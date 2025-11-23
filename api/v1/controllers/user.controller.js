const User = require("../models/user.model");
const ForgotPassword = require("../models/forgot-password.model");
const md5 = require('md5');
const generateHelper = require("../../../helpers/generate");
const sendMailHelper = require("../../../helpers/sendMail");

//[POST] /users/register
module.exports.register = async (req, res) => {
    let {fullName, email, password} = req.body;
    try {
        const exitUser = await User.findOne({ email: email, deleted: false });
        if (exitUser) {
            return res.json({
                code: 400,
                message: "Email đã tồn tại"
            });
        }
        password = md5(password);
        const user = new User({
            fullName: fullName,
            email: email,
            password: password,
            tokenUser: generateHelper.generateRandomString(20)
        });
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

//[POST] /users/login
module.exports.login = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email, deleted: false });
        if (!user) {
            return res.json({
                code: 400,
                message: "Email không tồn tại"
            });
        }
        if (user.password != md5(req.body.password)) {
            return res.json({
                code: 400,
                message: "Sai mật khẩu"
            });
        }
        if (user.status == "inactive") {
            return res.json({
                code: 400,
                message: "Tài khoản đã bị khóa"
            });
        }
        res.cookie("token", user.tokenUser);
        res.json({
            code: 200,
            mesage: "Đăng nhập thành công"
        });
    } catch (error) {
        res.json({
            code: 400,
            mesage: error
        });
    }
}

//[POST] /users/password/forgot
module.exports.forgotPassword = async (req, res) => {
    try {
        //kiểm tra xem email có tồn tại không
        const exitUser = await User.findOne({ email: req.body.email, deleted: false });
        if (!exitUser) {
            return res.json({
                code: 400,
                message: "Email không tồn tại"
            });
        }

        //kiểm tra email này đã được gửi mã chưa
        const exitOTP = await ForgotPassword.findOne({ email: req.body.email });
        if (exitOTP) {
            return res.json({
                code: 400,
                message: "Email đã được gửi mã OTP"
            });
        }
        const otp = generateHelper.generateRandomNumber(4);

        //Gửi mã OTP qua Mail
        const html = `
        <p>Mã OTP là: <b>${otp}</b> .Thời gian sử dụng là 3 phút</p>
    `;
        sendMailHelper(req.body.email, "Lấy lại mật khẩu", html);

        //Lưu vào db
        const forgotPassword = new ForgotPassword({
            email: req.body.email,
            otp: otp,
            expireAt: new Date()
        });
        await forgotPassword.save();

        res.json({
            code: 200,
            email: req.body.email
        });
    } catch (error) {
        res.json({
            code: 400,
            message: error
        });
    }
}

//[POST] /users/password/otp
module.exports.otpPassword = async (req, res) => {
    try {
        const checkOTP = await ForgotPassword.findOne({ email: req.body.email, otp: req.body.otp });
        if (!checkOTP) {
            return res.json({
                code: 400,
                message: "Mã OTP không chính xác"
            });
        }
        const user = await User.findOne({ email: req.body.email });
        res.cookie("token", user.tokenUser);
        res.json({
            code: 200,
            mesage: "Xác thực thành công",
            token: user.tokenUser
        });
    } catch (error) {
        res.json({
            code: 400,
            message: error
        });
    }
}

//[POST] /users/password/reset
module.exports.resetPassword = async (req, res) => {
    const token = req.cookies.token;
    const password = req.body.password;

    try {
        const user = await User.findOne({ tokenUser: token });
        if (md5(password) == user.password) {
            return res.json({
                code: 400,
                message: "Vui lòng nhập mật khẩu mới khác mật khẩu cũ"
            });
        }
        await User.updateOne({
            tokenUser: token
        }, {
            password: md5(password)
        });
        await ForgotPassword.deleteOne({email: user.email});
        res.json({
            code: 200,
            message: "Đổi mật khẩu thành công"
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Đổi mật khẩu thất bại"
        });
    }
}

// [GET] /users/detail
module.exports.detailUser = async (req, res) => {
    const token = req.cookies.token;
    try {
        const inforUser = await User.findOne({tokenUser: token}).select("email fullName status");
        res.json({
            code: 200,
            message: "Lấy thông tin thành công",
            inforUser: inforUser
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Lấy thông tin thất bại"
        });
    }
}
