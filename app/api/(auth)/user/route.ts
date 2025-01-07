/* eslint-disable @typescript-eslint/no-explicit-any */
import connect from '@/lib/db';
import User from '@/lib/modals/user';
import { NextResponse } from "next/server"

// get all users
export const GET = async () => {
    try {
        await connect(); 
        const users = await User.find();

        return new NextResponse(JSON.stringify(users), {
            status: 200}
        );
    } catch (error: any) {
        return new NextResponse("Error in fetching Users" + error.message, {
            status: 500
        });
    }
}

// Get user by ID
export const GET_BY_ID = async (request: Request, { params }: { params: { id: string } }) => {
  
  try {
      await connect();
      const { id } = params;
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

// create new users
export const POST = async (request: Request) => {
    try {
        await connect;
        const body = await request.json();
        const { email } = body;
        const existingUsers = await User.findOne({ email });

        // check if user is existing
        if (existingUsers) {
            console.log(`Email: ${email} is already in use`);
            return new NextResponse(`Email: ${email} is already in use`,
                { status: 500, })
        }
        // save to db if user is not existing
        const newUser = new User(body);
        await newUser.save();

        return new NextResponse(JSON.stringify({
            message: "New user is Created", user: newUser
        }),
            { status: 200 }
    )
    } catch (error: any) {
        return new NextResponse("error in creating new user" + error.message,
            { status: 500, })
    }
}


// Update user data
export const PUT = async (request: Request, { params }: { params: { id: string } }) => {
    try {
      await connect();
      const body = await request.json();
      const { id } = params;
  
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
  export const DELETE = async (request: Request, { params }: { params: { id: string } }) => {
    try {
      await connect();
      const { id } = params;
  
      const deletedUser = await User.findByIdAndDelete(id);
      if (!deletedUser) {
        return new NextResponse("User not found", { status: 404 });
      }
  
      return new NextResponse(JSON.stringify({ message: "User deleted successfully", user: deletedUser }), { status: 200 });
    } catch (error: any) {
      return new NextResponse("Error deleting user: " + error.message, { status: 500 });
    }
  };