import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import nodePolyfills from "rollup-plugin-polyfill-node";
import json from "@rollup/plugin-json";
import { babel } from "@rollup/plugin-babel";
import autoExternal from "rollup-plugin-auto-external";
import bundleSize from "rollup-plugin-bundle-size";
import { terser } from "rollup-plugin-terser";
import path from "path";

const name = "translate";

const namedInput = "./index.ts";
const defaultInput = "./lib/core/translate.ts";

const pkg = require("./package.json");

const tsPlugins = [
    typescript({
        tslib: require.resolve("tslib")
    }),
    nodePolyfills({ include: ["http*", "buffer*"] })
];

const buildConfig = ({ es5, browser = true, minifiedVersion = true, ...config }) => {
    const { file } = config.output;
    const ext = path.extname(file);
    const basename = path.basename(file, ext);
    const extArr = ext.split(".");
    extArr.shift();

    const build = ({ minified }) => ({
        input: namedInput,
        ...config,
        output: {
            ...config.output,
            file: `${path.dirname(file)}/${basename}.${(minified
                ? ["min", ...extArr]
                : extArr
            ).join(".")}`
        },
        plugins: [
            ...tsPlugins,
            json(),
            resolve({ browser }),
            commonjs(),
            minified && terser(),
            minified && bundleSize(),
            ...(es5
                ? [
                      babel({
                          babelHelpers: "bundled",
                          presets: ["@babel/preset-env"]
                      })
                  ]
                : []),
            ...(config.plugins || [])
        ]
    });

    const configs = [build({ minified: false })];

    if (minifiedVersion) {
        configs.push(build({ minified: true }));
    }

    return configs;
};

export default async () => {
    const banner = `// @space-chart/translate  v${
        pkg.version
    } Copyright (c) ${new Date().getFullYear()} ${pkg.author} and contributors`;

    return [
        // browser ESM bundle for CDN
        ...buildConfig({
            input: namedInput,
            output: {
                file: `dist/esm/${name}.js`,
                format: "esm",
                preferConst: true,
                exports: "named",
                banner
            }
        }),

        // Browser UMD bundle for CDN
        ...buildConfig({
            input: defaultInput,
            es5: true,
            output: {
                file: `dist/${name}.js`,
                name,
                format: "umd",
                exports: "default",
                banner
            }
        }),

        // Browser CJS bundle
        ...buildConfig({
            input: defaultInput,
            es5: false,
            minifiedVersion: false,
            output: {
                file: `dist/browser/${name}.cjs`,
                name,
                format: "cjs",
                exports: "default",
                banner
            }
        }),

        // Node.js commonjs bundle
        {
            input: defaultInput,
            output: {
                file: `dist/node/${name}.cjs`,
                format: "cjs",
                preferConst: true,
                exports: "default",
                banner
            },
            plugins: [...tsPlugins, autoExternal(), resolve(), commonjs()]
        }
    ];
};
