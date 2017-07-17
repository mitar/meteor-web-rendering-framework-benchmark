import { Mongo } from 'meteor/mongo';
import { Random } from 'meteor/random';

const collections = [];

collections[0] = new Mongo.Collection(null);
collections[1] = new Mongo.Collection(null);
collections[2] = new Mongo.Collection(null);

for (let i = 0; i < 1000; i++) {
  const row1 = [];
  const row2 = [];
  const row3 = [];

  for (let j = 0; j < 10; j++) {
    let doc1 = {
      _id: Random.id(),
      cell: {
        value: Random.id()
      }
    };
    let doc2 = {
      _id: Random.id(),
      cell: {
        value: Random.id()
      }
    };

    row1.push(doc1);
    row2.push(doc2);

    // collections[2] is half columns from collections[0], half columns from collections[1].
    if (j % 2 === 0) {
      row3.push(doc1);
    }
    else {
      row3.push(doc2);
    }
  }

  collections[0].insert({row: row1, order: i});
  collections[1].insert({row: row2, order: i});
  collections[2].insert({row: row3, order: i});
}

export default collections;
