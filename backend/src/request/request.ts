import { Submission } from './submission';
import { Approval } from './approval';

export class Request {  
    constructor(
        public requestId: string, 
        public employeeId: string, 
        public requestStatus: string,  
        public details: string, 
        public startDate: string, 
        public location: string, 
        public eventType: string,
        public eventDescription: string, 
        public reimburse: number, 
        public gradeForm: string, 
        public justification: string, 
        public document?: string, 
        public workTimeMissed?: string,
        public approval?: Approval
    ){};
}
