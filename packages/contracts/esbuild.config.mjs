import { build } from "esbuild";

await build({
  bundle: true,
  entryNames: "[dir]/[name]",
  entryPoints: [
    "./src/index.ts",
    "./src/critique.ts",
    "./src/style-cards.ts",
    "./src/print-specs.ts",
    "./src/api/connectionTest.ts",
    "./src/api/taste-profile.ts",
    "./src/api/orbit.ts",
    "./src/api/finalize.ts",
    "./src/api/providerModels.ts",
    "./src/api/research.ts",
  ],
  format: "esm",
  outbase: "./src",
  outdir: "./dist",
  outExtension: { ".js": ".mjs" },
  packages: "external",
  platform: "node",
  target: "node24",
});
