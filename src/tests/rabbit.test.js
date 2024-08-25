'use strict';

const { connectToRabbitMQForTest } = require('../db/rabbit.init');

describe('RabbitMQ Connection', () => {
  it('should be established successfully', async () => {
    const connection = await connectToRabbitMQForTest();
    expect(connection).toBeDefined();
    await connection.close();
  });
});
