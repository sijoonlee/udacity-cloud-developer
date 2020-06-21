import * as uuid from 'uuid'

import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'
import { TodoAccess } from '../dataLayer/DynamoAccess'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { DeleteTodoRequest } from '../requests/DeleteTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { parseUserId } from '../auth/utils'

const todoAccess = new TodoAccess()

export async function createTodo( 
  createTodoRequest: CreateTodoRequest, jwtToken: string): Promise<TodoItem> {

  const todoId = uuid.v4()
  const userId = parseUserId(jwtToken)

  return await todoAccess.createTodo({
    userId: userId,
    todoId: todoId,
    createdAt: new Date().toISOString(),
    todoName: createTodoRequest.todoName,
    dueDate: createTodoRequest.dueDate,
    done: false
  })
}

export async function getTodosByUserId(jwtToken: string): Promise<TodoItem[]> {
  const userId = parseUserId(jwtToken)
  return await todoAccess.getTodosByUserId(userId)
}

export async function updateTodoById(
  updateTodoRequest: UpdateTodoRequest, jwtToken:string): Promise<TodoUpdate> {
  
  const userId = parseUserId(jwtToken)
  return await todoAccess.updateTodoById(updateTodoRequest, userId)
}

export async function deleteTodoById(
  deleteTodoRequest: DeleteTodoRequest, jwtToken: string): Promise<string> {
  
  const userId = parseUserId(jwtToken)
  return await todoAccess.deleteTodoById(deleteTodoRequest.todoId, userId)
}
