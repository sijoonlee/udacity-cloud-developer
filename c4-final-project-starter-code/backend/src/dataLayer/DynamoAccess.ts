import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import * as _AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
const AWS = AWSXRay.captureAWS(_AWS)

import { TodoItem } from '../types/TodoItem'
import { CreateRequestToDynamo } from '../types/CreateRequestToDyanmo'
import { GetRequestToDynamo } from '../types/GetRequestToDynamo'
import { UpdateRequestToDynamo } from '../types/UpdateRequestToDynamo'
import { DeleteRequestToDynamo } from '../types/DeleteRequestToDynamo'
import { AttachmentUrlUpdateRequestToDynamo } from '../types/AttachmentUrlUpdateRequestToDynamo'


export class TodoAccess {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly todoTable = process.env.TODOS_TABLE,
    private readonly userIdIndex = process.env.USER_ID_INDEX) {
  }

  async getTodosByUserId(param: GetRequestToDynamo): Promise<TodoItem[]> {
    console.log('Getting Todos by user id')

    const result = await this.docClient.query({ // IAM permission - dynamodb:Query
      TableName: this.todoTable,
      IndexName: this.userIdIndex,
      KeyConditionExpression: "userId = :userId",
      ExpressionAttributeValues:{
        ":userId":param.userId
      }
    }).promise()

    const items = result.Items ? result.Items : []
    return items as TodoItem[]
  }

  async createTodo(param: CreateRequestToDynamo): Promise<TodoItem> {
    await this.docClient.put({ // IAM permission - dynamodb:PutItem
      TableName: this.todoTable,
      Item: param
    }).promise()

    return param
  }

  async updateTodoById(param:UpdateRequestToDynamo): Promise<TodoItem> {
    await this.docClient.update({ // IAM permission - dynamodb:UpdateItem
      TableName: this.todoTable,
      Key:{
        todoId: param.todoId
      },
      UpdateExpression: "set todoName = :todoName, dueDate = :dueDate, done = :done",
      ConditionExpression: "userId = :userId",
      ExpressionAttributeValues: { 
        ":todoName": param.todoName,
        ":dueDate": param.dueDate,
        ":done": param.done,
        ":userId": param.userId
      },
      ReturnValues:"UPDATED_NEW"
    }).promise()

    return param
  }

  async updateAttachmentUrlById(param: AttachmentUrlUpdateRequestToDynamo): Promise<TodoItem> {
    await this.docClient.update({ // IAM permission - dynamodb:UpdateItem
      TableName: this.todoTable,
      Key:{
        todoId: param.todoId
      },
      UpdateExpression: "set attachmentUrl = :attachmentUrl",
      ConditionExpression: "userId = :userId",
      ExpressionAttributeValues: { 
        ":attachmentUrl": param.attachmentUrl,
        ":userId": param.userId
      },
      ReturnValues:"UPDATED_NEW"
    }).promise()

    return param
  }


  async deleteTodoById(param: DeleteRequestToDynamo): Promise<TodoItem> {

    await this.docClient.delete({ // IAM permission - dynamodb:DeleteItem
      TableName: this.todoTable,
      Key:{
        todoId: param.todoId
      },
      ConditionExpression: "userId = :userId",
      ExpressionAttributeValues:{
        ":userId" : param.userId
      }
    }).promise()
    return param
  }
}



function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    console.log('Creating a local DynamoDB instance')
    return new AWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  return new AWS.DynamoDB.DocumentClient()
}
