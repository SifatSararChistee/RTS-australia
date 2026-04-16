import nodemailer from "nodemailer";

export async function sendApprovalEmail(toEmail: string, fullName: string, passportNumber: string) {
  try {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    let testAccount = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass, // generated ethereal password
      },
    });

    const info = await transporter.sendMail({
      from: '"RTS AUSTRALIA" <noreply@rtsaustralia.com>',
      to: toEmail,
      subject: "Visa Application Approved - RTS AUSTRALIA",
      text: `Hello ${fullName},\n\nYour application under passport number ${passportNumber} has been approved.\n\nThank you,\nRTS Australia`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #171717; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #003366; padding: 24px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">RTS AUSTRALIA</h1>
          </div>
          <div style="padding: 32px; background-color: #ffffff;">
            <h2 style="color: #003366; margin-top: 0;">Application Approved</h2>
            <p>Dear <strong>${fullName}</strong>,</p>
            <p>We are pleased to inform you that your visa application associated with Passport Number <strong>${passportNumber}</strong> has been successfully <span style="color: #16a34a; font-weight: bold;">APPROVED</span>.</p>
            <p>You can now log in to the portal using your passport number to download any attached secure documents regarding your processed visa.</p>
            <br>
            <p style="margin-bottom: 0;">Warm regards,</p>
            <p style="margin-top: 4px; font-weight: bold; color: #003366;">RTS Australia Migration Team</p>
          </div>
          <div style="background-color: #f9fafb; padding: 16px; text-align: center; border-top: 1px solid #e5e7eb;">
             <p style="color: #6b7280; font-size: 12px; margin: 0;">This is an automated message. Please do not reply directly to this email.</p>
          </div>
        </div>
      `,
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    return { success: true, previewUrl: nodemailer.getTestMessageUrl(info) };
  } catch (error) {
    console.error("Email send error:", error);
    return { success: false, error };
  }
}
