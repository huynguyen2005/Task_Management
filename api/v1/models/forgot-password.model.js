const mongoose = require('mongoose');

const forgotPasswordSchema = new mongoose.Schema({
    email: String,
    otp: String,
    expireAt: {
        type: Date,
        expires: 180
    }
}, {
    timestamps: true
}); //Tạo mới 1 cái bộ khung, khuôn mẫu 

const ForgotPassword = mongoose.model('ForgotPassword', forgotPasswordSchema, "forgot-password"); //Khởi tạo nó

//Tham số 1: Tên model, tham số 2: tên schema mà định nghĩa ở trên, tham số 3 là tên collection bên trong mongodb

module.exports = ForgotPassword;