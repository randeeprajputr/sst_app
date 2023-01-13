export const handler = async (event) => {
  return {
    statusCode: 200,
    headers: { "Content-Type": "text/plain" },
    body: `Hello, World! Your request was received at ${event.requestContext.time}.`,
  };
};

export const tester=async(event)=>{
  console.log("Here is Event:",event.rawQueryString)
  return{
    statusCode:200,
    headers:{"Content-Type":"text/plain"},
    body:`Hello Bhai ji kya haal hai btao sab badhiya`
  };
};
