import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import * as _AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
const AWS = AWSXRay.captureAWS(_AWS)

import { putAttachmentUrlById } from '../../businessLogic/Todos'
import { parseUserId } from '../../auth/utils'

const bucketName = process.env.IMAGES_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION
const s3 = new AWS.S3({
  signatureVersion: 'v4'
})


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]
  const userId = parseUserId(jwtToken)

  const uploadUrl = s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: userId + new Date().toISOString(),
    Expires: urlExpiration
  })

  const imageUrl = parseImageUrl(uploadUrl);
  
  await putAttachmentUrlById(imageUrl, jwtToken)
  
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      uploadUrl: uploadUrl
    })
  }

}

// Upload Url looks like
// https://sijoonlee-serverless-todos-images-dev.s3.ca-central-1.amazonaws.com/e0323c36-f8eb-408c-afe8-a0e3ce60b65d?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIAY3UBV5DSWJU3NKPV%2F20200622%2Fca-central-1%2Fs3%2Faws4_request&X-Amz-Date=20200622T155509Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENj%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaDGNhLWNlbnRyYWwtMSJHMEUCIQDfsWNVzzMeY3Ja%2BqYZHvvvFbsIyV6RBhrkcf5UPd2lOQIgGFe8j38pNIDj5WssXDJvo3zL2nKuB194UHTrMtwgVSYq4QEIYRABGgw2MDkwODM1ODI2OTMiDMzkwgz7StQs7JJPLiq%2BAY27ndtoakSBSldtRDSQKH9pmepUxWaIBahXPUfMCFWKnc81au4Ck5t1%2B2WP8nujb8uI6b%2FkDaOGRycGxtuygPqq3sqZqSEACV5cMxHokSvOdusstxf7ZHonfDk02BEp1KWS2U1oBu4XyZ6mrYDCOGCow%2FYdGlSZUOEovyu7anJ6fss8mBxJf9yrPsfkMkDuJk0iuMNRlOVphW3XltMrYWVRLIYPo1Boo97Cyosv365ZhCHm5b3wV%2BuIkx6BTE8w3ajD9wU64AEGOwkXLZFx0rlndQMC58VHC0Ew9w9DVvOjK5wlMpQULUx%2FCdTn90kJAZuxj15MHw8IwC1%2BAenhNtO9VY4lM6MtRBpKJQvw9FoCXq7y3IIebm4ov%2FFTZbsDmETkFfEVqOqKc3TYd1iW4yAYkKFdo9MBX%2BqXEGClhGQT8ySH5UiYpezdMsEqIhV5mbh8w6pdcmO6TL2QpeHVxVvBDNRHpS%2BiEvUrdNmOkQ26x%2BDW5nN%2F4ouWnZrXJEB5%2B%2FZ5%2BqmXTvOX181wGpnjUHe8PsnB4a6Gu51DBj%2F5up5kfKkbgZ9rfQ%3D%3D&X-Amz-Signature=0e90f2adc261e64856f05dc379c39d3ac34cb1bf3f997651dd8dbc5fef6faaea&X-Amz-SignedHeaders=host
// Image can be accessed via
// https://sijoonlee-serverless-todos-images-dev.s3.ca-central-1.amazonaws.com/e0323c36-f8eb-408c-afe8-a0e3ce60b65d

const parseImageUrl = (uploadUrl:string): string => {
  return uploadUrl.split("?")[0]
}