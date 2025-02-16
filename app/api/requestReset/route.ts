// pages/api/request-reset.ts
import crypto from 'crypto';
import resend from '@/lib/resend';
import { DATABASE_ID, db, Query, USER_COLLECTION_ID } from '@/lib/appwrite';
import { NextRequest, NextResponse } from 'next/server';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function POST(req: NextRequest) {
  const { email, prnNo } = await req.json();

  if (!email || typeof email !== 'string') {
    return NextResponse.json({ error: 'Invalid email.' }, { status: 400 });
  }

  try {
    // 🔍 Find user by email
    const users = await db.listDocuments(DATABASE_ID!, USER_COLLECTION_ID!, [
      Query.equal('email', email) && Query.equal('prnNo', prnNo),
    ]);

    if (users.total === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const user = users.documents[0];

    // 🔐 Generate a secure, URL-safe token
    const resetToken = crypto.randomBytes(32).toString('base64url');
    const resetTokenExpiry = new Date(Date.now() + 3600 * 1000).toISOString(); // 1-hour expiry

    // 📥 Update user document with token
    await db.updateDocument(DATABASE_ID!, USER_COLLECTION_ID!, user.$id, {
      resetToken,
      resetTokenExpiry,
    });

    // 📧 Send reset link via Resend
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2>Password Reset Request</h2>
          <p>Hi ${user.name},</p>
          <p>We received a request to reset your password. Click the button below to proceed:</p>
          <a href="${BASE_URL}/reset-password?token=${resetToken}"
             style="background-color: #0070f3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            Reset Password
          </a>
          <p>If you didn’t request this, you can safely ignore this email.</p>
          <p>This link will expire in 1 hour.</p>
        </div>
      `,
    });

    return NextResponse.json(
      { message: 'Password reset link sent.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error.' },
      { status: 500 }
    );
  }
}
