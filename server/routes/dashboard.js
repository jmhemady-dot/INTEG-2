const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
const PrintRequest = require('../models/PrintRequest');

const router = express.Router();

router.get('/student', async (req, res) => {
  try {
    const token = req.cookies?.campus_token;
    if (!token || !process.env.JWT_SECRET) return res.status(401).json({ error: 'Unauthorized' });
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (!mongoose.isValidObjectId(payload.id)) return res.status(401).json({ error: 'Unauthorized' });
    const user = await User.findById(payload.id).lean();
    if (!user) return res.status(401).json({ error: 'Unauthorized' });
    if (!['student', 'faculty', 'admin'].includes(user.role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    if (user.role === 'admin') {
      return res.json({
        user: { fullname: user.fullname, role: user.role },
        stats: { pending: 0, total: 0, completed: 0 },
        latestQueueNumber: null,
        recent: [],
        preview: true
      });
    }

    const owner = new mongoose.Types.ObjectId(user._id);
    const [total, pending, completed, recent] = await Promise.all([
      PrintRequest.countDocuments({ user_id: owner }),
      PrintRequest.countDocuments({ user_id: owner, status: 'Pending' }),
      PrintRequest.countDocuments({ user_id: owner, status: 'Completed' }),
      PrintRequest.find({ user_id: owner })
        .sort({ createdAt: -1, _id: -1 })
        .limit(5)
        .select('filename status queue_number createdAt')
        .lean()
    ]);
    const last = await PrintRequest.findOne({ user_id: owner })
      .sort({ createdAt: -1, _id: -1 })
      .select('queue_number')
      .lean();

    res.set('Cache-Control', 'no-store');
    return res.json({
      user: { fullname: user.fullname, role: user.role },
      stats: { pending, total, completed },
      latestQueueNumber: last?.queue_number ?? null,
      recent: recent.map(r => ({
        id: r._id.toString(),
        filename: r.filename,
        status: r.status,
        queueNumber: r.queue_number,
        createdAt: r.createdAt
      }))
    });
  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Invalid session' });
    }
    console.error('Dashboard error:', err.message);
    return res.status(500).json({ error: 'Unable to load dashboard' });
  }
});

module.exports = router;

