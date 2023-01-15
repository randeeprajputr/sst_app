import handler from "../util/handler";
import dynamodb from "../util/dynamodb";

export const main = handler(async (event) => {

    const params = {
        TableName: process.env.TABLE_NAME,
        FilterExpression: 'logStatus = :status',
        ExpressionAttributeValues: {
            ':status': 'Failure',
        }

    };

    const result = await dynamodb.scan(params);
    return result.Items;
})