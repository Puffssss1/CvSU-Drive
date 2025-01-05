import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../firebaseAdmin"; // Adjust the import path

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        try {
            const { docId, content } = req.body;

            // Validate request body
            if (!docId || !content) {
                return res.status(400).json({ error: "Missing docId or content" });
            }

            // Save the document to Firestore
            await db.collection("documents").doc(docId).set({ content, updatedAt: new Date().toISOString() });

            res.status(200).json({ message: "Document saved successfully!" });
        } catch (error) {
            console.error("Error saving document:", error);
            res.status(500).json({ error: "Failed to save document" });
        }
    } else {
        res.setHeader("Allow", ["POST"]);
        res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
}
