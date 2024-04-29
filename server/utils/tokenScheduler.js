const cron = require('node-cron');
const StudentInfo = require('../models/applicationModel');
const Schedule = require('../models/scheduleModel');

cron.schedule('0 0 * * *', async () => {
    try {
        const oneDay = new Date(Date.now() - 24 * 60 * 60 * 1000);

        const deletedStudent = await StudentInfo.deleteMany({ 
            expiredAt: { $lt: oneDay },
            verified: false
        });

        const remainingStudent = await Schedule.distinct('studentId', { studentId: { $in: deletedStudent.map(doc => doc._id) } });

        if(remainingStudent.length > 0) {
            await Schedule.deleteMany({ studentId: { $in: remainingStudent } });
        }

        console.log('Expired tokens with verification status false data have been removed successfully.');
    } catch(e) {
        console.log(e.message);
    }
});