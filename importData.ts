import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, BatchWriteCommand } from "@aws-sdk/lib-dynamodb";
import { fromIni } from "@aws-sdk/credential-providers";
import * as fs from 'fs';
import * as csv from 'csv-parser';

// TODO update config
const client = new DynamoDBClient({
    region: 'us-east-1',
    credentials: fromIni({ profile: 'my-profile' })

});

const ddbDocClient = DynamoDBDocumentClient.from(client);

// TODO update table name
const tableName = 'my-appliance-cost-table'; // Change to your DynamoDB table name

const importData = (filePath: string) => {
    const items: any[] = [];

    fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
            items.push(row);
        })
        .on('end', async () => {
            console.log('CSV file successfully processed');
            // TODO for batch insert, replace the following function call by insertItemsInBatches(items)
            await insertItems(items); // await insertItemsInBatches(items);
        });
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));


const insertItems = async (items: any[]) => {
    let i = 1;
    for (const item of items) {
        const params = {
            TableName: tableName,
            Item: item,
        };

        try {
            await ddbDocClient.send(new PutCommand(params));
            console.log(`Inserted item ${i++}: ${JSON.stringify(item)}`);
        } catch (error) {
            console.error(`Error inserting item: ${JSON.stringify(item)} - ${error}`);
            throw error;
        }

        await delay(250);
    }
};

const insertItemsInBatches = async (items: any[]) => {
    const chunkSize = 25;
    for (let i = 0; i < items.length; i += chunkSize) {
        const chunk = items.slice(i, i + chunkSize);
        const params = {
            RequestItems: {
                [tableName]: chunk.map(item => ({
                    PutRequest: {
                        Item: item
                    }
                }))
            }
        };

        try {
            await ddbDocClient.send(new BatchWriteCommand(params));
            console.log(`Inserted batch: ${i / chunkSize + 1}`);
        } catch (error) {
            console.error(`Error inserting batch: ${i / chunkSize + 1} - ${error}`);
        }

        // Add 500ms delay between each batch
        await delay(2000);
    }
}

// TODO update the filePath
// Specify the path to your CSV file here
const filePath = './myTestData.csv'; // Change to the path of your CSV file

importData(filePath);
