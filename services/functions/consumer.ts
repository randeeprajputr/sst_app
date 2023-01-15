
import dynamodb from '../util/dynamodb';
import { DynamoDB } from "aws-sdk";
import { Table } from "@serverless-stack/node/table";

const exponentialBackoff = (retries) => {
    return new Promise((resolve) => {
        setTimeout(resolve, Math.pow(1.5, retries) * 60000);
    });
}


const retrieveMessages = async (event) => {
    let retries = 0;
    while (true) {
        try {
            if (!event.Records) {
                break;
            }
            for (let i = 0; i < event.Records.length; i++) {
                try {
                    const randomNumber = Math.random();
                    if (randomNumber < 0.3) {
                        throw new Error('Random failure');
                    }
                    console.log(`Processing message: ${JSON.parse(event.Records[i].body)}`);
                } catch (err) {
                    const params = {
                        TableName: process.env.TABLE_NAME,
                        Item: {
                            logId: event.Records[i].messageId,
                            logStatus: "Failure",
                            content: event.Records[i].body,
                            createdAt: Date.now(),
                        },
                    }
                    await dynamodb.put(params);
                }
            }
            retries = 0;
        } catch (err) {
            if (retries < 3) {
                retries++;
                console.log(`Retrying after ${Math.pow(2, retries)} seconds...`);
                await exponentialBackoff(retries);
            } else {
                console.log(`Exceeded maximum number of retries: ${err}`)
                
            }
        }
    }
}

export async function handler(event) {
    retrieveMessages(event);
};
