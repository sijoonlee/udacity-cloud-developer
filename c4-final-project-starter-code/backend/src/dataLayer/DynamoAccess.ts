import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import * as AWS  from 'aws-sdk'
// import * as AWSXRay from 'aws-xray-sdk'
// const XAWS = AWSXRay.captureAWS(AWS)

import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'

export class TodoAccess {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly todoTable = process.env.TODOS_TABLE,
    private readonly userIdIndex = process.env.USER_ID_INDEX) {
  }

  async getTodosByUserId(userId:String): Promise<TodoItem[]> {
    console.log('Getting Todos by user id')

    const result = await this.docClient.query({ // IAM permission - dynamodb:Query
      TableName: this.todoTable,
      IndexName: this.userIdIndex,
      KeyConditionExpression: "userId = :userId",
      ExpressionAttributeValues:{
        ":userId":userId
      }
    }).promise()

    const items = result.Items ? result.Items : []
    return items as TodoItem[]
  }

  async createTodo(todoItem: TodoItem): Promise<TodoItem> {
    await this.docClient.put({ // IAM permission - dynamodb:PutItem
      TableName: this.todoTable,
      Item: todoItem
    }).promise()

    return todoItem
  }

  async updateTodoById(updatedItem:UpdateTodoRequest, userId:string): Promise<TodoUpdate> {
    await this.docClient.update({ // IAM permission - dynamodb:UpdateItem
      TableName: this.todoTable,
      Key:{
        todoId: updatedItem.todoId
      },
      UpdateExpression: "set todoName = :todoName, dueDate = :dueDate, done = :done",
      ConditionExpression: "userId = :userId",
      ExpressionAttributeValues: { 
        ":todoName": updatedItem.todoName,
        ":dueDate": updatedItem.dueDate,
        ":done": updatedItem.done,
        ":userId": userId
      },
      ReturnValues:"UPDATED_NEW"
    }).promise()

    return updatedItem
  }

  async deleteTodoById(todoId: string, userId: string): Promise<string> {

    await this.docClient.delete({ // IAM permission - dynamodb:DeleteItem
      TableName: this.todoTable,
      Key:{
        todoId:todoId
      },
      ConditionExpression: "userId = :userId",
      ExpressionAttributeValues:{
        ":userId" : userId
      }
    }).promise()
    return todoId
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
