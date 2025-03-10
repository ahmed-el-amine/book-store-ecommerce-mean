const defaultProps = {
  firstName: '',
  activeURL: '',
};

const activeEmailTemplate = (props = defaultProps) => {
  return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <title>Verify Your Email</title>
          <style type="text/css">
            /* Reset styles for email clients */
            body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
            table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
            img { -ms-interpolation-mode: bicubic; }
  
            /* Basic styles */
            body {
              margin: 0;
              padding: 0;
              height: 100% !important;
              width: 100% !important;
            }
  
            /* Responsive styles */
            @media screen and (max-width: 600px) {
              .email-container {
                width: 100% !important;
              }
              .button {
                width: 100% !important;
              }
            }
          </style>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, sans-serif;">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="100%" style="max-width: 600px; margin: auto; background-color: #ffffff;">
            <tr>
              <td style="padding: 40px 30px; background-color: #007bff; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: bold;">Email Verification</h1>
              </td>
            </tr>
            <tr>
              <td style="padding: 40px 30px;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                  <tr>
                    <td style="padding-bottom: 20px;">
                      <h2 style="margin: 0; font-size: 20px; color: #333333;">Hello ${props.firstName},</h2>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-bottom: 20px;">
                      <p style="margin: 0; font-size: 16px; line-height: 24px; color: #666666;">
                        Thank you for creating an account. Please verify your email address by clicking the button below:
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-bottom: 20px;">
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="margin: auto;">
                        <tr>
                          <td style="border-radius: 4px; background-color: #007bff; text-align: center;">
                            <a href="${props.activeURL}" 
                               style="background-color: #007bff; border: 1px solid #007bff; border-radius: 4px; color: #ffffff; display: inline-block; font-size: 16px; font-weight: bold; line-height: 1.2; padding: 12px 24px; text-decoration: none; text-transform: capitalize; cursor: pointer;">
                              Verify Email
                            </a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-bottom: 20px;">
                      <p style="margin: 0; font-size: 14px; line-height: 21px; color: #666666;">
                        If the button doesn't work, you can copy and paste this link into your browser:
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-bottom: 20px;">
                      <p style="margin: 0; font-size: 14px; line-height: 21px; color: #007bff; word-break: break-all;">
                        ${props.activeURL}
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <p style="margin: 0; font-size: 14px; line-height: 21px; color: #666666;">
                        This link will expire in 10 minutes. If you need a new verification link, you can request one by logging into your account.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding: 20px 30px; background-color: #f8f9fa; text-align: center;">
                <p style="margin: 0; font-size: 12px; line-height: 18px; color: #999999;">
                  If you didn't create an account, you can safely ignore this email.
                </p>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;
};

export default activeEmailTemplate;
