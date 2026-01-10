import defineConfig from "es-pkg";

export default defineConfig({
    "es": "./npm/esm",
    "cjs": "./npm/cjs",
    "typings": "./src",
    "publishDir": "./npm",
    include: ["./index.ts", "./jsx.runtime.ts", "./react-router.ts"]
})