import handler from "../util/handler";
import dynamodb from "../util/dynamodb";

export const main=handler(async(event)=>{

    const params={
        TableName:process.env.TABLE_NAME,
        KeyConditionExpression:"logId=:logId",
        ExpressionAttributeValues:{
            ":logId":"a85800b0-9380-11ed-a260-5d294aa736c9"
        },
    };

    const result=await dynamodb.query(params);
    return result.Items;
})