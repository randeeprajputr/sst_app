import {Table,Bucket} from "@serverless-stack/resources";

export function StorageStack({stack,app}){
    
    //Create table schema

    const table =new Table (stack,"Logs",{
        fields:{
            logId:"string",
            logStatus:"string",
        },
        primaryIndex:{partitionKey:"logId",sortKey:"logStatus"},
    });
    const bucket = new Bucket(stack, "Uploads");


    return {
        table,
        bucket
    };
}