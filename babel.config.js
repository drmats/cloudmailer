"use strict";




// ...
var

    runtimeVersion = require(
        "./package.json",
    ).dependencies["@babel/runtime-corejs3"],

    conf = {
        plugins: [
            "@babel/plugin-proposal-class-properties",
            [
                "@babel/plugin-transform-runtime",
                {
                    absoluteRuntime: false,
                    helpers: true,
                    corejs: 3,
                    version: runtimeVersion,
                },
            ],
        ],
        presets: [
            [
                "@babel/preset-env",
                {
                    modules: "commonjs",
                    useBuiltIns: false,
                    targets: {
                        node: "12.0.0",
                    },
                },
            ],
            [
                "@babel/preset-typescript",
            ],
        ],
        comments: false,
        shouldPrintComment: () => false,
    };




// configuration
module.exports = function (api) {
    api.cache.using(() => process.env.BABEL_ENV);

    return {

        env: {

            // production environment
            production: conf,

            // development environment
            development: conf,

        },

    };
};
