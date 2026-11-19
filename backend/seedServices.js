
import mongoose from "mongoose";
import Service from "./model/service.js";
import services from "./data/services.js";

const seedServices = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("Connected to MongoDB");

        for (const service of services) {
            await Service.updateOne(
                { name: service.name },
                { $setOnInsert: service },
                { upsert: true }
            );
        }

        console.log("Services added successfully!");

    } catch (error) {
        console.error("Seeding error:", error);
    } finally {
        await mongoose.disconnect();
    }
};

seedServices();
