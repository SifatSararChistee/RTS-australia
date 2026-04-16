import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendApprovalEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { passportNumber, status } = await req.json();

    if (!passportNumber || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const application = await prisma.application.update({
      where: { passportNumber },
      data: { status },
    });

    let emailPreviewUrl = null;

    // Approval Workflow: Clicking "Approve" triggers an automated SMTP email to the user
    if (status.toLowerCase() === "approved" || status === "Approved") {
      const emailResult = await sendApprovalEmail(
        application.email,
        application.fullName,
        application.passportNumber
      );
      if (emailResult.success) {
        emailPreviewUrl = emailResult.previewUrl;
      }
    }

    return NextResponse.json({ 
      success: true, 
      application, 
      emailPreviewUrl 
    });
  } catch (error: any) {
    console.error("Admin Action Error:", error);
    return NextResponse.json(
      { error: "Failed to update application status." },
      { status: 500 }
    );
  }
}
