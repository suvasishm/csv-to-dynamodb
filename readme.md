### Read from CSV and Insert into a DynamoDB table

*Assuming you have local AWS config setup and a DynamoDB table is created in your AWS account.*

Go through the TODOs in importData.csv, update as necessary, and you are all set to go!

### Steps:

Install libraries
```shell
npm i

```

Compile the typescript file
```shell
npx tsc importData.ts

```

Run
```shell

node importData.js

```