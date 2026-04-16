import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  context: any
) {
  try {
    const passportNumber = context.params.passport;

    if (!passportNumber) {
      return NextResponse.json({ error: "Passport number required" }, { status: 400 });
    }

    const application = await prisma.application.findUnique({
      where: { passportNumber },
      include: {
        documents: true,
      },
    });

    if (!application) {
      return NextResponse.json(
        { error: "No application found for this passport number." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, application });
  } catch (error: any) {
    console.error("Status check error:", error);
    return NextResponse.json(
      { error: "Server error preventing status check." },
      { status: 500 }
    );
  }
}
