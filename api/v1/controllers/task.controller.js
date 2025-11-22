const Task = require("../models/task.model");
const paginationHelper = require("../../../helpers/pagination");

//[GET] /api/v1/tasks
module.exports.index =  async (req, res) => {
    try {
        const find = {
            deleted: false
        };
        const sort = {};

        //Lọc công việc theo trạng thái
        if(req.query.status){
            find.status = req.query.status;
        }

        //Sắp xếp công việc theo tiêu chí
        if (req.query.sortKey && req.query.sortValue) {
            sort[req.query.sortKey] = req.query.sortValue;
        }

        //Phân trang
        const totalRecord = await Task.countDocuments(find);
        const initPagination = paginationHelper(totalRecord, req.query.page);
        

        const tasks = await Task.find(find).sort(sort).limit(initPagination.limitRecord).skip(initPagination.skip);
        res.json(tasks);
    } catch (error) {
        res.json("Không tìm thấy");
    }
};


//[GET] /api/v1/tasks/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const id = req.params.id;
        const task = await Task.findOne({
            _id: id,
            deleted: false
        });
        res.json(task);
    } catch (error) {
        res.json("Không tìm thấy");
    }
};

