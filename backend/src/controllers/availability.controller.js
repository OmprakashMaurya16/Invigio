const Availability = require("../models/availability.model.js");

const getMyAvailability = async (req, res) => {
  try {
    const availability = await Availability.findOne({ professorId: req.user._id });
    if (!availability) {
      return res.status(200).json({ isAvailable: true });
    }
    return res.status(200).json(availability);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const saveAvailability = async (req, res) => {
  try {
    const { isAvailable, startDate, endDate, morningOnly, afternoonOnly, weekendOnly } = req.body;
    const availability = await Availability.findOneAndUpdate(
      { professorId: req.user._id },
      { isAvailable, startDate, endDate, morningOnly, afternoonOnly, weekendOnly },
      { upsert: true, new: true }
    );
    return res.status(200).json(availability);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getAllAvailability = async (req, res) => {
  try {
    const records = await Availability.find().populate("professorId", "name email department");
    return res.status(200).json(records);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { getMyAvailability, saveAvailability, getAllAvailability };
