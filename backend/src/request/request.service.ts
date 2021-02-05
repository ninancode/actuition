import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import dynamo from '../dynamo/dynamo';
import logger from '../log';
import { Approval } from './approval';
import { Request } from './request';

class RequestService {

    private doc: DocumentClient;
    constructor() {
        // The documentClient. This is our interface with DynamoDB
        this.doc = dynamo; // We imported the DocumentClient from dyamo.ts
    }

    async getRequests(): Promise<Request[]> {
        logger.trace('Inside \'getRequests\'.');
        const params = {
            TableName: 'requests'
        };
        return await this.doc.scan(params).promise().then((data) => {
            return data.Items as Request[];
        }).catch((err) => {
            logger.error(err);
            return [];
        });
    }

    async getRequestsFromEmployee(employeeId: string): Promise<Request[]> {
        logger.trace('Inside \'getRequestsFromEmployee\'.');
        const params = {
            'TableName': 'requests',
            'IndexName': 'employeeRequests',
            KeyConditionExpression: 'employeeId = :employeeId',
            ExpressionAttributeValues: {
                ':employeeId': employeeId
            }
        }
        return await this.doc.query(params).promise().then((result) => {
            logger.debug(result);
            logger.info('Successfully retrieved all requests from employee.');
            return result.Items as Request[];
        }).catch((err) => {
            logger.error(err);
            return [];
        });
    }

    async getRequestById(requestId: string): Promise<Request | null> {
        logger.trace('Inside \'getRequestById\'.');
        const params = {
            TableName: 'requests',
            Key: {
                'employeeId': requestId
            }
        }
        return await this.doc.get(params).promise().then((data) => {
            if (data && data.Item) {
                logger.debug(`data.Item: ${JSON.stringify(data.Item)}`);
                return data.Item as Request;
            } else {
                return null;
            }
        })
    }

    async getUserRequestsByStatus(employeeId: string, requestStatus: 'string'): Promise<Request[]> {
        logger.trace('Inside \'viewAllAccepted\'.');
        const params = {
            'TableName': 'requests',
            'IndexName': 'employeeRequestsByStatus',
            KeyConditionExpression: 'employeeId = :employeeId AND requestStatus = :requestStatus, ',
            ExpressionAttributeValues: {
                '::employeeId': employeeId,
                ':requestStatus': requestStatus
            }
        }
        return await this.doc.query(params).promise().then((result) => {
            logger.debug(result);
            logger.info(`Successfully retrieved all ${requestStatus} requests for employee ${employeeId}.`);
            return result.Items as Request[];
        }).catch((err) => {
            logger.error(err);
            return [];
        });  
    }

    async getRequestByEmployee(employeeId: string): Promise<Request[]> {
        logger.trace('Inside \'getRequestByEmployee\'.');
        const params = {
            'TableName': 'requests',
            'IndexName': 'employeeRequests',
            KeyConditionExpression: 'employeeId = :employeeId',
            ExpressionAttributeValues: {
                ':employeeId': employeeId
            }
        }
        return await this.doc.query(params).promise().then((result) => {
            logger.debug(result);
            logger.info('Successfully retrieved all getRequestByEmployee.');
            return result.Items as Request[];
        }).catch((err) => {
            logger.error(err);
            return [];
        });
    }

        async updateRequest(request: Request) {
            logger.trace('Inside \'updateRequestStatus\'.');
            const params = {
                TableName: 'requests',
                Key: {
                    'requestId': request.requestId,
                },
                UpdateExpression: 'set #requestStatus = :s, #details = :d, #startDate = :sd, #location = :l, #eventType = :et, #eventDescription = :ed, #reimburse = :ri, #gradeForm = :gf, #justification = :j, #document = :dc, #approval = :a',
                ExpressionAttributeNames: {
                    '#requestStatus': 'requestStatus',
                    '#details': 'details',
                    '#startDate': 'startDate',
                    '#location': 'location',
                    '#eventType': 'eventType',
                    '#eventDescription': 'eventDescription',
                    '#reimburse': 'reimburse',
                    '#gradeForm': 'gradeForm',
                    '#justification': 'justification',
                    '#document': 'document',
                    '#approval': 'approval'

                },
                ExpressionAttributeValues: {
                    ':s': request.requestStatus,
                    ':d': request.details,
                    ':sd': request.startDate,
                    ':l': request.location,
                    ':et': request.eventType,
                    ':ed': request.eventDescription,
                    ':ri': request.reimburse,
                    ':gf': request.gradeForm,
                    ':j': request.justification,
                    ':dc': request.document,
                    ':a': request.approval,
                },
            };
            return await this.doc.update(params).promise().then((data) => {
                logger.trace(`Request ${request.requestId}\ was updated.`);
                logger.debug(data);
                return true;
            }).catch(error => {
                logger.error(error);
                return false;
            });
        }

        async addRequest(request: Request): Promise<boolean> {
            request.requestId = (Date.now() + Math.random()).toString();
            request.requestStatus = 'Being Approved';
            request.workTimeMissed = undefined;
            request.approval = undefined;

            const params = {
                TableName: 'requests',
                Item: request,
                ConditionExpression: '#requestId <> :requestId',
                ExpressionAttributeNames: {
                    '#requestId': 'requestId',
                },
                ExpressionAttributeValues: {
                    ':requestId': request.requestId,
                }
            };
            return await this.doc.put(params).promise().then((result) => {
                logger.info(`Successfully created ${request.requestId} for ${request.employeeId}`);
                return true;
            }).catch((error) => {
                logger.error(error);
                logger.error(`failed to add request`)
                return false;
            });
        }

    // async updateAmountPending(request: Request) {
    //         const params = {
    //             TableName: 'requests',
    //             Key: {
    //                 'requestId': request.requestId
    //             },
    //             UpdateExpression: 'set amountPending = :p',
    //             ExpressionAttributeValues: {
    //                 ':p': request.amountPending
    //             },
    //             ReturnValues: 'UPDATED_NEW'
    //         };
    //         return await this.doc.update(params).promise().then((data) => {
    //             logger.debug(data);
    //             return true;
    //         }).catch(error => {
    //             logger.error(error);
    //             return false;
    //         });
    //     }

        // async updateRequestToDenied(requestId: string) {
        //     logger.trace('Inside \'updateRequestToDenied\'.');
        //     const params = {
        //         TableName: 'requests',
        //         Key: {
        //             'username': requestId
        //         },
        //         UpdateExpression: 'set requestStatus = :s',
        //         ExpressionAttributeValues: {
        //             ':s': 'Denied'
        //         },
        //     };
        //     return await this.doc.update(params).promise().then((data) => {
        //         logger.trace(`Request ${requestId}\ was denied.`)
        //         logger.debug(data);
        //         return true;
        //     }).catch(error => {
        //         logger.error(error);
        //         return false;
        //     });
        // }

        // async updateRequestToPending(requestId: string) {
        //     logger.trace('Inside \'updateRequestToPending\'.');
        //     const params = {
        //         TableName: 'requests',
        //         Key: {
        //             'username': requestId
        //         },
        //         UpdateExpression: 'set requestStatus = :s',
        //         ExpressionAttributeValues: {
        //             ':s': 'Denied'
        //         },
        //     };
        //     return await this.doc.update(params).promise().then((data) => {
        //         logger.trace(`Request ${requestId}\ was denied.`)
        //         logger.debug(data);
        //         return true;
        //     }).catch(error => {
        //         logger.error(error);
        //         return false;
        //     });
        // }
}

const requestService = new RequestService();
export default requestService;