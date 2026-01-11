const VerificationEmail = (username, otp) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>Email Verification</title>

      <!-- Google Font -->
      <link
        href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap"
        rel="stylesheet"
      />

      <style>
        body {
          font-family: "Roboto", Verdana, sans-serif;
          background-color: #f4f6f8;
          margin: 0;
          padding: 0;
        }

        .container {
          max-width: 600px;
          margin: 40px auto;
          background: #ffffff;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 6px 15px rgba(0, 0, 0, 0.08);
          text-align: center;
        }

        h1 {
          color: #1f2937;
          font-size: 24px;
          margin-bottom: 15px;
        }

        p {
          color: #555;
          font-size: 15px;
          line-height: 1.6;
        }

        .otp-box {
          margin: 25px 0;
          padding: 15px;
          background: #f1f5f9;
          border-radius: 6px;
          font-size: 26px;
          letter-spacing: 6px;
          font-weight: 700;
          color: #2563eb;
        }

        .note {
          font-size: 14px;
          color: #666;
        }

        .footer {
          margin-top: 30px;
          font-size: 13px;
          color: #888;
        }
      </style>
    </head>

    <body>
      <div class="container">
        <h1>Email Verification 🔐</h1>

        <p>Hello <strong>${username}</strong>,</p>

        <p>
          Thank you for registering with us.  
          Please use the following OTP to verify your email address:
        </p>

        <div class="otp-box">${otp}</div>

        <p class="note">
          This OTP is valid for <strong>10 minutes</strong>.  
          Please do not share this code with anyone.
        </p>

        <p>
          If you did not request this verification, please ignore this email.
        </p>

        <div class="footer">
          © 2026 Your Company Name. All rights reserved.
        </div>
      </div>
    </body>
  </html>
  `;
};

export default VerificationEmail;
