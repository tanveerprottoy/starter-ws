import { DeleteCommandInput, GetCommandInput, PutCommandInput, QueryCommandInput, UpdateCommandInput } from "@aws-sdk/lib-dynamodb";
import { HttpStatus, Inject, Injectable, Logger } from "@nestjs/common";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { DbDataOpsInstance } from "../../libs/dynamodb";
import CoreUtils from "../../utils/core.utils";
import { EnvUtils } from "../../utils/env.utils";
import JsonUtils from "../../utils/json.utils";

@Injectable()
export class ChatsRepository {

    constructor(
        @Inject(WINSTON_MODULE_PROVIDER)
        private readonly logger: Logger
    ) { }

    async create(item: any): Promise<any> {
        try {
            const params: PutCommandInput = {
                TableName: EnvUtils.getChatTableName(),
                Item: item
            };
            const response = await DbDataOpsInstance.put(params);
            if(response.$metadata.httpStatusCode === HttpStatus.OK) {
                return item;
            }
            return null;
        }
        catch(e) {
            this.logger.error(e);
            return e;
        }
    }

    async findAll(
        keyConditionExpression: string,
        expressionAttributeValues: any,
        scanIndexForward = true,
        limit?: number,
        startKey?: any,
        indexName?: string,
        filterExpression?: string,
        projectionExpression?: string,
        expressionNames?: any
    ): Promise<any | Error> {
        const data = {
            items: [],
            limit: limit,
            count: 0,
            lastKey: null
        }
        try {
            const params: QueryCommandInput = {
                TableName: EnvUtils.getChatTableName(),
                KeyConditionExpression: keyConditionExpression,
                ExpressionAttributeValues: expressionAttributeValues,
                ScanIndexForward: scanIndexForward
            };
            if(projectionExpression) {
                params.ProjectionExpression = projectionExpression;
            }
            if(expressionNames) {
                params.ExpressionAttributeNames = expressionNames;
            }
            if(indexName) {
                params.IndexName = indexName;
            }
            if(limit && limit !== 0) {
                params.Limit = limit;
            }
            if(startKey) {
                params.ExclusiveStartKey = JsonUtils.parse(startKey);
            }
            if(filterExpression) {
                params.FilterExpression = filterExpression;
            }
            const response = await DbDataOpsInstance.query(params);
            if(response.$metadata.httpStatusCode === HttpStatus.OK) {
                data.items = response.Items;
                data.count = response.Count;
                data.lastKey = response.LastEvaluatedKey;
            }
            return data;
        }
        catch(e) {
            this.logger.error(e);
            return data;
        }
    }

    async findOne(key: Record<string, any>): Promise<any> {
        try {
            const params: GetCommandInput = {
                TableName: EnvUtils.getChatTableName(),
                Key: key
            };
            const response = await DbDataOpsInstance.get(params);
            if(response.$metadata.httpStatusCode === HttpStatus.OK) {
                return response.Item;
            }
            return null;
        }
        catch(e) {
            this.logger.error(e);
            return e;
        }
    }

    async update(
        key: any,
        updateExpression: string,
        expressionAttributeValues: any,
        expressionAttributeNames?: any,
        returnValues = "ALL_NEW"
    ): Promise<any> {
        try {
            const params: UpdateCommandInput = {
                TableName: EnvUtils.getChatTableName(),
                Key: key,
                UpdateExpression: updateExpression,
                ExpressionAttributeValues: expressionAttributeValues,
                ReturnValues: returnValues
            };
            if(expressionAttributeNames) {
                params.ExpressionAttributeNames = expressionAttributeNames;
            }
            const response = await DbDataOpsInstance.update(params);
            if(response.$metadata.httpStatusCode === HttpStatus.OK) {
                return response.Attributes;
            }
            return null;
        }
        catch(e) {
            this.logger.error({
                message: `could not update for key: ${JSON.stringify(key)}`,
                stack: "Error: \n" + CoreUtils.stringify(e)
            });
            return e;
        }
    }

    async delete(key: Record<string, any>): Promise<boolean> {
        try {
            const params: DeleteCommandInput = {
                TableName: EnvUtils.getChatTableName(),
                Key: key
            };
            const response = await DbDataOpsInstance.delete(params);
            if(response.$metadata.httpStatusCode === HttpStatus.OK) {
                return true;
            }
            return false;
        }
        catch(e) {
            this.logger.error(e);
            return false;
        }
    }
}