'use strict';

const {
  connectToRabbitMQ,
  consumerQueueForTest,
} = require('../db/rabbit.init');

// const log = console.log;

// console.log = function () {
//   log.apply(console, [new Date().toISOString(), ...arguments]);
// };

class MessageService {
  static async consumerToQueue(queueName) {
    try {
      const { channel, connection } = await connectToRabbitMQ();
      await consumerQueueForTest(channel, queueName);
    } catch (error) {
      console.error('Error consuming queue', error);
      throw error;
    }
  }
  // Normal processing
  static async consumerToQueueNormal() {
    try {
      const { channel, connection } = await connectToRabbitMQ();
      const notificationQueue = 'notificationQ'; // assertQueue

      // 1. TTL
      // const expiredTime = 15000;
      // setTimeout(() => {
      //   channel.consume(notificationQueue, (msg) => {
      //     console.log('Received message successfully:', msg.content.toString());
      //     channel.ack(msg);
      //   });
      // }, expiredTime);

      // 2. LOGIC
      channel.consume(notificationQueue, (msg) => {
        try {
          const testNumber = Math.random();
          console.log('testNumber', testNumber);
          if (testNumber < 0.5) {
            throw new Error('Something went wrong');
          }
          console.log('Received message successfully:', msg.content.toString());
          channel.ack(msg);
        } catch (error) {
          console.log('Error processing message:', error.message);
          channel.nack(msg, false, false);
          /**
           * nack: negative acknowledge
           * allUpTo: false >> Handle error to this message only, not for all messages
           * requeue: false >> Push error to DLX, not current queue
           */
        }
      });
    } catch (error) {
      console.error('Error consuming queue', error);
      throw error;
    }
  }
  // Fail to process
  static async consumerToQueueFail() {
    try {
      const { channel, connection } = await connectToRabbitMQ();

      const notificationExchangeDLX = 'notificationExDLX'; // direct
      const notificationRoutingKeyDLX = 'notificationRoutingKeyDLX'; // assertQueue
      const notificationQueueHandler = 'notificationQueueHotFix';

      await channel.assertExchange(notificationExchangeDLX, 'direct', {
        durable: true,
      });

      const queueResult = await channel.assertQueue(notificationQueueHandler, {
        exclusive: false,
      });

      await channel.bindQueue(
        queueResult.queue,
        notificationExchangeDLX,
        notificationRoutingKeyDLX
      );

      channel.consume(
        queueResult.queue,
        (failedMess) => {
          console.log(
            'Received failed message:',
            failedMess.content.toString()
          );
        },
        {
          noAck: true,
        }
      );
    } catch (error) {
      console.error('Error consuming queue', error);
      throw error;
    }
  }
}

module.exports = MessageService;
