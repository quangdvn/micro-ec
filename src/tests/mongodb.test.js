'use strict';

const mongoose = require('mongoose');

const connectionString =
  'mongodb://admin:mongo@localhost:27017/quangdvn-ec?authSource=admin';

const TestSchema = new mongoose.Schema({ name: String });
const Test = mongoose.model('Test', TestSchema);

describe('mongoose', () => {
  let connection;
  beforeAll(async () => {
    connection = await mongoose.connect(connectionString);
  });

  afterAll(async () => {
    await connection.disconnect();
  });

  it('should connect to MongoDB', async () => {
    expect(mongoose.connection.readyState).toEqual(1);
  });

  it('should save a document to MongoDB', async () => {
    const test = new Test({ name: 'test' });
    await test.save();
    expect(test.isNew).toBe(false);
  });

  it('should find a document in MongoDB', async () => {
    const test = await Test.findOne({ name: 'test' });
    expect(test).toBeDefined();
    expect(test.name).toEqual('test');
  });
});
