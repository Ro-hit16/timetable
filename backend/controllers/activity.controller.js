import Activity from "../models/activity.model.js";

export const creatActivity = async ({ type, action, details }) => {
  try {
    await Activity.create({ type, action, details });
  } catch (err) {
    console.error("Activity log failed", err);
  }
};

export const getRecentActivity = async (req, res) => {
  try {
    console.log("fetching recent activities ...");

    // ✅ correct: sort & limit on Mongoose query
    const activities = await Activity.find()
      .sort({ createdAt: -1 })
      .limit(10);

    console.log("activities fetched:", activities.length);

    res.json({
      success: true,
      data: activities
    });

  } catch (err) {
    console.error("❌ Activity fetch error:", err);

    res.status(500).json({
      success: false,
      message: "Failed to fetch activities"
    });
  }
};
