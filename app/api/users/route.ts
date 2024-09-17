import { NextResponse } from "next/server";


const users = [
    { 
        id: 1, 
        name: 'Mr. Admin', 
        email: 'john@example.com', 
        role: 'Admin'
    },
    { 
        id: 2, 
        name: 'Mr. Faculty', 
        email: 'jane@example.com', 
        role: 'Faculty'
    },
    { 
        id: 3, 
        name: 'Mr. Chair Person', 
        email: 'jane@example.com', 
        role: 'Chair Person'
    }
    ];
export async function GET() {
    return NextResponse.json(users);
}