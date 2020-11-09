/**
 * Redirects configuration.
 *
 * @module cloudmailer-app
 * @license BSD-2-Clause
 * @copyright Mat. 2020
 */




import { useMemory } from "../lib/memory";
import {
    rootPath,
    apiRoot,
    apiV1,
} from "./env";

import hello from "../actions/hello";




/**
 * Redirects configuration.
 */
export default function configureRedirects () {

    // shared application objects
    const { app } = useMemory();


    // in case `rootPath` is not a `/` (no-proxy redirect)
    if (rootPath !== "/") {
        app.get("/", (_req, res, next) => {
            res.redirect(`${apiV1}/`);
            next();
        });
    }

    // redirect: rootPath -> apiV1
    app.get(rootPath, (_req, res, next) => {
        res.redirect(`${apiV1}/`);
        next();
    });

    // redirect: apiRoot -> apiV1
    app.get(`${apiRoot}/`, (_req, res, next) => {
        res.redirect(`${apiV1}/`);
        next();
    });

    // "hello world" route
    app.get(`${apiV1}/`, hello);

}
