'use client';

// Cloudinary Configuration
// Replace these values with your actual Cloudinary credentials

export const CLOUDINARY_CONFIG = {
    // Your Cloudinary Cloud Name (found in Dashboard > Settings > Account Details)
    CLOUD_NAME: "defgskoxv",

    // Your Cloudinary Upload Preset (create one in Dashboard > Settings > Upload)
    // Make sure to set it as "Unsigned" for public uploads
    UPLOAD_PRESET: "x01b8cid",

    // Optional: Folder name for organization
    FOLDER: "STJ"
};

// Instructions:
// 1. Go to https://cloudinary.com/console
// 2. Copy your Cloud Name from the top-right corner
// 3. Go to Settings > Upload and create an upload preset (set as "Unsigned")
// 4. Replace the values above with your actual credentials
