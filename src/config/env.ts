/**
 * Environment variables.
 *
 * @module cloudmailer-app
 * @license BSD-2-Clause
 * @copyright Mat. 2020
 */




import { publicPath } from "../../package.json";




/**
 * @constant {String} rootPath Path prefix
 */
export const rootPath = publicPath;




/**
 * @constant {String} apiRoot Root for all REST API paths.
 */
export const apiRoot = `${rootPath}api`;




/**
 * @constant {String} apiV1 Where to send all queries?
 */
export const apiV1 = `${apiRoot}/v1`;




/**
 * @constant {Number} maxSubjectLength Maximum length of e-mail subject.
 */
export const maxSubjectLength = 128;




/**
 * @constant {Number} maxBodyLength Maximum length of e-mail body text.
 */
export const maxBodyLength = 65536;
