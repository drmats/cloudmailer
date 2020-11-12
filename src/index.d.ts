/**
 * Interface extensions and custom type definitions.
 *
 * @module cloudmailer-app
 * @license BSD-2-Clause
 * @copyright Mat. 2020
 */




// app-specific express namespace declaration merging
declare namespace Express {

    // request object type extension
    interface Request {
        xhostname?: string;
    }

}
