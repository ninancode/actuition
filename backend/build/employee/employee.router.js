"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var log_1 = __importDefault(require("../log"));
var employee = __importStar(require("./employee"));
var employee_service_1 = __importDefault(require("./employee.service"));
var constant_1 = __importDefault(require("../constant"));
var router = express_1.default.Router();
//login
router.post('/', function (req, res, next) {
    log_1.default.debug("In POST method in employee.router: " + req.body);
    employee.login(req.body.employeeId, req.body.password).then(function (employee) {
        if (employee === null) {
            res.sendStatus(401);
        }
        req.session.employee = employee;
        res.send(JSON.stringify(employee));
    });
});
router.get('/', function (req, res, next) {
    var u = __assign({}, req.session.employee);
    log_1.default.debug(u);
    //delete u.password;
    res.send(JSON.stringify(u));
});
router.get('/role/:role', function (req, res, next) {
    employee_service_1.default.getEmployeeByRole(req.params.role).then(function (employees) {
        res.send(JSON.stringify(employees));
    });
});
router.get('/login', function (req, res, next) {
    // If I'm already logged in, why would I log in again?
    if (req.session.user) {
        console.log(req.session.user);
        res.redirect('/');
    }
    res.sendFile('login.html', { root: constant_1.default });
});
//log out
router.delete('/', function (req, res, next) {
    req.session.destroy(function (err) { return log_1.default.error(err); });
    res.sendStatus(204);
});
exports.default = router;
