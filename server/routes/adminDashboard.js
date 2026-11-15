const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const PrintRequest = require("../models/PrintRequest");

const router = express.Router();

router.use(async (req, res, next) => {
  try {
    const token = req.cookies?.campus_token;
    if (!token) return res.status(401).json({ error: "Please log in" });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id);

    if (!user) return res.status(401).json({ error: "Invalid session" });
    if (user.role !== "admin")
      return res.status(403).json({ error: "Administrators only" });

    req.user = user;
    next();
  } catch {
    res.status(401).json({ error: "Invalid session" });
  }
});

router.get("/", async (req, res) => {
  try {
    const statuses = [
      "Pending", "In Progress", "Printing",
      "Ready for Pickup", "Completed"
    ];

    const [total, grouped, recent, activity] = await Promise.all([
      PrintRequest.countDocuments(),
      PrintRequest.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } }
      ]),
      PrintRequest.find()
        .sort({ createdAt: -1, _id: -1 })
        .limit(5)
        .select("-file_path")
        .populate("user_id", "fullname")
        .lean(),
      PrintRequest.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(Date.now() - 8 * 86400000)
            }
          }
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$createdAt",
                timezone: "Asia/Manila"
              }
            },
            count: { $sum: 1 }
          }
        }
      ])
    ]);

    const counts = Object.fromEntries(
      statuses.map(s => [s, 0])
    );
    for (const item of grouped) {
      if (item._id in counts) counts[item._id] = item.count;
    }

    const activityMap = Object.fromEntries(
      activity.map(a => [a._id, a.count])
    );

    const days = [];
    const now = new Date();

    for (let offset = 6; offset >= 0; offset--) {
      const manilaNow = new Date(
        now.toLocaleString("en-US", {
          timeZone: "Asia/Manila"
        })
      );
      manilaNow.setHours(12, 0, 0, 0);
      manilaNow.setDate(manilaNow.getDate() - offset);

      const key = [
        manilaNow.getFullYear(),
        String(manilaNow.getMonth() + 1).padStart(2, "0"),
        String(manilaNow.getDate()).padStart(2, "0")
      ].join("-");

      days.push({
        date: key,
        label: manilaNow.toLocaleDateString("en-US", {
          weekday: "short"
        }),
        count: activityMap[key] || 0
      });
    }

    res.json({
      total,
      counts,
      activity: days,
      recent: recent.map(r => ({
        id: r._id,
        filename: r.filename,
        queueNumber: r.queue_number,
        fullname: r.user_id?.fullname || "Unknown User",
        status: r.status,
        createdAt: r.createdAt
      }))
    });
  } catch (error) {
    console.error("Admin dashboard:", error.message);
    res.status(500).json({ error: "Unable to load admin dashboard" });
  }
});

module.exports = router;
