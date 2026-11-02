/**
 * Professional HTML Email Templates for SecureAuth Identity Suite
 */

export const renderOtpEmail = ({ name, otp, purpose, expirationMinutes = 5 }) => {
  const isRegistration = purpose === 'REGISTRATION';
  const title = isRegistration ? 'Verify Your SecureAuth Account' : 'Password Reset Verification Code';
  const subtitle = isRegistration
    ? 'Welcome to SecureAuth. Please verify your email to activate your account.'
    : 'We received a request to reset your password. Use the code below to complete the process.';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #0f131d;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #dfe2f1;
    }
    .container {
      max-width: 580px;
      margin: 40px auto;
      background: #171b26;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
    }
    .header {
      padding: 32px 40px 20px 40px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .logo-badge {
      display: inline-block;
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
      border-radius: 12px;
      text-align: center;
      line-height: 40px;
      color: #ffffff;
      font-weight: bold;
      font-size: 20px;
    }
    .logo-text {
      font-size: 20px;
      font-weight: 700;
      color: #ffffff;
      letter-spacing: -0.5px;
    }
    .content {
      padding: 36px 40px;
    }
    h1 {
      font-size: 24px;
      font-weight: 700;
      color: #ffffff;
      margin: 0 0 12px 0;
      letter-spacing: -0.5px;
    }
    p {
      font-size: 15px;
      line-height: 1.6;
      color: #e0c0b1;
      margin: 0 0 24px 0;
    }
    .otp-box {
      background: #0a0e18;
      border: 1.5px dashed #f97316;
      border-radius: 16px;
      padding: 24px;
      text-align: center;
      margin: 28px 0;
    }
    .otp-code {
      font-family: 'Courier New', Courier, monospace;
      font-size: 38px;
      font-weight: 800;
      letter-spacing: 10px;
      color: #ffb690;
      margin: 0;
      user-select: all;
    }
    .expiry {
      font-size: 13px;
      color: #4cd7f6;
      margin-top: 8px;
      font-weight: 500;
    }
    .security-notice {
      background: rgba(255, 180, 171, 0.08);
      border-left: 3px solid #f97316;
      border-radius: 8px;
      padding: 16px;
      margin-top: 28px;
    }
    .security-notice p {
      margin: 0;
      font-size: 13px;
      color: #dfe2f1;
    }
    .footer {
      background: #0a0e18;
      padding: 24px 40px;
      font-size: 12px;
      color: #a78b7d;
      border-top: 1px solid rgba(255, 255, 255, 0.04);
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo-badge">🛡️</div>
      <div class="logo-text">SecureAuth</div>
    </div>
    <div class="content">
      <h1>${title}</h1>
      <p>Hello ${name || 'User'},</p>
      <p>${subtitle}</p>
      
      <div class="otp-box">
        <div class="otp-code">${otp}</div>
        <div class="expiry">Valid for ${expirationMinutes} minutes • Single-use only</div>
      </div>

      <div class="security-notice">
        <p><strong>Security Warning:</strong> Never share this verification code with anyone. SecureAuth support staff will never ask for your verification code or password.</p>
      </div>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} SecureAuth Identity Platform. UpToSkills Project.</p>
      <p>If you did not request this email, please safely disregard it or secure your account.</p>
    </div>
  </div>
</body>
</html>
  `.trim();
};
