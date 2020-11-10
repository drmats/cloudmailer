/**
 * 'Send-email action.
 *
 * @module cloudmailer-actions
 * @license BSD-2-Clause
 * @copyright Mat. 2020
 */




import { access } from "@xcmats/js-toolbox/struct";
import { useMemory } from "../lib/memory";




/**
 * Act!
 *
 * @function send
 */
export default async function sendMail (req, res, next) {

    // shared application objects
    const { secrets, mail, templates } = useMemory();

    let { replyTo, subject, text } = req.body;

    try {

        // sanitize
        replyTo = replyTo.normalize("NFKC").trim().toLowerCase();

        let
            recipient = access(
                secrets.config, ["domains", 0, 1, "to"],
                "drmats <drmats@users.noreply.github.com>"
            ),

            info = await mail({
                from: secrets.client.from,
                to: recipient,
                replyTo,
                subject: templates.subject({
                    subject: `${(new Date).toISOString()} ${subject}`,
                }),
                text: templates.text({ text }),
                html: templates.html({ html: text }),
            });

        // respond
        res.status(202).send({ ...info });

    } catch (ex) {

        res.status(404).send(access(
            ex, ["response", "data"], ex
        ));

    }

    return next();

}
