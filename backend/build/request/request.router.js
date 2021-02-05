"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var log_1 = __importDefault(require("../log"));
var request_service_1 = __importDefault(require("../request/request.service"));
var router = express_1.default.Router();
/* GET users listing. */
router.get('/', function (req, res, next) {
    request_service_1.default.getRequests().then(function (requests) {
        res.send(JSON.stringify(requests));
    });
});
router.get('/:id', function (req, res, next) {
    request_service_1.default.getRequestById(req.params.id).then(function (rest) {
        res.send(JSON.stringify(rest));
    });
});
router.get('/employeeId/:id', function (req, res, next) {
    request_service_1.default.getRequestByEmployee(req.params.id).then(function (rest) {
        res.send(JSON.stringify(rest));
    });
});
router.post('/', function (req, res, next) {
    log_1.default.debug(req.body);
    request_service_1.default.addRequest(req.body).then(function (data) {
        log_1.default.debug(data);
        res.sendStatus(201); // Created
    }).catch(function (err) {
        log_1.default.error(err);
        res.sendStatus(500); // Server error, sorry
    });
});
router.put('/', function (req, res, next) {
    log_1.default.debug(req.body);
    request_service_1.default.updateRequest(req.body).then(function (data) {
        res.send(data);
    });
});
exports.default = router;
