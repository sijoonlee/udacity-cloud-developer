import * as uuid from 'uuid'

import { TodoAccess } from '../dataLayer/DynamoAccess'
import { parseUserId } from '../auth/utils'

import { TodoItem } from '../types/TodoItem'
import { CreateRequest } from '../types/CreateRequest'
import { UpdateRequest } from '../types/UpdateRequest'
import { DeleteRequest } from '../types/DeleteRequest'


const todoAccess = new TodoAccess()

export async function createTodo( 
  createRequest: CreateRequest, jwtToken: string): Promise<TodoItem> {

  const id = uuid.v4()
  const userId = parseUserId(jwtToken)

  return await todoAccess.createTodo({
    userId: userId,
    id: id,
    createdAt: new Date().toISOString(),
    ...createRequest
  })
}

export async function getTodosByUserId(jwtToken: string): Promise<TodoItem[]> {
  const userId = parseUserId(jwtToken)
  return await todoAccess.getTodosByUserId({userId})
}

export async function updateTodoById(
  updateRequest: UpdateRequest, jwtToken:string): Promise<TodoItem> {
  
  const userId = parseUserId(jwtToken)
  return await todoAccess.updateTodoById({userId, ...updateRequest})
}

export async function deleteTodoById(
  deleteRequest: DeleteRequest, jwtToken: string): Promise<TodoItem> {
  
  const userId = parseUserId(jwtToken)
  return await todoAccess.deleteTodoById({userId, ...deleteRequest})
}

export async function putAttachmentUrlById(
  attachmentUrl: string, jwtToken: string) {
  const userId = parseUserId(jwtToken)
  await todoAccess.putAttachmentUrlById({userId, attachmentUrl})
}

export async function getAttachmentUrlById(jwtToken: string) {
  const userId = parseUserId(jwtToken)
  return await todoAccess.getAttachmentUrlById({userId})
}