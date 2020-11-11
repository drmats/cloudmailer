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
 * @returns memory object
 */
const memory = lazyish({});




/**
 * Invoke function argument with a reference to shared memory.
 *
 * @function useMemory
 * @param f function to invoke on a shared memory
 * @returns {*}
 */
export function useMemory<T> (f: (x: T) => T = identity): T {
    return f(memory() as T);
}




/**
 * Extend shared memory with keys from provided extension object.
 * It throws when shared memory already have those keys.
 *
 * @function share
 * @param ext extension object
 * @returns extended memory object
 */
export const share = (
    ext: Record<string, unknown>
): Record<string, unknown> =>
    useMemory(ctx => {
        const overlap = intersection(
            Object.keys(ctx), Object.keys(ext)
        ) as string[];
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
