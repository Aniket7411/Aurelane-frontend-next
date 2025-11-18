'use client';

// Cloudinary Configuration
const CLOUDINARY_CONFIG = {
    CLOUD_NAME: "defgskoxv",
    UPLOAD_PRESET: "x01b8cid",
    FOLDER: "STJ"
};

export default async function uploadFileToCloudinary(e) {
    try {
        const file = e.target.files[0];

        if (!file) {
            throw new Error("No file selected");
        }

        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", CLOUDINARY_CONFIG.UPLOAD_PRESET);
        data.append("cloud_name", CLOUDINARY_CONFIG.CLOUD_NAME);
        data.append("folder", CLOUDINARY_CONFIG.FOLDER);

        // Determine resource type based on file MIME type
        let resource_Type = "auto"; // Auto-detect type
        if (file.type.startsWith("image/")) {
            resource_Type = "image";
        } else if (file.type.startsWith("video/")) {
            resource_Type = "video";
        } else {
            resource_Type = "raw"; // For PDFs, docs, zip, etc.
        }

        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.CLOUD_NAME}/${resource_Type}/upload`,
            {
                method: "POST",
                body: data,
            }
        );

        const res = await response.json();

        if (!response.ok) {
            throw new Error(res.error?.message || "Upload failed");
        }

        return res.secure_url; // Return Cloudinary file URL
    } catch (error) {
        console.error("Error uploading file:", error);
        return null;
    }
}
