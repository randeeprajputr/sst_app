import handler from "../util/handler";
import dynamoDb from "../util/dynamodb";

export const main = handler(async(event)=>{
    console.log("I am in query")
    const params={
        TableName:process.env.TABLE_NAME,
        // 'Key' defines the partition key and sort key of the item to be retrieved
        Key:{
            logStatus:"Failure",
        },
    };

    const result =await dynamoDb.get(params);
    console.log("Here is DB Results:",result)
    if(!result.Item){
        throw new Error("Item not found.");
    }

    //Return the retrieved item

    return result.Item;
});