/**
 * 'Hello-world' action.
 *
 * @module cloudmailer-actions
 * @license BSD-2-Clause
 * @copyright Mat. 2020
 */




import type { RequestHandler } from "express";
import {
    name as applicationName,
    version,
} from "../../package.json";




/**
 * "Hello world".
 *
 * @function hello
 */
export const hello: RequestHandler = (req, res, next) => {

    const responseData = {
        message: "hello",
        app: applicationName,
        version,
        client: {
            ua: req.get("user-agent"),
            ip: req.ip,
            host: req.hostname,
            headers: req.headers,
        },
    };

    res.status(200).send(responseData);

    return next();

};
