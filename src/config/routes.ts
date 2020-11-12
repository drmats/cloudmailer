/**
 * Routes configuration.
 *
 * @module cloudmailer-app
 * @license BSD-2-Clause
 * @copyright Mat. 2020
 */




import { useMemory } from "../lib/memory";
import { apiV1 } from "./env";

import sendMail from "../actions/send_mail";




/**
 * Routes configuration.
 */
export default function configureRoutes (): void {

    // shared application objects
    const { app } = useMemory();


    // send e-mail
    app.post(`${apiV1}/send/`, sendMail);

}
