import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const script = readFileSync(new URL('../dist/theme.js', import.meta.url), 'utf8');
function browser({stored = null, dark = false, blocked = false, legacy = false, noMedia = false} = {}) {
  const root = {dataset: {}}, listeners = {}, windowEvents = {}, choiceEvents = {};
  const status = {textContent: ''}, writes = [];
  const select = {disabled: true, value: 'system', dataset: {systemStatus: 'System: {0}', storageNotice: 'Cannot save.'},
    querySelector: selector => ({textContent: selector.includes('dark') ? 'Dark' : 'Light'}),
    addEventListener: (event, fn) => choiceEvents[event] = fn};
  let mediaListener;
  const media = {matches: dark};
  media[legacy ? 'addListener' : 'addEventListener'] = (...args) => mediaListener = args.at(-1);
  const document = {documentElement: root, querySelector: id => id === '#theme-select' ? select : status,
    addEventListener: (event, fn) => listeners[event] = fn};
  const window = {addEventListener: (event, fn) => windowEvents[event] = fn};
  if (!noMedia) window.matchMedia = () => media;
  const localStorage = {getItem: () => {if (blocked) throw Error('blocked'); return stored;},
    setItem: (key, value) => {if (blocked) throw Error('blocked'); writes.push([key, value]);}};
  vm.runInNewContext(script, {document, window, localStorage});
  const initial = {...root.dataset};
  listeners.DOMContentLoaded();
  return {root, select, status, writes, initial,
    choose(value) {select.value = value; choiceEvents.change();},
    system(value) {media.matches = value; mediaListener?.();},
    storage(value, key = 'ada-theme-v1') {windowEvents.storage({key, newValue: value});}};
}
for (const dark of [false, true]) {
  const b = browser({dark});
  assert.equal(b.initial.theme, dark ? 'dark' : 'light', 'System resolved before controls load');
  assert.equal(b.select.value, 'system'); assert.equal(b.select.disabled, false);
  b.system(!dark); assert.equal(b.root.dataset.theme, dark ? 'light' : 'dark');
  assert.equal(b.writes.length, 0, 'System detection does not overwrite preference');
}
for (const stored of ['light', 'dark']) {
  const b = browser({stored, dark: stored === 'light'});
  assert.equal(b.initial.theme, stored); assert.equal(b.select.value, stored);
  b.system(stored === 'dark'); assert.equal(b.root.dataset.theme, stored, 'Explicit mode survives system changes');
}
const b = browser({dark: true});
b.choose('light'); assert.equal(b.root.dataset.theme, 'light');
assert.deepEqual(b.writes.at(-1), ['ada-theme-v1', 'light']);
b.choose('dark'); assert.equal(b.root.dataset.theme, 'dark');
b.choose('system'); b.system(false); assert.equal(b.root.dataset.theme, 'light');
assert.match(b.status.textContent, /System: Light/);
b.storage('dark'); assert.equal(b.select.value, 'dark'); assert.equal(b.root.dataset.theme, 'dark');
b.storage('light', 'unrelated'); assert.equal(b.root.dataset.theme, 'dark');
b.storage(null, null); assert.equal(b.select.value, 'system'); assert.equal(b.root.dataset.theme, 'light');
assert.equal(browser({stored: 'invalid', dark: true}).root.dataset.theme, 'dark');
const restricted = browser({blocked: true, dark: true});
restricted.choose('light'); assert.equal(restricted.root.dataset.theme, 'light');
assert.match(restricted.status.textContent, /Cannot save/);
const old = browser({legacy: true}); old.system(true); assert.equal(old.root.dataset.theme, 'dark');
assert.equal(browser({noMedia: true}).root.dataset.theme, 'light');
console.log('PASS: initial appearance, three modes, persistence, system changes, cross-tab sync, blocked storage and legacy fallback.');
