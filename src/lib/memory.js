/**
 * Shared memory.
 *
 * @module memory
 * @license BSD-2-Clause
 * @copyright Mat. 2020
 */




import { intersection } from "@xcmats/js-toolbox/array";
import {
    identity,
    lazyish,
} from "@xcmats/js-toolbox/func";
import {
    quote,
    space,
} from "@xcmats/js-toolbox/string";




/**
 * Application logic shared memory structure.
 *
 * @function memory
 * @returns {Object}
 */
const memory = lazyish({});




/**
 * Invoke function argument with a reference to shared memory.
 *
 * @function useMemory
 * @param {Function} [f]
 * @return {*}
*/
export const useMemory = (f = identity) => f(memory());




/**
 * Extend shared memory with keys from provided extension object.
 * It throws when shared memory already have those keys.
 *
 * @function share
 * @param {Object} ext
 * @returns {Object}
 */
export const share = ext => useMemory(ctx => {
    let overlap = intersection(Object.keys(ctx), Object.keys(ext));
    if (overlap.length === 0) {
        Object.assign(ctx, ext);
    } else {
        throw new Error([
            "conflicting keys:",
            overlap.map(x => quote(x)).join(", "),
        ].join(space()));
    }
    return ctx;
});
