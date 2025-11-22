const mongoose = require('mongoose');

module.exports.connectDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connect successful");
    } catch (error) {
        console.log("Connect error");
    }
}