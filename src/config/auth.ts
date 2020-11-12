/**
 * Origin-verification.
 *
 * @module cloudmailer-app
 * @license BSD-2-Clause
 * @copyright Mat. 2020
 */




import { Request, Response, NextFunction } from "express";
import { parse } from "url";
import {
    share,
    useMemory,
} from "../lib/memory";




/**
 * Auth configuration.
 */
export default function configureAuth (): void {

    const

        // shared application objects
        { secrets } = useMemory(),

        // origin-check middleware
        authOriginMw = async (
            req: Request, res: Response, next: NextFunction
        ) => {

            const
                // site originating request
                origin = req.get("origin"),

                // http 403 helper
                forbidden = (error: string) => {
                    res.status(403).send({ error });
                    return next(error);
                };


            // check if origin was provided
            if (!origin) return forbidden("no origin");

            // check if provided origin is valid
            let hostname = parse(origin).hostname;
            if (!hostname) return forbidden("origin invalid");

            // check if provided origin is allowed
            if (!secrets.origins[hostname])
                return forbidden("origin not allowed");

            req.xhostname = hostname;

            return next();

        };


    // share this middleware
    share({ authOriginMw });

}
