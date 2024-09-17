import { NextResponse } from "next/server";
const today = new Date().toISOString();


const files = [
    { 
        id: 1, 
        fileName: 'attendance.csv',
        date: today, 
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRppdqXtwdmOOlLS6DB5LpSQjM0_g6fOMQebw&s'
    },
    { 
        id: 2, 
        fileName: 'grades.pdf', 
        date: today, 
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRppdqXtwdmOOlLS6DB5LpSQjM0_g6fOMQebw&s'
    },
    { 
        id: 2, 
        fileName: 'pdf.pdf', 
        date: today, 
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRppdqXtwdmOOlLS6DB5LpSQjM0_g6fOMQebw&s'
    }
    ];
export async function GET() {
    return NextResponse.json(files);
}