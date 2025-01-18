/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */

const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
   mode: "production",
   context: path.resolve(__dirname, "../src"),
   entry: {
      background: path.resolve(__dirname, "../src/js", "background.ts"),
      filters: path.resolve(__dirname, "../src/js", "filters.ts"),
      popup: path.resolve(__dirname, "../src/js", "popup.ts"),
      svgGenerator: path.resolve(__dirname, "../src/js", "svg-generator.ts"),
      filterDefs: path.resolve(__dirname, "../src/js", "filter-defs.ts"),
   },
   output: {
      path: path.join(__dirname, "../../../dist/firefox"),
      filename: "js/[name].js",
   },
   resolve: {
      extensions: [".ts", ".js"],
   },
   module: {
      rules: [
         {
            test: /\.tsx?$/,
            loader: "ts-loader",
            exclude: /node_modules/,
         },
      ],
   },
   plugins: [
      new CopyPlugin({
         patterns: [
            {from: ".", to: "./img", context: "img"},
            {from: ".", to: "./css", context: "css"},
            {from: "./*.html", to: "."},
            {from: "./*.json", to: "."},
         ]
      }),
   ],
};