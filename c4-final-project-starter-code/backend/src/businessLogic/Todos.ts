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

  const todoId = uuid.v4()
  const userId = parseUserId(jwtToken)

  return await todoAccess.createTodo({
    userId: userId,
    todoId: todoId,
    createdAt: new Date().toISOString(),
    done: false,
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

export async function updateAttachmentUrlById(
  todoId: string, attachmentUrl: string, jwtToken: string): Promise<TodoItem> {
  const userId = parseUserId(jwtToken)
  return await todoAccess.updateAttachmentUrlById({userId, todoId, attachmentUrl})
}