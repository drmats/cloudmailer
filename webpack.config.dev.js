"use strict";




// ...
const
    { realpathSync } = require("fs"),
    { resolve } = require("path"),
    webpack = require("webpack"),
    MinifyPlugin = require("terser-webpack-plugin"),
    nodeExternals = require("webpack-node-externals"),
    appDirectory = realpathSync(process.cwd());




// ...
module.exports = {

    mode: "development",


    target: "node",


    resolve: {
        extensions: [".ts", ".js"],
    },


    externals: [nodeExternals({
        allowlist: [
            /@babel\/runtime(\/.*)?/,
            /@xcmats\/js-toolbox(\/.*)?/,
        ],
    })],


    entry: {
        "cloudmailer": resolve(appDirectory, "src/index.js"),
    },


    output: {
        chunkFilename: "[name].c.js",
        filename: "[name].js",
        globalObject: "this",
        libraryTarget: "commonjs",
        path: resolve(__dirname, "./dist"),
    },


    optimization: {
        concatenateModules: true,
        mergeDuplicateChunks: true,
        minimize: true,
        minimizer: [
            new MinifyPlugin({
                terserOptions: {
                    output: {
                        comments: false,
                    },
                },
                extractComments: false,
            }),
        ],
        chunkIds: "total-size",
        moduleIds: "size",
        providedExports: true,
        removeAvailableModules: true,
        removeEmptyChunks: true,
        sideEffects: true,
    },


    module: {
        rules: [
            {
                enforce: "pre",
                test: /\.(js|ts)$/,
                exclude: /node_modules/,
                loader: "eslint-loader",
            },
            {
                test: /\.(js|ts)$/,
                exclude: /node_modules/,
                loader: "babel-loader",
                sideEffects: true,
            },
        ],
    },


    node: {
        __dirname: false,
        __filename: false,
    },


    plugins: [
        new webpack.DefinePlugin({
            "process.env.BABEL_ENV": JSON.stringify("development"),
        }),
    ],

};
