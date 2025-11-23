const User = require("../models/user.model");
const md5 = require('md5');

//[POST] /users/register
module.exports.register = async (req, res) => {
    try {
        const exitUser = await User.findOne({ email: req.body.email, deleted: false});
        if (exitUser) {
            return res.json({
                code: 400,
                message: "Email đã tồn tại"
            });
        }
        req.body.password = md5(req.body.password);
        const user = new User(req.body);
        await user.save();
        res.cookie("token", user.tokenUser);
        res.json({
            code: 200,
            message: "Tạo tài khoản thành công"
        });
    } catch (error) {
        res.json({
            code: 400,
            message: error
        });
    }
}