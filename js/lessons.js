// Course content. Each chapter starts from `seed()` and every command exercise
// continues from the data left behind by the previous exercise's `solution`.
//
// Exercise types:
//   cmd  – learner types a shell command; it is run and the resulting data is
//          compared with what `solution` produces. `must` adds technique checks.
//   text – learner types a short answer; compared against `answers`.
(function (root) {
  'use strict';

  const { oid, date } = root.Engine;

  const ID = {
    fluffy: '5f33aa91bf91d0dd5c1440dd',
    dazzy: '5f33aa91bf91d0dd5c1440de',
    timmy: '5f33aa91bf91d0dd5c1440df',
    frenzy: '5f33acfbbf91d0dd5c1440e0',
    biscuit: '5f33acfbbf91d0dd5c1440e1',
    chuaFrenzy: '5f33addebf91d0dd5c1440e2',
    leeFrenzy: '5f33addebf91d0dd5c1440e3',
    chuaBiscuit1: '5f33b0e3bf91d0dd5c1440e5',
    ongBiscuit: '5f33b0e3bf91d0dd5c1440e6',
    chuaBiscuit2: '5f33b0e3bf91d0dd5c1440e7',
  };

  const chapters = [
    {
      id: 'insert',
      title: 'Create & insert',
      blurb: 'Pick a database and put documents into a collection.',
      seed: () => ({ dbName: 'test', cols: {} }),
      exercises: [
        {
          id: 'ins-use',
          type: 'cmd',
          title: 'Open the shelter',
          note: {
            title: 'Choosing a database',
            body: '<code>use &lt;name&gt;</code> switches to a database. It does not need to exist yet: MongoDB creates it the first time you store something in it.',
            code: 'use my_database',
          },
          prompt: 'Switch to a database called <code>animal_shelter</code>.',
          hints: ['The command is the word <code>use</code> followed by the database name. No brackets, no quotes.'],
          solution: 'use animal_shelter',
        },
        {
          id: 'ins-lazy',
          type: 'text',
          title: 'Quick check',
          prompt: 'True or false: the <code>animals</code> collection must already exist before you can insert a document into it.',
          answers: ['false', 'f', 'no'],
          explain: 'Collections are created automatically on the first insert.',
          hints: ['Think about what happened with the database in the previous step.'],
        },
        {
          id: 'ins-one',
          type: 'cmd',
          title: 'First resident',
          note: {
            title: 'Inserting one document',
            body: 'The pattern is <code>db.&lt;collection&gt;.insertOne({ ... })</code>. A document is written like a JavaScript object: <code>key: value</code> pairs separated by commas. Text goes in quotes, numbers do not.',
            code: 'db.pets.insertOne({\n  name: "Rex",\n  age: 5\n})',
          },
          prompt: 'Insert one document into the <code>animals</code> collection:<ul><li><code>name</code>: "Fluffy"</li><li><code>age</code>: 3</li><li><code>breed</code>: "Golden Retriever"</li><li><code>type</code>: "Dog"</li></ul>',
          hints: [
            'Start with <code>db.animals.insertOne({ ... })</code>.',
            'Inside the braces: <code>name: "Fluffy", age: 3, ...</code>. The age is a number, so no quotes.',
          ],
          solution: 'db.animals.insertOne({ name: "Fluffy", age: 3, breed: "Golden Retriever", type: "Dog" })',
        },
        {
          id: 'ins-many-q',
          type: 'text',
          title: 'Quick check',
          prompt: 'Which collection method inserts several documents in a single call?',
          answers: ['insertmany', 'db.animals.insertmany', '.insertmany'],
          explain: '<code>insertMany</code> takes an array of documents.',
          hints: ['It is named like <code>insertOne</code>, but for more than one.'],
        },
        {
          id: 'ins-many',
          type: 'cmd',
          title: 'Two more arrive',
          note: {
            title: 'Inserting many documents',
            body: '<code>insertMany</code> takes one argument: an <strong>array</strong> of documents. That means square brackets around the list, and a comma between documents.',
            code: 'db.pets.insertMany([\n  { name: "Rex", age: 5 },\n  { name: "Ziggy", age: 2 }\n])',
          },
          prompt: 'With a single command, insert these two dogs into <code>animals</code>:<ul><li>name "Dazzy", age 35, breed "Greyhound", type "Dog"</li><li>name "Timmy", age 1, breed "Border Collie", type "Dog"</li></ul>',
          hints: [
            'Shape: <code>db.animals.insertMany([ { ... }, { ... } ])</code>.',
            'Do not forget the square brackets, and the comma between the two documents.',
          ],
          must: [{ re: /insertMany/, msg: 'The data is right, but use a single <code>insertMany</code> call for this one.' }],
          solution:
            'db.animals.insertMany([\n  { name: "Dazzy", age: 35, breed: "Greyhound", type: "Dog" },\n  { name: "Timmy", age: 1, breed: "Border Collie", type: "Dog" }\n])',
        },
        {
          id: 'ins-rich',
          type: 'cmd',
          title: 'Arrays and dates',
          note: {
            title: 'Values that are not just text or numbers',
            body: 'A field can hold an <strong>array</strong> (a list in square brackets) and a <strong>date</strong>. Write dates with <code>ISODate("YYYY-MM-DD")</code> so they are stored as real dates rather than text.',
            code: 'db.pets.insertOne({\n  name: "Rex",\n  toys: ["ball", "rope"],\n  date_adopted: ISODate("2019-03-28")\n})',
          },
          prompt: 'Insert a cat into <code>animals</code>:<ul><li><code>name</code>: "Milo"</li><li><code>age</code>: 2</li><li><code>breed</code>: "Tabby"</li><li><code>type</code>: "Cat"</li><li><code>tags</code>: an array holding "playful" and "vaccinated"</li><li><code>date_arrived</code>: 12th August 2020</li></ul>',
          hints: [
            'The array: <code>tags: ["playful", "vaccinated"]</code>.',
            'The date: <code>date_arrived: ISODate("2020-08-12")</code>. Year first, then month, then day.',
          ],
          solution:
            'db.animals.insertOne({\n  name: "Milo",\n  age: 2,\n  breed: "Tabby",\n  type: "Cat",\n  tags: ["playful", "vaccinated"],\n  date_arrived: ISODate("2020-08-12")\n})',
        },
      ],
    },

    {
      id: 'update',
      title: 'Update & delete',
      blurb: 'Change specific fields and remove documents.',
      seed: () => ({
        dbName: 'animal_shelter',
        cols: {
          animals: [
            { _id: oid(ID.fluffy), name: 'Fluffy', age: 3, breed: 'Golden Retriever', type: 'Dog' },
            { _id: oid(ID.dazzy), name: 'Dazzy', age: 35, breed: 'Greyhound', type: 'Dog' },
            { _id: oid(ID.timmy), name: 'Timmy', age: 1, breed: 'Border Collie', type: 'Dog' },
          ],
        },
      }),
      exercises: [
        {
          id: 'upd-set-q',
          type: 'text',
          title: 'Quick check',
          note: {
            title: 'Updating a document',
            body: '<code>updateOne</code> takes two arguments. The first is a <strong>filter</strong> that finds the document. The second says what to change, and <code>$set</code> gives new values to the listed fields while leaving every other field alone.',
            code: 'db.pets.updateOne(\n  { _id: ObjectId("5f33aa91bf91d0dd5c1440aa") },\n  { $set: { name: "Rexy" } }\n)',
          },
          prompt: 'Which update operator gives new values to specific fields without touching the rest of the document?',
          answers: ['$set', 'set'],
          explain: '<code>$set</code> only changes the fields you list.',
          hints: ['It starts with a dollar sign and appears in the lesson note above.'],
        },
        {
          id: 'upd-by-id',
          type: 'cmd',
          title: 'A new name',
          prompt: 'Dazzy is being renamed. Find the document by its <code>_id</code> and change its <code>name</code> to "Thunder".<p class="aside">Tip: click an ObjectId in the data panel to paste it into your command.</p>',
          hints: [
            'Filter: <code>{ _id: ObjectId("...") }</code> using Dazzy\'s id from the data panel.',
            'Second argument: <code>{ $set: { name: "Thunder" } }</code>.',
          ],
          must: [{ re: /_id/, msg: 'That works, but practise filtering by <code>_id</code> here.' }],
          solution: 'db.animals.updateOne(\n  { _id: ObjectId("' + ID.dazzy + '") },\n  { $set: { name: "Thunder" } }\n)',
        },
        {
          id: 'upd-two',
          type: 'cmd',
          title: 'Two fields at once',
          note: {
            title: 'Filtering by any field, setting several fields',
            body: 'The filter can use any field, not only <code>_id</code>. And one <code>$set</code> can change several fields: list them all inside the same braces.',
            code: 'db.pets.updateOne(\n  { name: "Rex" },\n  { $set: { age: 6, breed: "Mixed" } }\n)',
          },
          prompt: 'Find the animal whose <code>name</code> is "Timmy". In one command, change its <code>age</code> to 2 and its <code>breed</code> to "Collie".',
          hints: [
            'Filter: <code>{ name: "Timmy" }</code>.',
            'Both changes go in one <code>$set</code>: <code>{ $set: { age: 2, breed: "Collie" } }</code>.',
          ],
          solution: 'db.animals.updateOne(\n  { name: "Timmy" },\n  { $set: { age: 2, breed: "Collie" } }\n)',
        },
        {
          id: 'upd-order-q',
          type: 'text',
          title: 'Quick check',
          prompt: 'In <code>updateOne(A, B)</code>, which argument is the filter that chooses the document: <code>A</code> or <code>B</code>?',
          answers: ['a', 'first', 'the first', '1', '1st'],
          explain: 'Filter first, changes second.',
          hints: ['You have to find a document before you can change it.'],
        },
        {
          id: 'del-by-id',
          type: 'cmd',
          title: 'Adopted!',
          note: {
            title: 'Deleting a document',
            body: '<code>deleteOne</code> takes a filter, just like the first argument of <code>updateOne</code>, and removes the first document that matches.',
            code: 'db.pets.deleteOne({\n  _id: ObjectId("5f33aa91bf91d0dd5c1440aa")\n})',
          },
          prompt: 'Fluffy has found a home. Delete Fluffy\'s document, finding it by <code>_id</code>.',
          hints: ['<code>db.animals.deleteOne({ _id: ObjectId("...") })</code> with Fluffy\'s id from the data panel.'],
          must: [{ re: /_id/, msg: 'That works, but practise filtering by <code>_id</code> here.' }],
          solution: 'db.animals.deleteOne({ _id: ObjectId("' + ID.fluffy + '") })',
        },
        {
          id: 'del-by-name',
          type: 'cmd',
          title: 'Another happy ending',
          prompt: 'Timmy has been adopted too. Remove the animal whose <code>name</code> is "Timmy".',
          hints: ['Same method, different filter: <code>{ name: "Timmy" }</code>.'],
          solution: 'db.animals.deleteOne({ name: "Timmy" })',
        },
      ],
    },

    {
      id: 'arrays',
      title: 'Arrays & sub-documents',
      blurb: 'Add to, remove from and edit inside arrays.',
      seed: () => ({
        dbName: 'animal_shelter',
        cols: {
          animals: [
            { _id: oid(ID.dazzy), name: 'Thunder', age: 35, breed: 'Greyhound', type: 'Dog', tags: ['calm', 'senior'], checkups: [] },
            {
              _id: oid(ID.frenzy),
              name: 'Frenzy',
              age: 1,
              breed: 'Wild Cat',
              type: 'Cat',
              checkups: [
                { _id: oid(ID.chuaFrenzy), name: 'Dr Chua', diagnosis: 'Heartworms', treatment: 'Steroids' },
                { _id: oid(ID.leeFrenzy), name: 'Dr Lee', diagnosis: 'Fleas', treatment: 'Flea bath' },
              ],
            },
            {
              _id: oid(ID.biscuit),
              name: 'Biscuit',
              age: 6,
              breed: 'Beagle',
              type: 'Dog',
              microchip: 'pending',
              checkups: [
                { _id: oid(ID.chuaBiscuit1), name: 'Dr Chua', diagnosis: 'Ear infection', treatment: 'Ear drops' },
                { _id: oid(ID.ongBiscuit), name: 'Dr Ong', diagnosis: 'Arthritis', treatment: 'Joint supplements' },
                { _id: oid(ID.chuaBiscuit2), name: 'Dr Chua', diagnosis: 'Obesity', treatment: 'Diet plan' },
              ],
            },
          ],
        },
      }),
      exercises: [
        {
          id: 'arr-push-str',
          type: 'cmd',
          title: 'Add to a list',
          note: {
            title: 'Adding an element to an array',
            body: '<code>$push</code> appends one new element to the end of an array field. It is used in the second argument of <code>updateOne</code>, in the same place you would put <code>$set</code>.',
            code: 'db.pets.updateOne(\n  { name: "Rex" },\n  { $push: { toys: "frisbee" } }\n)',
          },
          prompt: 'Thunder has just been microchipped. Add the string "microchipped" to Thunder\'s <code>tags</code> array.',
          hints: [
            'Filter by <code>{ name: "Thunder" }</code>.',
            'Update: <code>{ $push: { tags: "microchipped" } }</code>.',
          ],
          must: [{ re: /\$push|\$addToSet/, msg: 'The data is right, but use <code>$push</code> so the existing tags are left alone.' }],
          solution: 'db.animals.updateOne(\n  { name: "Thunder" },\n  { $push: { tags: "microchipped" } }\n)',
        },
        {
          id: 'arr-pull-str',
          type: 'cmd',
          title: 'Take from a list',
          note: {
            title: 'Removing an element from an array',
            body: '<code>$pull</code> is the opposite of <code>$push</code>: it removes every element that matches the value you give it.',
            code: 'db.pets.updateOne(\n  { name: "Rex" },\n  { $pull: { toys: "ball" } }\n)',
          },
          prompt: 'Thunder does not like being called old. Remove "senior" from Thunder\'s <code>tags</code>.',
          hints: ['Update: <code>{ $pull: { tags: "senior" } }</code>.'],
          must: [{ re: /\$pull/, msg: 'The data is right, but use <code>$pull</code> for this one.' }],
          solution: 'db.animals.updateOne(\n  { name: "Thunder" },\n  { $pull: { tags: "senior" } }\n)',
        },
        {
          id: 'arr-insert-empty',
          type: 'cmd',
          title: 'A dog with no history',
          note: {
            title: 'Embedded documents',
            body: 'An array can hold whole objects, called <strong>sub-documents</strong>. Here each animal keeps its vet visits in a <code>checkups</code> array. A new animal starts with an empty one: <code>[]</code>.',
            code: 'db.pets.insertOne({\n  name: "Rex",\n  visits: []\n})',
          },
          prompt: 'Insert a new dog into <code>animals</code>:<ul><li><code>name</code>: "Cookie"</li><li><code>age</code>: 3</li><li><code>breed</code>: "Lab Retriever"</li><li><code>type</code>: "Dog"</li><li><code>checkups</code>: an empty array</li></ul>',
          hints: ['An empty array is written <code>[]</code>, so the last field is <code>checkups: []</code>.'],
          solution: 'db.animals.insertOne({\n  name: "Cookie",\n  age: 3,\n  breed: "Lab Retriever",\n  type: "Dog",\n  checkups: []\n})',
        },
        {
          id: 'arr-push-q',
          type: 'text',
          title: 'Quick check',
          prompt: 'Cookie is about to see the vet for the first time. Which update operator will add the new checkup to her <code>checkups</code> array?',
          answers: ['$push', 'push'],
          explain: '<code>$push</code> works the same whether the new element is a string or a whole object.',
          hints: ['You used it two steps ago to add a tag.'],
        },
        {
          id: 'arr-push-doc',
          type: 'cmd',
          title: 'Cookie\'s first checkup',
          note: {
            title: 'Pushing a sub-document',
            body: 'To push an object, put the whole object as the value. Calling <code>ObjectId()</code> with nothing inside generates a fresh id, which gives the sub-document an <code>_id</code> of its own so you can find it later.',
            code: 'db.pets.updateOne(\n  { name: "Rex" },\n  {\n    $push: {\n      visits: {\n        _id: ObjectId(),\n        vet: "Dr Lim",\n        reason: "Vaccination"\n      }\n    }\n  }\n)',
          },
          prompt: 'Add a checkup to Cookie\'s <code>checkups</code> array (find her by name):<ul><li><code>_id</code>: a newly generated ObjectId</li><li><code>name</code>: "Dr Tan"</li><li><code>diagnosis</code>: "Diabetes"</li><li><code>treatment</code>: "Medication"</li></ul>',
          hints: [
            'Outline: <code>db.animals.updateOne({ name: "Cookie" }, { $push: { checkups: { ... } } })</code>.',
            'The pushed object: <code>{ _id: ObjectId(), name: "Dr Tan", diagnosis: "Diabetes", treatment: "Medication" }</code>.',
          ],
          must: [{ re: /\$push|\$addToSet/, msg: 'The data is right, but use <code>$push</code> for this one.' }],
          solution:
            'db.animals.updateOne(\n  { name: "Cookie" },\n  {\n    $push: {\n      checkups: {\n        _id: ObjectId(),\n        name: "Dr Tan",\n        diagnosis: "Diabetes",\n        treatment: "Medication"\n      }\n    }\n  }\n)',
        },
        {
          id: 'arr-pull-doc',
          type: 'cmd',
          title: 'A checkup entered by mistake',
          note: {
            title: 'Pulling a sub-document',
            body: 'With sub-documents, give <code>$pull</code> a small condition object. Every element of the array that matches it is removed. Matching on the sub-document\'s <code>_id</code> removes exactly one.',
            code: 'db.pets.updateOne(\n  { _id: ObjectId("5f33aa91bf91d0dd5c1440aa") },\n  {\n    $pull: {\n      visits: { _id: ObjectId("5f33aa91bf91d0dd5c1440bb") }\n    }\n  }\n)',
          },
          prompt: 'Frenzy\'s checkup with Dr Lee was recorded by mistake. Find Frenzy by <code>_id</code>, then remove that one checkup from the <code>checkups</code> array by the checkup\'s own <code>_id</code>.',
          hints: [
            'There are two different ids here: Frenzy\'s goes in the filter, the checkup\'s goes inside <code>$pull</code>.',
            'Update: <code>{ $pull: { checkups: { _id: ObjectId("...Dr Lee\'s checkup id...") } } }</code>.',
          ],
          must: [{ re: /\$pull/, msg: 'The data is right, but use <code>$pull</code> for this one.' }],
          solution:
            'db.animals.updateOne(\n  { _id: ObjectId("' + ID.frenzy + '") },\n  { $pull: { checkups: { _id: ObjectId("' + ID.leeFrenzy + '") } } }\n)',
        },
        {
          id: 'arr-elem-q',
          type: 'text',
          title: 'Quick check',
          note: {
            title: 'Editing one element inside an array',
            body: 'Two pieces work together. In the filter, <code>$elemMatch</code> finds the document that has an array element matching your criteria. In the update, the path <code>"visits.$.vet"</code> uses <code>$</code> to mean "the index of the element that the filter matched". Because the path contains dots, it must be in quotes.',
            code: 'db.pets.updateOne(\n  {\n    visits: {\n      $elemMatch: { _id: ObjectId("5f33aa91bf91d0dd5c1440bb") }\n    }\n  },\n  { $set: { "visits.$.vet": "Dr Wong" } }\n)',
          },
          prompt: 'Which query operator finds a document by looking for an array element that fits your criteria?',
          answers: ['$elemmatch', 'elemmatch'],
          explain: '<code>$elemMatch</code> goes in the filter, on the array field.',
          hints: ['It is in the filter of the lesson note above.'],
        },
        {
          id: 'arr-dollar-q',
          type: 'text',
          title: 'Quick check',
          prompt: 'In the update path <code>"checkups.$.name"</code>, which single character stands for the position of the matched element?',
          answers: ['$', 'dollar', 'dollar sign', 'the dollar sign'],
          explain: '<code>$</code> is the positional operator: a placeholder for the matched index.',
          hints: ['It sits between the two dots.'],
        },
        {
          id: 'arr-elem',
          type: 'cmd',
          title: 'Wrong vet on record',
          prompt: 'Frenzy\'s Heartworms checkup lists the wrong vet. Use <code>$elemMatch</code> to find the checkup by its <code>_id</code>, then change that checkup\'s <code>name</code> to "Dr Su".',
          hints: [
            'Filter: <code>{ checkups: { $elemMatch: { _id: ObjectId("...") } } }</code>.',
            'Update: <code>{ $set: { "checkups.$.name": "Dr Su" } }</code>. The quotes around the path are required.',
          ],
          must: [
            { re: /\$elemMatch/, msg: 'The data is right, but use <code>$elemMatch</code> in the filter for this one.' },
            { re: /checkups\.\$\.name/, msg: 'The data is right, but use the positional path <code>"checkups.$.name"</code>.' },
          ],
          solution:
            'db.animals.updateOne(\n  { checkups: { $elemMatch: { _id: ObjectId("' + ID.chuaFrenzy + '") } } },\n  { $set: { "checkups.$.name": "Dr Su" } }\n)',
        },
        {
          id: 'arr-dot',
          type: 'cmd',
          title: 'The shorter way',
          note: {
            title: 'Dot notation in the filter',
            body: 'When you match on a single field of the sub-document, you can skip <code>$elemMatch</code> and write the path directly: <code>"visits._id"</code>. The <code>$</code> in the update works the same way. <code>ISODate()</code> with nothing inside means "right now".',
            code: 'db.pets.updateOne(\n  { "visits._id": ObjectId("5f33aa91bf91d0dd5c1440bb") },\n  {\n    $set: {\n      "visits.$.vet": "Dr Wong",\n      "visits.$.date": ISODate()\n    }\n  }\n)',
          },
          prompt: 'Correct the same checkup again, this time filtering with <code>"checkups._id"</code>. Set its <code>name</code> to "Dr Zhao" and add a <code>date</code> field holding the current date.',
          hints: [
            'Filter: <code>{ "checkups._id": ObjectId("...") }</code>.',
            'Update: <code>{ $set: { "checkups.$.name": "Dr Zhao", "checkups.$.date": ISODate() } }</code>.',
          ],
          must: [{ re: /checkups\._id/, msg: 'The data is right, but filter with the dotted path <code>"checkups._id"</code> this time.' }],
          solution:
            'db.animals.updateOne(\n  { "checkups._id": ObjectId("' + ID.chuaFrenzy + '") },\n  { $set: { "checkups.$.name": "Dr Zhao", "checkups.$.date": ISODate() } }\n)',
        },
        {
          id: 'arr-filters',
          type: 'cmd',
          title: 'Redact a vet\'s notes',
          note: {
            title: 'Changing several elements: arrayFilters',
            body: '<code>$</code> only reaches the first matched element. To change <em>every</em> element that fits a condition, invent a name (an identifier) and use it in the path as <code>$[name]</code>. Then pass a third argument with <code>arrayFilters</code> that says which elements that name stands for. <code>updateMany</code> with an empty filter <code>{}</code> applies this to every document.',
            code: 'db.pets.updateMany(\n  {},\n  { $set: { "visits.$[v].reason": "hidden" } },\n  { arrayFilters: [ { "v.vet": "Dr Lim" } ] }\n)',
          },
          prompt: 'Across all animals, set the <code>diagnosis</code> of every checkup whose <code>name</code> is "Dr Chua" to the string "redacted".',
          hints: [
            'Three arguments: <code>db.animals.updateMany({}, { $set: ... }, { arrayFilters: [ ... ] })</code>.',
            'The path: <code>"checkups.$[eachCheckup].diagnosis"</code>. The identifier can be any name you like.',
            'The filter: <code>{ arrayFilters: [ { "eachCheckup.name": "Dr Chua" } ] }</code>. It must use the same identifier.',
          ],
          must: [{ re: /arrayFilters/, msg: 'The data is right, but use <code>arrayFilters</code> for this one.' }],
          solution:
            'db.animals.updateMany(\n  {},\n  { $set: { "checkups.$[eachCheckup].diagnosis": "redacted" } },\n  { arrayFilters: [ { "eachCheckup.name": "Dr Chua" } ] }\n)',
        },
        {
          id: 'arr-unset',
          type: 'cmd',
          title: 'Drop a field',
          note: {
            title: 'Removing a field',
            body: '<code>$unset</code> deletes a key from the document altogether. The value you give is ignored, so by convention it is an empty string.',
            code: 'db.pets.updateOne(\n  { name: "Rex" },\n  { $unset: { nickname: "" } }\n)',
          },
          prompt: 'The shelter no longer tracks microchip status this way. Remove the <code>microchip</code> field from Biscuit\'s document.',
          hints: ['Update: <code>{ $unset: { microchip: "" } }</code>.'],
          must: [{ re: /\$unset/, msg: 'Use <code>$unset</code> for this one.' }],
          solution: 'db.animals.updateOne(\n  { name: "Biscuit" },\n  { $unset: { microchip: "" } }\n)',
        },
        {
          id: 'arr-unset-q',
          type: 'text',
          title: 'Quick check',
          prompt: 'One last recall before the final mission. Which operator removes one value from an array, leaving the rest of the array in place?',
          answers: ['$pull', 'pull'],
          explain: '<code>$pull</code> removes array elements; <code>$unset</code> removes a whole field.',
          hints: ['It is the opposite of <code>$push</code>.'],
        },
      ],
    },

    {
      id: 'final',
      title: 'Final mission: fake_school',
      blurb: 'No lesson notes. Build and maintain a school database from scratch.',
      final: true,
      seed: () => ({ dbName: 'test', cols: {} }),
      exercises: [
        {
          id: 'fin-use',
          type: 'cmd',
          title: 'A new database',
          prompt: 'Create (switch to) a new database with the name <code>fake_school</code>.',
          hints: ['<code>use</code> followed by the database name.'],
          solution: 'use fake_school',
        },
        {
          id: 'fin-create',
          type: 'cmd',
          title: 'A new collection',
          prompt: 'Create a new, empty collection named <code>students</code>.<p class="aside">New here: <code>db.createCollection("name")</code> creates a collection without inserting anything.</p>',
          hints: ['<code>db.createCollection("students")</code>. The name is a string, so it needs quotes.'],
          solution: 'db.createCollection("students")',
        },
        {
          id: 'fin-insert',
          type: 'cmd',
          title: 'Enrol three students',
          prompt:
            'Add these three students to <code>students</code>. Use the field names <code>name</code>, <code>age</code>, <code>subjects</code> (an array of strings) and <code>date_enrolled</code> (a date).' +
            '<table class="facts"><tr><th>name</th><th>age</th><th>subjects</th><th>date enrolled</th></tr>' +
            '<tr><td>Jane Doe</td><td>13</td><td>Defense Against the Dark Arts, Charms, History of Magic</td><td>13th May 2016</td></tr>' +
            '<tr><td>James Verses</td><td>14</td><td>Transfiguration, Alchemy</td><td>15th June 2015</td></tr>' +
            '<tr><td>Jonathan Goh</td><td>12</td><td>Divination, Study of Ancient Runes</td><td>16th April 2017</td></tr></table>',
          hints: [
            'One <code>insertMany([ {...}, {...}, {...} ])</code> does it.',
            'One student looks like: <code>{ name: "Jane Doe", age: 13, subjects: ["Defense Against the Dark Arts", "Charms", "History of Magic"], date_enrolled: ISODate("2016-05-13") }</code>.',
          ],
          solution:
            'db.students.insertMany([\n  {\n    name: "Jane Doe",\n    age: 13,\n    subjects: ["Defense Against the Dark Arts", "Charms", "History of Magic"],\n    date_enrolled: ISODate("2016-05-13")\n  },\n  {\n    name: "James Verses",\n    age: 14,\n    subjects: ["Transfiguration", "Alchemy"],\n    date_enrolled: ISODate("2015-06-15")\n  },\n  {\n    name: "Jonathan Goh",\n    age: 12,\n    subjects: ["Divination", "Study of Ancient Runes"],\n    date_enrolled: ISODate("2017-04-16")\n  }\n])',
        },
        {
          id: 'fin-age',
          type: 'cmd',
          title: 'A correction',
          prompt: 'Change the age of James Verses to 13.',
          hints: ['<code>updateOne</code> with a filter on <code>name</code>, then <code>$set</code> the <code>age</code>.'],
          solution: 'db.students.updateOne(\n  { name: "James Verses" },\n  { $set: { age: 13 } }\n)',
        },
        {
          id: 'fin-jane',
          type: 'cmd',
          title: 'Jane Doe Jr',
          prompt: 'Change the student with the name "Jane Doe" to "Jane Doe Jr" and her age to 11.',
          hints: ['One <code>$set</code> can hold both fields: <code>{ $set: { name: "Jane Doe Jr", age: 11 } }</code>.'],
          solution: 'db.students.updateOne(\n  { name: "Jane Doe" },\n  { $set: { name: "Jane Doe Jr", age: 11 } }\n)',
        },
        {
          id: 'fin-delete',
          type: 'cmd',
          title: 'A student leaves',
          prompt: 'Remove Jonathan Goh from the system.',
          hints: ['<code>deleteOne</code> with a filter on <code>name</code>.'],
          solution: 'db.students.deleteOne({ name: "Jonathan Goh" })',
        },
        {
          id: 'fin-push',
          type: 'cmd',
          title: 'A new subject',
          prompt: 'Add Arithmancy to James Verses\' subjects.',
          hints: ['<code>subjects</code> is an array of strings, so <code>$push</code> a string onto it.'],
          must: [{ re: /\$push|\$addToSet/, msg: 'The data is right, but add to the array with <code>$push</code> instead of rewriting it.' }],
          solution: 'db.students.updateOne(\n  { name: "James Verses" },\n  { $push: { subjects: "Arithmancy" } }\n)',
        },
        {
          id: 'fin-pull',
          type: 'cmd',
          title: 'Drop a subject',
          prompt: 'Remove History of Magic from Jane Doe Jr\'s subjects.',
          hints: ['Remember her name changed. Then <code>$pull</code> the string from <code>subjects</code>.'],
          must: [{ re: /\$pull/, msg: 'The data is right, but remove from the array with <code>$pull</code> instead of rewriting it.' }],
          solution: 'db.students.updateOne(\n  { name: "Jane Doe Jr" },\n  { $pull: { subjects: "History of Magic" } }\n)',
        },
      ],
    },
  ];

  // Build the starting data for every exercise by replaying the solutions.
  const { run, clone, setDeterministic } = root.Engine;
  setDeterministic(true);
  for (const ch of chapters) {
    let state = ch.seed();
    for (const ex of ch.exercises) {
      ex.before = clone(state);
      if (ex.type !== 'cmd') continue;
      const res = run(ex.solution, state);
      if (res.error) console.error('Solution for ' + ex.id + ' failed: ' + res.error);
    }
  }
  setDeterministic(false);

  const { equal, explain, Cursor } = root.Engine;

  // Grades one attempt. status: 'ok' | 'wrong' | 'error' | 'info' (a harmless
  // read such as find() that neither passes nor counts as a miss).
  function check(ex, input) {
    if (ex.type === 'text') {
      const norm = String(input)
        .toLowerCase()
        .replace(/["'`]/g, '')
        .replace(/\(\)|[.!]+$/g, '')
        .replace(/\s+/g, ' ')
        .trim();
      if (!norm) return { status: 'error', error: 'Type an answer first.' };
      return { status: ex.answers.includes(norm) ? 'ok' : 'wrong', reasons: [] };
    }
    const state = clone(ex.before);
    const res = run(input, state);
    if (res.error) return { status: 'error', error: res.error };
    const want = clone(ex.before);
    run(ex.solution, want);
    const out = { state, value: res.value, text: res.text };
    if (equal(state, want, true)) {
      const miss = (ex.must || []).find((m) => !m.re.test(input));
      if (miss) return Object.assign(out, { status: 'wrong', reasons: [miss.msg], html: true });
      return Object.assign(out, { status: 'ok' });
    }
    const wrote = res.value && res.value.acknowledged;
    if (!wrote && equal(state, ex.before)) return Object.assign(out, { status: 'info' });
    return Object.assign(out, { status: 'wrong', reasons: explain(state, want, ex.before) });
  }

  root.Course = { chapters, check };
})(typeof window !== 'undefined' ? window : globalThis);
