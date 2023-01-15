import {StackContext,Queue,Api ,use} from "@serverless-stack/resources";
import { StorageStack } from "./StorageStack";

export function ApiStack ({stack,app}:StackContext){
    const {table}=use(StorageStack);

    //Create Queue
    const queue = new Queue(stack, "Queue", {
        consumer: {
            function: {
                handler: "functions/consumer.handler",
                timeout: 30,
                environment: { TABLE_NAME: table.tableName },
                permissions: [table],      
              },
        },
    
        
      });


    //Create Api 
    const api =new Api(stack,"Api",{
        defaults:{
            function:{
                permissions:[table,queue],
                environment:{
                    TABLE_NAME:table.tableName,
                },
                bind:[table,queue],
            },
        },
        routes:{
            "POST /":"functions/lambda.handler",
            "GET /":"functions/lambda.getMessages",
            // "POST /create-log":"functions/create.main",
            // "GET /all-logs":"functions/get.main",
            "GET /logs":"functions/list.main",
            "GET /query":"functions/dbQuery.main"
        },
    });
    return {
        api,
    };
}