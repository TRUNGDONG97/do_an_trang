import EmployeeModel from "../models/EmployeeModel";
import TimekeepingModel from "../models/TimekeepingModel";
import Constants from "../util/contant";
import { getArrayPages, PageCount } from "../util/funtions";
import url from "url";
import pug from "pug";
import sequelize, { Op } from "sequelize";
import md5 from "md5";
import DateUtil from "../util/DateUtil";
import excel from "exceljs";

const getTimekeeping = async (req, res, next) => {
    res.render('TimekeepingView');
}
const seacherListTimekeeping = async (req, res, next) => {
    try {
        const { currentPage, employee_code, nameEmployee , startDate, endDate} = req.body;
        console.log("currentPage",currentPage);
        console.log("startDate", startDate);
        console.log("endDate", endDate);
        // console.log("timekeeping", timekeepings[0].employee.id)
        const employees = await EmployeeModel.findAll({
            attributes: ['id', 'first_name', 'last_name', 'employee_code',
            [sequelize.fn('sum', sequelize.col('timekeepings.workday')), 'countWorkday'],
            [sequelize.fn('sum', sequelize.col('timekeepings.time_late')), 'countTimeLate']],
            include: [{
                model: TimekeepingModel,
                attributes: [],
                where: {
                    date_timekeeping: {
                        [Op.between]: [startDate, endDate]
                    }
                },
                required: false,
            }],
            where: {
                [Op.and]: [
                    sequelize.where(sequelize.fn("lower", sequelize.col("last_name")), {
                        [Op.like]: "%" + nameEmployee + "%",
                    }),
                    sequelize.where(sequelize.fn("lower", sequelize.col("employee_code")), {
                        [Op.like]: "%" + employee_code + "%",
                    }),
                    {
                        is_active: 1,
                    },
                ],
            },
            row: true,
            group: ['employee.id'],
            offset: Constants.PER_PAGE * (currentPage - 1),
            // limit: Constants.PER_PAGE,
            order: [["last_name", "ASC"]],
        });
        const count = employees.length

        // console.log("rows", employees[7]);
        const pageCount = PageCount(count);
        // console.log("pageCount", pageCount);

        var urlTable = `${process.cwd()}/src/table/TimekeepingTable.pug`;
        var htmlTable = await pug.renderFile(urlTable, {
            employees: employees,
            STT: (currentPage - 1) * Constants.PER_PAGE,
            currentPage,
            pageCount: pageCount,
            pages: getArrayPages(req)(pageCount, currentPage),
        });
        res.send({
            htmlTable,
        });
        return;
    } catch (error) {
        console.log(error);
        res.status(404).send();
        return;
    }
}
export default {
    getTimekeeping,
    seacherListTimekeeping
}