/**
 * Headers configuration.
 *
 * @module cloudmailer-app
 * @license BSD-2-Clause
 * @copyright Mat. 2020
 */




import { useMemory } from "../index";
import {
    name as applicationName,
    version,
} from "../../package.json";




/**
 * Headers configuration.
 */
export default function configureHeaders (): void {

    const { app } = useMemory();

    app.use((req, res, next) => {

        if (req.method === "OPTIONS") {
            res.header({ "Access-Control-Max-Age": 1209600 });
        }

        res.header({
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": [
                "Accept",
                "Cache-Control",
                "Content-Type",
                "DNT",
                "If-Modified-Since",
                "Origin",
                "Range",
                "User-Agent",
                "X-Requested-With",
            ].join(", "),
            "Access-Control-Allow-Methods": "HEAD, GET, OPTIONS, POST",
            "Access-Control-Expose-Headers": [
                "Cache-Control",
                "Content-Language",
                "Content-Length",
                "Content-Type",
                "Expires",
                "Last-Modified",
                "Pragma",
            ].join(", "),
            "X-Powered-By": `${applicationName}/${version}`,
        });

        return next();

    });

}
