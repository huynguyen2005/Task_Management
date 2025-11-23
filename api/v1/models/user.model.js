const mongoose = require('mongoose');
const generate = require('../../../helpers/generate');

const userSchema = new mongoose.Schema({
    email: String,
    fullName: String,
    password: String,
    tokenUser: String,
    avatar: String,
    status: {
        type: String,
        default: "active"
    },
    deleted: {
        type: Boolean,
        default: false
    },
    deleteAt: Date
}, {
    timestamps: true
}); //Tạo mới 1 cái bộ khung, khuôn mẫu 

const User = mongoose.model('User', userSchema, "users"); //Khởi tạo nó

//Tham số 1: Tên model, tham số 2: tên schema mà định nghĩa ở trên, tham số 3 là tên collection bên trong mongodb

module.exports = User;