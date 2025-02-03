import { Resend } from 'resend';
import crypto from 'crypto';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (user) => {
  const verificationToken = crypto.randomBytes(32).toString('hex');
  const verificationLink = `${process.env.NEXTAUTH_URL}/api/auth/verify?token=${verificationToken}`;

  try {
    const { data, error } = await resend.emails.send({
      from: `${process.env.APP_NAME} <${process.env.EMAIL_FROM}>`,
      to: [user.email],
      subject: 'Verify your email address',
      html: `
        <h1>Welcome to ${process.env.APP_NAME}!</h1>
        <p>Please click the link below to verify your email address:</p>
        <a href="${verificationLink}">Verify Email</a>
        <p>This link will expire in 24 hours.</p>
      `
    });

    if (error) {
      console.error('Email sending error:', error);
      throw new Error('Failed to send verification email');
    }

    console.log('Verification email sent:', data);

    return {
      token: verificationToken,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    };
  } catch (error) {
    console.error('Email service error:', error);
    throw error;
  }
};
