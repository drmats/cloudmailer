/**
 * Redirects configuration.
 *
 * @module cloudmailer-app
 * @license BSD-2-Clause
 * @copyright Mat. 2020
 */




import { useMemory } from "../index";
import {
    rootPath,
    apiRoot,
    apiV1,
} from "./env";




/**
 * Redirects configuration.
 */
export default function configureRedirects (): void {

    const { app } = useMemory();


    // in case `rootPath` is not a `/` (no-proxy redirect)
    if (rootPath !== "/") {
        app.get("/", (_req, res, next) => {
            res.redirect(`${apiV1}/`);
            return next();
        });
    }

    // redirect: rootPath -> apiV1
    app.get(rootPath, (_req, res, next) => {
        res.redirect(`${apiV1}/`);
        return next();
    });

    // redirect: apiRoot -> apiV1
    app.get(`${apiRoot}/`, (_req, res, next) => {
        res.redirect(`${apiV1}/`);
        return next();
    });

}
