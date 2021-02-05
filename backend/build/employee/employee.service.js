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
var EmployeeService = /** @class */ (function () {
    function EmployeeService() {
        this.doc = dynamo_1.default;
    }
    EmployeeService.prototype.getUsers = function () {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = {
                            TableName: 'employees'
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
    EmployeeService.prototype.getEmployeeById = function (employeeId) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        log_1.default.debug("Inside 'getEmployeeById' with " + employeeId + ". ");
                        params = {
                            TableName: 'employees',
                            Key: {
                                'employeeId': employeeId
                            }
                        };
                        return [4 /*yield*/, this.doc.get(params).promise().then(function (data) {
                                if (data && data.Item) {
                                    log_1.default.debug("data.Item: " + JSON.stringify(data.Item));
                                    return data.Item;
                                }
                                else {
                                    log_1.default.debug("NULL block - data.Item: " + JSON.stringify(data.Item));
                                    return null;
                                }
                            }).catch(function (err) {
                                log_1.default.error(err);
                                return null;
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    EmployeeService.prototype.getEmployeeByRole = function (role1) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        log_1.default.debug("Inside 'getEmployeeByRole' with " + role1 + ". ");
                        params = {
                            TableName: 'employees',
                            IndexName: 'employee_role',
                            KeyConditionExpression: '#role1 = :role1',
                            ExpressionAttributeNames: {
                                '#role1': 'role1'
                            },
                            ExpressionAttributeValues: {
                                ':role1': role1
                            }
                        };
                        return [4 /*yield*/, this.doc.query(params).promise().then(function (data) {
                                if (data && data.Items) {
                                    log_1.default.debug("data.Item: " + JSON.stringify(data.Items));
                                    return data.Items;
                                }
                                else {
                                    log_1.default.debug("NULL block - data.Item: " + JSON.stringify(data.Items));
                                    return null;
                                }
                            }).catch(function (err) {
                                log_1.default.error(err);
                                return null;
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    EmployeeService.prototype.addEmployee = function (employee) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = {
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
                        return [4 /*yield*/, this.doc.put(params).promise().then(function (result) {
                                log_1.default.info("Successfully created " + employee.role1 + " " + employee.name);
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
    return EmployeeService;
}());
var employeeService = new EmployeeService();
exports.default = employeeService;
