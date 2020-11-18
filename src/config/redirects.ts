/**
 * Redirects configuration.
 *
 * @module cloudmailer-app
 * @license BSD-2-Clause
 * @copyright Mat. 2020
 */




import {
    Express,
    Request,
    Response,
    NextFunction,
} from "express";
import { useMemory } from "@xcmats/js-toolbox/memory";
import {
    rootPath,
    apiRoot,
    apiV1,
} from "./env";

import hello from "../actions/hello";




/**
 * Redirects configuration.
 */
export default function configureRedirects (): void {

    // shared application objects
    const { app } = useMemory<{ app: Express }>();


    // in case `rootPath` is not a `/` (no-proxy redirect)
    if (rootPath !== "/") {
        app.get("/", (
            _req: Request, res: Response, next: NextFunction
        ) => {
            res.redirect(`${apiV1}/`);
            return next();
        });
    }

    // redirect: rootPath -> apiV1
    app.get(rootPath, (
        _req: Request, res: Response, next: NextFunction
    ) => {
        res.redirect(`${apiV1}/`);
        return next();
    });

    // redirect: apiRoot -> apiV1
    app.get(`${apiRoot}/`, (
        _req: Request, res: Response, next: NextFunction
    ) => {
        res.redirect(`${apiV1}/`);
        return next();
    });

    // "hello world" route
    app.get(`${apiV1}/`, hello);

}
