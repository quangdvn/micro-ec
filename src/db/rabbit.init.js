'use strict';

const amqp = require('amqplib');

const connectToRabbitMQ = async () => {
  try {
    const connection = await amqp.connect('amqp://admin:admin@localhost');
    if (!connection)
      throw new Error('Error: Connection can not be established');

    const channel = await connection.createChannel();

    return { connection, channel };
  } catch (error) {
    console.error('Error connecting to RabbitMQ', error);
    throw error;
  }
};

const connectToRabbitMQForTest = async () => {
  try {
    const { channel, connection } = await connectToRabbitMQ();
    // Publish message to a test queue
    const testQueue = 'test-queue';
    const message = 'Hello, RabbitMQ!';

    await channel.assertQueue(testQueue, { durable: false });
    channel.sendToQueue(testQueue, Buffer.from(message));

    // Close connection
    await channel.close();

    return connection;
  } catch (error) {
    console.error('RabbitMQ error:', error);
  }
};

module.exports = { connectToRabbitMQ, connectToRabbitMQForTest };
