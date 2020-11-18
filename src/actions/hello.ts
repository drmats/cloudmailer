/**
 * 'Hello-world' action.
 *
 * @module cloudmailer-actions
 * @license BSD-2-Clause
 * @copyright Mat. 2020
 */




import {
    Request,
    Response,
    NextFunction,
} from "express";
import {
    name as applicationName,
    version,
} from "../../package.json";




/**
 * "Hello world".
 *
 * @function hello
 */
export default function hello (
    req: Request, res: Response, next: NextFunction
): void {

    // default response data
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

}
