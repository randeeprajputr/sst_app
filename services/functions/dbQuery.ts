import handler from "../util/handler";
import dynamoDb from "../util/dynamodb";

export const main = handler(async(event)=>{
    console.log("I am in query")
    const params={
        TableName:process.env.TABLE_NAME,
        Key:{
            logStatus:"Failure",
        },
    };

    const result =await dynamoDb.get(params);
    if(!result.Item){
        throw new Error("Item not found.");
    }
    return result.Item;
});