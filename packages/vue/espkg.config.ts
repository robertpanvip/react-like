import defineConfig from "es-pkg";

export default defineConfig({
    "es": "./npm",
    "cjs": false,
    "typings": "./src",
    "publishDir": "./npm",
    include: ["./index.ts", "./jsx-runtime.ts", "./react-router.ts","./react-dom.ts","./client.ts",]
})