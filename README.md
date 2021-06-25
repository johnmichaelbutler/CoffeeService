# CoffeeService

CoffeeService is an online order app for a coffee shop. It utilizes AWS Serverless technologies all the way! It will be composed of three TypeScript Microservices and a frontend Next.js client. Each microservice communicates with the others using AWS EventBridge and is built using the AWS SAM Framework. Each service utilizes AWS Lambda, DynamoDB, and API Gateway. Secrets are stored on Systems Manager. An SQS queue will be utilized for administrators to see incoming orders and fulfill them. Authentication is handled using AWS Cognito.

