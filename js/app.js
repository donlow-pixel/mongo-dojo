(function () {
  'use strict';

  const { ObjectId, Cursor } = window.Engine;
  const { chapters, check } = window.Course;

  const STORE = 'mongo-dojo-v1';
  const RANKS = [
    [0, 'Novice'],
    [0.2, 'Document Wrangler'],
    [0.45, 'Query Apprentice'],
    [0.75, 'Array Tamer'],
    [1, 'CRUD Master'],
  ];
  const total = chapters.reduce((n, c) => n + c.exercises.length, 0);

  const $ = (id) => document.getElementById(id);
  const el = {
    map: $('map'), crumb: $('crumb'), title: $('title'), note: $('note'), noteTitle: $('note-title'),
    noteBody: $('note-body'), noteCode: $('note-code'), prompt: $('prompt'), form: $('form'),
    label: $('input-label'), editor: $('editor'), answer: $('answer'), run: $('run'), hint: $('hint'),
    reveal: $('reveal'), next: $('next'), console: $('console'), data: $('data'), dbname: $('dbname'),
    xp: $('xp'), streak: $('streak'), rank: $('rank'), reset: $('reset'),
  };

  // ---------- saved progress ----------

  let save = { done: {}, pos: [0, 0], streak: 0 };
  try {
    const raw = JSON.parse(localStorage.getItem(STORE));
    if (raw && raw.done && Array.isArray(raw.pos)) save = raw;
  } catch (e) {
    /* storage unavailable: play without saving */
  }
  if (!chapters[save.pos[0]] || !chapters[save.pos[0]].exercises[save.pos[1]]) save.pos = [0, 0];

  function persist() {
    try {
      localStorage.setItem(STORE, JSON.stringify(save));
    } catch (e) {
      /* ignore */
    }
  }

  // Per-exercise attempt state, reset every time an exercise is opened.
  let turn = { hints: 0, misses: 0, revealed: false, solved: false };

  const current = () => chapters[save.pos[0]].exercises[save.pos[1]];

  // ---------- pretty printing ----------

  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  function fmt(v, ind) {
    ind = ind || '';
    const deeper = ind + '  ';
    if (v instanceof ObjectId) return '<span class="t-oid" data-oid="' + v.hex + '" title="Click to paste into your command">ObjectId("' + v.hex + '")</span>';
    if (v instanceof Date) return '<span class="t-oid">ISODate("' + v.toISOString() + '")</span>';
    if (typeof v === 'string') return '<span class="t-str">' + esc(JSON.stringify(v)) + '</span>';
    if (v === null || typeof v !== 'object') return '<span class="t-num">' + esc(String(v)) + '</span>';
    if (Array.isArray(v)) {
      if (!v.length) return '[]';
      const flat = v.every((x) => x === null || typeof x !== 'object');
      if (flat) return '[ ' + v.map((x) => fmt(x)).join(', ') + ' ]';
      return '[\n' + v.map((x) => deeper + fmt(x, deeper)).join(',\n') + '\n' + ind + ']';
    }
    const keys = Object.keys(v);
    if (!keys.length) return '{}';
    const key = (k) => '<span class="t-key">' + esc(/^[A-Za-z_$][\w$]*$/.test(k) ? k : JSON.stringify(k)) + '</span>';
    return '{\n' + keys.map((k) => deeper + key(k) + ': ' + fmt(v[k], deeper)).join(',\n') + '\n' + ind + '}';
  }

  function renderData(state, flash) {
    el.dbname.textContent = state.dbName;
    const names = Object.keys(state.cols);
    if (!names.length) {
      el.data.innerHTML = '<div class="empty">No collections yet. Whatever you insert will show up here.</div>';
    } else {
      el.data.innerHTML = names
        .map((n) => {
          const docs = state.cols[n];
          const head = '<div class="coll">db.' + esc(n) + ' (' + docs.length + ' document' + (docs.length === 1 ? '' : 's') + ')</div>';
          return head + docs.map((d) => '<div class="doc">' + fmt(d) + '</div>').join('');
        })
        .join('');
    }
    if (flash) {
      el.data.classList.remove('flash');
      void el.data.offsetWidth;
      el.data.classList.add('flash');
    }
  }

  // ---------- console ----------

  function say(kind, tag, html) {
    const div = document.createElement('div');
    div.className = 'msg ' + kind;
    div.innerHTML = (tag ? '<span class="tag">' + tag + '</span>' : '') + html;
    el.console.prepend(div);
    el.console.scrollIntoView({ block: 'nearest' });
    return div;
  }

  function showOutput(res) {
    let html = '';
    if (res.text !== undefined) html = esc(res.text);
    else if (res.value instanceof Cursor) html = res.value.docs.length ? res.value.docs.map((d) => fmt(d)).join('\n') : '(no documents matched)';
    else if (res.value !== undefined) html = fmt(res.value);
    if (html) say('', '', 'Shell output<pre>' + html + '</pre>');
  }

  // ---------- header + map ----------

  function renderStats() {
    const ids = Object.keys(save.done);
    const xp = ids.reduce((n, id) => n + save.done[id], 0);
    const share = ids.length / total;
    el.xp.textContent = xp;
    el.streak.textContent = save.streak;
    el.rank.textContent = RANKS.filter((r) => share >= r[0]).pop()[1];
  }

  function renderMap() {
    el.map.innerHTML = '';
    chapters.forEach((ch, ci) => {
      const box = document.createElement('div');
      box.className = 'chapter';
      box.innerHTML = '<h2><span class="num">' + (ci + 1) + '</span>' + esc(ch.title) + '</h2><p>' + esc(ch.blurb) + '</p>';
      const dots = document.createElement('div');
      dots.className = 'dots';
      ch.exercises.forEach((ex, ei) => {
        const b = document.createElement('button');
        b.type = 'button';
        const done = ex.id in save.done;
        const here = ci === save.pos[0] && ei === save.pos[1];
        b.className = 'dot' + (done ? ' done' : '') + (here ? ' here' : '');
        b.textContent = done ? '✓' : ei + 1;
        b.setAttribute('aria-label', ch.title + ', step ' + (ei + 1) + ': ' + ex.title + (done ? ' (done)' : ''));
        if (here) b.setAttribute('aria-current', 'step');
        b.title = ex.title;
        b.addEventListener('click', () => open(ci, ei));
        dots.appendChild(b);
      });
      box.appendChild(dots);
      el.map.appendChild(box);
    });
  }

  // ---------- exercise ----------

  function open(ci, ei) {
    save.pos = [ci, ei];
    persist();
    turn = { hints: 0, misses: 0, revealed: false, solved: false };
    const ch = chapters[ci];
    const ex = ch.exercises[ei];
    const isCmd = ex.type === 'cmd';

    el.crumb.textContent = 'Chapter ' + (ci + 1) + ' · ' + ch.title + ' · step ' + (ei + 1) + ' of ' + ch.exercises.length;
    el.title.textContent = ex.title;
    el.prompt.innerHTML = ex.prompt;

    el.note.hidden = !ex.note;
    if (ex.note) {
      el.note.open = true;
      el.noteTitle.textContent = ex.note.title;
      el.noteBody.innerHTML = ex.note.body;
      el.noteCode.textContent = ex.note.code;
      el.noteCode.hidden = !ex.note.code;
    }

    el.editor.hidden = !isCmd;
    el.answer.hidden = isCmd;
    el.editor.value = '';
    el.answer.value = '';
    el.label.htmlFor = isCmd ? 'editor' : 'answer';
    el.label.textContent = isCmd ? 'Your command (Ctrl+Enter to run)' : 'Your answer (Enter to check)';
    el.run.textContent = isCmd ? 'Run' : 'Check';
    el.run.disabled = false;
    el.hint.disabled = false;
    el.reveal.disabled = false;
    el.next.hidden = true;
    el.console.innerHTML = '';

    renderData(ex.before);
    renderMap();
    renderStats();
    (isCmd ? el.editor : el.answer).focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }

  function following() {
    const [ci, ei] = save.pos;
    if (ei + 1 < chapters[ci].exercises.length) return [ci, ei + 1];
    if (ci + 1 < chapters.length) return [ci + 1, 0];
    return null;
  }

  function succeed(ex, res) {
    turn.solved = true;
    let xp = turn.revealed ? 10 : Math.max(25, 100 - 25 * turn.hints) + (turn.misses === 0 && turn.hints === 0 ? 20 : 0);
    const clean = !turn.revealed && turn.hints === 0;
    save.streak = clean ? save.streak + 1 : 0;
    const gained = Math.max(0, xp - (save.done[ex.id] || 0));
    save.done[ex.id] = Math.max(xp, save.done[ex.id] || 0);
    persist();

    if (res.state) renderData(res.state, true);
    const extra = ex.explain ? ' ' + ex.explain : '';
    say('ok', 'Correct.', '+' + gained + ' XP.' + extra);
    el.run.disabled = true;
    el.hint.disabled = true;
    el.reveal.disabled = true;

    const nxt = following();
    const allDone = Object.keys(save.done).length === total;
    if (allDone) {
      say('ok finale', '', '<h2>Mission complete</h2>You have worked through every step, from <code>use</code> to <code>$pull</code>. Try the final mission again in a real <code>mongosh</code> session without looking anything up.');
    }
    if (nxt) {
      el.next.hidden = false;
      el.next.textContent = nxt[1] === 0 ? 'Next chapter →' : 'Next →';
      el.next.focus({ preventScroll: true });
    }
    renderMap();
    renderStats();
  }

  function submit() {
    if (turn.solved) return;
    const ex = current();
    const input = ex.type === 'cmd' ? el.editor.value : el.answer.value;
    const res = check(ex, input);
    el.console.innerHTML = '';

    if (res.status === 'error') {
      say('bad', 'Error.', esc(res.error));
      return;
    }
    if (ex.type === 'cmd') showOutput(res);
    if (res.status === 'ok') {
      succeed(ex, res);
      return;
    }
    if (res.status === 'info') {
      say('', '', 'That only read data, so nothing was graded. Explore as much as you like.');
      return;
    }
    turn.misses += 1;
    if (ex.type === 'text') {
      say('bad', 'Not quite.', 'Have another go, or ask for a hint.');
      return;
    }
    const items = res.reasons.map((r) => '<li>' + (res.html ? r : esc(r)) + '</li>').join('');
    say('bad', res.html ? 'Almost.' : 'Not quite.', (res.html ? '' : 'Your command ran, but the result is not what the task asks for. Nothing was saved, so just fix it and run again.') + '<ul>' + items + '</ul>');
  }

  // ---------- events ----------

  el.form.addEventListener('submit', (e) => {
    e.preventDefault();
    submit();
  });

  el.editor.addEventListener('keydown', (e) => {
    const t = el.editor;
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      submit();
    } else if (e.key === 'Tab' && !e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey) {
      e.preventDefault();
      t.setRangeText('  ', t.selectionStart, t.selectionEnd, 'end');
    } else if (e.key === 'Enter' && !e.shiftKey) {
      // keep the indentation of the current line, one level deeper after an opener
      const before = t.value.slice(0, t.selectionStart);
      const line = before.slice(before.lastIndexOf('\n') + 1);
      const indent = /^\s*/.exec(line)[0] + (/[{[(]\s*$/.test(line) ? '  ' : '');
      e.preventDefault();
      t.setRangeText('\n' + indent, t.selectionStart, t.selectionEnd, 'end');
    }
  });

  el.hint.addEventListener('click', () => {
    const ex = current();
    if (turn.hints >= ex.hints.length) {
      say('hint', 'Hint.', 'That was the last hint. Use "Show answer" if you are still stuck.');
      return;
    }
    say('hint', 'Hint ' + (turn.hints + 1) + ' of ' + ex.hints.length + '.', ex.hints[turn.hints]);
    turn.hints += 1;
  });

  el.reveal.addEventListener('click', () => {
    const ex = current();
    turn.revealed = true;
    const answer = ex.type === 'cmd' ? ex.solution : ex.answers[0];
    const div = say('hint', 'Answer.', 'Type it out yourself to finish the step. It sticks better than copying.<pre></pre>');
    div.querySelector('pre').textContent = answer;
  });

  el.next.addEventListener('click', () => {
    const nxt = following();
    if (nxt) open(nxt[0], nxt[1]);
  });

  // Clicking an ObjectId in the data panel pastes it at the cursor.
  el.data.addEventListener('click', (e) => {
    const t = e.target.closest('[data-oid]');
    if (!t || el.editor.hidden) return;
    const ed = el.editor;
    ed.setRangeText('ObjectId("' + t.dataset.oid + '")', ed.selectionStart, ed.selectionEnd, 'end');
    ed.focus();
  });

  el.reset.addEventListener('click', () => {
    if (!confirm('Erase all progress and start again from the first step?')) return;
    save = { done: {}, pos: [0, 0], streak: 0 };
    persist();
    open(0, 0);
  });

  open(save.pos[0], save.pos[1]);
})();
