"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Request = void 0;
var Request = /** @class */ (function () {
    function Request(requestId, employeeId, requestStatus, details, startDate, location, eventType, eventDescription, reimburse, gradeForm, justification, document, workTimeMissed, approval) {
        this.requestId = requestId;
        this.employeeId = employeeId;
        this.requestStatus = requestStatus;
        this.details = details;
        this.startDate = startDate;
        this.location = location;
        this.eventType = eventType;
        this.eventDescription = eventDescription;
        this.reimburse = reimburse;
        this.gradeForm = gradeForm;
        this.justification = justification;
        this.document = document;
        this.workTimeMissed = workTimeMissed;
        this.approval = approval;
    }
    ;
    return Request;
}());
exports.Request = Request;
