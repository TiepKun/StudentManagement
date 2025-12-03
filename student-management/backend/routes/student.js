const Student = require('./student');
app.get('/api/students', async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (err) {
    res.status(500).json({ error: err.message });
    }
});