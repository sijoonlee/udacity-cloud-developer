import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

import * as jwt from 'jsonwebtoken'
import { createLogger } from '../../utils/logger'
import { JwtPayload } from '../../auth/JwtPayload'
import * as jwksClient from 'jwks-rsa'
import authConfig from "../../../auth-config.js"

const logger = createLogger('auth')

export const handler = async (
  event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
  logger.info('Authorizing a user', event.authorizationToken) // event.headers.Authorization) when it has route
  try {
    const jwtToken = await verifyToken(event.authorizationToken) // event.headers.Authorization)
    logger.info('User was authorized', jwtToken)

    // return IAM policy
    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader: string): Promise<JwtPayload> {
  const token = getToken(authHeader)
  const decoded = jwt.decode(token, {complete: true});
  const payload = decoded["payload"]
  const client = jwksClient({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: `https://${authConfig.domain}/.well-known/jwks.json`
  });
   
  let options = { algorithms: ['RS256'] }
  
  try {
      client.getSigningKey(decoded["header"]["kid"], function(_err, key) {
          const cert = key.getPublicKey();  
        
          jwt.verify(token, cert, options, function(err, decoded) {
              if(err){
                logger.info("RSA256 verification failed", err)
                throw Error("RSA256 verification failed");
              }
              logger.info("RSA256 verification success", decoded);
          })
      });
      return payload as JwtPayload

  } catch (e) {
      logger.info(e)
  }
}



function getToken(authHeader: string): string {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}

