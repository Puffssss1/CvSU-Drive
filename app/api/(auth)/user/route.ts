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
