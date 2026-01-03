// Email template styles
const emailStyles = `
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
    
    body {
      margin: 0;
      padding: 0;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background-color: #f3f4f6;
    }
    
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    
    .email-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 40px 30px;
      text-align: center;
    }
    
    .email-logo {
      font-size: 32px;
      font-weight: 700;
      color: #ffffff;
      margin: 0;
      text-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .email-body {
      padding: 40px 30px;
      color: #374151;
      line-height: 1.6;
    }
    
    .email-title {
      font-size: 24px;
      font-weight: 700;
      color: #1f2937;
      margin: 0 0 20px 0;
    }
    
    .email-text {
      font-size: 16px;
      color: #6b7280;
      margin: 0 0 20px 0;
    }
    
    .otp-container {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 12px;
      padding: 30px;
      text-align: center;
      margin: 30px 0;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    
    .otp-label {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.9);
      margin: 0 0 10px 0;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    
    .otp-code {
      font-size: 48px;
      font-weight: 700;
      color: #ffffff;
      letter-spacing: 8px;
      margin: 0;
      text-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }
    
    .otp-expiry {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.8);
      margin: 10px 0 0 0;
    }
    
    .info-box {
      background-color: #fef3c7;
      border-left: 4px solid #f59e0b;
      padding: 16px;
      border-radius: 8px;
      margin: 20px 0;
    }
    
    .info-box p {
      margin: 0;
      font-size: 14px;
      color: #92400e;
    }
    
    .email-footer {
      background-color: #f9fafb;
      padding: 30px;
      text-align: center;
      border-top: 1px solid #e5e7eb;
    }
    
    .footer-text {
      font-size: 14px;
      color: #9ca3af;
      margin: 0 0 10px 0;
    }
    
    .footer-link {
      color: #667eea;
      text-decoration: none;
      font-weight: 600;
    }
    
    .footer-link:hover {
      text-decoration: underline;
    }
    
    @media only screen and (max-width: 600px) {
      .email-body {
        padding: 30px 20px;
      }
      
      .otp-code {
        font-size: 36px;
        letter-spacing: 4px;
      }
    }
  </style>
`;

// OTP Email Template
export const otpEmailTemplate = (otp, userName = 'User') => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your OTP Code</title>
      ${emailStyles}
    </head>
    <body>
      <div class="email-container">
        <!-- Header -->
        <div class="email-header">
          <h1 class="email-logo">🚀 MERN App</h1>
        </div>
        
        <!-- Body -->
        <div class="email-body">
          <h2 class="email-title">Password Reset Request</h2>
          <p class="email-text">
            Hello ${userName},
          </p>
          <p class="email-text">
            We received a request to reset your password. Use the OTP code below to complete the process:
          </p>
          
          <!-- OTP Container -->
          <div class="otp-container">
            <p class="otp-label">Your OTP Code</p>
            <h1 class="otp-code">${otp}</h1>
            <p class="otp-expiry">⏰ Valid for 10 minutes</p>
          </div>
          
          <!-- Warning Box -->
          <div class="info-box">
            <p>
              <strong>⚠️ Security Note:</strong> If you didn't request this code, please ignore this email or contact support if you have concerns about your account security.
            </p>
          </div>
          
          <p class="email-text">
            This OTP will expire in <strong>10 minutes</strong>. If you need a new code, you can request another one from the password reset page.
          </p>
        </div>
        
        <!-- Footer -->
        <div class="email-footer">
          <p class="footer-text">
            This is an automated message, please do not reply to this email.
          </p>
          <p class="footer-text">
            © ${new Date().getFullYear()} MERN App. All rights reserved.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Welcome Email Template
export const welcomeEmailTemplate = (userName, userEmail) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to MERN App</title>
      ${emailStyles}
    </head>
    <body>
      <div class="email-container">
        <!-- Header -->
        <div class="email-header">
          <h1 class="email-logo">🚀 MERN App</h1>
        </div>
        
        <!-- Body -->
        <div class="email-body">
          <h2 class="email-title">Welcome to MERN App! 🎉</h2>
          <p class="email-text">
            Hi ${userName},
          </p>
          <p class="email-text">
            Thank you for signing up! We're excited to have you on board.
          </p>
          <p class="email-text">
            Your account has been successfully created with the email: <strong>${userEmail}</strong>
          </p>
          
          <div class="info-box">
            <p>
              <strong>🔐 Keep your account secure:</strong> Never share your password with anyone and enable two-factor authentication for added security.
            </p>
          </div>
          
          <p class="email-text">
            If you have any questions or need assistance, feel free to reach out to our support team.
          </p>
        </div>
        
        <!-- Footer -->
        <div class="email-footer">
          <p class="footer-text">
            Need help? Contact us at <a href="mailto:support@mernapp.com" class="footer-link">support@mernapp.com</a>
          </p>
          <p class="footer-text">
            © ${new Date().getFullYear()} MERN App. All rights reserved.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Password Reset Success Template
export const passwordResetSuccessTemplate = (userName) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset Successful</title>
      ${emailStyles}
    </head>
    <body>
      <div class="email-container">
        <!-- Header -->
        <div class="email-header">
          <h1 class="email-logo">🚀 MERN App</h1>
        </div>
        
        <!-- Body -->
        <div class="email-body">
          <h2 class="email-title">Password Reset Successful ✅</h2>
          <p class="email-text">
            Hi ${userName},
          </p>
          <p class="email-text">
            Your password has been successfully reset. You can now log in with your new password.
          </p>
          
          <div class="info-box">
            <p>
              <strong>⚠️ Didn't make this change?</strong> If you didn't reset your password, please contact our support team immediately.
            </p>
          </div>
          
          <p class="email-text">
            For security reasons, we recommend that you:
          </p>
          <ul style="color: #6b7280; font-size: 16px; line-height: 1.8;">
            <li>Use a strong, unique password</li>
            <li>Enable two-factor authentication</li>
            <li>Avoid sharing your password with anyone</li>
          </ul>
        </div>
        
        <!-- Footer -->
        <div class="email-footer">
          <p class="footer-text">
            Need help? Contact us at <a href="mailto:support@mernapp.com" class="footer-link">support@mernapp.com</a>
          </p>
          <p class="footer-text">
            © ${new Date().getFullYear()} MERN App. All rights reserved.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export default {
    otpEmailTemplate,
    welcomeEmailTemplate,
    passwordResetSuccessTemplate,
};
