const express = require('express');
require('dotenv').config();
const appRoute = require('./routes/route');
const mongoose = require('mongoose');
require('./utils/tokenScheduler');
const cors = require('cors');


const PORT = process.env.PORT || 3000;
const app = express();
app.use(cors({
  origin: ["https://icat-93eb7.web.app/"],
  methods: ["POST", "GET"],
  credentials: true
}));


// EXPRESS MIDDLEWARE 
app.use(express.json());


// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URL).then(()=> {
  console.log("Connected to the Database...");
}).catch(e => console.log(e.message));


// ROUTES
app.use('/api', appRoute);


// START SERVER
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});
