const router = require('express').Router();

const { getApplication, selectSchedule, getApplicationSchedule, getVerifyApplication, getStudents, getStudentInfo, updateStudentInfo, deleteStudent, createSchedule, getSchedule, deleteSchedule, getScheduleView, viewPDF } = require('../controller/appController.js');
const { login, getUser, editUser, userPass, signup } = require('../controller/authController.js');

// HTTP Request
router.post('/application', getApplication);

router.get('/application/schedule', getApplicationSchedule);

router.put('/application/select/:id', selectSchedule);

router.get('/application/verify/:token/:id', getVerifyApplication);

router.post('/signup', signup); //only for admin create

router.post('/login', login);

router.get('/getUser/:id', getUser);

router.put('/editUser/:id', editUser);

router.put('/user/password/:id', userPass);

router.post('/schedule/create', createSchedule);

router.get('/schedule', getSchedule);

router.delete('/schedule-delete/:id', deleteSchedule);

router.get('/schedule/view/:id', getScheduleView);

router.get('/students', getStudents);

router.get('/student/:id', getStudentInfo);

router.put('/student/edit/:id', updateStudentInfo);

router.delete('/students/:id', deleteStudent);

router.get('/viewPdf/:filename', viewPDF);


module.exports = router;