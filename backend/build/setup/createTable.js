"use strict";
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
var AWS = __importStar(require("aws-sdk"));
var employee_service_1 = __importDefault(require("../employee/employee.service"));
var log_1 = __importDefault(require("../log"));
var request_service_1 = __importDefault(require("../request/request.service"));
AWS.config.update({ region: 'us-west-2' });
var ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });
var removeEmployees = {
    TableName: 'employees'
};
var removeRequests = {
    TableName: 'requests'
};
var employeeSchema = {
    AttributeDefinitions: [
        {
            AttributeName: 'employeeId',
            AttributeType: 'S'
        },
        {
            AttributeName: 'role1',
            AttributeType: 'S'
        }
    ],
    KeySchema: [
        {
            AttributeName: 'employeeId',
            KeyType: 'HASH'
        }
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
    },
    TableName: 'employees',
    StreamSpecification: {
        StreamEnabled: false
    },
    GlobalSecondaryIndexes: [
        {
            IndexName: 'employee_role',
            KeySchema: [
                {
                    AttributeName: 'role1',
                    KeyType: 'HASH'
                }
            ],
            Projection: {
                ProjectionType: 'ALL'
            },
            ProvisionedThroughput: {
                ReadCapacityUnits: 1,
                WriteCapacityUnits: 1
            }
        }
    ]
};
var requestSchema = {
    AttributeDefinitions: [
        {
            AttributeName: 'requestId',
            AttributeType: 'S'
        },
        {
            AttributeName: 'employeeId',
            AttributeType: 'S'
        },
        {
            AttributeName: 'requestStatus',
            AttributeType: 'S'
        }
    ],
    KeySchema: [
        {
            AttributeName: 'requestId',
            KeyType: 'HASH'
        }
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
    },
    TableName: 'requests',
    StreamSpecification: {
        StreamEnabled: false
    },
    GlobalSecondaryIndexes: [
        {
            IndexName: 'employeeRequests',
            KeySchema: [
                {
                    AttributeName: 'employeeId',
                    KeyType: 'HASH'
                }
            ],
            Projection: {
                ProjectionType: 'ALL'
            },
            ProvisionedThroughput: {
                ReadCapacityUnits: 1,
                WriteCapacityUnits: 1
            }
        },
        {
            IndexName: 'employeeRequestsByStatus',
            KeySchema: [
                {
                    AttributeName: 'employeeId',
                    KeyType: 'HASH'
                },
                {
                    AttributeName: 'requestStatus',
                    KeyType: 'RANGE'
                },
            ],
            Projection: {
                ProjectionType: 'ALL'
            },
            ProvisionedThroughput: {
                ReadCapacityUnits: 1,
                WriteCapacityUnits: 1
            }
        }
    ]
};
ddb.deleteTable(removeEmployees, function (err, data) {
    if (err) {
        log_1.default.error('Unable to delete table. Error JSON:', JSON.stringify(err, null, 2));
    }
    else {
        log_1.default.info('Deleted table. Table description JSON:', JSON.stringify(data, null, 2));
    }
    setTimeout(function () {
        ddb.createTable(employeeSchema, function (err, data) {
            if (err) {
                // log the error
                log_1.default.error('Error', err);
            }
            else {
                // celebrate, I guess
                log_1.default.info('Table Created', data);
                setTimeout(function () {
                    populateEmployeeTable();
                }, 15000);
            }
        });
    }, 10000);
});
function populateEmployeeTable() {
    employee_service_1.default.addEmployee({ employeeId: '101501', name: 'Cloud', password: 'pass', role1: 'Employee' }).then(function () { });
    employee_service_1.default.addEmployee({ employeeId: '101502', name: 'Fox', password: 'pass', role1: 'Direct Manager' }).then(function () { });
    employee_service_1.default.addEmployee({ employeeId: '101511', name: 'Mario', password: 'pass', role1: 'Supervisor', role2: 'Direct Manager' }).then(function () { });
    employee_service_1.default.addEmployee({ employeeId: '101511', name: 'Mario', password: 'pass', role1: 'Supervisor' }).then(function () { });
    employee_service_1.default.addEmployee({ employeeId: '101521', name: 'Reyna', password: 'pass', role1: 'BenCo' }).then(function () { });
    employee_service_1.default.addEmployee({ employeeId: '101621', name: 'Yoru', password: 'pass', role1: 'BenCo' }).then(function () { });
}
ddb.deleteTable(removeRequests, function (err, data) {
    if (err) {
        console.error('Unable to delete table. Error JSON:', JSON.stringify(err, null, 2));
    }
    else {
        console.log('Deleted table. Table description JSON:', JSON.stringify(data, null, 2));
    }
    setTimeout(function () {
        ddb.createTable(requestSchema, function (err, data) {
            if (err) {
                // log the error
                console.log('Error', err);
            }
            else {
                // celebrate, I guess
                console.log('Table Created', data);
                setTimeout(function () {
                    populateRequestTable();
                }, 15000);
            }
        });
    }, 10000);
});
function populateRequestTable() {
    request_service_1.default.addRequest({
        requestId: '23049823',
        employeeId: '101501',
        requestStatus: 'Being Approved',
        details: '',
        startDate: '2020-04-01',
        location: 'Atlanta',
        eventType: 'cert',
        eventDescription: 'description',
        reimburse: 200,
        gradeForm: 'Letter',
        justification: '',
        document: 'file.pdf',
        workTimeMissed: undefined,
        approval: undefined
    }).then(function () { });
}
// function populateRestTable() {
//     restaurantService.addRestaurant({
//         name: 'McDonalds',
//         chef: 'Ronald',
//         rating: 4,
//         hours: [],
//         img: 'https://corporate.mcdonalds.com/is/image//content/dam/gwscorp/nfl/newsroom/media_assets/The%20Token.png?$MEDIA_LISTING_MODAL_IMAGE$',
//         menu: [{name: 'McDouble', price: 1}],
//         type: 'American'
//     });
//     restaurantService.addRestaurant(
//         {name: 'Wendys', chef: 'Wendy', rating: 3.5, hours: [], img:'https://img.foodlogistics.com/files/base/acbm/fl/image/2015/08/wendys_co_logo.55d5ec69667bb.png?auto=format&fit=max&w=1200', menu: [{name: 'Fries', price: 2}], type: 'American'});
//     restaurantService.addRestaurant(
//         {name: 'The Krusty Krab', chef: 'SpongeBob', rating: 5, img:'https://thefreshtoast.com/wp-content/uploads/2017/01/krusty-krab-1-1068x580.jpg', hours: [], menu: [{name: 'Krabby Patty', price: 5},{name: 'Krabby Patty with Cheese', price: 6}], type: 'Seafood'});
//     restaurantService.addRestaurant(
//         {name: 'Central Perk', chef: 'Gunther', rating: 10, img:'https://i.etsystatic.com/13571447/r/il/b9f2e8/2071038622/il_570xN.2071038622_j4vn.jpg', hours: [], menu: [{name: 'Richael\'s Coffee', price: 5}], type: 'Coffee'});
// }
