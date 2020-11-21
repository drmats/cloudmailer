/**
 * Routes configuration.
 *
 * @module cloudmailer-app
 * @license BSD-2-Clause
 * @copyright Mat. 2020
 */




import { useMemory } from "../index";
import { apiV1 } from "./env";

import hello from "../actions/hello";
import sendMail from "../actions/send_mail";




/**
 * Routes configuration.
 */
export default function configureRoutes (): void {

    const { app, authOriginMw } = useMemory();

    // "hello world" route
    app.get(`${apiV1}/`, hello);

    // send e-mail
    app.post(`${apiV1}/send/`, authOriginMw, sendMail);

}
