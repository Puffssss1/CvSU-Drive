/* eslint-disable @typescript-eslint/no-explicit-any */
import connect from '@/lib/db';
import User from '@/lib/modals/user';
import { NextResponse } from "next/server"

// Get user by ID
export const GET = async (request: Request) => {
    try {
        await connect();
        
        const {searchParams} = new URL(request.url);
        const id =searchParams.get("id");

        console.log(id)
        // Fetch the user by ID
        const user = await User.findById(id);
        if (!user) {
            return new NextResponse("User not found", { status: 404 });
        }

        return new NextResponse(JSON.stringify(user), { status: 200 });
    } catch (error: any) {
        return new NextResponse("Error in fetching user: " + error.message, { status: 500 });
    }
};

// Update user data
export const PUT = async (request: Request) => {
    try {
        await connect();
        const body = await request.json();
        const {searchParams} = new URL(request.url);
        const id =searchParams.get("id");
    
        const updatedUser = await User.findByIdAndUpdate(id, body, { new: true });
        if (!updatedUser) {
            return new NextResponse("User not found", { status: 404 });
        }

            return new NextResponse(JSON.stringify({ message: "User updated successfully", user: updatedUser }), { status: 200 });
        } catch (error: any) {
            return new NextResponse("Error updating user: " + error.message, { status: 500 });
        }
};

  // Delete a user
export const DELETE = async (request: Request) => {
    try {
    await connect();
        const {searchParams} = new URL(request.url);
        const id =searchParams.get("id");

        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            return new NextResponse("User not found", { status: 404 });
        }

            return new NextResponse(JSON.stringify({ message: "User deleted successfully", user: deletedUser }), { status: 200 });
        } catch (error: any) {
            return new NextResponse("Error deleting user: " + error.message, { status: 500 });
        }
};