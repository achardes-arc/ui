import { readFileSync, readdirSync } from 'node:fs';
import assert from 'node:assert/strict';
const css = readFileSync(new URL('../src/style.css', import.meta.url), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
assert(!/#[\da-f]{3,8}\b|(?:rgb|hsl|oklch)\(/i.test(css), 'Use design-system color tokens');
assert(!/--ar-[\w-]+\s*:/.test(css), 'Do not redefine design-system tokens');
for (const match of css.matchAll(/border-radius\s*:\s*([^;}]+)/g)) assert(/^(0|0px)$/.test(match[1].trim()), 'Corners must remain square');
for (const match of css.matchAll(/(?:^|[{}])\s*([^{}]+)\{/g)) {
  if (match[1].trim().startsWith('@')) continue;
  for (const selector of match[1].split(',')) assert(selector.trim().startsWith('.ar-'), `Unscoped selector: ${selector}`);
}
for (const name of readdirSync(new URL('../src/components/', import.meta.url))) {
  const content = readFileSync(new URL(`../src/components/${name}`, import.meta.url), 'utf8');
  assert(!/v-html\b/.test(content), `Raw HTML is not accepted by ${name}`);
}
console.log('Style contract passed: scoped additions, shared tokens, square corners, no raw HTML.');
