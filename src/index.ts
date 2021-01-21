/**
 * Cloudmailer service.
 *
 * @module cloudmailer-app
 * @license BSD-2-Clause
 * @copyright Mat. 2020
 */

/* eslint-disable @typescript-eslint/no-namespace */




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
import {
    share,
    useMemory as useBareMemory
} from "mem-box";

import configureAuth from "./config/auth";
import configureCatchAll from "./config/catchall";
import configureCloudmailer from "./config/cloudmailer";
import configureHeaders from "./config/headers";
import configureLogging from "./config/logging";
import configureRedirects from "./config/redirects";
import configureRoutes from "./config/routes";

import { port } from "./config/server.json";
import { version } from "../package.json";




/**
 * Type-safe instance of useMemory.
 */
export const useMemory: (() => Ctx) = useBareMemory;




/**
 * Async enclosure to run the logic - application main entry point.
 */
run(async () => {

    const

        // shared application objects
        ctx = useMemory(),

        // express application
        app = express(),

        // node's http server
        server = http.createServer(app);


    // share application-specific variables
    share({ app, server });


    // expose shared memory as a global variable (for remote-debugging)
    if (devEnv()) {
        global.ctx = ctx;
    }


    // trust proxy, use json and url encoding
    app.enable("trust proxy");
    app.enable("strict routing");
    app.use(json());
    app.use(urlencoded({ extended: true }));


    // set up cloudmailer
    await configureCloudmailer();


    // set up CORS
    configureHeaders();


    // auth (origin-check) mechanism
    configureAuth();


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




/**
 * Global declaration merging.
 */
declare global {

    /**
     * Shared memory type augmentation.
     */
    interface Ctx {
        app: ReturnType<typeof express>;
        server: ReturnType<typeof http.createServer>;
    }

    /**
     * App-specific NodeJS namespace declaration merging:
     * global object type extension
     */
    namespace NodeJS {
        interface Global {
            ctx?: Ctx;
        }
    }

}
