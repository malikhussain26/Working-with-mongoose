import express from "express";
const router = express.Router();
import db from '../db/conn.js';

// GET route at /grades/stats
router.get('stats', async (req, res) => {
    const pipeline = [
        {
            $group: {
                _id: null,
                totalLearners: { $sum: 1},
                learnersAbove50: { $sum: { $cond: [{ $gt: ['$weightedAverage', 50] }, 1, 0] } },
            },
        },
        {
            $project: {
                _id: 0,
                totalLearners: 1,
                learnersAbover50: { $multiply: [{ $divide: ['$learnersAbove50', '$totalLearners'] }, 100] },
            },
        },
    ];

    const result = await db.collection('grades').aggregate(pipeline).toArray();
    res.json(result[0]);
});

//  GET route at /grades/stats/:id
router.get('/stats/:id', async (req, res) => {
    const classId = parseInt(req.params.id);
    const pipeline = [
      {
        $match: { class_id: classId },
      },
      {
        $group: {
          _id: null,
          totalLearners: { $sum: 1 },
          learnersAbove50: { $sum: { $cond: [{ $gt: ['$weightedAverage', 50] }, 1, 0] } },
        },
      },
      {
        $project: {
          _id: 0,
          totalLearners: 1,
          learnersAbove70: 1,
          percentageAbove70: { $multiply: [{ $divide: ['$learnersAbove50', '$totalLearners'] }, 100] },
        },
      },
    ];
  
    const result = await db.collection('grades').aggregate(pipeline).toArray();
    res.json(result[0]);
  });


export default router;