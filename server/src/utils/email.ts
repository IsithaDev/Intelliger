import nodemailer, { SendMailOptions } from "nodemailer";

import { getEnv } from "../utils";

const sendEmail = async (options: SendMailOptions) => {
  const transporter = nodemailer.createTransport({
    host: getEnv("SMTP_HOST"),
    port: getEnv("SMTP_PORT"),
    auth: {
      user: getEnv("SMTP_USER"),
      pass: getEnv("SMTP_PASS"),
    },
  });

  const mailOptions: SendMailOptions = {
    from: "Isitha Sathsara <isitha.dev@gmail.com>",
    to: options.to,
    subject: options.subject,
    text: options.text,
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;
