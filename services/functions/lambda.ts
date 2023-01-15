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

