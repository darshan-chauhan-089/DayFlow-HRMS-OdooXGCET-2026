# Email Configuration Guide

This guide will help you set up email functionality for sending OTP codes and notifications.

## 📧 Email Service Options

### Option 1: Gmail (Recommended for Development)

1. **Enable 2-Step Verification** on your Google Account:
   - Go to: https://myaccount.google.com/security
   - Click on "2-Step Verification" and enable it

2. **Generate App Password**:
   - Visit: https://myaccount.google.com/apppasswords
   - Select "Mail" as the app
   - Select "Other" as the device
   - Name it "MERN App"
   - Copy the 16-character password

3. **Update `.env` file**:
   ```env
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-16-char-app-password
   EMAIL_FROM=your-email@gmail.com
   EMAIL_FROM_NAME=MERN App
   ```

### Option 2: SendGrid (Recommended for Production)

1. Sign up at https://sendgrid.com
2. Generate an API key
3. Update `.env`:
   ```env
   EMAIL_HOST=smtp.sendgrid.net
   EMAIL_PORT=587
   EMAIL_USER=apikey
   EMAIL_PASSWORD=your-sendgrid-api-key
   EMAIL_FROM=verified-sender@yourdomain.com
   EMAIL_FROM_NAME=MERN App
   ```

### Option 3: AWS SES (Production - Scalable)

1. Set up AWS SES and verify your domain/email
2. Get SMTP credentials
3. Update `.env`:
   ```env
   EMAIL_HOST=email-smtp.us-east-1.amazonaws.com
   EMAIL_PORT=587
   EMAIL_USER=your-ses-smtp-username
   EMAIL_PASSWORD=your-ses-smtp-password
   EMAIL_FROM=verified@yourdomain.com
   EMAIL_FROM_NAME=MERN App
   ```

### Option 4: Mailtrap (Development/Testing Only)

1. Sign up at https://mailtrap.io
2. Get credentials from inbox settings
3. Update `.env`:
   ```env
   EMAIL_HOST=smtp.mailtrap.io
   EMAIL_PORT=2525
   EMAIL_USER=your-mailtrap-username
   EMAIL_PASSWORD=your-mailtrap-password
   EMAIL_FROM=noreply@mernapp.com
   EMAIL_FROM_NAME=MERN App
   ```

## 🚀 Quick Start

1. **Install nodemailer** (already done):
   ```bash
   npm install nodemailer
   ```

2. **Update environment variables** in `.env`:
   ```env
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password
   EMAIL_FROM=your-email@gmail.com
   EMAIL_FROM_NAME=MERN App
   ```

3. **Test email sending**:
   - Start the server: `npm run dev`
   - Try the forgot password flow
   - Check your email for the OTP

## 📝 Email Templates Available

### 1. OTP Email (`otpEmailTemplate`)
- Used for password reset
- Contains 6-digit OTP code
- Valid for 10 minutes
- Professional gradient design

### 2. Welcome Email (`welcomeEmailTemplate`)
- Sent after signup (optional)
- Welcomes new users
- Confirms account creation

### 3. Password Reset Success (`passwordResetSuccessTemplate`)
- Sent after successful password reset
- Confirms the security action
- Includes security tips

## 🔧 Files Structure

```
server/
├── config/
│   └── email.js              # Nodemailer configuration
├── utils/
│   └── emailTemplates.js     # HTML email templates
└── controllers/
    └── authController.js     # Updated with email sending
```

## 🎨 Email Template Features

- ✅ Responsive design (mobile-friendly)
- ✅ Professional gradient styling
- ✅ Modern typography (Inter font)
- ✅ Security warnings and tips
- ✅ Branded header and footer
- ✅ Clear call-to-action

## 🔒 Security Notes

1. **Never commit** `.env` file to version control
2. **Use App Passwords** for Gmail (not your actual password)
3. **Verify sender domains** in production (SPF, DKIM, DMARC)
4. **Rate limit** OTP requests to prevent abuse
5. **Monitor email bounces** and complaints

## 🐛 Troubleshooting

### "Failed to send email" error

1. Check if EMAIL_USER and EMAIL_PASSWORD are correct
2. For Gmail: Ensure 2-Step Verification is enabled and you're using App Password
3. Check if firewall is blocking port 587
4. Try using port 465 with `secure: true`

### Emails going to spam

1. Use verified sender domain
2. Set up SPF, DKIM, and DMARC records
3. Avoid spam trigger words in subject/body
4. Use reputable email service (SendGrid, AWS SES)

### Rate limiting errors

1. Gmail has sending limits (500/day for free accounts)
2. Use professional email service for production
3. Implement rate limiting on your end

## 📊 Production Recommendations

1. **Use professional email service**: SendGrid, AWS SES, Mailgun
2. **Set up email templates** with tracking and analytics
3. **Implement bounce handling** and unsubscribe features
4. **Add email queue** (Bull, BeeQueue) for async processing
5. **Monitor email deliverability** and reputation
6. **Use environment-specific** email configurations

## 💡 Testing

For development/testing without sending real emails:
- Use Mailtrap.io (catches all emails in inbox)
- Or temporarily log OTPs to console (already removed from production code)

## 📞 Support

If you encounter issues:
1. Check the server logs for detailed error messages
2. Verify your email service credentials
3. Test with Mailtrap first before using production email
4. Check your email service's documentation

---

**Current Setup**: The system is configured to send:
- ✅ OTP emails for password reset
- ✅ Password reset confirmation emails
- ⚠️ Welcome emails (optional - can be enabled in signup controller)
