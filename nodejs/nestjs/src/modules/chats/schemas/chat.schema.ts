import { CreateTableInput } from "@aws-sdk/client-dynamodb";
import { EnvUtils } from "../../../utils/env.utils";

export const ChatSchema: CreateTableInput = {
    TableName: EnvUtils.getChatTableName(),
    AttributeDefinitions: [
        {
            AttributeName: "pk",
            AttributeType: "S"
        },
        {
            AttributeName: "sk",
            AttributeType: "S"
        },
        {
            AttributeName: "msisdn",
            AttributeType: "S"
        }
    ],
    KeySchema: [
        {
            AttributeName: "pk",
            KeyType: "HASH"
        },
        {
            AttributeName: "sk",
            KeyType: "RANGE"
        }
    ],
    GlobalSecondaryIndexes: [
        {
            IndexName: "msisdnIndex",
            KeySchema: [
                {
                    AttributeName: "pk",
                    KeyType: "HASH",
                },
                {
                    AttributeName: "msisdn",
                    KeyType: "RANGE"
                },
            ],
            Projection: {
                ProjectionType: "ALL"
            },
            ProvisionedThroughput: {
                WriteCapacityUnits: 1,
                ReadCapacityUnits: 1
            }
        }
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1
    }
};
