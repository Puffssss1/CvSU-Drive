import { NextRequest, NextResponse } from "next/server";
import { Twilio } from "twilio";

const client = new Twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);


// Temporary in-memory OTP storage (use a database in production)
const otpStore: Record<string, { otp: string; expires: number }> = {};

// Generate a 6-digit OTP
const generateOTP = (): string =>
  Math.floor(100000 + Math.random() * 900000).toString();

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      return NextResponse.json(
        { message: "Invalid content type. Expected JSON." },
        { status: 400 }
      );
    }

    const body = await req.json();
    if (!body || !body.phone) {
      return NextResponse.json(
        { message: "Phone number is required." },
        { status: 400 }
      );
    }

    const { phone } = body;

    const otp = generateOTP();
    otpStore[phone] = { otp, expires: Date.now() + 5 * 60 * 1000 }; // Expires in 5 minutes

    try {
      const verification = await client.verify.v2
      .services("VA1100513784dd291de85e744c507488dc")
      .verifications.create({
        channel: "sms",
        to: phone,
      })

      return NextResponse.json({ message: "OTP sent successfully.", verification });
    } catch (error) {
      console.error("Error sending OTP:", error);
      return NextResponse.json(
        { message: "Failed to send OTP.", error: error.message },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Invalid request body.", error: error.message },
      { status: 400 }
    );
  }
}
