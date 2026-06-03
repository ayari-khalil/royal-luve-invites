import express from "express";
import slugify from "slugify";
import Invitation from "../models/Invitation.js";

const router = express.Router();

function createSlug(groomName, brideName) {
    return slugify(`${groomName}-${brideName}`, {
        lower: true,
        strict: true,
        trim: true,
    });
}

function cleanInvitationPayload(body) {
    return {
        id: body.id || String(Date.now()),
        slug: body.slug,
        groomName: body.groomName,
        brideName: body.brideName,
        weddingDate: body.weddingDate,
        venue: body.venue || "",
        address: body.address || "",
        googleMapsLink: body.googleMapsLink || "",
        message: body.message || "",
        photoUrl: body.photoUrl || "",
        whatsappNumber: body.whatsappNumber || "",
        theme: body.theme || "or",
        template: body.template || "royal-or",
        createdAt: body.createdAt || new Date().toISOString(),
    };
}

// Get all invitations
router.get("/", async (req, res) => {
    try {
        const invitations = await Invitation.find().sort({ createdAt: -1 });
        res.json(invitations);
    } catch (error) {
        console.error("Get invitations error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Create invitation
router.post("/", async (req, res) => {
    try {
        const payload = cleanInvitationPayload(req.body);

        if (!payload.groomName || !payload.brideName || !payload.weddingDate) {
            return res.status(400).json({
                message: "groomName, brideName and weddingDate are required",
            });
        }

        if (!payload.slug) {
            payload.slug = createSlug(payload.groomName, payload.brideName);
        }

        payload.slug = payload.slug.toLowerCase().trim().replace(/\s+/g, "-");

        const existingSlug = await Invitation.findOne({ slug: payload.slug });

        if (existingSlug) {
            return res.status(409).json({
                message: "This slug already exists",
            });
        }

        const invitation = await Invitation.create(payload);

        res.status(201).json({
            message: "Invitation created successfully",
            invitation,
            url: `/marriage/${invitation.slug}`,
        });
    } catch (error) {
        console.error("Create invitation error:", error);

        if (error.code === 11000) {
            return res.status(409).json({
                message: "Invitation already exists",
                field: Object.keys(error.keyPattern || {})[0],
            });
        }

        res.status(500).json({ message: "Server error" });
    }
});

// Get invitation by slug
router.get("/:slug", async (req, res) => {
    try {
        const invitation = await Invitation.findOne({
            slug: req.params.slug.toLowerCase(),
        });

        if (!invitation) {
            return res.status(404).json({ message: "Invitation not found" });
        }

        res.json(invitation);
    } catch (error) {
        console.error("Get invitation error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Update invitation by id
router.put("/:id", async (req, res) => {
    try {
        const payload = cleanInvitationPayload(req.body);

        if (!payload.slug) {
            payload.slug = createSlug(payload.groomName, payload.brideName);
        }

        payload.slug = payload.slug.toLowerCase().trim().replace(/\s+/g, "-");

        const invitation = await Invitation.findOneAndUpdate(
            { id: req.params.id },
            payload,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!invitation) {
            return res.status(404).json({ message: "Invitation not found" });
        }

        res.json({
            message: "Invitation updated successfully",
            invitation,
        });
    } catch (error) {
        console.error("Update invitation error:", error);

        if (error.code === 11000) {
            return res.status(409).json({
                message: "Slug already exists",
            });
        }

        res.status(500).json({ message: "Server error" });
    }
});

// Delete invitation by id
router.delete("/:id", async (req, res) => {
    try {
        const invitation = await Invitation.findOneAndDelete({
            id: req.params.id,
        });

        if (!invitation) {
            return res.status(404).json({ message: "Invitation not found" });
        }

        res.json({ message: "Invitation deleted successfully" });
    } catch (error) {
        console.error("Delete invitation error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;