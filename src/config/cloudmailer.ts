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
 * Compound type of one entry in `config.json`.
 */
type Domain = [string, Record<string, string>];




/**
 * Enumerate over `domains` array and compute dictionary of form:
 * <allowed-origin: { origin configuration }>.
 */
let compileOrigins = (domains: Domain[]) => {
    const fields = ["subject", "text", "html"];
    let origins: Record<string, Record<string, unknown>> = {};
    for (let [name, config] of domains) {
        let domain: Record<string, unknown> = { to: config.to };
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
export default async function configureCloudmailer (): Promise<void> {

    const

        // e-mail client and domain configuration files
        secrets: Record<string, Record<string, unknown>> = {
            client: await readJSON(
                path.join(process.cwd(), "./secrets/client.json")
            ),
            config: await readJSON(
                path.join(process.cwd(), "./secrets/config.json")
            ),
        },

        // preconfigured mail-sending function
        mail = cloudmailer({
            user: secrets.client.user as string,
            keyFile: path.join(process.cwd(), "./secrets/client_auth.json"),
        });


    // allowed origins dictionary
    secrets.origins = compileOrigins(secrets.config.domains as Domain[]);


    // share cloudmailer-specific variables
    share({ secrets, mail });

}
