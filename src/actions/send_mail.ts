/**
 * 'Send-email' action.
 *
 * @module cloudmailer-actions
 * @license BSD-2-Clause
 * @copyright Mat. 2020
 */




import { Request, Response, NextFunction } from "express";
import { SendMailOptions } from "nodemailer";
import { access } from "@xcmats/js-toolbox/struct";
import { useMemory } from "../lib/memory";




/**
 * Send email.
 *
 * @function send
 */
export default async function sendMail (
    req: Request, res: Response, next: NextFunction
): Promise<void> {

    if (!req.xhostname) {
        return next("bad route auth config");
    }

    const
        // shared application objects
        { secrets, mail } = useMemory(),

        // http 400 helper
        badRequest = (error: string) => {
            res.status(400).send({ error });
            return next(error);
        };

    try {

        let
            { replyTo, subject, text } = req.body,
            config = secrets.origins[req.xhostname],
            mailOptions: SendMailOptions;

        // check and sanitize subject
        if (!subject) return badRequest("no subject");
        subject = subject.substr(0, 128);

        // check and sanitize text (email body)
        if (!text) return badRequest("no text");
        text = subject.substr(0, 65536);

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
            return badRequest(e.message);
        } else {
            res.status(404).send(access(
                e, ["response", "data"], Object.keys(e)
            ));
            return next(e);
        }

    }

    return next();

}
