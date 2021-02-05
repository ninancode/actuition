export class Submission {
    constructor(
        public startDate: Date[], 
        public location: string, 
        public eventType: string,
        public eventDescription: string, 
        public reimburse: number, 
        public gradeForm: string, 
        public justification: string, 
        public document?: string, 
        public workTimeMissed?: string){};
}

