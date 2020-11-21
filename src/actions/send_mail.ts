/**
 * 'Send-email' action.
 *
 * @module cloudmailer-actions
 * @license BSD-2-Clause
 * @copyright Mat. 2020
 */




import {
    Request,
    Response,
    NextFunction,
} from "express";
import { SendMailOptions } from "nodemailer";
import { useMemory } from "../index";
import {
    maxBodyLength,
    maxSubjectLength
} from "../config/env";




/**
 * Send email.
 *
 * @function send
 */
export default async function sendMail (
    req: Request, res: Response, next: NextFunction
): Promise<void> {

    if (!req.xhostname) {
        return next(new Error("bad route auth config"));
    }

    const
        // shared application objects
        { secrets, mail } = useMemory(),

        // http 400 helper
        badRequest = (error: Error) => {
            res.status(400).send({ error: error.toString() });
            return next(error);
        };

    try {

        let
            { replyTo, subject, text } = req.body,
            config = secrets.origins[req.xhostname],
            mailOptions: SendMailOptions;

        // check and sanitize subject
        if (!subject) return badRequest(new Error("no subject"));
        subject = subject.substr(0, maxSubjectLength);

        // check and sanitize text (email body)
        if (!text) return badRequest(new Error("no text"));
        text = text.substr(0, maxBodyLength);

        // basic mail options
        mailOptions = {
            from: secrets.client.from,
            to: config.to,
            subject: config.templates.subject({ subject }),
            text: config.templates.text({ text }),
            html: config.templates.html({ html: text }),
        };

        // sanitize replyTo e-mail address and add to mailOptions if present
        if (replyTo) {
            mailOptions.replyTo =
                replyTo.normalize("NFKC").trim().toLowerCase();
        }

        // respond
        res.status(202).send(await mail(mailOptions));

    } catch (e) {

        if (e instanceof TypeError) {
            return badRequest(e);
        } else {
            res.status(404).send(e);
            return next(e);
        }

    }

    return next();

}
