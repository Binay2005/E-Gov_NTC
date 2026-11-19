import Complaint from "../model/complaint.js";

// Submit a complaint
export const createComplaint = async (req, res) => {
  try {
    const { category, subject, description } = req.body;

    if (!category || !subject || !description) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all fields."
      });
    }

    const complaint = await Complaint.create({
      user: req.user._id,
      category,
      subject,
      description
    });

    res.status(201).json({
      success: true,
      message: "Complaint submitted successfully.",
      complaint
    });
  } catch (error) {
    console.error("Create complaint error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to submit complaint."
    });
  }
};

// Get complaints submitted by the logged-in user
export const getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({
      user: req.user._id
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      complaints
    });
  } catch (error) {
    console.error("Get complaints error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to retrieve complaints."
    });
  }
};

// Get all complaints (admin)
export const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate("user", "fullname phone")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      complaints
    });
  } catch (error) {
    console.error("Get all complaints error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to retrieve complaints."
    });
  }
};

// Update complaint status and admin response (admin)
export const updateComplaint = async (req, res) => {
  try {
    const { status, adminResponse } = req.body;

    const allowedStatuses = [
      "Pending",
      "In Progress",
      "Resolved",
      "Rejected"
    ];

    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid complaint status."
      });
    }

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found."
      });
    }

    if (status) {
      complaint.status = status;
      complaint.resolvedAt =
        status === "Resolved" ? new Date() : null;
    }

    if (adminResponse !== undefined) {
      complaint.adminResponse = adminResponse;
    }

    await complaint.save();

    res.status(200).json({
      success: true,
      message: "Complaint updated successfully.",
      complaint
    });
  } catch (error) {
    console.error("Update complaint error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to update complaint."
    });
  }
};