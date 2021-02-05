"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Request = void 0;
var Request = /** @class */ (function () {
    function Request(requestId, employeeId, requestStatus, submission, details, approval, grading) {
        this.requestId = requestId;
        this.employeeId = employeeId;
        this.requestStatus = requestStatus;
        this.submission = submission;
        this.details = details;
        this.approval = approval;
        this.grading = grading;
    }
    ;
    return Request;
}());
exports.Request = Request;
