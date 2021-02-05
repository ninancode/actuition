import logger from '../log';
import employeeService from './employee.service';

export class Employee {
    constructor(
        public employeeId: string, 
        public password: string, 
        public name: string, 
        public role1: string, 
        public role2?: string) {
    };
}

export async function login(employeeId: string, password: string): Promise<Employee|null> {
    logger.debug(`Entered info: employeeId: ${employeeId} password: ${password}`);
    return await employeeService.getEmployeeById(employeeId).then((employee)=> {
        if (employee && employee.password === password) {
            logger.debug(`In backend login statement. Returning employee ${employee.name}.`)
            return employee
        } else {
            logger.debug(`returning null`);
            return null;
        }
    })
}