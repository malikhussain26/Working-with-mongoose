const express = require("express");
const router = express.Router();
const db = require('../db/conn');

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
                learnersAbover50: { $multiply: [{ $divide: ['$learnersAbove70', '$totalLearners'] }, 100] },
            },
        },
    ];

    const result = await db.collection('grades').aggregate(pipeline).toArray();
    res.json(result[0]);
});

module.exports = router;