import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import dynamo from '../dynamo/dynamo';
import logger from '../log';
import { Employee } from './employee';

class EmployeeService {
    private doc: DocumentClient;
    constructor() {
        this.doc = dynamo; 
    }

    async getUsers(): Promise<Employee[]> {
        const params = {
            TableName: 'employees'
        };
        return await this.doc.scan(params).promise().then((data) => {
            return data.Items as Employee[];
        }).catch((err) => {
            logger.error(err);
            return [];
        });
    }

    async getEmployeeById(employeeId: string): Promise<Employee | null> {
        logger.debug(`Inside \'getEmployeeById\' with ${employeeId}. `)
        const params = {
            TableName: 'employees',
            Key: {
                'employeeId': employeeId
            }
        };
        return await this.doc.get(params).promise().then((data) => {
            if (data && data.Item) {
                logger.debug(`data.Item: ${JSON.stringify(data.Item)}`);
                return data.Item as Employee;
            } else {
                logger.debug(`NULL block - data.Item: ${JSON.stringify(data.Item)}`);
                return null;
            }
        }).catch((err) => {
            logger.error(err);
            return null;
        })
    }

    async getEmployeeByRole(role1: string): Promise<Employee[] | null> {
        logger.debug(`Inside \'getEmployeeByRole\' with ${role1}. `)
        const params = {
            TableName: 'employees',
            IndexName:'employee_role',
            KeyConditionExpression: '#role1 = :role1',
            ExpressionAttributeNames:{
                '#role1': 'role1'
            },
            ExpressionAttributeValues: {
                ':role1': role1
            }
        };
        return await this.doc.query(params).promise().then((data) => {
            if (data && data.Items) {
                logger.debug(`data.Item: ${JSON.stringify(data.Items)}`);
                return data.Items as Employee[];
            } else {
                logger.debug(`NULL block - data.Item: ${JSON.stringify(data.Items)}`);
                return null;
            }
        }).catch((err) => {
            logger.error(err);
            return null;
        })
    }

    async addEmployee(employee: Employee): Promise<boolean> {
        const params = {
            TableName: 'employees',
            Item: employee,
            ConditionExpression: '#employeeId <> :employeeId',
            ExpressionAttributeNames: {
                '#employeeId': 'employeeId',
            },
            ExpressionAttributeValues: {
                ':employeeId': employee.employeeId,
            }
        };
        return await this.doc.put(params).promise().then((result) => {
            logger.info(`Successfully created ${employee.role1} ${employee.name}`);
            return true;
        }).catch((error) => {
            logger.error(error);
            return false;
        });
    }
}

const employeeService = new EmployeeService();
export default employeeService;
