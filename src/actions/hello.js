/**
 * 'Hello-world' action.
 *
 * @module cloudmailer-actions
 * @license BSD-2-Clause
 * @copyright Mat. 2020
 */




import {
    name as applicationName,
    version,
} from "../../package.json";




/**
 * "Hello world".
 *
 * @function hello
 */
export default function hello (req, res, next) {

    // default response data
    let responseData = {
        message: "hello",
        app: applicationName,
        version,
        client: {
            ua: req.get("user-agent"),
            ip: req.ip,
            host: req.hostname,
        },
    };

    res.status(200).send(responseData);

    return next();

}
