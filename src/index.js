/**
 * Cloudmailer.
 *
 * @module cloudmailer-app
 * @license BSD-2-Clause
 */




import cloudmailer from "./cloudmailer";
import { access } from "@xcmats/js-toolbox/struct";
import hb from "handlebars";

import client from "../secrets/client.json";
import config from "../secrets/config.json";




// eslint-disable-next-line no-console
const logger = console;




// ...
let compileTemplates = () => ({
    subject: hb.compile(
        access(config, ["domains", 0, 1, "subject"], "{{subject}}")
    ),
    text: hb.compile(
        access(config, ["domains", 0, 1, "text"], "{{text}}")
    ),
    html: hb.compile(
        access(config, ["domains", 0, 1, "html"], "{{html}}")
    ),
});




// ...
export const main = async () => {

    let
        recipient = access(
            config, ["domains", 0, 1, "to"],
            "drmats <drmats@users.noreply.github.com>"
        ),
        t = compileTemplates(),
        mail = cloudmailer();

    try {

        logger.info(
            await mail({
                from: client.from,
                to: recipient,
                subject: t.subject({
                    subject: `${(new Date).toISOString()} 🤘 Hi there! 🤘`,
                }),
                text: t.text({ text: "Just... Hello :-)." }),
                html: t.html({ html: "Just... Hello 😎." }),
            })
        );

    } catch (ex) {

        logger.error(access(
            ex, ["response", "data"], ex
        ));

    }

};




// ...
if (module === require.main) {
    main().catch(logger.error);
}
