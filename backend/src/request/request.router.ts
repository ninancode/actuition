import Express from 'express';
import logger from '../log';
import requestService from '../request/request.service'

const router = Express.Router();


/* GET users listing. */
router.get('/', function(req, res, next) {
    requestService.getRequests().then((requests) => {
        res.send(JSON.stringify(requests));
    });
});

router.get('/:id', function(req, res, next) {
    requestService.getRequestById(req.params.id).then((rest)=>{
        res.send(JSON.stringify(rest));
    });
})

router.get('/employeeId/:id', function(req, res, next) {
    requestService.getRequestByEmployee(req.params.id).then((rest)=>{
        res.send(JSON.stringify(rest));
    });
})

router.post('/', (req, res, next) => {
    logger.debug(req.body);
    requestService.addRequest(req.body).then((data)=> {
        logger.debug(data);
        res.sendStatus(201); // Created
    }).catch((err) => {
        logger.error(err);
        res.sendStatus(500); // Server error, sorry
    })
});

router.put('/', (req, res, next) => {
    logger.debug(req.body);
    requestService.updateRequest(req.body).then((data)=> {
        res.send(data);
    })
})
export default router;