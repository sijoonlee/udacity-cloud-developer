# install
1. install serverless
- npm install -g serverless
- (if needed) npm install --save-dev serverless-webpack

2. set up a new user in IAM 
- named "serverless"
- programmatic access
- attach existing policies directly
    - AdministratorAccess
- save the access key and secret key

3. sls config credentials
- sls config credentials --provider aws --key <aws_access_key_id> --secret <aws_secret_access_key> --profile serverless

# create project 
- show all template
    - serverless create --template
- run command for our project
    - serverless create --template aws-nodejs-typescript --path <foler-name>
- ex) serverless create --template aws-nodejs-typescript --path serverless-udagram-app-demo
- serverless will make boilerplate

# install npm packages
- npm install

# deploy project
- sls deploy -v
- (if permission error) sls deploy -v --aws-profile serverless
- will upload yml file to CloudFormation, which will configure AWS resources
- https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-template-resource-type-ref.html


# install aws-sdk
- npm i --save-dev aws-sdk
- since it contains typescript definitions


# Request validator
- npm i serverless-aws-documentation serverless-reqvalidator-plugin --save-dev
- add two plugins in serverless.yml
  - serverless-reqvalidator-plugin
  - serverless-aws-documentation