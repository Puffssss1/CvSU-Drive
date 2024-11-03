/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../firebaseAdmin'; // Ensure this points to your Firebase admin config
import admin from 'firebase-admin'; 
import { getServerSession } from 'next-auth'; // Correct import for API routes
import { authOptions } from '../auth/[...nextauth]/route'; // Adjust this import according to your setup

// Define interfaces for Folder and File
interface Folder {
    name: string;
    createdAt: admin.firestore.FieldValue;
    parentPath: string | null;
    createdBy: string;
    isDeleted: boolean;
}

// POST: Create a new folder
export async function POST(req: NextRequest) {
    try {
        const { folderName, parentPath }: { folderName: string; parentPath?: string; userId: string } = await req.json();

        const session = await getServerSession(authOptions);

        // Validate folderName and userId
        if (!folderName) {
            console.log('Folder name is required');
            return NextResponse.json({ message: 'Folder name is required' }, { status: 400 });
        }

        // Check if user is authenticated
        if (!session || !session.user) {
            return NextResponse.json({ message: 'User not authenticated' }, { status: 401 });
        }

        const userName = session.user.name; 

        // Create a reference for the new folder document
        const folderRef = db.collection('folders').doc(); // Auto-generate a unique ID

        // Set the folder data
        const folderData: Folder = {
            name: folderName,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            parentPath: parentPath || null,
            createdBy: userName, // Save the user ID
            isDeleted: false
        };
        
        await folderRef.set(folderData);

        // Return success response
        return NextResponse.json({ message: 'Folder created successfully', id: folderRef.id }, { status: 200 });
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error creating folder:', error.message);
            return NextResponse.json({ message: 'Failed to create folder', error: error.message }, { status: 500 });
        } else {
            console.error('Unknown error:', error);
            return NextResponse.json({ message: 'Failed to create folder', error: 'Unknown error' }, { status: 500 });
        }
    }
}

// GET: Retrieve all folders
export async function GET(req: NextRequest) {
    try {
        const snapshot = await db.collection('folders').get();
        const folders = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // Return success response with folders
        return NextResponse.json(folders, { status: 200 });
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error retrieving folders:', error.message);
            return NextResponse.json({ message: 'Failed to retrieve folders', error: error.message }, { status: 500 });
        } else {
            console.error('Unknown error:', error);
            return NextResponse.json({ message: 'Failed to retrieve folders', error: 'Unknown error' }, { status: 500 });
        }
    }
}