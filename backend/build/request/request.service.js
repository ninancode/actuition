"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dynamo_1 = __importDefault(require("../dynamo/dynamo"));
var log_1 = __importDefault(require("../log"));
var RequestService = /** @class */ (function () {
    function RequestService() {
        // The documentClient. This is our interface with DynamoDB
        this.doc = dynamo_1.default; // We imported the DocumentClient from dyamo.ts
    }
    RequestService.prototype.getRequests = function () {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        log_1.default.trace('Inside \'getRequests\'.');
                        params = {
                            TableName: 'requests'
                        };
                        return [4 /*yield*/, this.doc.scan(params).promise().then(function (data) {
                                return data.Items;
                            }).catch(function (err) {
                                log_1.default.error(err);
                                return [];
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    RequestService.prototype.getRequestsFromEmployee = function (employeeId) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        log_1.default.trace('Inside \'getRequestsFromEmployee\'.');
                        params = {
                            'TableName': 'requests',
                            'IndexName': 'employeeRequests',
                            KeyConditionExpression: 'employeeId = :employeeId',
                            ExpressionAttributeValues: {
                                ':employeeId': employeeId
                            }
                        };
                        return [4 /*yield*/, this.doc.query(params).promise().then(function (result) {
                                log_1.default.debug(result);
                                log_1.default.info('Successfully retrieved all requests from employee.');
                                return result.Items;
                            }).catch(function (err) {
                                log_1.default.error(err);
                                return [];
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    RequestService.prototype.getRequestById = function (requestId) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        log_1.default.trace('Inside \'getRequestById\'.');
                        params = {
                            TableName: 'requests',
                            Key: {
                                'employeeId': requestId
                            }
                        };
                        return [4 /*yield*/, this.doc.get(params).promise().then(function (data) {
                                if (data && data.Item) {
                                    log_1.default.debug("data.Item: " + JSON.stringify(data.Item));
                                    return data.Item;
                                }
                                else {
                                    return null;
                                }
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    RequestService.prototype.getUserRequestsByStatus = function (employeeId, requestStatus) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        log_1.default.trace('Inside \'viewAllAccepted\'.');
                        params = {
                            'TableName': 'requests',
                            'IndexName': 'employeeRequestsByStatus',
                            KeyConditionExpression: 'employeeId = :employeeId AND requestStatus = :requestStatus, ',
                            ExpressionAttributeValues: {
                                '::employeeId': employeeId,
                                ':requestStatus': requestStatus
                            }
                        };
                        return [4 /*yield*/, this.doc.query(params).promise().then(function (result) {
                                log_1.default.debug(result);
                                log_1.default.info("Successfully retrieved all " + requestStatus + " requests for employee " + employeeId + ".");
                                return result.Items;
                            }).catch(function (err) {
                                log_1.default.error(err);
                                return [];
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    RequestService.prototype.getRequestByEmployee = function (employeeId) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        log_1.default.trace('Inside \'getRequestByEmployee\'.');
                        params = {
                            'TableName': 'requests',
                            'IndexName': 'employeeRequests',
                            KeyConditionExpression: 'employeeId = :employeeId',
                            ExpressionAttributeValues: {
                                ':employeeId': employeeId
                            }
                        };
                        return [4 /*yield*/, this.doc.query(params).promise().then(function (result) {
                                log_1.default.debug(result);
                                log_1.default.info('Successfully retrieved all getRequestByEmployee.');
                                return result.Items;
                            }).catch(function (err) {
                                log_1.default.error(err);
                                return [];
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    RequestService.prototype.updateRequest = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        log_1.default.trace('Inside \'updateRequestStatus\'.');
                        params = {
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
                        return [4 /*yield*/, this.doc.update(params).promise().then(function (data) {
                                log_1.default.trace("Request " + request.requestId + " was updated.");
                                log_1.default.debug(data);
                                return true;
                            }).catch(function (error) {
                                log_1.default.error(error);
                                return false;
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    RequestService.prototype.addRequest = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        request.requestId = (Date.now() + Math.random()).toString();
                        request.requestStatus = 'Being Approved';
                        request.workTimeMissed = undefined;
                        request.approval = undefined;
                        params = {
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
                        return [4 /*yield*/, this.doc.put(params).promise().then(function (result) {
                                log_1.default.info("Successfully created " + request.requestId + " for " + request.employeeId);
                                return true;
                            }).catch(function (error) {
                                log_1.default.error(error);
                                log_1.default.error("failed to add request");
                                return false;
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return RequestService;
}());
var requestService = new RequestService();
exports.default = requestService;
