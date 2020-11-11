/**
 * Various utilities.
 *
 * @module utils
 * @license BSD-2-Clause
 * @copyright Mat. 2020
 */




import { promises } from "fs";




/**
 * Read file and parse it as a JSON object.
 *
 * @function readJSON
 * @param path file
 * @returns parsed object
 */
export const readJSON = async (
    path: string
): Promise<Record<string, unknown>> =>
    JSON.parse(
        (await promises.readFile(path)).toString("utf8")
    );
