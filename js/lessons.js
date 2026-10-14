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
      id: 'design',
      title: 'Design: normalize or denormalize?',
      blurb: 'Copy data into every view, or store it once and refer to it? Feel the trade-off.',
      // Approach 2 from the slides: collections shaped around screens, data copied into each.
      seed: () => ({
        dbName: 'swim_coach',
        cols: {
          upcoming_sessions: [
            {
              _id: '5001',
              datetime: '2022-01-10 10:00',
              venue: 'Yishun Swimming Complex',
              students: [
                { _id: '2001', name: 'Benjamin Tan' },
                { _id: '2002', name: 'Cindy Teo' },
              ],
            },
            {
              _id: '5002',
              datetime: '2022-02-10 10:00',
              venue: 'Ang Mo Kio Swimming Complex',
              students: [{ _id: '2001', name: 'Benjamin Tan' }],
            },
            {
              _id: '5003',
              datetime: '2022-02-17 10:00',
              venue: 'Yishun Swimming Complex',
              students: [{ _id: '2002', name: 'Cindy Teo' }],
            },
          ],
          customers: [
            {
              _id: '2001',
              name: 'Benjamin Tan',
              parent: { _id: '1001', name: 'Tan Ah Kow' },
              sessions: [
                { _id: '5001', datetime: '2022-01-10 10:00', venue: 'Yishun Swimming Complex' },
                { _id: '5002', datetime: '2022-02-10 10:00', venue: 'Ang Mo Kio Swimming Complex' },
              ],
            },
            {
              _id: '2002',
              name: 'Cindy Teo',
              parent: { _id: '1002', name: 'Teo Ah De' },
              sessions: [
                { _id: '5001', datetime: '2022-01-10 10:00', venue: 'Yishun Swimming Complex' },
                { _id: '5003', datetime: '2022-02-17 10:00', venue: 'Yishun Swimming Complex' },
              ],
            },
          ],
        },
      }),
      exercises: [
        {
          id: 'des-norm-q',
          type: 'text',
          title: 'Two ways to model',
          note: {
            title: 'From ER diagram to documents',
            body: 'A swimming coach runs sessions at different pools. Parents pay for their children\'s sessions. You could store this data in two quite different ways:<br><strong>One collection per entity</strong> (<code>students</code>, <code>sessions</code>, <code>venues</code>, …). Each fact is stored once, and documents point to each other by <code>_id</code>.<br><strong>One collection per feature or screen</strong> (e.g. <code>upcoming_sessions</code>, <code>customers</code>). Each document already holds everything its screen shows, so the same fact is copied into many places.',
            code: '// one collection per entity: store once, refer by id\nstudents: { _id: "2001", name: "Benjamin Tan", session_ids: ["5001"] }\nsessions: { _id: "5001", venue_id: "404" }\n\n// one collection per screen: copy what the screen needs\ncustomers: {\n  _id: "2001", name: "Benjamin Tan",\n  sessions: [ { _id: "5001", venue: "Yishun Swimming Complex" } ]\n}',
          },
          prompt: 'What is the name for the <strong>one collection per entity</strong> design, where each fact is stored once and documents refer to each other by id?',
          answers: ['normalized', 'normalised', 'normalization', 'normalisation', 'normalized design', 'normalised design'],
          explain: 'Normalized: no duplicates, one source of truth.',
          hints: ['It is the same term used for relational (SQL) table design.', 'The other approach is the same word with "de" in front.'],
        },
        {
          id: 'des-denorm-q',
          type: 'text',
          title: 'And the other one',
          prompt: 'And what is the name for the <strong>one collection per feature</strong> design, where data is copied into every document that displays it?',
          answers: ['denormalized', 'denormalised', 'de-normalized', 'de-normalised', 'denormalization', 'denormalisation'],
          explain: 'Denormalized: duplicated data, shaped for fast reads. Many MongoDB developers prefer it, but keeping the copies consistent is up to you.',
          hints: ['Put "de" in front of the previous answer.'],
        },
        {
          id: 'des-embed-insert',
          type: 'cmd',
          title: 'A new customer',
          note: {
            title: 'A denormalized collection',
            body: 'The data panel now shows <code>swim_coach</code> built the denormalized way. <code>upcoming_sessions</code> feeds the "Upcoming sessions" screen and <code>customers</code> feeds the "Customers" screen. Each customer document <strong>embeds</strong> a copy of the parent and of the sessions, so the screen gets everything it needs from a single document with no extra lookups.',
            code: '{\n  _id: "2001",\n  name: "Benjamin Tan",\n  parent: { _id: "1001", name: "Tan Ah Kow" },   // embedded copy\n  sessions: [ ... ]                               // embedded copies\n}',
          },
          prompt: 'A new student signs up. Insert into <code>customers</code>:<ul><li><code>_id</code>: "2003"</li><li><code>name</code>: "Rachel Lee"</li><li><code>parent</code>: an embedded object with <code>_id</code> "1003" and <code>name</code> "Sharon Lee"</li><li><code>sessions</code>: an empty array</li></ul><p class="aside">The ids in this chapter are strings, as in the class examples, so no ObjectId() this time.</p>',
          hints: [
            'An embedded object is just an object as a value: <code>parent: { _id: "1003", name: "Sharon Lee" }</code>.',
            'Full shape: <code>db.customers.insertOne({ _id: "2003", name: "Rachel Lee", parent: { ... }, sessions: [] })</code>.',
          ],
          solution:
            'db.customers.insertOne({\n  _id: "2003",\n  name: "Rachel Lee",\n  parent: { _id: "1003", name: "Sharon Lee" },\n  sessions: []\n})',
        },
        {
          id: 'des-rename-1',
          type: 'cmd',
          title: 'The pool gets a new name',
          note: {
            title: 'Updating many documents',
            body: '<code>updateOne</code> stops after the first match. <code>updateMany</code> changes <strong>every</strong> document that matches the filter.',
            code: 'db.pets.updateMany(\n  { type: "Dog" },\n  { $set: { needs_walk: true } }\n)',
          },
          prompt: '"Yishun Swimming Complex" has been renamed to "Yishun Aquatic Centre". Update every document in <code>upcoming_sessions</code> whose <code>venue</code> is the old name.',
          hints: [
            'Two sessions are at Yishun, so <code>updateOne</code> will not be enough.',
            '<code>db.upcoming_sessions.updateMany({ venue: "Yishun Swimming Complex" }, { $set: { venue: "Yishun Aquatic Centre" } })</code>',
          ],
          solution:
            'db.upcoming_sessions.updateMany(\n  { venue: "Yishun Swimming Complex" },\n  { $set: { venue: "Yishun Aquatic Centre" } }\n)',
        },
        {
          id: 'des-inconsistent-q',
          type: 'text',
          title: 'Spot the problem',
          prompt: 'Now look at <code>customers</code> in the data panel. The session list there still says "Yishun Swimming Complex", while <code>upcoming_sessions</code> says "Yishun Aquatic Centre". The database now contradicts itself. In one word, the data is now…?',
          answers: ['inconsistent', 'inconsistency', 'data inconsistency', 'not consistent', 'stale', 'out of sync', 'outdated', 'duplicated', 'contradictory'],
          explain: 'In a denormalized design, every copy has to be updated. Miss one and different screens show different "truths".',
          hints: ['The opposite of consistent.'],
        },
        {
          id: 'des-rename-2',
          type: 'cmd',
          title: 'Hunt down every copy',
          prompt: 'Fix <code>customers</code>: for every customer, set the <code>venue</code> of every session that still says "Yishun Swimming Complex" to "Yishun Aquatic Centre".<p class="aside">Careful: Cindy has <em>two</em> Yishun sessions in her array.</p>',
          hints: [
            'The positional <code>$</code> only changes the first matching element in each document, so Cindy would keep one stale copy.',
            'Use <code>updateMany</code> with <code>"sessions.$[s].venue"</code> and <code>{ arrayFilters: [ { "s.venue": "Yishun Swimming Complex" } ] }</code>.',
          ],
          solution:
            'db.customers.updateMany(\n  {},\n  { $set: { "sessions.$[s].venue": "Yishun Aquatic Centre" } },\n  { arrayFilters: [ { "s.venue": "Yishun Swimming Complex" } ] }\n)',
        },
        {
          id: 'des-typo',
          type: 'cmd',
          title: 'A typo, everywhere',
          prompt: 'Cindy\'s surname was misspelled: it should be "Cindy Teoh". Her student id is "2002". Fix her name <strong>everywhere</strong> it is stored, which includes her customer document and each upcoming session she is in.<p class="aside">You can write more than one command in the editor. Put each on its own line and they run in order.</p>',
          hints: [
            'Two collections need changing. Use one command for each.',
            'Customers: <code>db.customers.updateOne({ _id: "2002" }, { $set: { name: "Cindy Teoh" } })</code>.',
            'Sessions: <code>db.upcoming_sessions.updateMany({ "students._id": "2002" }, { $set: { "students.$.name": "Cindy Teoh" } })</code>.',
          ],
          solution:
            'db.customers.updateOne({ _id: "2002" }, { $set: { name: "Cindy Teoh" } })\ndb.upcoming_sessions.updateMany(\n  { "students._id": "2002" },\n  { $set: { "students.$.name": "Cindy Teoh" } }\n)',
        },
        {
          id: 'des-size-q',
          type: 'text',
          title: 'How big can it grow?',
          prompt: 'Embedding everything in one document has a hard limit. What is the maximum size of a single MongoDB document, in MB?',
          answers: ['16', '16mb', '16 mb', '16 megabytes', 'sixteen'],
          explain: '16 MB. An array that grows forever, like every payment ever made, can eventually hit it.',
          hints: ['It is a power of two between 10 and 20.'],
        },

        // ---- the normalized version of the same data ----
        {
          id: 'des-ref-rename',
          type: 'cmd',
          title: 'The normalized way',
          seed: () => ({
            dbName: 'swim_coach',
            cols: {
              parents: [
                { _id: '1001', name: 'Tan Ah Kow' },
                { _id: '1002', name: 'Teo Ah De' },
              ],
              students: [
                { _id: '2001', name: 'Benjamin Tan', parent_id: '1001', session_ids: ['5001', '5002'] },
                { _id: '2002', name: 'Cindy Teoh', parent_id: '1002', session_ids: ['5001', '5003'] },
              ],
              sessions: [
                { _id: '5001', datetime: '2022-01-10 10:00', venue_id: '404' },
                { _id: '5002', datetime: '2022-02-10 10:00', venue_id: '405' },
                { _id: '5003', datetime: '2022-02-17 10:00', venue_id: '404' },
              ],
              venues: [
                { _id: '404', name: 'Yishun Swimming Complex' },
                { _id: '405', name: 'Ang Mo Kio Swimming Complex' },
                { _id: '406', name: 'Boon Lay Sports Complex' },
              ],
            },
          }),
          note: {
            title: 'A normalized collection set: references',
            body: 'The data panel now shows the same business stored the normalized way: one collection per entity. Instead of copying a venue\'s name into every session, a session stores only <code>venue_id</code>, a <strong>reference</strong> to a document in <code>venues</code>. Students refer to their parent with <code>parent_id</code> and to their sessions with an array of ids, <code>session_ids</code>.',
            code: 'sessions: { _id: "5001", venue_id: "404" }\nvenues:   { _id: "404",  name: "Yishun Swimming Complex" }',
          },
          prompt: 'The same renaming again: venue "404" becomes "Yishun Aquatic Centre". Make the change in this design.',
          hints: ['The name is stored in exactly one place: the <code>venues</code> document with <code>_id</code> "404".'],
          solution: 'db.venues.updateOne({ _id: "404" }, { $set: { name: "Yishun Aquatic Centre" } })',
        },
        {
          id: 'des-count-q',
          type: 'text',
          title: 'Count the changes',
          prompt: 'In the denormalized design, the rename took two commands and changed four documents across two collections. How many documents did you change this time?',
          answers: ['1', 'one', '1 document', 'one document'],
          explain: 'One. Every session that refers to venue "404" picks up the new name automatically. This single source of truth is the main payoff of normalizing.',
          hints: ['Count the <code>updateOne</code> calls you made, and how many documents each changed.'],
        },
        {
          id: 'des-ref-push',
          type: 'cmd',
          title: 'Booking by reference',
          prompt: 'Benjamin (student "2001") signs up for session "5003". In this design a booking is just a reference: add the id "5003" to his <code>session_ids</code> array.',
          hints: ['You are pushing a plain string onto an array: <code>{ $push: { session_ids: "5003" } }</code>.'],
          must: [{ re: /\$push|\$addToSet/, msg: 'The data is right, but add the reference with <code>$push</code>.' }],
          solution: 'db.students.updateOne({ _id: "2001" }, { $push: { session_ids: "5003" } })',
        },
        {
          id: 'des-ref-payment',
          type: 'cmd',
          title: 'A payment, in its own collection',
          note: {
            title: 'Referencing from the "many" side',
            body: 'A parent may make hundreds of payments over the years. Embedding all of them in one document would make it grow forever, so each payment becomes its own document holding references to the student and the session it pays for.',
            code: 'payments: {\n  _id: "501", mode: "CC", amount: 50,\n  student_id: "2001", session_id: "5001"\n}',
          },
          prompt: 'Record Benjamin\'s payment for session "5003" in a new <code>payments</code> collection:<ul><li><code>_id</code>: "503"</li><li><code>mode</code>: "PayNow"</li><li><code>amount</code>: 50</li><li><code>student_id</code>: "2001"</li><li><code>session_id</code>: "5003"</li></ul>',
          hints: ['<code>db.payments.insertOne({ _id: "503", mode: "PayNow", amount: 50, student_id: "2001", session_id: "5003" })</code>. The collection is created by the insert.'],
          solution:
            'db.payments.insertOne({\n  _id: "503",\n  mode: "PayNow",\n  amount: 50,\n  student_id: "2001",\n  session_id: "5003"\n})',
        },
        {
          id: 'des-ref-find',
          type: 'cmd',
          read: true,
          title: 'The price of references',
          note: {
            title: 'Following references: $in',
            body: 'With references, one screen can need several queries: first read the student to get the ids, then fetch the documents they point to. <code>$in</code> matches any value in a list, which is handy for fetching every referenced document in one go.',
            code: 'db.pets.find({ _id: { $in: ["p1", "p7", "p9"] } })',
          },
          prompt: 'Cindy\'s <code>session_ids</code> are "5001" and "5003". Write a <code>find</code> that returns exactly those two documents from <code>sessions</code>.',
          hints: [
            'Filter on <code>_id</code> with <code>$in</code> and an array of the two ids.',
            '<code>db.sessions.find({ _id: { $in: ["5001", "5003"] } })</code>',
          ],
          must: [{ re: /\$in/, msg: 'Right documents! Now do it with a single <code>$in</code> filter.' }],
          solution: 'db.sessions.find({ _id: { $in: ["5001", "5003"] } })',
        },
        {
          id: 'des-venue-q',
          type: 'text',
          title: 'Who remembers Boon Lay?',
          prompt: 'Boon Lay Sports Complex has no sessions yet. Which design can still record that the venue exists: normalized or denormalized?',
          answers: ['normalized', 'normalised', 'normalized design', 'the normalized one', 'normalised design'],
          explain: 'A view-shaped (denormalized) collection only knows about venues that appear in some session. A separate <code>venues</code> collection can hold all of them.',
          hints: ['In the denormalized data, a venue only existed as text inside a session.'],
        },
        {
          id: 'des-embed-q1',
          type: 'text',
          title: 'Embed or reference? (1/3)',
          note: {
            title: 'Rules of thumb',
            body: '<strong>Embed</strong> when the data belongs to its parent, is read together with it, and stays small, for example one-to-one or "one-to-few".<br><strong>Reference</strong> when the data is shared by many documents and must stay consistent, when it grows without limit, or when it must exist on its own.',
            code: '',
          },
          prompt: 'Each user has exactly one profile (picture and intro), and it is always shown together with the user. Should the profile be embedded or referenced? <em>Answer <code>embed</code> or <code>reference</code>.</em>',
          answers: ['embed', 'embedded', 'embedding'],
          explain: 'One-to-one and always read together: embed it.',
          hints: ['How many profiles per user? Is it ever shown on its own?'],
        },
        {
          id: 'des-embed-q2',
          type: 'text',
          title: 'Embed or reference? (2/3)',
          prompt: 'Every parent\'s payment history grows by dozens of payments a year, forever. Embed the payments in the parent document, or reference them? <em>Answer <code>embed</code> or <code>reference</code>.</em>',
          answers: ['reference', 'referenced', 'references', 'referencing', 'ref'],
          explain: 'An array that grows without limit heads towards the 16 MB cap, so keep payments in their own collection.',
          hints: ['Remember the document size limit.'],
        },
        {
          id: 'des-embed-q3',
          type: 'text',
          title: 'Embed or reference? (3/3)',
          prompt: 'A venue\'s name appears on many sessions, venues get renamed now and then, and the coach wants one source of truth. Embed or reference? <em>Answer <code>embed</code> or <code>reference</code>.</em>',
          answers: ['reference', 'referenced', 'references', 'referencing', 'ref'],
          explain: 'It is shared and it changes, so reference it. You felt why in the rename steps.',
          hints: ['Think back to how many commands the rename needed in each design.'],
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
      if (ex.seed) state = ex.seed();
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
    const out = { state, value: res.value, text: res.text };
    if (ex.read) return Object.assign(out, gradeRead(ex, input, state, res));
    const want = clone(ex.before);
    run(ex.solution, want);
    if (equal(state, want, true)) {
      const miss = (ex.must || []).find((m) => !m.re.test(input));
      if (miss) return Object.assign(out, { status: 'wrong', reasons: [miss.msg], html: true });
      return Object.assign(out, { status: 'ok' });
    }
    const wrote = res.value && res.value.acknowledged;
    if (!wrote && equal(state, ex.before)) return Object.assign(out, { status: 'info' });
    return Object.assign(out, { status: 'wrong', reasons: explain(state, want, ex.before) });
  }

  // Read exercises are graded on the documents the query returns.
  function gradeRead(ex, input, state, res) {
    if (!equal(state, ex.before)) {
      return { status: 'wrong', reasons: ['This step only reads data. Use find() rather than changing anything (nothing was saved).'] };
    }
    const docsOf = (v) => (v instanceof Cursor ? v.docs : v == null ? [] : Array.isArray(v) ? v : [v]);
    if (res.text !== undefined || !(res.value instanceof Cursor || (res.value && typeof res.value === 'object'))) {
      const msg = typeof res.value === 'number'
        ? 'That returned a number, not documents. Drop the .count() so find() returns the documents themselves.'
        : 'Return the matching documents themselves, e.g. with db.<collection>.find({ ... }).';
      return { status: 'wrong', reasons: [msg] };
    }
    const got = docsOf(res.value);
    const want = docsOf(run(ex.solution, clone(ex.before)).value);
    const same = got.length === want.length && want.every((d) => got.some((g) => equal(g, d, true)));
    if (!same) {
      const n = (k) => k + ' document' + (k === 1 ? '' : 's');
      return {
        status: 'wrong',
        reasons: [got.length === want.length ? 'Your query returned ' + n(got.length) + ', but not the right ones.' : 'Your query returned ' + n(got.length) + ', but ' + want.length + ' are expected.'],
      };
    }
    const miss = (ex.must || []).find((m) => !m.re.test(input));
    if (miss) return { status: 'wrong', reasons: [miss.msg], html: true };
    return { status: 'ok' };
  }

  root.Course = { chapters, check };
})(typeof window !== 'undefined' ? window : globalThis);
