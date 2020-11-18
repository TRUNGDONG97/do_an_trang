import express from "express";
import Other from "../api/WebApi/Other";
import AdminController from "../controllers/AdminController";
import EmployeeController from "../controllers/EmployeeController";
import Employee from "../models/EmployeeModel";

const router = express.Router();

router.get("/", function (req, res, next) {
  res.redirect("admin/login");
  // res.render('IndexView');
});
router.post("/user/changePass", Other.changePass);
router.get("/getCountEmployee", Other.getCountEmployee);
router.post("/searchEmployee", EmployeeController.searchEmployee);
router.post("/addEmployee", EmployeeController.addEmployee);
router.post("/saveEmployee", EmployeeController.saveEmployee);
router.post("/deleteEmployee", EmployeeController.deleteEmployee);
router.post("/importListEmployee", EmployeeController.importListEmployee);
router.get("/exportFileEmployee", EmployeeController.exportFileEmployee);

router.post("/searchAdmin", AdminController.searchAdmin);
module.exports = router;
