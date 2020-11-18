/**
 * Catch all (*) configuration.
 *
 * @module cloudmailer-app
 * @license BSD-2-Clause
 * @copyright Mat. 2020
 */




import {
    Express,
    Request,
    Router as ExpressRouter,
    Response,
    NextFunction,
} from "express";
import { dict } from "@xcmats/js-toolbox/struct";
import { isArray } from "@xcmats/js-toolbox/type";
import {
    useMemory,
    share,
} from "@xcmats/js-toolbox/memory";
import { parse } from "url";




// type definitions for some express.js internals
interface Route {
    path: string;
    methods: Record<string, string>;
}
interface Layer {
    route: Route;
}
interface Router extends ExpressRouter {
    stack: Array<Layer>;
}
interface ExpressApp extends Express {
    _router: Router;
}




/**
 * Catch all route configuration.
 */
export default function configureCatchall (): void {

    const

        // shared application objects
        { app } = useMemory<{ app: ExpressApp }>(),

        // routes (pathnames with trailing slashes) and their allowed methods
        routes: Record<string, string[]> = dict(
            app._router.stack
                // find layer with routes
                .filter(l => l.route)
                // extract paths and methods from routes
                .map<[string, string[]]>(l => [
                    l.route.path.endsWith("/") ?
                        l.route.path : `${l.route.path}/`,
                    Object.keys(l.route.methods)
                        .map(m => m.toUpperCase()),
                ])
                // append "HEAD" method to all routes with "GET" method
                .map<[string, string[]]>(([p, m]) =>
                    [p, m.concat(m.find(v => v === "GET") ? ["HEAD"] : [])]
                )
                // sort by path
                .sort(([a, _1], [b, _2]) => a.localeCompare(b))
        );


    // share catchall-specific variables
    share({ routes });


    // catch-all (404)
    app.use("*", (req: Request, res: Response, next: NextFunction) => {
        if (!res.headersSent) {
            if (req.method !== "OPTIONS") {
                res.status(404).send({ error: "not found" });
            } else {
                let originalPath = parse(req.originalUrl).pathname;
                if (!originalPath) {
                    res.status(500).end();
                    return next("internal server error");
                }
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
