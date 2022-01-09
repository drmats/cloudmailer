"use strict";




// ...
var

    conf = {
        presets: [
            [
                "@babel/preset-env",
                {
                    exclude: [
                        "transform-async-to-generator",
                        "transform-regenerator",
                    ],
                    modules: "commonjs",
                    targets: {
                        node: "14.0.0",
                    },
                    useBuiltIns: false,
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
