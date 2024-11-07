const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema({
    learner_id: Number,
    class_id: Number,
    scores: [{ type: Number}]
});

const Grade = mongoose.model('Grade', gradeSchema);

module.exports = Grade;