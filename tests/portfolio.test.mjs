import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import test from 'node:test';
import ts from 'typescript';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

// Exercise the real components without adding a browser or test-only production exports.
const page = readFileSync(new URL('../app/page.tsx', import.meta.url), 'utf8');
const compiled = ts.transpileModule(`${page}\nexport { PixelCharacter, QuickPortfolio };`, {
  compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText.replace(/from "([^"]+)"/g, (_, name) => `from "${import.meta.resolve(name)}"`);
const { default: Home, PixelCharacter, QuickPortfolio } = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);

test('all character assets remain mounted across idle, walking, dash and direction changes', () => {
  let expected;
  for (const mode of ['idle', 'walk', 'dash']) {
    for (const direction of [-1, 1]) {
      const html = renderToStaticMarkup(createElement(PixelCharacter, { mode, direction }));
      const sources = [...html.matchAll(/<img[^>]*src="([^"]+)"/g)].map((match) => match[1]);
      assert.equal(sources.length, 6);
      expected ??= sources;
      assert.deepEqual(sources, expected);
      for (const src of sources) assert.ok(existsSync(new URL(`../public${src}`, import.meta.url)), src);
      assert.match(html, /knight-sprite-fallback[^>]*data-active="true"/);
      assert.equal((html.match(/data-active="true"/g) ?? []).length, 1);
    }
  }
});

test('GIF character never inherits the obsolete alternating-opacity animation', () => {
  const css = readFileSync(new URL('../app/globals.css', import.meta.url), 'utf8');
  assert.doesNotMatch(css, /knight-stride|knight-sprite-primary|knight-sprite-alternate/);
  assert.match(css, /\.knight-sprite\s*\{\s*animation: none; transition: none;/);
  assert.doesNotMatch(css, /\.knight-sprite-animated\s*\{ visibility: hidden !important;/);
});

test('every exploration section has a focusable reading panel and hidden scenes are inert', () => {
  const html = renderToStaticMarkup(createElement(Home));
  assert.equal((html.match(/class="scene-panel [^"]*panel-scroll" tabindex="0"/g) ?? []).length, 10);
  assert.equal((html.match(/aria-hidden="true" inert=""/g) ?? []).length, 9);
  assert.match(html, /Skip to reading view/);
});

test('reading view exposes every case study and its navigation destinations', () => {
  const html = renderToStaticMarkup(createElement(QuickPortfolio, { onExplore() {} }));
  for (const id of ['selected-work', 'skill-tree', 'career-map', 'current-quest', 'quick-contact', 'case-renewables', 'case-selah', 'case-ifgf-planner', 'case-dcim-platform']) {
    assert.ok(html.includes(`id="${id}"`), id);
  }
  assert.match(html, /BUILD WITH PURPOSE/);
  assert.match(html, /ENGINEERING EXPERTISE/);
});

test('project references use supplied destinations and preserve existing Church Planner links', () => {
  const html = renderToStaticMarkup(createElement(QuickPortfolio, { onExplore() {} }));
  for (const href of ['http://selah.cubelated.com/', 'https://planner.ifgftaichung.dpdns.org/', 'https://github.com/cubelated/ifgf-planner', 'https://hostinginside.com/']) {
    assert.ok(html.includes(`href="${href}"`), href);
  }
  assert.match(html, /Organizational Scheduling and Dashboard/);
  assert.match(html, /Company reference only/);
  assert.match(html, /id="case-ifgf-planner"/);
});


test('project website previews are embedded beside the information', () => {
  const html = renderToStaticMarkup(createElement(QuickPortfolio, { onExplore() {} }));
  assert.equal((html.match(/<iframe /g) ?? []).length, 3);
  assert.match(html, /HostingInside company website preview/);
  assert.match(html, /src="https:\/\/selah.cubelated.com\/"/);
});
