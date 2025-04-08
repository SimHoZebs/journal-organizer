const verificationEmailTemplate = (verificationLink) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Journal Organizer Account</title>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      line-height: 1.6;
      color: #333333;
      margin: 0;
      padding: 0;
      background-color: #f9f9f9;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    .header {
      text-align: center;
      padding: 20px 0;
      background-color: #4a4a4a;
      border-radius: 8px 8px 0 0;
    }
    .header h1 {
      color: #ffffff;
      margin: 0;
      font-size: 24px;
    }
    .content {
      padding: 30px 20px;
      text-align: center;
    }
    .button {
      display: inline-block;
      background-color: #4a4a4a;
      color: #ffffff !important;
      text-decoration: none;
      padding: 12px 30px;
      border-radius: 4px;
      margin: 20px 0;
      font-weight: bold;
      text-align: center;
    }
    .footer {
      text-align: center;
      padding: 20px;
      color: #666666;
      font-size: 12px;
      border-top: 1px solid #eeeeee;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Journal Organizer</h1>
    </div>
    <div class="content">
      <h2>Welcome to Journal Organizer!</h2>
      <p>Thank you for signing up. To complete your registration and start organizing your journals, please verify your email address.</p>
      <p><a href="${verificationLink}" class="button">Verify Email Address</a></p>
      <p>This link will expire in 24 hours.</p>
      <p>If you did not create an account, you can safely ignore this email.</p>
      <p>If the button above doesn't work, copy and paste the following URL into your browser:</p>
      <p style="font-size: 12px; word-break: break-all;">${verificationLink}</p>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} Journal Organizer. All rights reserved.</p>
      <p>This is an automated email. Please do not reply to this message.</p>
    </div>
  </div>
</body>
</html>
  `;
};

export default verificationEmailTemplate;
