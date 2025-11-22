const Task = require("../models/task.model");
const paginationHelper = require("../../../helpers/pagination");
const searchHelper = require("../../../helpers/search");

//[GET] /api/v1/tasks
module.exports.index = async (req, res) => {
    try {
        const find = {
            deleted: false
        };
        const sort = {};

        //Lọc công việc theo trạng thái
        if (req.query.status) {
            find.status = req.query.status;
        }

        //Sắp xếp công việc theo tiêu chí
        if (req.query.sortKey && req.query.sortValue) {
            sort[req.query.sortKey] = req.query.sortValue;
        }

        //Phân trang
        const totalRecord = await Task.countDocuments(find);
        const initPagination = paginationHelper(totalRecord, req.query.page);

        //Tìm kiếm theo tên 
        if (req.query.keyword) {
            find.title = searchHelper(req.query.keyword);
        }

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

// [PATCH] /api/v1/tasks/change-status/:id
module.exports.changeStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const exitTask = await Task.findOne({ _id: id, deleted: false });
        if (!exitTask) {
            return res.json({
                code: 400,
                message: "Không tồn tại công việc này"
            });
        }
        await Task.updateOne({
            _id: req.params.id
        }, {
            status: req.body.status
        });
        res.json({
            code: 200,
            message: "Cập nhật trạng thái thành công"
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Cập nhật trạng thái thất bại"
        });
    }
};

// [PATCH] /api/v1/tasks/change-multi
module.exports.changeMulti = async (req, res) => {
    try {
        const ids = req.body.ids;
        const key = req.body.key;
        const value = req.body.value;
        switch (key) {
            case "status":
                await Task.updateMany({
                    _id: { $in: ids }
                }, {
                    status: value
                });
                res.json({
                    code: 200,
                    message: "Cập nhật trạng thái thành công"
                });
                break;
        }
    } catch (error) {
        res.json({
            code: 400,
            message: "Cập nhật trạng thái thất bại"
        });
    }
}

// [POST] /api/v1/tasks/create
module.exports.create = async (req, res) => {
    try {
        const task = new Task(req.body);
        await task.save();

        res.json({
            code: 200,
            message: "Tạo công việc thành công"
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Tạo công việc thất bại"
        });
    }
}

//[PATCH] /api/v1/tasks/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id;
        const exitTask = await Task.findOne({ _id: id, deleted: false });
        if (!exitTask) {
            return res.json({
                code: 400,
                message: "Không tồn tại công việc này"
            });
        }
        await Task.updateOne({
            _id: id
        }, req.body);
        res.json({
            code: 200,
            message: "Cập nhật công việc thành công"
        });
    } catch (error) {
        res.json({
            code: 400,
            message: error
        });
    }
}