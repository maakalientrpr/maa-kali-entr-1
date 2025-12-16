import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async ({ to, subject, html }: {to: string, subject: string, html: string}) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "Maa kali Tours <info@maakaligroup.com>",
      to: [to],
      subject,
      html,
    });
    if (error) {
      return console.log({ error });
    } else {
      console.log(data);
    }
  } catch (error) {
    console.log(error);
  }
};
