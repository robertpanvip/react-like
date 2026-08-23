/**
 * 共享测试环境配置
 * - jsdom polyfill (matchMedia, ResizeObserver, getBoundingClientRect)
 * - mountAntd 辅助函数
 */
import {mount} from '@vue/test-utils'
import {defineComponent, createElement, resetReactScheduler} from '@react-like/vue'

/* ===================== jsdom 环境 polyfill ===================== */
// @ts-ignore
window.matchMedia = window.matchMedia || function matchMediaMock(query: string) {
  return {
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }
}
// @ts-ignore
window.getComputedStyle = window.getComputedStyle || function getComputedStyleMock() {
  return { getPropertyValue: () => '' }
}
// @ts-ignore
if (typeof window.ResizeObserver === 'undefined') {
  // @ts-ignore
  window.ResizeObserver = class ResizeObserverMock {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
}
// @ts-ignore
if (typeof window.Element.prototype.getBoundingClientRect === 'undefined') {
  // @ts-ignore
  window.Element.prototype.getBoundingClientRect = function() {
    return { top: 0, left: 0, bottom: 0, right: 0, width: 0, height: 0, x: 0, y: 0 }
  }
}

/* ===================== mountAntd 辅助函数 ===================== */
let currentWrapper: any = null

export function mountAntd(
  Component: any,
  props: Record<string, any> = {},
  children: any = null,
) {
  const VueComp = defineComponent(Component as any)
  const TestComponent = defineComponent(() => {
    if (children !== null) {
      return createElement(VueComp, props, children)
    }
    return createElement(VueComp, props)
  })
  currentWrapper = mount(TestComponent)
  return currentWrapper
}

export function getCurrentWrapper() {
  return currentWrapper
}

export function cleanup() {
  if (currentWrapper) {
    try { currentWrapper.unmount() } catch (e) {}
    currentWrapper = null
  }
  document.body.innerHTML = ''
}