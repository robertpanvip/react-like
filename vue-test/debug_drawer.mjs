// Quick check what Drawer renders in isolation
import { mount } from '@vue/test-utils';
import { defineComponent, createElement, resetReactScheduler } from '@react-like/vue';
import { Drawer } from 'antd';

// Polyfill
if (typeof window !== 'undefined') {
  window.matchMedia = window.matchMedia || function(q) { return { matches: false, media: q, addListener: () => {}, removeListener: () => {}, addEventListener: () => {}, removeEventListener: () => {}, dispatchEvent: () => false }; };
  window.getComputedStyle = window.getComputedStyle || function() { return { getPropertyValue: () => '' }; };
  if (!window.ResizeObserver) window.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} };
  if (!window.Element.prototype.getBoundingClientRect) window.Element.prototype.getBoundingClientRect = function() { return { top: 0, left: 0, bottom: 0, right: 0, width: 0, height: 0, x: 0, y: 0 }; };
}

const VueComp = defineComponent(Drawer);
const TestComponent = defineComponent(() => {
  return createElement(VueComp, { open: true, title: 'Drawer Title', getContainer: false, children: 'Drawer Content' });
});

try {
  const wrapper = mount(TestComponent);
  console.log('Drawer HTML:', wrapper.html().substring(0, 500));
  console.log('.ant-drawer exists:', wrapper.find('.ant-drawer').exists());
  console.log('.ant-drawer-title text:', wrapper.find('.ant-drawer-title').text());
  wrapper.unmount();
} catch(e) {
  console.error('Drawer mount error:', e.message);
}

resetReactScheduler();