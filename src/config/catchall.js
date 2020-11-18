/**
 * Catch all (*) configuration.
 *
 * @module cloudmailer-app
 * @license BSD-2-Clause
 * @copyright Mat. 2020
 */




import { dict } from "@xcmats/js-toolbox/struct";
import { isArray } from "@xcmats/js-toolbox/type";
import {
    useMemory,
    share,
} from "@xcmats/js-toolbox/memory";
import { parse } from "url";




/**
 * Catch all route configuration.
 */
export default function configureCatchall () {

    const

        // shared application objects
        { app } = useMemory(),

        // routes with allowed methods (pathnames with trailing slashes)
        routes = dict(
            app._router.stack
                .filter(l => l.route)
                .map(l => [
                    l.route.path.endsWith("/") ?
                        l.route.path : `${l.route.path}/`,
                    Object.keys(l.route.methods)
                        .map(m => m.toUpperCase()),
                ])
                .map(([p, m]) =>
                    [p, m.concat(m.find(v => v === "GET") ? ["HEAD"] : [])]
                )
                .sort(([a, _1], [b, _2]) => a.localeCompare(b))
        );


    // share catchall-specific variables
    share({ routes });


    // catch-all (404)
    app.use("*", (req, res, next) => {
        if (!res.headersSent) {
            if (req.method !== "OPTIONS") {
                res.status(404).send({ error: "not found" });
            } else {
                let originalPath = parse(req.originalUrl).pathname;
                if (!originalPath.endsWith("/")) originalPath += "/";
                if (isArray(routes[originalPath])) {
                    res.header({ "Allow": routes[originalPath].join(",") });
                    res.status(204).end();
                } else {
                    res.status(204).end();
                }
            }
        }
        return next();
    });

}
