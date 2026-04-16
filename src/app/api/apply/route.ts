import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fullName, email, phone, passportNumber, visaType, message } = body;

    if (!passportNumber || !fullName || !email || !phone || !visaType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validation: Prevent duplicate submissions for the same Passport Number.
    const existing = await prisma.application.findUnique({
      where: { passportNumber },
    });

    if (existing) {
      return NextResponse.json(
        { error: "An application with this Passport Number already exists." },
        { status: 409 }
      );
    }

    const application = await prisma.application.create({
      data: {
        passportNumber,
        fullName,
        email,
        phone,
        visaType,
        message,
        status: "Applied",
      },
    });

    return NextResponse.json({ success: true, application });
  } catch (error: any) {
    console.error("Apply API Error:", error);
    return NextResponse.json(
      { error: "Failed to submit application. Please try again later." },
      { status: 500 }
    );
  }
}
