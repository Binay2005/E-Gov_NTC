
import Service from "../model/service.js";

export const getServices = async (req, res) => {
    try {
        const services = await Service.find({
            isActive: true
        }).sort({
            category: 1,
            sortOrder: 1
        });

        res.status(200).json({
            success: true,
            services
        });

    } catch (error) {
        console.error("Get services error:", error);

        res.status(500).json({
            success: false,
            error: "Unable to retrieve services"
        });
    }
};
