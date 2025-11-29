const User = require("../models/user.model");

module.exports.requireAuth = async (req, res, next) => {
    if (req.headers.authorization) {
        const token = req.headers.authorization.split(" ")[1];
        try { 
            const userInfor = await User.findOne({
                tokenUser: token,
                deleted: false
            }).select("-password");

            if (!userInfor) {
                return res.json({
                    code: 400,
                    message: "token không hợp lệ"
                });
            }
            req.userInfor = userInfor;
            next();
        } catch (error) {
            res.json({
                code: 400,
                message: "Lỗi truy vấn database"
            });
        }
    }
    else {
        return res.json({
            code: 400,
            message: "Vui lòng gửi token!"
        });
    }
}