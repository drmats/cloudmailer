/**
 * Cloudmailer configuration.
 *
 * @module cloudmailer-app
 * @license BSD-2-Clause
 * @copyright Mat. 2020
 */




import path from "path";
import hb from "handlebars";
import { share } from "@xcmats/js-toolbox/memory";
import cloudmailer from "../lib/cloudmailer";
import { readJSON } from "../lib/utils";




/**
 * Compound type of one entry in `config.json`.
 */
type Domain = [string, Record<string, string>];




/**
 * Single origin configuration.
 */
interface Origin {
    to: string;
    templates: Record<string, hb.TemplateDelegate>;
}




/**
 * Enumerate over `domains` array and compute dictionary of form:
 * <allowed-origin: { origin configuration }>.
 */
const compileOrigins = (domains: Domain[]) => {
    const fields = ["subject", "text", "html"];
    let origins: Record<string, Origin> = {};
    for (let [name, config] of domains) {
        let domain: Origin = { to: config.to, templates: {} };
        for (let f of fields) {
            domain.templates[f] = hb.compile(config[f] || `{{${f}}}`);
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

        // e-mail client
        client = await readJSON(
            path.join(process.cwd(), "./secrets/client.json")
        ),

        // domain configuration files
        config = await readJSON(
            path.join(process.cwd(), "./secrets/config.json")
        ),

        // allowed origins dictionary
        origins = compileOrigins(config.domains as Domain[]),

        // preconfigured mail-sending function
        mail = cloudmailer({
            user: client.user as string,
            keyFile: path.join(process.cwd(), "./secrets/client_auth.json"),
        });


    // share cloudmailer-specific variables
    share({ mail, secrets: { client, config, origins } });

}




/**
 * Shared memory type augmentation.
 */
declare global {
    interface Ctx {
        mail: ReturnType<typeof cloudmailer>;
        secrets: {
            client: Record<string, unknown>;
            config: Record<string, unknown>;
            origins: ReturnType<typeof compileOrigins>;
        };
    }
}
