import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import * as _AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
const AWS = AWSXRay.captureAWS(_AWS)

import { TodoItem } from '../types/TodoItem'
import { ImageItem } from '../types/ImageItem'
import { CreateRequestToDynamo } from '../types/CreateRequestToDyanmo'
import { GetRequestToDynamo } from '../types/GetRequestToDynamo'
import { UpdateRequestToDynamo } from '../types/UpdateRequestToDynamo'
import { DeleteRequestToDynamo } from '../types/DeleteRequestToDynamo'
import { AttachmentUrlUpdateRequestToDynamo } from '../types/AttachmentUrlUpdateRequestToDynamo'
import { createLogger } from '../utils/logger'
const logger = createLogger('DB')

export class TodoAccess {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly todoTable = process.env.TODOS_TABLE,
    private readonly imageTable = process.env.IMAGE_TABLE,
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
        id: param.id
      },
      UpdateExpression: "set title = :title, body = :body, posX = :posX, posY = :posY, width = :width, height = :height, isHidden = :isHidden, isDeleted = :isDeleted",
      ConditionExpression: "userId = :userId",
      ExpressionAttributeValues: { 
        ":title": param.title,
        ":body": param.body,
        ":posX": param.posX,
        ":posY": param.posY,
        ":width": param.width,
        ":height": param.height,
        ":isHidden": param.isHidden, 
        ":isDeleted": param.isDeleted,
        ":userId": param.userId
      },
      ReturnValues:"UPDATED_NEW"
    }).promise()

    return param
  }

  async putAttachmentUrlById(param: AttachmentUrlUpdateRequestToDynamo) {
    await this.docClient.put({ // IAM permission - dynamodb:PutItem
      TableName: this.imageTable,
      Item: param
    }).promise()
  }

  async getAttachmentUrlById(param: GetRequestToDynamo): Promise<ImageItem> {
    console.log('Getting Todos by user id')

    const result = await this.docClient.get({ // IAM permission - dynamodb:GetItem
      TableName: this.imageTable,
      Key: {userId: param.userId}
    }).promise()
    logger.info('GetItem', result)
    logger.info('Get attachment url', result.Item)
    return result.Item as ImageItem
  }

  async deleteTodoById(param: DeleteRequestToDynamo): Promise<TodoItem> {

    await this.docClient.delete({ // IAM permission - dynamodb:DeleteItem
      TableName: this.todoTable,
      Key:{
        id: param.id
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
