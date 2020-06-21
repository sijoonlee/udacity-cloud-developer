import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

import { verify } from 'jsonwebtoken'
import { createLogger } from '../../utils/logger'
import { JwtPayload } from '../../auth/JwtPayload'
import * as AWS  from 'aws-sdk'

const client = new AWS.SecretsManager();
//let cachedSecret: string;

const secretId = process.env.AUTH_0_SECRET_ID
const secretField = process.env.AUTH_0_SECRET_FIELD

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
/* 
verify(token, auth0Secret)
{
  iss: 'https://dev-4jhxl3g1.us.auth0.com/', // issuer
  sub: 'google-oauth2|101481008020418269823', // subject
  aud: 'ROWviBovDscyxl1R9c7fxD8Cq7N1AP5T', // audience
  iat: 1592699753, // issued at
  exp: 1593059753, // expiration time
  at_hash: 'VFiILm-HpUjUENTLG3bo7w',
  nonce: 'hg6s~5mNppEjbsQsYCwig2NEhuGoBDEP'
}

decode(token, { complete: true })
  {
    header: { alg: 'HS256', typ: 'JWT' },
    payload: {
      iss: 'https://dev-4jhxl3g1.us.auth0.com/',
      sub: 'google-oauth2|101481008020418269823',
      aud: 'ROWviBovDscyxl1R9c7fxD8Cq7N1AP5T',
      iat: 1592699753,
      exp: 1593059753,
      at_hash: 'VFiILm-HpUjUENTLG3bo7w',
      nonce: 'hg6s~5mNppEjbsQsYCwig2NEhuGoBDEP'
    },
    signature: 'PVY-MTzmy-lqPiV38HFPZnpgpX_g98q8ia2HjZTFfmY'
  }
*/

  // TODO: Implement token verification
  // You should implement it similarly to how it was implemented for the exercise for the lesson 5
  // You can read more about how to do this here: https://auth0.com/blog/navigating-rs256-and-jwks/
  const secretObject = await getSecret()
  const auth0Secret = secretObject[secretField]
  return verify(token, auth0Secret) as JwtPayload
}

async function getSecret(): Promise<Object> {
  //if(cachedSecret) return cachedSecret;

  const data = await client
    .getSecretValue({
      SecretId: secretId
    })
    .promise()

  //cachedSecret = data.SecretString
  //return JSON.parse(cachedSecret)
  return JSON.parse(data.SecretString)
}

function getToken(authHeader: string): string {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}

