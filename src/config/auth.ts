/**
 * Origin-verification.
 *
 * @module cloudmailer-app
 * @license BSD-2-Clause
 * @copyright Mat. 2020
 */

/* eslint-disable @typescript-eslint/no-namespace */




import type { RequestHandler } from "express";
import { parse } from "url";
import { share } from "@xcmats/js-toolbox/memory";
import { useMemory } from "../index";




/**
 * Auth configuration.
 */
export default function configureAuth (): void {

    const

        // shared application secrets
        { secrets } = useMemory(),

        // origin-check middleware
        authOriginMw: RequestHandler = async (req, res, next) => {

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




/**
 * Global declaration merging.
 */
declare global {

    /**
     * Shared memory type augmentation.
     */
    interface Ctx {
        authOriginMw: RequestHandler;
    }

    /**
     * App-specific Express namespace declaration merging.
     */
    namespace Express {

        /**
         * Request object type extension.
         */
        interface Request {
            xhostname?: string;
        }

    }

}
