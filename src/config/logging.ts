/**
 * Logging configuration.
 *
 * @module cloudmailer-app
 * @license BSD-2-Clause
 * @copyright Mat. 2020
 */



import type {
    Request,
    Response,
    NextFunction,
} from "express";
import type { JSAnyFun } from "@xcmats/js-toolbox/type";
import chalk from "chalk";
import { share } from "mem-box";
import { useMemory } from "../index";




/**
 * Extended console.
 */
interface ExtendedConsole extends Console {
    ok: JSAnyFun;
    err: JSAnyFun;
}




/**
 * Logging configuration.
 */
export default function configureLogging (): void {

    const

        // shared application objects
        { app } = useMemory(),

        // console logger
        logger = {
            // eslint-disable-next-line no-console
            ...console,
            ok: (...text: unknown[]) =>
                // eslint-disable-next-line no-console
                console.info(...text.map(txt => chalk.green(txt))),
            err: (...text: unknown[]) =>
                // eslint-disable-next-line no-console
                console.error(...text.map(txt => chalk.red(txt))),
            warn: (...text: unknown[]) =>
                // eslint-disable-next-line no-console
                console.warn(...text.map(txt => chalk.yellow(txt))),
            info: (...text: unknown[]) =>
                // eslint-disable-next-line no-console
                console.info(...[
                    chalk.gray((new Date()).toISOString()), ...text,
                ]),
        };


    // share logger-specific variables
    share({ logger });


    // simple request logger
    app.use((req, res, next) => {

        // don't log successful cors preflight checks
        if (req.method !== "OPTIONS"  ||  res.statusCode !== 204) {

            logger.info(
                req.ip, chalk.gray(req.method), req.url,
                (
                    res.statusCode < 400 ? chalk.green : chalk.red
                )(res.statusCode)
            );

        }

        // oops...
        if (!res.headersSent) { next(new Error("panic!")); }

    });


    // simple error handler/logger
    app.use((
        error: Error, req: Request, res: Response, _next: NextFunction
    ) => {

        if (res.headersSent) {

            logger.info(
                chalk.red(req.ip),
                chalk.gray(req.method), req.url,
                chalk.red(res.statusCode)
            );

        } else {

            res.status(500).send({ error: error.toString() });

            logger.info(
                chalk.red(req.ip),
                chalk.gray(req.method), req.url,
                chalk.red(500), chalk.red("!")
            );

            logger.err(error.toString());

        }

    });

}




/**
 * Shared memory type augmentation.
 */
declare global {
    interface Ctx {
        logger: ExtendedConsole;
    }
}
