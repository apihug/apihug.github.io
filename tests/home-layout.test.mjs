import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const heroSource = readFileSync(new URL("../src/components/home/hero.tsx", import.meta.url), "utf8");
const logoSource = readFileSync(new URL("../src/components/logo.tsx", import.meta.url), "utf8");

test("quick start desktop shell stays half-width to align with the proto panel", () => {
  assert.match(heroSource, /rounded-xl bg-gray-950 p-1[^"\n]*lg:w-1\/2/);
});

test("desktop logo tagline bottom-aligns with the mark", () => {
  assert.match(logoSource, /hidden items-end gap-3 md:flex/);
});
