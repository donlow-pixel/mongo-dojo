// A tiny in-memory imitation of the Mongo shell, just big enough for the lessons.
// Learner commands are evaluated against it so answers are graded by what they
// *do* to the data, not by how they are spelled.
(function (root) {
  'use strict';

  class ObjectId {
    constructor(hex, generated) {
      this.hex = hex;
      this.generated = !!generated;
    }
    toString() {
      return this.hex;
    }
  }

  class Cursor {
    constructor(docs) {
      this.docs = docs;
    }
    pretty() {
      return this;
    }
    toArray() {
      return this.docs;
    }
    count() {
      return this.docs.length;
    }
    limit(n) {
      return new Cursor(this.docs.slice(0, n));
    }
  }

  class MongoError extends Error {}
  const err = (msg) => new MongoError(msg);

  // Deterministic ids are used while building the exercise chain so the data
  // panel shows the same ObjectIds on every page load.
  let deterministic = false;
  let idCounter = 0;

  function newHex() {
    if (deterministic) {
      idCounter += 1;
      return '6500a1b2c3d4e5f6a7b8' + idCounter.toString(16).padStart(4, '0');
    }
    let s = '';
    for (let i = 0; i < 24; i++) s += Math.floor(Math.random() * 16).toString(16);
    return s;
  }

  function makeObjectId(hex) {
    if (hex === undefined) return new ObjectId(newHex(), true);
    if (hex instanceof ObjectId) return new ObjectId(hex.hex);
    if (typeof hex !== 'string' || !/^[0-9a-fA-F]{24}$/.test(hex)) {
      throw err('BSONError: ObjectId needs a 24 character hex string, but got ' + JSON.stringify(hex) + '.');
    }
    return new ObjectId(hex.toLowerCase());
  }

  function ISODate(s) {
    if (s === undefined) return new Date();
    const d = new Date(s);
    if (isNaN(d)) throw err('Invalid ISODate: ' + JSON.stringify(s) + '. Use a format like ISODate("2016-05-13").');
    return d;
  }

  const isPlain = (v) =>
    v !== null &&
    typeof v === 'object' &&
    !Array.isArray(v) &&
    !(v instanceof ObjectId) &&
    !(v instanceof Date) &&
    !(v instanceof RegExp) &&
    !(v instanceof Cursor);

  function clone(v) {
    if (v instanceof ObjectId) return new ObjectId(v.hex, v.generated);
    if (v instanceof Date) return new Date(v.getTime());
    if (Array.isArray(v)) return v.map(clone);
    if (isPlain(v)) {
      const out = {};
      for (const k of Object.keys(v)) out[k] = clone(v[k]);
      return out;
    }
    return v;
  }

  const DAY = 24 * 60 * 60 * 1000;

  // loose = grading mode: auto-generated ObjectIds match any ObjectId, and dates
  // match within a day (so ISODate() "now" and local-time dates are accepted).
  function equal(a, b, loose) {
    if (a instanceof ObjectId || b instanceof ObjectId) {
      if (!(a instanceof ObjectId && b instanceof ObjectId)) return false;
      return a.hex === b.hex || (!!loose && (a.generated || b.generated));
    }
    if (a instanceof Date || b instanceof Date) {
      if (!(a instanceof Date && b instanceof Date)) return false;
      return loose ? Math.abs(a - b) < DAY : a.getTime() === b.getTime();
    }
    if (Array.isArray(a) || Array.isArray(b)) {
      if (!(Array.isArray(a) && Array.isArray(b)) || a.length !== b.length) return false;
      return a.every((x, i) => equal(x, b[i], loose));
    }
    if (isPlain(a) || isPlain(b)) {
      if (!(isPlain(a) && isPlain(b))) return false;
      const ka = Object.keys(a);
      if (ka.length !== Object.keys(b).length) return false;
      return ka.every((k) => k in b && equal(a[k], b[k], loose));
    }
    return a === b;
  }

  function nearest(word, options) {
    let best = null;
    let bestD = 3;
    for (const o of options) {
      const d = lev(word.toLowerCase(), o.toLowerCase());
      if (d < bestD) {
        bestD = d;
        best = o;
      }
    }
    return best ? ' Did you mean ' + best + '?' : '';
  }

  function lev(a, b) {
    const row = Array.from({ length: b.length + 1 }, (_, i) => i);
    for (let i = 1; i <= a.length; i++) {
      let prev = row[0];
      row[0] = i;
      for (let j = 1; j <= b.length; j++) {
        const tmp = row[j];
        row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
        prev = tmp;
      }
    }
    return row[b.length];
  }

  // ---------- query matching ----------

  const QUERY_OPS = ['$eq', '$ne', '$gt', '$gte', '$lt', '$lte', '$in', '$nin', '$exists', '$elemMatch', '$size', '$not'];

  const isOpObj = (c) => isPlain(c) && Object.keys(c).length > 0 && Object.keys(c).every((k) => k[0] === '$');

  function notePos(pos, i) {
    if (pos && pos.i === undefined) pos.i = i;
  }

  function compare(value, arg, fn) {
    if (Array.isArray(value)) return value.some((v) => compare(v, arg, fn));
    if (value instanceof Date && arg instanceof Date) return fn(value.getTime(), arg.getTime());
    if (typeof value !== typeof arg || (typeof value !== 'number' && typeof value !== 'string')) return false;
    return fn(value, arg);
  }

  function testOp(value, op, arg, pos) {
    switch (op) {
      case '$eq':
        return testCond(value, arg, pos);
      case '$ne':
        return !testCond(value, arg, {});
      case '$gt':
        return compare(value, arg, (a, b) => a > b);
      case '$gte':
        return compare(value, arg, (a, b) => a >= b);
      case '$lt':
        return compare(value, arg, (a, b) => a < b);
      case '$lte':
        return compare(value, arg, (a, b) => a <= b);
      case '$in':
      case '$nin': {
        if (!Array.isArray(arg)) throw err(op + ' needs an array, e.g. { ' + op + ': ["a", "b"] }.');
        const hit = arg.some((a) => testCond(value, a, op === '$in' ? pos : {}));
        return op === '$in' ? hit : !hit;
      }
      case '$exists':
        return (value !== undefined) === !!arg;
      case '$size':
        return Array.isArray(value) && value.length === arg;
      case '$not':
        return !testCond(value, arg, {});
      case '$elemMatch': {
        if (!isPlain(arg)) throw err('$elemMatch needs an object, e.g. { $elemMatch: { name: "Dr Chua" } }.');
        if (!Array.isArray(value)) return false;
        const i = value.findIndex((el) => (isOpObj(arg) ? testCond(el, arg, {}) : isPlain(el) && matches(el, arg, {})));
        if (i < 0) return false;
        notePos(pos, i);
        return true;
      }
      default:
        throw err('unknown operator: ' + op + '.' + nearest(op, QUERY_OPS));
    }
  }

  function testCond(value, cond, pos) {
    if (cond instanceof RegExp) return typeof value === 'string' && cond.test(value);
    if (isOpObj(cond)) return Object.keys(cond).every((op) => testOp(value, op, cond[op], pos));
    if (Array.isArray(value) && !Array.isArray(cond)) {
      const i = value.findIndex((el) => equal(el, cond));
      if (i < 0) return false;
      notePos(pos, i);
      return true;
    }
    if (cond === null) return value == null;
    return equal(value, cond);
  }

  function matchPath(value, segs, cond, pos) {
    if (segs.length === 0) return testCond(value, cond, pos);
    const seg = segs[0];
    if (Array.isArray(value)) {
      if (/^\d+$/.test(seg)) return matchPath(value[+seg], segs.slice(1), cond, pos);
      const i = value.findIndex((el) => matchPath(el, segs, cond, {}));
      if (i < 0) return false;
      notePos(pos, i);
      return true;
    }
    if (isPlain(value)) return matchPath(value[seg], segs.slice(1), cond, pos);
    return testCond(undefined, cond, pos);
  }

  function matches(doc, query, pos) {
    if (!isPlain(query)) throw err('The filter must be an object, e.g. { name: "Fluffy" }. Use {} to match everything.');
    return Object.keys(query).every((key) => {
      const cond = query[key];
      if (key === '$and' || key === '$or' || key === '$nor') {
        if (!Array.isArray(cond)) throw err(key + ' needs an array of filters.');
        if (key === '$and') return cond.every((q) => matches(doc, q, pos));
        const any = cond.some((q) => matches(doc, q, pos));
        return key === '$or' ? any : !any;
      }
      if (key[0] === '$') {
        throw err('unknown top level operator: ' + key + '. A filter starts with a field name, e.g. { name: "Fluffy" }.');
      }
      return matchPath(doc, key.split('.'), cond, pos);
    });
  }

  // ---------- updates ----------

  const UPDATE_OPS = ['$set', '$unset', '$push', '$pull', '$inc', '$addToSet'];

  function expand(node, seg, ctx) {
    const positional = seg === '$' || seg === '$[]' || /^\$\[\w+\]$/.test(seg);
    if (positional && !Array.isArray(node)) {
      throw err('Cannot use ' + seg + ' in "' + ctx.path + '" — the part before it is not an array.');
    }
    if (seg === '$') {
      if (ctx.pos.i === undefined) {
        throw err('The positional operator did not find the match needed from the query. The filter has to match an element inside the array (e.g. with $elemMatch or "checkups._id").');
      }
      return [ctx.pos.i];
    }
    if (seg === '$[]') return node.map((_, i) => i);
    const m = /^\$\[(\w+)\]$/.exec(seg);
    if (m) {
      const id = m[1];
      const filter = (ctx.arrayFilters || []).find(
        (f) => isPlain(f) && Object.keys(f).some((k) => k === id || k.startsWith(id + '.'))
      );
      if (!filter) {
        throw err("No array filter found for identifier '" + id + "' in path '" + ctx.path + "'. Pass { arrayFilters: [ { \"" + id + '.<field>": <value> } ] } as the third argument.');
      }
      const out = [];
      node.forEach((el, i) => {
        const ok = Object.keys(filter).every((k) =>
          k === id ? testCond(el, filter[k], {}) : matchPath(el, k.slice(id.length + 1).split('.'), filter[k], {})
        );
        if (ok) out.push(i);
      });
      return out;
    }
    if (Array.isArray(node) && !/^\d+$/.test(seg)) {
      throw err("Cannot create field '" + seg + "' directly inside an array. Point at one element with the positional operator, e.g. \"checkups.$." + seg + '".');
    }
    return [seg];
  }

  function targets(node, segs, ctx) {
    const out = [];
    for (const k of expand(node, segs[0], ctx)) {
      if (segs.length === 1) {
        out.push([node, k]);
        continue;
      }
      let child = node[k];
      if (child == null) {
        if (segs[1][0] === '$') {
          throw err("The path '" + k + "' must exist in the document in order to apply array updates. Narrow the filter to documents that have it.");
        }
        if (!ctx.create) continue;
        child = node[k] = {};
      }
      if (!isPlain(child) && !Array.isArray(child)) {
        throw err("Cannot create field '" + segs[1] + "' inside '" + k + "' because it is not an object or array.");
      }
      out.push(...targets(child, segs.slice(1), ctx));
    }
    return out;
  }

  function pullMatch(el, cond) {
    if (isOpObj(cond)) return testCond(el, cond, {});
    if (isPlain(cond)) return isPlain(el) && matches(el, cond, {});
    return equal(el, cond);
  }

  function applyOp(op, box, key, val, path) {
    const cur = box[key];
    switch (op) {
      case '$set':
        box[key] = clone(val);
        return;
      case '$unset':
        if (Array.isArray(box)) box[key] = null;
        else delete box[key];
        return;
      case '$inc':
        if (typeof val !== 'number') throw err('Cannot increment with a non-numeric argument.');
        if (cur !== undefined && typeof cur !== 'number') throw err("Cannot apply $inc to '" + path + "' because it is not a number.");
        box[key] = (cur || 0) + val;
        return;
      case '$push':
      case '$addToSet': {
        if (cur === undefined) box[key] = [];
        else if (!Array.isArray(cur)) throw err("The field '" + path + "' must be an array to use " + op + ', but it is a ' + typeof cur + '.');
        const items = isPlain(val) && '$each' in val ? val.$each : [val];
        for (const item of items) {
          if (op === '$addToSet' && box[key].some((x) => equal(x, item))) continue;
          box[key].push(clone(item));
        }
        return;
      }
      case '$pull':
        if (cur === undefined) return;
        if (!Array.isArray(cur)) throw err("Cannot apply $pull to '" + path + "' because it is not an array.");
        box[key] = cur.filter((el) => !pullMatch(el, val));
        return;
    }
  }

  function checkUpdate(update) {
    if (!isPlain(update)) throw err('The second argument must be an update document, e.g. { $set: { age: 4 } }.');
    const ops = Object.keys(update);
    if (!ops.length || ops.some((k) => k[0] !== '$')) {
      throw err('MongoInvalidArgumentError: Update document requires atomic operators. Wrap your changes in an operator such as $set: { $set: { field: value } }.');
    }
    for (const op of ops) {
      if (!UPDATE_OPS.includes(op)) throw err('Unknown modifier: ' + op + '.' + nearest(op, UPDATE_OPS));
      if (!isPlain(update[op])) throw err(op + ' expects an object of field: value pairs, e.g. { ' + op + ': { field: value } }.');
    }
  }

  function applyUpdate(doc, update, pos, arrayFilters) {
    for (const op of Object.keys(update)) {
      const spec = update[op];
      for (const path of Object.keys(spec)) {
        if (path === '_id' && op !== '$unset' && !equal(doc._id, spec[path])) {
          throw err("Performing an update on the path '_id' would modify the immutable field '_id'.");
        }
        const ctx = { pos, arrayFilters, path, create: op !== '$unset' && op !== '$pull' };
        for (const [box, key] of targets(doc, path.split('.'), ctx)) applyOp(op, box, key, spec[path], path);
      }
    }
  }

  // ---------- db / collection objects ----------

  const COLL_METHODS = ['insertOne', 'insertMany', 'insert', 'updateOne', 'updateMany', 'update', 'deleteOne', 'deleteMany', 'remove', 'find', 'findOne', 'countDocuments', 'drop'];

  function makeCollection(state, name) {
    const docs = () => state.cols[name] || [];
    const ensure = () => (state.cols[name] = state.cols[name] || []);

    function prepare(doc, method) {
      if (!isPlain(doc)) throw err(method + ' expects a document object like { name: "Fluffy" }.');
      let d = clone(doc);
      if (!('_id' in d)) d = Object.assign({ _id: makeObjectId() }, d);
      if (docs().some((x) => equal(x._id, d._id))) throw err('E11000 duplicate key error: a document with that _id already exists.');
      return d;
    }

    function upd(method, filter, update, opts, multi) {
      if (filter === undefined || update === undefined) {
        throw err(method + ' needs two arguments: a filter, then an update document. e.g. ' + method + '({ name: "Fluffy" }, { $set: { age: 4 } })');
      }
      if (opts !== undefined && !isPlain(opts)) throw err('The third argument to ' + method + ' must be an options object, e.g. { arrayFilters: [ ... ] }.');
      const filters = opts && opts.arrayFilters;
      if (filters !== undefined && !(Array.isArray(filters) && filters.every(isPlain))) {
        throw err('arrayFilters must be an array of objects, e.g. { arrayFilters: [ { "item.name": "Dr Chua" } ] }.');
      }
      checkUpdate(update);
      let matchedCount = 0;
      let modifiedCount = 0;
      for (const doc of docs()) {
        const pos = {};
        if (!matches(doc, filter, pos)) continue;
        const before = clone(doc);
        applyUpdate(doc, update, pos, filters);
        matchedCount += 1;
        if (!equal(before, doc)) modifiedCount += 1;
        if (!multi) break;
      }
      return { acknowledged: true, insertedId: null, matchedCount, modifiedCount, upsertedCount: 0 };
    }

    function del(method, filter, multi) {
      if (filter === undefined) throw err(method + ' needs a filter, e.g. ' + method + '({ name: "Fluffy" }).');
      let deletedCount = 0;
      const keep = [];
      for (const doc of docs()) {
        if ((multi || deletedCount === 0) && matches(doc, filter, {})) deletedCount += 1;
        else keep.push(doc);
      }
      if (state.cols[name]) state.cols[name] = keep;
      return { acknowledged: true, deletedCount };
    }

    const api = {
      insertOne(doc) {
        if (Array.isArray(doc)) throw err('insertOne takes a single document. To insert an array of documents use insertMany([ ... ]).');
        const d = prepare(doc, 'insertOne');
        ensure().push(d);
        return { acknowledged: true, insertedId: d._id };
      },
      insertMany(arr) {
        if (!Array.isArray(arr)) throw err('insertMany expects an array of documents: insertMany([ { ... }, { ... } ]).');
        const insertedIds = {};
        arr.forEach((doc, i) => {
          const d = prepare(doc, 'insertMany');
          ensure().push(d);
          insertedIds[i] = d._id;
        });
        return { acknowledged: true, insertedIds };
      },
      insert(x) {
        return Array.isArray(x) ? api.insertMany(x) : api.insertOne(x);
      },
      updateOne: (f, u, o) => upd('updateOne', f, u, o, false),
      updateMany: (f, u, o) => upd('updateMany', f, u, o, true),
      update: (f, u, o) => upd('update', f, u, o, !!(o && o.multi)),
      deleteOne: (f) => del('deleteOne', f, false),
      deleteMany: (f) => del('deleteMany', f, true),
      remove: (f, o) => del('remove', f, !(o === true || (o && o.justOne))),
      find: (f) => new Cursor(docs().filter((d) => matches(d, f === undefined ? {} : f, {})).map(clone)),
      findOne: (f) => {
        const d = docs().find((x) => matches(x, f === undefined ? {} : f, {}));
        return d ? clone(d) : null;
      },
      countDocuments: (f) => docs().filter((d) => matches(d, f === undefined ? {} : f, {})).length,
      drop() {
        const existed = name in state.cols;
        delete state.cols[name];
        return existed;
      },
    };

    return new Proxy(api, {
      get(t, p) {
        if (typeof p === 'symbol') return undefined;
        if (p in t) return t[p];
        return () => {
          throw err('TypeError: db.' + name + '.' + p + ' is not a function.' + nearest(p, COLL_METHODS));
        };
      },
    });
  }

  function makeDb(state) {
    const api = {
      createCollection(name) {
        if (typeof name !== 'string' || !name) throw err('createCollection needs the collection name as a string: db.createCollection("students").');
        if (name in state.cols) throw err("Collection '" + name + "' already exists.");
        state.cols[name] = [];
        return { ok: 1 };
      },
      getCollection: (name) => makeCollection(state, name),
      getName: () => state.dbName,
      getCollectionNames: () => Object.keys(state.cols),
    };
    return new Proxy(api, {
      get(t, p) {
        if (typeof p === 'symbol') return undefined;
        if (p in t) return t[p];
        return makeCollection(state, p);
      },
    });
  }

  // ---------- running a learner command ----------

  function bracketTip(src) {
    const stack = [];
    const pairs = { ')': '(', ']': '[', '}': '{' };
    let quote = null;
    for (let i = 0; i < src.length; i++) {
      const c = src[i];
      if (quote) {
        if (c === '\\') i += 1;
        else if (c === quote) quote = null;
      } else if (c === '"' || c === "'" || c === '`') quote = c;
      else if ('([{'.includes(c)) stack.push(c);
      else if (pairs[c]) {
        if (stack.pop() !== pairs[c]) return ' There is a "' + c + '" that does not match an opening bracket.';
      }
    }
    if (quote) return ' A string is missing its closing ' + quote + ' quote.';
    if (stack.length) return ' You have ' + stack.length + ' unclosed bracket' + (stack.length > 1 ? 's' : '') + ': ' + stack.join(' ') + '.';
    if (/[{,]\s*[\w$]+\.[\w$.[\]]+\s*:/.test(src)) return ' Keys that contain a dot must be quoted, e.g. "checkups.$.name".';
    return ' Check for a missing comma between fields or arguments.';
  }

  function describe(e, src) {
    if (e instanceof MongoError) return e.message;
    if (e instanceof SyntaxError) return 'SyntaxError: ' + e.message + '.' + bracketTip(src);
    if (e instanceof ReferenceError) return 'ReferenceError: ' + e.message + '. Text values need quotes, e.g. "Dog".';
    return (e && e.name ? e.name + ': ' : '') + (e && e.message ? e.message : String(e));
  }

  // Runs `src` against `state` (mutating it). Returns { value, text } or { error }.
  function run(src, state) {
    src = String(src)
      .replace(/[“”]/g, '"')
      .replace(/[‘’]/g, "'")
      .trim();
    if (!src) return { error: 'Type a command first.' };

    let m = /^use\s+(\S+?)\s*;?$/.exec(src);
    if (m) {
      const name = m[1].replace(/^["'`]|["'`]$/g, '');
      if (!/^[\w-]+$/.test(name)) return { error: 'Invalid database name: ' + name };
      state.dbName = name;
      return { text: 'switched to db ' + name };
    }
    if (/^use\b/.test(src)) return { error: 'use needs exactly one database name, e.g. use animal_shelter' };
    if (/^show\s+(dbs|databases)\s*;?$/.test(src)) return { text: state.dbName + '\nadmin\nlocal' };
    if (/^show\s+collections\s*;?$/.test(src)) return { text: Object.keys(state.cols).join('\n') || '(no collections yet)' };
    if (/^db\s*;?$/.test(src)) return { text: state.dbName };

    const db = makeDb(state);
    try {
      let fn;
      try {
        fn = new Function('db', 'ObjectId', 'ISODate', '"use strict"; return (\n' + src.replace(/;\s*$/, '') + '\n);');
      } catch (e) {
        if (!(e instanceof SyntaxError)) throw e;
        // Not a single expression — maybe several statements.
        fn = new Function('db', 'ObjectId', 'ISODate', '"use strict";\n' + src);
      }
      return { value: fn(db, makeObjectId, ISODate) };
    } catch (e) {
      return { error: describe(e, src) };
    }
  }

  // ---------- explaining a wrong result ----------

  function show(v) {
    if (v === undefined) return 'nothing';
    if (v instanceof ObjectId) return 'ObjectId("' + v.hex + '")';
    if (v instanceof Date) return 'ISODate("' + v.toISOString().slice(0, 10) + '")';
    if (Array.isArray(v)) return v.length > 4 ? 'an array of ' + v.length + ' items' : '[' + v.map(show).join(', ') + ']';
    if (isPlain(v)) return 'an object';
    return JSON.stringify(v);
  }

  function fieldDiffs(got, want, path, out) {
    if (out.length >= 4 || equal(got, want, true)) return;
    if (isPlain(got) && isPlain(want)) {
      for (const k of Object.keys(want)) {
        const p = path ? path + '.' + k : k;
        if (!(k in got)) out.push('field "' + p + '" is missing');
        else fieldDiffs(got[k], want[k], p, out);
      }
      for (const k of Object.keys(got)) {
        if (!(k in want)) out.push('unexpected field "' + (path ? path + '.' + k : k) + '"');
      }
      return;
    }
    if (Array.isArray(got) && Array.isArray(want)) {
      if (got.length !== want.length) {
        out.push('"' + path + '" should have ' + want.length + ' item' + (want.length === 1 ? '' : 's') + ' but has ' + got.length);
        return;
      }
      got.forEach((g, i) => fieldDiffs(g, want[i], path + '[' + i + ']', out));
      return;
    }
    let msg = '"' + path + '" should be ' + show(want) + ' but is ' + show(got);
    if (typeof got !== typeof want && String(got) === String(want)) msg += ' (wrong type: ' + typeof got + ' instead of ' + typeof want + ')';
    out.push(msg);
  }

  // Returns a list of human-readable reasons why `got` differs from `want`.
  function explain(got, want, before) {
    if (got.dbName !== want.dbName) {
      return ['You are in database "' + got.dbName + '", but this step needs "' + want.dbName + '".'];
    }
    if (equal(got, before, true)) {
      return ['The command ran, but the data did not change. Check that your filter matches the document you are after.'];
    }
    const out = [];
    const gotNames = Object.keys(got.cols);
    const wantNames = Object.keys(want.cols);
    for (const n of gotNames) {
      if (!wantNames.includes(n)) out.push('You wrote to a collection called "' + n + '". Expected: ' + (wantNames.map((w) => '"' + w + '"').join(', ') || 'none') + '.');
    }
    for (const n of wantNames) {
      if (!gotNames.includes(n)) {
        out.push('The collection "' + n + '" does not exist yet.');
        continue;
      }
      const g = got.cols[n].slice();
      const w = [];
      for (const doc of want.cols[n]) {
        const i = g.findIndex((x) => equal(x, doc, true));
        if (i >= 0) g.splice(i, 1);
        else w.push(doc);
      }
      if (got.cols[n].length !== want.cols[n].length) {
        out.push('"' + n + '" should hold ' + want.cols[n].length + ' document' + (want.cols[n].length === 1 ? '' : 's') + ', but holds ' + got.cols[n].length + '.');
      }
      for (const doc of w) {
        let i = g.findIndex((x) => equal(x._id, doc._id));
        if (i < 0) i = g.findIndex((x) => x.name !== undefined && x.name === doc.name);
        if (i < 0 && g.length === w.length) i = 0;
        if (i < 0) continue;
        const diffs = [];
        fieldDiffs(g[i], doc, '', diffs);
        const label = doc.name !== undefined ? show(doc.name) : 'a document';
        diffs.forEach((d) => out.push('In ' + label + ': ' + d + '.'));
        g.splice(i, 1);
      }
    }
    return out.length ? out.slice(0, 5) : ['The data does not match what this step asks for. Compare the data panel with the task.'];
  }

  root.Engine = {
    ObjectId,
    Cursor,
    oid: makeObjectId,
    date: ISODate,
    clone,
    equal,
    run,
    explain,
    setDeterministic(on) {
      deterministic = on;
      idCounter = 0;
    },
  };
})(typeof window !== 'undefined' ? window : globalThis);
