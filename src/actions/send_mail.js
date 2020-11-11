/**
 * 'Send-email action.
 *
 * @module cloudmailer-actions
 * @license BSD-2-Clause
 * @copyright Mat. 2020
 */




import { access } from "@xcmats/js-toolbox/struct";
import { useMemory } from "../lib/memory";
import { parse } from "url";




/**
 * Act!
 *
 * @function send
 */
export default async function sendMail (req, res, next) {

    // shared application objects
    const { secrets, mail } = useMemory();

    try {

        let
            { replyTo, subject, text } = req.body,
            { origin } = req.headers,
            hostname = parse(origin).hostname;

        // sanitize
        replyTo = replyTo.normalize("NFKC").trim().toLowerCase();

        let
            config = secrets.origins[hostname],

            info = await mail({
                from: secrets.client.from,
                to: config.to,
                replyTo,
                subject: config.subject({
                    subject: `${(new Date).toISOString()} ${subject}`,
                }),
                text: config.text({ text }),
                html: config.html({ html: text }),
            });

        // respond
        res.status(202).send({ ...info });

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
