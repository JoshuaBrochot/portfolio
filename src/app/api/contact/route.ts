import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json();

    console.log("[contact] Received request:", { name, email, subject });

    // Validation basique
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Tous les champs sont requis." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Adresse email invalide." },
        { status: 400 }
      );
    }

    // Vérifier les variables d'environnement
    const smtpConfig = {
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === "true",
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS ? "***" : undefined,
      contactTo: process.env.CONTACT_TO,
    };

    console.log("[contact] SMTP config:", smtpConfig);

    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS || !process.env.CONTACT_TO) {
      console.error("[contact] Missing environment variables");
      return NextResponse.json(
        { error: "Configuration SMTP manquante. Vérifie le fichier .env.local" },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),      // 587
      secure: false,                             // false pour STARTTLS
      requireTLS: true,                          // force TLS sur 587
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    console.log("[contact] Sending email...");

    await transporter.sendMail({
      from: `"Portfolio JB" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_TO,
      replyTo: email,
      subject: `[Portfolio] ${subject}`,
      html: `
        <div style="font-family: monospace; color: #0A0A0A; max-width: 600px;">
          <h2 style="color: #7990FF; margin-bottom: 24px;">Nouveau message — Portfolio</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #555; width: 80px;">Nom</td>
              <td style="padding: 8px 0; font-weight: bold;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #555;">Email</td>
              <td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #7990FF;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #555;">Sujet</td>
              <td style="padding: 8px 0;">${subject}</td>
            </tr>
          </table>
          <hr style="border: 1px solid #eee; margin: 24px 0;" />
          <p style="white-space: pre-wrap; line-height: 1.7;">${message}</p>
        </div>
      `,
    });

    console.log("[contact] Email sent successfully");

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[contact] SMTP error:", err);
    return NextResponse.json(
      { error: "Erreur lors de l'envoi. Réessaie plus tard." },
      { status: 500 }
    );
  }
}
