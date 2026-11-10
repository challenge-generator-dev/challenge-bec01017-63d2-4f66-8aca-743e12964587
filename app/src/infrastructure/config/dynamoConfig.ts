import { DynamoDBClient, DynamoDBClientConfig } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

const getClientConfig = (): DynamoDBClientConfig => {
    const region = process.env.AWS_REGION || 'us-east-1';
    const endpoint = process.env.DYNAMODB_ENDPOINT;
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

    const config: DynamoDBClientConfig = { region };

    if (endpoint) {
        config.endpoint = endpoint;
    }

    if (accessKeyId && secretAccessKey) {
        config.credentials = {
            accessKeyId,
            secretAccessKey
        };
    }

    return config;
};

interface DocumentClientConfig {
    client: DynamoDBClient;
    marshallOptions?: {
        removeUndefinedValues?: boolean;
        convertClassInstanceToMap?: boolean;
        convertTopLevelContainer?: boolean;
    };
    unmarshallOptions?: {
        wrapNumbers?: boolean;
    };
}

const getDocumentClientConfig = (client: DynamoDBClient): DocumentClientConfig => {
    return {
        client,
        marshallOptions: {
            removeUndefinedValues: true,
            convertClassInstanceToMap: true
        },
        unmarshallOptions: {
            wrapNumbers: false
        }
    };
};

export const createDynamoDBClient = (): DynamoDBClient => {
    const config = getClientConfig();
    return new DynamoDBClient(config);
};

export const createDocumentClient = (client: DynamoDBClient): DynamoDBDocumentClient => {
    const config = getDocumentClientConfig(client);
    return DynamoDBDocumentClient.from(client, config);
};

export const getTableName = (): string => {
    return process.env.DYNAMODB_TABLE_NAME || 'Orders';
};

export const initializeDynamoDB = (): { documentClient: DynamoDBDocumentClient; tableName: string } => {
    const dbClient = createDynamoDBClient();
    const documentClient = createDocumentClient(dbClient);
    const tableName = getTableName();

    return { documentClient, tableName };
};