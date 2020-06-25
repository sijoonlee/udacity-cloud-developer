## Please note this
I've got error messages about the reserved word 'word' was used
Maybe I did something wrong, but I changed a variable name  
So in both front-end and back-end,  
I am using **"todoName"** instead of "name"  
For example, 
```
export interface Todo {
  todoId: string
  createdAt: string
  todoName: string // this was 'name: string'
  dueDate: string
  done: boolean
  attachmentUrl?: string
}
```

## Backend API Address
https://2135u40867.execute-api.ca-central-1.amazonaws.com/dev/  


## Rubric Checklist

### Functionality
- The application allows users to create, update, delete TODO items
    - Yes
- The application allows users to upload a file
    - Yes
- The application only displays TODO items for a logged in user
    - Yes, like below example in [DynamoAccess.ts](https://github.com/sijoonlee/udacity-cloud-developer/blob/master/c4-final-project-starter-code/backend/src/dataLayer/DynamoAccess.ts)
    ```
    const result = await this.docClient.query({
      TableName: this.todoTable,
      IndexName: this.userIdIndex,
      KeyConditionExpression: "userId = :userId",
      ExpressionAttributeValues:{
        ":userId":userId
      }
    }).promise()
    ```
- Authentication is implemented and does not allow unauthenticated access
    - Yes, [authorizer](https://github.com/sijoonlee/udacity-cloud-developer/blob/master/c4-final-project-starter-code/backend/src/lambda/auth/auth0Authorizer.ts)

### Code Base
- The code is split into multiple layers separating business logic from I/O related code.
    - Yes
- Code is implemented using async/await and Promises without using callbacks.
    - Yes

### Best Practices
- All resources in the application are defined in the "serverless.yml" file
    - Yes, check [serverless.yml](https://github.com/sijoonlee/udacity-cloud-developer/blob/master/c4-final-project-starter-code/backend/serverless.yml)
- Each function has its own set of permissions.
    - Yes, check [serverless.yml](https://github.com/sijoonlee/udacity-cloud-developer/blob/master/c4-final-project-starter-code/backend/serverless.yml)
- Application has sufficient monitoring
    - Yes, check [Winston logging @ authorizer](https://github.com/sijoonlee/udacity-cloud-developer/blob/master/c4-final-project-starter-code/backend/src/lambda/auth/auth0Authorizer.ts)
- HTTP requests are validated
    -  request validation in API Gateway used in [serverless.yml](https://github.com/sijoonlee/udacity-cloud-developer/blob/master/c4-final-project-starter-code/backend/serverless.yml)

### Architecture
- Data is stored in a table with a composite key
    - Primary Key(todoId) & Global Secondary Index Key(userId)
- Scan operation is not used to read data from a database
    - Query is being used


### Request body validator

I have to add "pattern" key in json model file
It's now working properly to prevent empty string
- the Regex pattern that represents non-empty string
    ```
    ^(?!\s*$).+ 
    ```
-  after adding escape character
    ```
    ^(?!\\s*$).+
    ```
- create-todo-request.json file
    ```
    {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "todo",
    "type": "object",
    "properties": {
        "todoName": {
        "type": "string",
        "pattern": "^(?!\\s*$).+"
        },
        "dueDate": {
        "type": "string",
        "pattern": "^(?!\\s*$).+"
        }
    },
    "required": [
        "todoName",
        "dueDate"
    ],
    "additionalProperties": false
    }
    ```

- reference
https://www.serverless.com/framework/docs/providers/aws/events/apigateway/  
https://stackoverflow.com/questions/3085539regular-expression-for-anything-but-an-empty-string  
https://stackoverflow.com/questions/25426464/regex-pattern-in-json  

