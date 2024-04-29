const multer = require('multer');
const path = require('path');
const  StudentInfo  = require('../models/applicationModel');
const Schedule = require('../models/scheduleModel');
const sendEmail = require('../utils/sendEmail');
const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');
const { format } = require('date-fns');
const crypto = require('crypto');
const fs = require('fs');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        // const uniqueSuffix = Date.now();
        // cb(null, uniqueSuffix + file.originalname);
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    },
});


const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed'));
        }
    } 
});


const getApplication = async (req, res) => {
    upload.array('files', 3)(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
            console.error('Multer Error:', err);
            return res.status(500).send('File upload error.');
        } else if (err){
            console.error('Error:', err);
            return res.status(500).send('Internal server error.');
        }


        const studentJson = {
            firstName: req.body.firstName,
            middleName: req.body.middleName,
            lastName: req.body.lastName,
            extensionName: req.body.extensionName,
            unitAddress: req.body.unitAddress,
            streetAddress: req.body.streetAddress,
            city: req.body.city,
            email: req.body.email,
            phone: req.body.phone,
            zipCode: req.body.zipCode,
            school: req.body.school,
            schoolAddress: req.body.schoolAddress,
            course: req.body.course,
            files: req.files.map(file => file.path),
            studentStatus: req.body.studentStatus,
            createdAt: new Date()
        };
       
     
        try {
            const studentLastName = await StudentInfo.findOne({ lastName: studentJson.lastName });
            
            if (studentLastName) {
                const token = crypto.randomBytes(32).toString('hex');
                const expiration = new Date();
                expiration.setHours(expiration.getHours() + 24);
        
                const newStudent = await StudentInfo.create({...studentJson, verifyToken: token, expiredAt: expiration});
                const studentId = newStudent._id;
        
                const verificationLink = `${process.env.BASE_URL}application/verify/${token}/${studentId}`;
                await sendEmail(studentJson.email, 'Email Verification', verificationLink);
        
                const responseObj = {
                    message: "Successfully email sent!",
                    email: studentJson.email,
                    id: studentId
                };
                return res.status(201).send(responseObj);
            }
        
            const studentExist = await StudentInfo.findOne({ firstName: studentJson.firstName, lastName: studentJson.lastName });
            
            if (studentExist) {
                return res.status(400).send('This user has already submitted an application!');
            }
        
            const token = crypto.randomBytes(32).toString('hex');
            const expiration = new Date();
            expiration.setHours(expiration.getHours() + 24);
        
            const newStudent = await StudentInfo.create({...studentJson, verifyToken: token, expiredAt: expiration});
            const studentId = newStudent._id;
        
            const verificationLink = `${process.env.BASE_URL}application/verify/${token}/${studentId}`;
            await sendEmail(studentJson.email, 'Email Verification', verificationLink);
        
            const responseObj = {
                message: "Successfully email sent!",
                email: studentJson.email,
                id: studentId
            };
            res.status(201).send(responseObj);
        } catch (e) {
            console.log('Error:', e);
            res.status(500).send('Something went wrong, Please try again...');
        }        
    });
}


const selectSchedule = async (req, res) => {
    const { id } = req.params;
    const studentId = req.body.studentId;

    try {
        const updatedSchedule = await Schedule.findByIdAndUpdate(id, { $push: { studentId: studentId } }, { new: true });

        if (!updatedSchedule) {
            return res.status(404).send('Schedule not found');
        }

        res.status(200).send('Schedule selected successfully.');
        console.log('Schedule updated successfully!');
    } catch (e) {
        console.error('Error:', e);
        res.status(500).send('Failed to select schedule.');
    }
}


const getApplicationSchedule = async (req, res) => {
    try {
        const schedule = await Schedule.find();

        return res.status(200).json(schedule);
    } catch(e) {
        console.error('Error:', e);
        return res.status(500).send('Something went wrong...');
    }
}


const getVerifyApplication = async (req, res) => {
    const { token, id } = req.params;

    if (!token || !id) {
        return res.status(403).json({ success: false, message: 'Token and id are required.' });
    } 
   

    try {
        const student = await StudentInfo.findOne({verifyToken: token, _id: id});

        if(!student) {
            return res.status(404).json({ success: false, message: 'Invalid token or ID.' });
        }

        if (student.verified) {
            return res.status(200).json({ success: true, message: 'Email has already been verified.' });
        }

        await StudentInfo.findOneAndUpdate(
            { verifyToken: token, _id: id },
            { verified: true, $unset: { expiredAt: 1 } }
        );

        const schedule = await Schedule.findOne({ studentId: id});

        if(!schedule) {
            return res.status(404).json({ success: false, message: 'Schedule not found' });
        }

        const transporter = nodemailer.createTransport({
            host: process.env.HOST,
            service: process.env.SERVICE,
            port: Number(process.env.EMAIL_PORT),
            secure: Boolean(process.env.SECURE),
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailGenerator = new Mailgen({
            theme: 'default',
            product: {
                name: 'ICAT Application',
                link: 'http://localhost:5173/',
            }
        });

        const formatDate = format(schedule.date, "MMMM dd, yyyy");
        const formatTime = format(schedule.time, "hh:mm a");

        const emailBody = {
            body: {
                greeting: `Hello ${student.lastName}`,
                intro: "Schedule details:",
                table: {
                    data: [
                        {
                            Date: formatDate,
                            Time: formatTime,
                        },
                    ],
                },
                outro: 'Thank you for submitting your application.'
            }
        };

        const emailTemplate = mailGenerator.generate(emailBody);

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: student.email,
            subject: 'Email Verified',
            html: emailTemplate
        });

        return res.status(200).json({ success: true, message: 'Application Verified Successfully.' });
    } catch(e) {
        console.error('Error:', e);
        return res.status(500).json({success: false, message: 'Something went wrong, Please try again...'});
    }
}


