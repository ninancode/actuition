import express from 'express';
import logger from '../log';
import * as employee from './employee';
import employeeService from './employee.service';
import publicDir from '../constant';

const router = express.Router();

//login
router.post('/', function(req: any, res, next) {
    logger.debug(`In POST method in employee.router: ${req.body}`);
    employee.login(req.body.employeeId, req.body.password).then((employee) => {
      if(employee === null) {
        res.sendStatus(401);
      }
      req.session.employee = employee;
      res.send(JSON.stringify(employee))
      
    });
  });

  router.get('/', (req: any, res, next) => {
    let u = {...req.session.employee};
    logger.debug(u);
    //delete u.password;
    res.send(JSON.stringify(u));
  });

  router.get('/role/:role', function(req, res, next) {
    employeeService.getEmployeeByRole(req.params.role).then((employees)=>{
      res.send(JSON.stringify(employees));
    })
  });


  router.get('/login', function(req: any, res, next) {
    // If I'm already logged in, why would I log in again?
    if(req.session.user) {
      console.log(req.session.user);
      res.redirect('/');
    }
    res.sendFile('login.html', {root: publicDir});
  });
  
  //log out
  router.delete('/', (req, res, next) => {
    req.session.destroy((err) => logger.error(err));
    res.sendStatus(204);
  })

export default router;
