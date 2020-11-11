/**
 * Cloudmailer service.
 *
 * @module cloudmailer-app
 * @license BSD-2-Clause
 * @copyright Mat. 2020
 */




import path from "path";
import http from "http";
import express, {
    json,
    urlencoded,
} from "express";
import chalk from "chalk";
import {
    devEnv,
    run,
} from "@xcmats/js-toolbox/utils";
import hb from "handlebars";
import {
    useMemory,
    share,
} from "./lib/memory";
import { readJSON } from "./lib/utils";
import configureCatchAll from "./config/catchall";
import configureHeaders from "./config/headers";
import configureLogging from "./config/logging";
import configureRedirects from "./config/redirects";
import configureRoutes from "./config/routes";
import cloudmailer from "./lib/cloudmailer";

import { port } from "./config/server.json";
import { version } from "../package.json";




// ...
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




// async enclosure to run the logic - application main entry point
run(async () => {

    const

        // shared application objects
        ctx = useMemory(),

        // ...
        secrets = {
            client: await readJSON(
                path.join(process.cwd(), "./secrets/client.json")
            ),
            config: await readJSON(
                path.join(process.cwd(), "./secrets/config.json")
            ),
        },

        // express application
        app = express(),

        // node's http server
        server = http.createServer(app),

        // preconfigured mail-sending function
        mail = await cloudmailer(secrets.client.user);


    // share application-specific variables
    share({ secrets, app, server, mail });


    // ...
    secrets.origins = compileOrigins(secrets.config.domains);


    // expose shared memory as a global variable (for remote-debugging)
    if (devEnv()) {
        global.ctx = ctx;
    }


    // trust proxy, use json and url encoding
    app.enable("trust proxy");
    app.enable("strict routing");
    app.use(json());
    app.use(urlencoded({ extended: true }));


    // set up CORS
    configureHeaders();


    // redirects
    configureRedirects();


    // routes configuration
    configureRoutes();


    // catch-all route configuration
    configureCatchAll();


    // logger (and error handling) configuration
    configureLogging();


    // listen and respond to requests
    server.listen(
        port, "0.0.0.0",
        () => ctx.logger.info(
            `cloudmailer:${chalk.yellow(port)}`,
            `(${chalk.blueBright("v." + version)})`
        )
    );

});
