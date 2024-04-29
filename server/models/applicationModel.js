const mongoose = require('mongoose');

const studentInfoSchema = new mongoose.Schema({
    firstName: String,
    middleName: String,
    lastName: String,
    extensionName: String,
    unitAddress: String,
    streetAddress: String,
    city: String,
    email: String,
    phone: Number,
    zipCode: String,
    school: String,
    schoolAddress: String,
    course: String,
    files: [String],
    studentStatus: String,
    verified: { type: Boolean, default: false },
    verifyToken: String,
    expiredAt: Date,
    createdAt: Date,
});

const StudentInfo = mongoose.model('studentInfo', studentInfoSchema);

module.exports = StudentInfo;