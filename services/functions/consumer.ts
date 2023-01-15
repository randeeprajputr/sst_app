import dynamodb from '../util/dynamodb';


//Exponential Backoff Function

const exponentialBackoff = (retries) => {
    return new Promise((resolve) => {
        setTimeout(resolve, Math.pow(1.5, retries) * 60000);
    });
}


//Retrieve Messages from the Queue
const retrieveMessages = async (event) => {

    //Initally Set retires value=0
    let retries = 0;

    while (true) {

        for (let i = 0; i < event.Records.length; i++) {
            try {
                const randomNumber = Math.random();
                if (randomNumber < 0.3) {
                    throw new Error('Random failure');
                }
                console.log(`Processing message: ${JSON.parse(event.Records[i].body)}`);
            } catch (err) {
                if (retries < 3) {
                    retries++;
                    console.log(`Retrying after ${Math.pow(1.5, retries)* 60} seconds...`);
                    await exponentialBackoff(retries);
                } else {
                    console.log(`Exceeded maximum number of retries. Storing Message to DB with message Id:${event.Records[i].messageId}`)
                    const params = {
                        TableName: process.env.TABLE_NAME,
                        Item: {
                            logId: event.Records[i].messageId,
                            logStatus: "Failure",
                            content: event.Records[i].body,
                            createdAt: Date.now(),
                        },
                    }
                    return await dynamodb.put(params);
                }

            }
        }
    }
}

export async function handler(event) {
    retrieveMessages(event);
};
