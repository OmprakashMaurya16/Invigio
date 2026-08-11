const Venue = require("../models/venue.model.js");

const createVenue = async (req, res) => {
  try {
    const { block, room, capacity } = req.body;

    if (!block || !room) {
      return res.status(400).json({
        success: false,
        message: "block and room are required",
      });
    }

    const existing = await Venue.findOne({
      block: block.toUpperCase(),
      room: room.toUpperCase(),
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Venue with this block and room already exists",
      });
    }

    const venueData = { block: block.toUpperCase(), room: room.toUpperCase() };
    if (capacity !== undefined) venueData.capacity = capacity;

    const venue = await Venue.create(venueData);

    return res.status(201).json({
      success: true,
      message: "Venue created successfully",
      venue,
    });
  } catch (error) {
    console.error("Create venue error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to create venue",
    });
  }
};

const getAllVenues = async (req, res) => {
  try {
    const { block, search } = req.query;

    const filter = {};

    if (block) filter.block = block.toUpperCase();

    if (search) {
      filter.$or = [
        { block: { $regex: search, $options: "i" } },
        { room: { $regex: search, $options: "i" } },
      ];
    }

    const venues = await Venue.find(filter).sort({ block: 1, room: 1 });

    return res.status(200).json({
      success: true,
      total: venues.length,
      venues,
    });
  } catch (error) {
    console.error("Get all venues error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch venues",
    });
  }
};

const getVenueById = async (req, res) => {
  try {
    const { id } = req.params;

    const venue = await Venue.findById(id);

    if (!venue) {
      return res.status(404).json({
        success: false,
        message: "Venue not found",
      });
    }

    return res.status(200).json({
      success: true,
      venue,
    });
  } catch (error) {
    console.error("Get venue by id error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch venue",
    });
  }
};

const updateVenue = async (req, res) => {
  try {
    const { id } = req.params;
    const { block, room, capacity } = req.body;

    const venue = await Venue.findById(id);

    if (!venue) {
      return res.status(404).json({
        success: false,
        message: "Venue not found",
      });
    }

    const newBlock = block ? block.toUpperCase() : venue.block;
    const newRoom = room ? room.toUpperCase() : venue.room;

    const duplicate = await Venue.findOne({
      block: newBlock,
      room: newRoom,
      _id: { $ne: id },
    });

    if (duplicate) {
      return res.status(409).json({
        success: false,
        message: "Another venue with this block and room already exists",
      });
    }

    venue.block = newBlock;
    venue.room = newRoom;
    if (capacity !== undefined) venue.capacity = capacity;

    await venue.save();

    return res.status(200).json({
      success: true,
      message: "Venue updated successfully",
      venue,
    });
  } catch (error) {
    console.error("Update venue error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to update venue",
    });
  }
};

const deleteVenue = async (req, res) => {
  try {
    const { id } = req.params;

    const venue = await Venue.findByIdAndDelete(id);

    if (!venue) {
      return res.status(404).json({
        success: false,
        message: "Venue not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Venue deleted successfully",
    });
  } catch (error) {
    console.error("Delete venue error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to delete venue",
    });
  }
};

module.exports = {
  createVenue,
  getAllVenues,
  getVenueById,
  updateVenue,
  deleteVenue,
};
