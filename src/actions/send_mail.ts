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
import { parse } from "url";




/**
 * Send email.
 *
 * @function send
 */
export default async function sendMail (
    req: Request, res: Response, next: NextFunction
): Promise<void> {

    const
        // shared application objects
        { secrets, mail } = useMemory(),

        // http 403 helper
        forbidden = () => {
            res.status(403).send({ error: "forbidden" });
            return next();
        };

    try {

        let
            { replyTo, subject, text } = req.body,
            { origin } = req.headers,
            hostname, config,
            mailOptions: SendMailOptions;

        // check if origin was provided
        if (!origin) return forbidden();

        // check if provided origin is valid
        hostname = parse(origin).hostname;
        if (!hostname) return forbidden();

        // check if provided origin is allowed
        config = secrets.origins[hostname];
        if (!config) return forbidden();

        // check and sanitize subject
        if (!subject) return forbidden();
        subject = subject.substr(0, 128);

        // check and sanitize text (email body)
        if (!text) return forbidden();
        text = subject.substr(0, 65536);

        // basic mail options
        mailOptions = {
            from: secrets.client.from,
            to: config.to,
            subject: config.subject({
                subject: `${(new Date).toISOString()} ${subject}`,
            }),
            text: config.text({ text }),
            html: config.html({ html: text }),
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
            res.status(400).send({ error: e.message });
        } else {
            res.status(404).send(access(
                e, ["response", "data"], Object.keys(e)
            ));
        }

    }

    return next();

}
