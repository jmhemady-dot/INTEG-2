const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/User");
const PrintRequest = require("../models/PrintRequest");

const router = express.Router();

router.use(async (req, res, next) => {
  try {
    const token = req.cookies?.campus_token;
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id);

    if (!user || !["student", "faculty"].includes(user.role)) {
      return res.status(403).json({ error: "Access denied" });
    }

    req.user = user;
    next();
  } catch {
    res.status(401).json({ error: "Please log in" });
  }
});

router.get("/queue", async (req, res) => {
  try {
    const active = await PrintRequest.find({
      user_id: req.user._id,
      status: { $ne: "Completed" }
    }).select("-file_path").sort({ queue_number: -1 }).lean();

    const selected = active.find(
      r => String(r._id) === String(req.query.request_id)
    ) || active[0] || null;

    if (!selected) {
      return res.json({
        requests: [], selected: null,
        ahead: 0, totalQueue: 0, estimate: 0
      });
    }

    const ahead = await PrintRequest.countDocuments({
      queue_number: { $lt: selected.queue_number },
      status: { $nin: ["Completed", "Ready for Pickup"] }
    });

    const totalQueue = await PrintRequest.countDocuments({
      status: { $nin: ["Completed", "Ready for Pickup"] }
    });

    res.json({
      requests: active,
      selected,
      ahead,
      totalQueue,
      estimate: ahead * 2
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Unable to load queue" });
  }
});

router.get("/history", async (req, res) => {
  try {
    const userFilter = { user_id: req.user._id };
    const search = String(req.query.search || "").trim().slice(0, 100);
    const filter = { ...userFilter };

    if (search) {
      const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filter.filename = { $regex: escaped, $options: "i" };
    }

    const [requests, total, completed, totals] = await Promise.all([
      PrintRequest.find(filter).select("-file_path")
        .sort({ createdAt: -1, _id: -1 }).limit(500).lean(),
      PrintRequest.countDocuments(userFilter),
      PrintRequest.countDocuments({
        ...userFilter, status: "Completed"
      }),
      PrintRequest.aggregate([
        { $match: { user_id: new mongoose.Types.ObjectId(req.user._id) } },
        { $group: {
          _id: null,
          pages: { $sum: "$pages" },
          cost: { $sum: "$estimated_cost" }
        }}
      ])
    ]);

    res.json({
      requests,
      stats: {
        total,
        completed,
        pages: totals[0]?.pages || 0,
        cost: totals[0]?.cost || 0
      },
      limited: requests.length === 500
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Unable to load history" });
  }
});

module.exports = router;
