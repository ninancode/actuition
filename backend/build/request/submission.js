"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Submission = void 0;
var Submission = /** @class */ (function () {
    function Submission(startDate, location, eventType, eventDescription, reimburse, gradeForm, justification, document, workTimeMissed) {
        this.startDate = startDate;
        this.location = location;
        this.eventType = eventType;
        this.eventDescription = eventDescription;
        this.reimburse = reimburse;
        this.gradeForm = gradeForm;
        this.justification = justification;
        this.document = document;
        this.workTimeMissed = workTimeMissed;
    }
    ;
    return Submission;
}());
exports.Submission = Submission;
