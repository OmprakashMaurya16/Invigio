const User = require("../models/user.model.js");

const createFaculty = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      department,
      phone,
      maxAssignmentsPerSemester,
    } = req.body;

    if (!name || !email || !password || !department || !phone) {
      return res.status(400).json({
        success: false,
        message: "name, email, password, department and phone are required",
      });
    }

    const existing = await User.findOne({ $or: [{ email }, { phone }] });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Faculty with this email or phone already exists",
      });
    }

    const faculty = await User.create({
      name,
      email,
      password,
      department,
      phone,
      role: "PROFESSOR",
      maxAssignmentsPerSemester: maxAssignmentsPerSemester ?? 8,
    });

    return res.status(201).json({
      success: true,
      message: "Faculty created successfully",
      faculty: {
        id: faculty._id,
        name: faculty.name,
        email: faculty.email,
        department: faculty.department,
        phone: faculty.phone,
        maxAssignmentsPerSemester: faculty.maxAssignmentsPerSemester,
        isActive: faculty.isActive,
        createdAt: faculty.createdAt,
      },
    });
  } catch (error) {
    console.error("Create faculty error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to create faculty",
    });
  }
};

const getAllFaculty = async (req, res) => {
  try {
    const { department, isActive, search } = req.query;

    const filter = { role: "PROFESSOR" };

    if (department) filter.department = department;

    if (isActive !== undefined) filter.isActive = isActive === "true";

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const faculty = await User.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      total: faculty.length,
      faculty,
    });
  } catch (error) {
    console.error("Get all faculty error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch faculty list",
    });
  }
};

const getFacultyById = async (req, res) => {
  try {
    const { id } = req.params;

    const faculty = await User.findOne({ _id: id, role: "PROFESSOR" });

    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: "Faculty not found",
      });
    }

    return res.status(200).json({
      success: true,
      faculty,
    });
  } catch (error) {
    console.error("Get faculty by id error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch faculty",
    });
  }
};

const updateFaculty = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      email,
      department,
      phone,
      maxAssignmentsPerSemester,
      isActive,
    } = req.body;

    const faculty = await User.findOne({ _id: id, role: "PROFESSOR" });

    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: "Faculty not found",
      });
    }

    if (email && email !== faculty.email) {
      const emailTaken = await User.findOne({ email, _id: { $ne: id } });
      if (emailTaken) {
        return res.status(409).json({
          success: false,
          message: "Email is already in use by another user",
        });
      }
    }

    if (phone && phone !== faculty.phone) {
      const phoneTaken = await User.findOne({ phone, _id: { $ne: id } });
      if (phoneTaken) {
        return res.status(409).json({
          success: false,
          message: "Phone number is already in use by another user",
        });
      }
    }

    if (name !== undefined) faculty.name = name;
    if (email !== undefined) faculty.email = email;
    if (department !== undefined) faculty.department = department;
    if (phone !== undefined) faculty.phone = phone;
    if (maxAssignmentsPerSemester !== undefined)
      faculty.maxAssignmentsPerSemester = maxAssignmentsPerSemester;
    if (isActive !== undefined) faculty.isActive = isActive;

    await faculty.save();

    return res.status(200).json({
      success: true,
      message: "Faculty updated successfully",
      faculty,
    });
  } catch (error) {
    console.error("Update faculty error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to update faculty",
    });
  }
};

const deleteFaculty = async (req, res) => {
  try {
    const { id } = req.params;

    const faculty = await User.findOneAndDelete({ _id: id, role: "PROFESSOR" });

    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: "Faculty not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Faculty deleted successfully",
    });
  } catch (error) {
    console.error("Delete faculty error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to delete faculty",
    });
  }
};

module.exports = {
  createFaculty,
  getAllFaculty,
  getFacultyById,
  updateFaculty,
  deleteFaculty,
};
