import * as uuid from "uuid";
import AWS from 'aws-sdk';
import { Queue } from '@serverless-stack/node/queue';

const sqs = new AWS.SQS();


const sendMessageBatch = async (queueUrl, messages) => {
  const entries = messages.map((message, index) => ({
      Id: `message_${index}`,
      MessageBody: message
  }));

  const params = {
      QueueUrl: queueUrl,
      Entries: entries
  };

  const data = await sqs.sendMessageBatch(params).promise();

  console.log(`Sent ${data.Successful.length} messages to SQS`);

  return data;
};

export async function handler() {
    const queueUrl=Queue.Queue.queueUrl;
    const message=["Hello!","My Name is Randeep Chauhan","I am always try to learn new Things!","Bye","Good Night","Its 3 am in nigh or is say morning!"];
    await sendMessageBatch(queueUrl,message)

}

const receiveMessage = async (queueUrl) => {
  let delay = 100; // initial delay in ms
  let attempts = 0;

  while (attempts < 3) {
      try {
          const params = {
              QueueUrl: queueUrl,
              WaitTimeSeconds: 20
          };

          const data = await sqs.receiveMessage(params).promise();

          if (data.Messages) {
              console.log(`Received ${data.Messages.length} messages`);

              data.Messages.forEach((message) => {
                  console.log(`Message: ${message.Body}`);

                  // Process the message here
              });

              return data;
          } else {
              console.log("No message received");
          }
      } catch (err) {
          console.error(`Error retrieving message from SQS: ${err.message}`);

          if (attempts < 4) {
              // Exponentially increase the delay before next retry
              delay *= 2;

              console.log(`Retrying in ${delay} ms`);

              await new Promise(resolve => setTimeout(resolve, delay));
          } else {
              throw err;
          }
      }

      attempts++;
  }
};

export async function getMessages (event) {
  const queueUrl = Queue.Queue.queueUrl;

  receiveMessage(queueUrl);
};