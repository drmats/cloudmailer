/**
 * 'Send-email action.
 *
 * @module cloudmailer-actions
 * @license BSD-2-Clause
 * @copyright Mat. 2020
 */




import { access } from "@xcmats/js-toolbox/struct";
import { useMemory } from "../lib/memory";

import client from "../../secrets/client.json";
import config from "../../secrets/config.json";




/**
 * Act!
 *
 * @function send
 */
export default async function sendMail (req, res, next) {

    // shared application objects
    const { mail, templates } = useMemory();

    let { replyTo, subject, text } = req.body;

    try {

        // sanitize
        replyTo = replyTo.normalize("NFKC").trim().toLowerCase();

        let
            recipient = access(
                config, ["domains", 0, 1, "to"],
                "drmats <drmats@users.noreply.github.com>"
            ),

            info = await mail({
                from: client.from,
                to: recipient,
                replyTo,
                subject: templates.subject({
                    subject: `${(new Date).toISOString()} ${subject}`,
                }),
                text: templates.text({ text }),
                html: templates.html({ html: text }),
            });

        // respond
        res.status(200).send({ ...info });

    } catch (ex) {

        res.status(404).send(access(
            ex, ["response", "data"], ex
        ));

    }

    return next();

}