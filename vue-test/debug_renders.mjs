// Debug: check what antd v6 actually renders for each component
import { mount } from '@vue/test-utils';
import { defineComponent, createElement, resetReactScheduler } from '@react-like/vue';
import * as antd from 'antd';

// Polyfill
if (typeof window !== 'undefined') {
  if (!window.matchMedia) {
    window.matchMedia = q => ({ matches: false, media: q, addListener: () => {}, removeListener: () => {}, addEventListener: () => {}, removeEventListener: () => {}, dispatchEvent: () => false });
  }
  if (!window.getComputedStyle) window.getComputedStyle = function() { return { getPropertyValue: () => '' }; };
  if (!window.ResizeObserver) window.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} };
  if (!window.Element.prototype.getBoundingClientRect) window.Element.prototype.getBoundingClientRect = function() { return { top: 0, left: 0, bottom: 0, right: 0, width: 0, height: 0, x: 0, y: 0 }; };
}

function mountAntd(Component, props = {}, children = null) {
  const VueComp = defineComponent(Component);
  const TestComponent = defineComponent(() => {
    if (children !== null) return createElement(VueComp, props, children);
    return createElement(VueComp, props);
  });
  return mount(TestComponent);
}

// Test Drawer
try {
  const dw = mountAntd(antd.Drawer, { open: true, title: 'Test', getContainer: false, children: 'Content' });
  console.log('=== Drawer HTML ===');
  console.log(dw.html().substring(0, 1000));
  dw.unmount();
} catch(e) { console.log('Drawer error:', e.message); }

resetReactScheduler();
document.body.innerHTML = '';

// Test Tooltip
try {
  const tt = mountAntd(antd.Tooltip, { title: 'Tooltip' }, 'Hover');
  console.log('\n=== Tooltip HTML ===');
  console.log(tt.html().substring(0, 1000));
  tt.unmount();
} catch(e) { console.log('Tooltip error:', e.message); }

resetReactScheduler();
document.body.innerHTML = '';

// Test Tree
try {
  const tree = mountAntd(antd.Tree, { treeData: [{ title: 'Node 1', key: '1' }] });
  console.log('\n=== Tree HTML ===');
  console.log(tree.html().substring(0, 1000));
  tree.unmount();
} catch(e) { console.log('Tree error:', e.message); }

resetReactScheduler();
document.body.innerHTML = '';

// Test Timeline
try {
  const tl = mountAntd(antd.Timeline, { items: [{ children: 'Event 1' }, { children: 'Event 2' }] });
  console.log('\n=== Timeline HTML ===');
  console.log(tl.html().substring(0, 1000));
  tl.unmount();
} catch(e) { console.log('Timeline error:', e.message); }

resetReactScheduler();
document.body.innerHTML = '';

// Test Carousel
try {
  const car = mountAntd(antd.Carousel, null, ['Slide 1', 'Slide 2']);
  console.log('\n=== Carousel HTML ===');
  console.log(car.html().substring(0, 1000));
  car.unmount();
} catch(e) { console.log('Carousel error:', e.message); }