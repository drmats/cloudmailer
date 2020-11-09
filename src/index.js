/**
 * Cloudmailer service.
 *
 * @module cloudmailer-app
 * @license BSD-2-Clause
 * @copyright Mat. 2020
 */




import http from "http";
import express, {
    json,
    urlencoded,
} from "express";
import chalk from "chalk";
import { access } from "@xcmats/js-toolbox/struct";
import {
    devEnv,
    run,
} from "@xcmats/js-toolbox/utils";
import hb from "handlebars";
import {
    useMemory,
    share,
} from "./lib/memory";
import configureCatchAll from "./config/catchall";
import configureHeaders from "./config/headers";
import configureLogging from "./config/logging";
import configureRedirects from "./config/redirects";
import configureRoutes from "./config/routes";
import cloudmailer from "./cloudmailer";

import { port } from "./config/server.json";
import { version } from "../package.json";

import config from "../secrets/config.json";




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




// async enclosure to run the logic - application main entry point
run(async () => {

    const

        // shared application objects
        ctx = useMemory(),

        // express application
        app = express(),

        // node's http server
        server = http.createServer(app),

        // ...
        templates = compileTemplates(),

        // preconfigured mail-sending function
        mail = cloudmailer();


    // share application-specific variables
    share({ app, server, templates, mail });


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
        port,
        () => ctx.logger.info(
            `cloudmailer::${chalk.yellow(port)}`,
            `(${chalk.blueBright("v." + version)})`
        )
    );

});
