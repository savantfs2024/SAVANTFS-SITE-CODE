import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs"; // ensure we use Node runtime (not edge)

export async function POST(req: Request) {
  try {
    const { name, email, phone, service, message } = await req.json();

    // You MUST configure these in your .env.local
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: false, // Must be false for port 587
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });


    const mailText = `
New enquiry from the SavantFS website:

Name: ${name || ""}
Email: ${email || ""}
Phone: ${phone || ""}
Service: ${service || ""}

Message:
${message || ""}
    `.trim();

    await transporter.sendMail({
      from: '"SavantFS Website" <info@savantfs.com.au>', // what you want the FROM to show
      to: "sakib@savantfs.com.au",                       // recipient
      replyTo: email || "info@savantfs.com.au",
      subject: `New enquiry: ${service || "General enquiry"}`,
      text: mailText,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error sending contact email", error);
    return NextResponse.json(
      { ok: false, error: "Failed to send email" },
      { status: 500 }
    );
  }
}
