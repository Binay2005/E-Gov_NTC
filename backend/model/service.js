import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String,
        required: true
    },

    category: {
        type: String,
        enum: ["NTC Service", "Utility"],
        required: true
    },

    type: {
        type: String,
        enum: ["redirect", "ussd", "instruction", "emergency"],
        required: true
    },

    icon: {
        type: String,
        default: "📱"
    },

    actionValue: {
        type: String,
        default: ""
    },

    actionLabel: {
        type: String,
        default: "Open"
    },

    isActive: {
        type: Boolean,
        default: true
    },

    sortOrder: {
        type: Number,
        default: 0
    }

}, { timestamps: true });

const Service = mongoose.model("Service", serviceSchema);

export default Service;
