/**
 * Cloudmailer configuration.
 *
 * @module cloudmailer-app
 * @license BSD-2-Clause
 * @copyright Mat. 2020
 */




import path from "path";
import hb from "handlebars";
import { share } from "../lib/memory";
import cloudmailer from "../lib/cloudmailer";
import { readJSON } from "../lib/utils";




/**
 * Enumerate over `domains` array and compute dictionary of form:
 * <allowed-origin: { origin configuration }>.
 */
let compileOrigins = (domains) => {
    const fields = ["subject", "text", "html"];
    let origins = {};
    for (let [name, config] of domains) {
        let domain = { to: config.to };
        for (let f of fields) {
            domain[f] = hb.compile(config[f] || `{{${f}}}`);
        }
        origins[name] = domain;
    }
    return origins;
};




/**
 * Cloudmailer configuration.
 */
export default async function configureCloudmailer () {

    const

        // ...
        secrets = {
            client: await readJSON(
                path.join(process.cwd(), "./secrets/client.json")
            ),
            config: await readJSON(
                path.join(process.cwd(), "./secrets/config.json")
            ),
        },

        // preconfigured mail-sending function
        mail = await cloudmailer(secrets.client.user);


    // ...
    secrets.origins = compileOrigins(secrets.config.domains);


    // share cloudmailer-specific variables
    share({ secrets, mail });

}
