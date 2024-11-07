import express from "express";
import "dotenv/config";
import grades from './routes/grades.js';
import grades_agg from "./routes/grades_agg.js";
import gradesStatsRouter from './routes/stats.js';
import Grade from './models/grade.model.js';

import mongoose from 'mongoose';
async function main() {
await mongoose.connect('mongodb://127.0.0.1:27017/grades');
}
const PORT = process.env.PORT || 3000
const app = express();

app.get('/grades', async (req, res) => {
  try {
    const grades = await Grade.find();
    res.json(grades);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching grades' });
  }
});

app.post('/grades', async (req, res) => {
  try {
    const grade = new Grade(req.body);
    await grade.save();
    res.json(grade);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating grade' });
  }
});

app.get('/grades/:id', async (req, res) => {
  try {
    const grade = await Grade.findById(req.params.id);
    if (!grade) {
      res.status(404).json({ message: 'Grade not found' });
    } else {
      res.json(grade);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching grade' });
  }
});

app.put('/grades/:id', async (req, res) => {
  try {
    const grade = await Grade.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!grade) {
      res.status(404).json({ message: 'Grade not found' });
    } else {
      res.json(grade);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating grade' });
  }
});

app.delete('/grades/:id', async (req, res) => {
  try {
    await Grade.findByIdAndRemove(req.params.id);
    res.json({ message: 'Grade deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting grade' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`)
})