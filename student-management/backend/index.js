const express = require('express');
const bodyParser = require('body-parser');
//const studentRoutes = require('./routes/studentRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

const moongoose = require('mongoose');
moongoose.connect('mongodb://localhost:27017/student_db')
.then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Error connecting to MongoDB', err);
});

// Middleware
app.use(bodyParser.json());

// Routes
//app.use('/api/students', studentRoutes);



// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});