import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { CreateRequest } from '../../types/CreateRequest'
import { createTodo } from '../../businessLogic/Todos'
import { createLogger } from '../../utils/logger'

const logger = createLogger('create Todo')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  const newTodo: CreateRequest = JSON.parse(event.body)
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]
  try { 
    logger.info('Asking Dynamo DB to create')
    const newItem = await createTodo(newTodo, jwtToken)
    logger.info('Creation done!')
    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        item: newItem
      })
    }
  } catch (e) {
    logger.info('Error on creating Todo', e)
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        item: {}
      })
    }
  }
  


}