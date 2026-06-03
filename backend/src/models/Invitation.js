import mongoose from "mongoose";

const invitationSchema = new mongoose.Schema(
    {
        id: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        groomName: {
            type: String,
            required: true,
            trim: true,
        },

        brideName: {
            type: String,
            required: true,
            trim: true,
        },

        weddingDate: {
            type: String,
            required: true,
        },

        venue: {
            type: String,
            default: "",
        },

        address: {
            type: String,
            default: "",
        },

        googleMapsLink: {
            type: String,
            default: "",
        },

        message: {
            type: String,
            default: "",
        },

        photoUrl: {
            type: String,
            default: "",
        },

        whatsappNumber: {
            type: String,
            default: "",
        },

        theme: {
            type: String,
            default: "or",
        },

        template: {
            type: String,
            default: "royal-or",
        },

        createdAt: {
            type: String,
            default: () => new Date().toISOString(),
        },
    },
    {
        id: false,
        versionKey: false,
    }
);

export default mongoose.model("Invitation", invitationSchema);