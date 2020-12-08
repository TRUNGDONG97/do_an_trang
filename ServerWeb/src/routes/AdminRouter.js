import express from 'express'
import EmployeeController from '../controllers/EmployeeController'
import HomeController from '../controllers/HomeController'
import AdminController from '../controllers/AdminController'
import Admin from '../models/AdminModel';
import MacAddressController from '../controllers/MacAddressController';
const router = express.Router();

router.get('/home', HomeController.home);
router.get('/employee',EmployeeController.getEmployee)
router.get('/admin',AdminController.getAdmin)
router.get('/mac',MacAddressController.getMacAddress)
module.exports = router;