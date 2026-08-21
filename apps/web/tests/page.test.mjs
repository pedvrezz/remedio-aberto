import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");

test("homepage is honest about dataset status", () => {
  assert.match(page, /nenhuma fonte regulatória foi integrada/i);
  assert.match(page, /Ainda não há dados importados/);
});

test("homepage includes medical disclaimer", () => {
  assert.match(page, /não substitui orientação de profissionais de saúde/i);
});
