// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'hpwlim57z4'
const region = 'ca-central-1'

//  https://hpwlim57z4.execute-api.ca-central-1.amazonaws.com/dev

export const apiEndpoint = `https://${apiId}.execute-api.${region}.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'dev-4jhxl3g1.us.auth0.com',            // Auth0 domain
  clientId: 'ROWviBovDscyxl1R9c7fxD8Cq7N1AP5T',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
