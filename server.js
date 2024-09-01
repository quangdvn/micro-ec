'use strict';

const {
  consumerToQueue,
  consumerToQueueFail,
  consumerToQueueNormal,
} = require('./src/services/consumerQueue.service');

// const queueName = 'test-topic';
// consumerToQueue(queueName)
//   .then(() => {
//     console.log('Start consuming queue');
//   })
//   .catch((err) => console.error(`Message Error: ${err.message}`));

consumerToQueueNormal()
  .then(() => {
    console.log('Start consuming queue normally');
  })
  .catch((err) => console.error(`Message Error: ${err.message}`));

consumerToQueueFail()
  .then(() => {
    console.log('Start consuming queue if error');
  })
  .catch((err) => console.error(`Message Error: ${err.message}`));
