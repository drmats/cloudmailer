/**
 * Cloudmailer.
 *
 * @module cloudmailer
 * @license BSD-2-Clause
 * @copyright Mat. 2020
 */




import path from "path";
import { google } from "googleapis";
import nodemailer, {
    SendMailOptions,
    SentMessageInfo,
} from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

import client from "../../secrets/client.json";




// ...
export default function ():
    (mailOptions: SendMailOptions) => Promise<SentMessageInfo>
{

    // JWT class used to authorize against google services
    // and obtain Access Token
    const gjwt = new google.auth.JWT({
        keyFile: path.join(process.cwd(), "./secrets/client_auth.json"),
        scopes: [
            "https://mail.google.com/",
            "https://www.googleapis.com/auth/gmail.modify",
            "https://www.googleapis.com/auth/gmail.compose",
            "https://www.googleapis.com/auth/gmail.send",
        ],
        subject: client.user,
    });


    // email sending logic
    return async (mailOptions: SendMailOptions) => {

        const
            { token } = await gjwt.getAccessToken(),
            transport = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 465,
                secure: true,
                auth: {
                    type: "OAuth2",
                    user: client.user,
                    accessToken: token || "",
                },
            } as SMTPTransport.Options),
            response = await transport.sendMail(mailOptions);

        transport.close();

        return response;

    };

}