const getStudents = async (req, res) => {
    try {
        const students = await StudentInfo.find({verified: true});

        return res.status(200).json(students);
    } catch(e) {
        console.error('Error:', e);
        return res.status(500).send('Something went wrong...');
    }
}


const getStudentInfo = async (req, res) => {
    const id = req.params.id;

    try {
        const student = await StudentInfo.findById(id);

        if (!student) {
            return res.status(404).send('Student not found');
        }

        return res.status(200).json(student);
    } catch(e) {
        console.error('Error:', e);
        return res.status(500).send('Something went wrong...');
    }
}


const updateStudentInfo = async (req, res) => {
    const id = req.params.id;
    const updatedInfo = {
        firstName: req.body.firstName,
        middleName: req.body.middleName,
        lastName: req.body.lastName,
        extensionName: req.body.extensionName,
        unitAddress: req.body.unitAddress,
        streetAddress: req.body.streetAddress,
        city: req.body.city,
        email: req.body.email,
        phone: req.body.phone,
        zipCode: req.body.zipCode,
        school: req.body.school,
        schoolAddress: req.body.schoolAddress,
        course: req.body.course,
    };

    try {
        const student = await StudentInfo.findByIdAndUpdate(id, updatedInfo, {new: true});

        if (!student) {
            return res.status(404).send('Student not found');
        }
        
        return res.status(201).send('Student data has been updated.');
    } catch(e) {
        console.error('Error:', e);
        return res.status(500).send('Failed to update data');
    }
}


const deleteStudent = async (req, res) => {
    try {
        await StudentInfo.findByIdAndDelete(req.params.id);
        res.status(200).send('Student application has been deleted.');
    } catch(e) {
        console.error('Error:', e);
        return res.status(500).send('Error deleting student application');
    }
}


const viewPDF = async (req, res) => {
    const { filename } = req.params;

    try {
        const studentInfo = await StudentInfo.findOne({ files: filename });
        if (!studentInfo) {
          return res.status(404).json({ message: 'PDF not found' });
        }
        
        const base64Data = studentInfo.files.find(file => file === filename);
        const pdfBuffer = Buffer.from(base64Data, 'base64');
        
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
        
        res.json(pdfBuffer);
      } catch (error) {
        console.error('Error fetching PDF:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
}


const createSchedule = async (req, res) => {
    const scheduleJson = {
        date: req.body.date,
        time: req.body.time,
        maxStudent: req.body.maxStudent,
        createAt: new Date()
    }

    try {
        const scheduleExist = await Schedule.findOne({ date: scheduleJson.date, time: scheduleJson.time });

        if (scheduleExist) {
            return res.status(400).send('This date and time is already exist!');
        }

        await Schedule.create(scheduleJson);
        return res.status(201).send('New schedule has been created');
    } catch(e) {
        console.error('Error:', e);
        return res.status(500).send('Failed creating schedule, Please try again...');
    }
}


const getSchedule = async (req, res) => {
    try {
        const schedule = await Schedule.find();

        return res.status(200).json(schedule);
    } catch(e) {
        console.error('Error:', e);
        return res.status(500).send('Something went wrong...');
    }
}


const deleteSchedule = async (req, res) => {
    try {
        await Schedule.findByIdAndDelete(req.params.id);
        res.status(200).send('Schedule has been deleted.');
    } catch(e) {
        console.error('Error:', e);
        return res.status(500).send('Error deleting schedule');
    }
}


const getScheduleView = async (req, res) => {
    const id = req.params.id;

    try {
        const schedule = await Schedule.findById(id);

        if (!schedule) {
            return res.status(404).send('ScheduleId not found');
        }

        const studentIds = schedule.studentId;
        const studentData = await StudentInfo.find({ _id: { $in: studentIds } });

        if (!studentData) {
            return res.status(404).send('Student not found');
        }

        return res.status(200).json(studentData);
    } catch(e) {
        console.error('Error:', e);
        return res.status(500).send('Something went wrong...');
    }
}


module.exports = {
    getApplication,
    selectSchedule,
    getApplicationSchedule,
    getVerifyApplication,
    getStudents,
    getStudentInfo,
    updateStudentInfo,
    deleteStudent,
    createSchedule,
    getSchedule,
    deleteSchedule,
    getScheduleView,
    viewPDF
}