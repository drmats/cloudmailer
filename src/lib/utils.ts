/**
 * Various utilities.
 *
 * @module utils
 * @license BSD-2-Clause
 * @copyright Mat. 2020
 */




import { promises } from "fs";
import { ap } from "@xcmats/js-toolbox/async";
import { flow } from "@xcmats/js-toolbox/func";
import { bytesToString } from "@xcmats/js-toolbox/codec";




/**
 * Read file and parse it as a JSON object.
 *
 * @function readJSON
 * @param path file
 * @returns parsed object
 */
export const readJSON: (
    arg: string,
) => Promise<Record<string, unknown>> =
    flow(
        promises.readFile,
        ap(bytesToString),
        ap(JSON.parse),
    );
