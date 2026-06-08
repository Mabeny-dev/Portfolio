import nodemailer from "nodemailer";

const DEFAULT_FROM_EMAIL = "info@johnmabeny.com";
const DEFAULT_WEBSITE_URL = "https://www.johnmabeny.com";

let transporter;

const getSmtpConfig = () => {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  const port = Number(process.env.SMTP_PORT || 587);

  if (!Number.isInteger(port) || port <= 0) {
    throw new Error("SMTP_PORT must be a positive integer");
  }

  return {
    host,
    port,
    secure: process.env.SMTP_SECURE === "true" || port === 465,
    auth: {
      user,
      pass,
    },
  };
};

const getTransporter = () => {
  if (transporter) return transporter;

  const config = getSmtpConfig();
  if (!config) return null;

  transporter = nodemailer.createTransport(config);
  return transporter;
};

const buildNewsletterWelcomeEmail = () => {
  const websiteUrl = process.env.WEBSITE_URL || DEFAULT_WEBSITE_URL;

  return {
    subject: "Welcome to my newsletter",
    text: `Welcome, and thanks for subscribing.

I am glad you are here.

From time to time, I will share new articles, projects, practical engineering lessons, and a closer look at the things I am building.

I value your attention, so every email will be intentional and useful. No noise, no crowded inbox.

Explore my latest work: ${websiteUrl}

Thanks for joining me,
John Mabeny

You received this email because you subscribed at ${websiteUrl}. To stop receiving updates, reply to this email and ask to unsubscribe.`,
    html: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Welcome to my newsletter</title>
  </head>
  <body style="margin:0;background:#f4f4f5;color:#18181b;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f4f5;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:620px;background:#ffffff;border:1px solid #e4e4e7;border-radius:16px;overflow:hidden;">
            <tr>
              <td style="background:#18181b;padding:24px 32px;color:#ffffff;">
                <div style="font-size:13px;letter-spacing:2px;text-transform:uppercase;color:#d4d4d8;">John Mabeny</div>
                <h1 style="margin:12px 0 0;font-size:28px;line-height:1.25;">Welcome. You are on the list.</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:36px 32px;">
                <p style="margin:0 0 18px;font-size:17px;line-height:1.7;">Thanks for subscribing. I am glad you are here.</p>
                <p style="margin:0 0 18px;font-size:16px;line-height:1.7;color:#3f3f46;">From time to time, I will share new articles, projects, practical engineering lessons, and a closer look at the things I am building.</p>
                <p style="margin:0 0 28px;font-size:16px;line-height:1.7;color:#3f3f46;">I value your attention, so every email will be intentional and useful. No noise, no crowded inbox.</p>
                <table role="presentation" cellspacing="0" cellpadding="0">
                  <tr>
                    <td style="background:#18181b;border-radius:8px;">
                      <a href="${websiteUrl}" style="display:inline-block;padding:13px 22px;color:#ffffff;text-decoration:none;font-size:15px;font-weight:700;">Explore my latest work</a>
                    </td>
                  </tr>
                </table>
                <p style="margin:32px 0 0;font-size:16px;line-height:1.7;">Thanks for joining me,<br><strong>John Mabeny</strong></p>
              </td>
            </tr>
            <tr>
              <td style="border-top:1px solid #e4e4e7;padding:20px 32px;font-size:12px;line-height:1.6;color:#71717a;">
                You received this email because you subscribed at <a href="${websiteUrl}" style="color:#52525b;">${websiteUrl}</a>.
                To stop receiving updates, reply to this email and ask to unsubscribe.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`,
  };
};

const sendNewsletterWelcomeEmail = async (recipient) => {
  const mailer = getTransporter();

  if (!mailer) {
    console.warn(
      "Newsletter welcome email skipped because SMTP_HOST, SMTP_USER, or SMTP_PASS is not configured.",
    );
    return false;
  }

  const fromEmail = process.env.MAIL_FROM_EMAIL || DEFAULT_FROM_EMAIL;
  const fromName = process.env.MAIL_FROM_NAME || "John Mabeny";
  const replyTo = process.env.MAIL_REPLY_TO || fromEmail;
  const message = buildNewsletterWelcomeEmail();

  await mailer.sendMail({
    from: {
      name: fromName,
      address: fromEmail,
    },
    to: recipient,
    replyTo,
    subject: message.subject,
    text: message.text,
    html: message.html,
  });

  return true;
};

export { buildNewsletterWelcomeEmail, sendNewsletterWelcomeEmail };
