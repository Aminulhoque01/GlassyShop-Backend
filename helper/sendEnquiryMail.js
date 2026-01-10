

const CustomerEnquiryEmail = (name, productName, productSpecification) => {
  return `
      <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <title>Enquiry Confirmation</title>

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
                margin: 30px auto;
                background: #ffffff;
                padding: 25px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
            }

            h1 {
                color: #2c3e50;
                font-size: 22px;
                margin-bottom: 15px;
            }

            p {
                color: #555;
                line-height: 1.6;
                font-size: 15px;
            }

            .info-box {
                background: #f1f5f9;
                padding: 15px;
                border-radius: 6px;
                margin: 20px 0;
            }

            .info-box p {
                margin: 6px 0;
                font-size: 14px;
            }

            .footer {
                margin-top: 30px;
                font-size: 13px;
                color: #888;
                text-align: center;
            }

            .highlight {
                color: #2563eb;
                font-weight: 500;
            }
            </style>
        </head>

        <body>
            <div class="container">
            <h1>Enquiry Received ✅</h1>

            <p>
                Hello <strong>{{name}}</strong>,
            </p>

            <p>
                Thank you for contacting us. We have successfully received your enquiry.
                Below are the details you submitted:
            </p>

            <div class="info-box">
                <p>
                <strong>Product Name:</strong>
                <span class="highlight">{{productName}}</span>
                </p>

                <p>
                <strong>Product Specification:</strong><br />
                {{productSpecification}}
                </p>
            </div>

            <p>
                Our team will review your enquiry and get back to you as soon as
                possible.
            </p>

            <p>Thank you for choosing us!</p>

            <div class="footer">
                © 2026 Your Company Name. All rights reserved.
            </div>
            </div>
        </body>
        </html>

    `;
};




const AdminEnquiryEmail = (name, productName, productSpecification) => {
  return `
      <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <title>Enquiry Confirmation</title>

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
                margin: 30px auto;
                background: #ffffff;
                padding: 25px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
            }

            h1 {
                color: #2c3e50;
                font-size: 22px;
                margin-bottom: 15px;
            }

            p {
                color: #555;
                line-height: 1.6;
                font-size: 15px;
            }

            .info-box {
                background: #f1f5f9;
                padding: 15px;
                border-radius: 6px;
                margin: 20px 0;
            }

            .info-box p {
                margin: 6px 0;
                font-size: 14px;
            }

            .footer {
                margin-top: 30px;
                font-size: 13px;
                color: #888;
                text-align: center;
            }

            .highlight {
                color: #2563eb;
                font-weight: 500;
            }
            </style>
        </head>

        <body>
            <div class="container">
            <h1>Enquiry Received ✅</h1>

            <p>
                Hello <strong>{{name}}</strong>,
            </p>

            <p>
                Thank you for contacting us. We have successfully received your enquiry.
                Below are the details you submitted:
            </p>

            <div class="info-box">
                <p>
                <strong>Product Name:</strong>
                <span class="highlight">{{productName}}</span>
                </p>

                <p>
                <strong>Product Specification:</strong><br />
                {{productSpecification}}
                </p>
            </div>

            <p>
                Our team will review your enquiry and get back to you as soon as
                possible.
            </p>

            <p>Thank you for choosing us!</p>

            <div class="footer">
                © 2026 Your Company Name. All rights reserved.
            </div>
            </div>
        </body>
        </html>

    `;
};
