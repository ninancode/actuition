import * as AWS from 'aws-sdk';
import employeeService from '../employee/employee.service';
import logger from '../log';
import requestService from '../request/request.service';

AWS.config.update({ region: 'us-west-2' });

const ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });

const removeEmployees = {
    TableName: 'employees'
}
const removeRequests = {
    TableName: 'requests'
}

const employeeSchema = {
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

const requestSchema = {
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
        logger.error('Unable to delete table. Error JSON:', JSON.stringify(err, null, 2));
    } else {
        logger.info('Deleted table. Table description JSON:', JSON.stringify(data, null, 2));
    }
    setTimeout(()=>{
        ddb.createTable(employeeSchema, (err, data) => {
            if (err) {
                // log the error
                logger.error('Error', err);
            } else {
                // celebrate, I guess
                logger.info('Table Created', data);
                setTimeout(()=>{
                    populateEmployeeTable();
                }, 15000);
            }
        });
    }, 10000);
});

function populateEmployeeTable() {
    employeeService.addEmployee({employeeId: '101501', name:'Cloud', password: 'pass', role1: 'Employee'}).then(()=>{});
    employeeService.addEmployee({employeeId: '101502', name:'Fox', password: 'pass', role1: 'Direct Manager'}).then(()=>{});
    employeeService.addEmployee({employeeId: '101511', name:'Mario', password: 'pass', role1: 'Supervisor', role2: 'Direct Manager'}).then(()=>{});
    employeeService.addEmployee({employeeId: '101511', name:'Mario', password: 'pass', role1: 'Supervisor'}).then(()=>{});
    employeeService.addEmployee({employeeId: '101521', name:'Reyna', password: 'pass', role1: 'BenCo'}).then(()=>{});
    employeeService.addEmployee({employeeId: '101621', name:'Yoru', password: 'pass', role1: 'BenCo'}).then(()=>{});
}

ddb.deleteTable(removeRequests, function (err, data) {
    if (err) {
        console.error('Unable to delete table. Error JSON:', JSON.stringify(err, null, 2));
    } else {
        console.log('Deleted table. Table description JSON:', JSON.stringify(data, null, 2));
    }
    setTimeout(()=>{
        ddb.createTable(requestSchema, (err, data) => {
            if (err) {
                // log the error
                console.log('Error', err);
            } else {
                // celebrate, I guess
                console.log('Table Created', data);
                setTimeout(()=>{
                    populateRequestTable();
                }, 15000);
            }
        });
    }, 10000);
});

function populateRequestTable() {
    requestService.addRequest({
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
    }).then(()=>{});
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