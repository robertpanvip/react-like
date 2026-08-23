/**
 * 调试 Modal 组件 teleport 问题的专用测试文件
 */
import {describe, it, expect, beforeAll} from 'vitest'
import {mount} from '@vue/test-utils'
import {defineComponent, createElement} from '@react-like/vue'
import * as antd from 'antd'

beforeAll(() => {
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
})

function mountAntd(
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
  return mount(TestComponent, {attachTo: document.body})
}

describe('debug Modal', () => {
  it('Modal teleport', async () => {
    const wrapper = mountAntd(antd.Modal, {open: true, title: 'Modal Title', children: 'Modal Content'})
    await new Promise(r => setTimeout(r, 100))
    console.log('=== wrapper.html() ===')
    console.log(wrapper.html())
    console.log('=== document.body.innerHTML ===')
    console.log(document.body.innerHTML)
    const modalRoot = document.querySelector('.ant-modal')
    console.log('=== modal in document.body ===', !!modalRoot)
    if (modalRoot) {
      console.log('=== modal outerHTML ===')
      console.log(modalRoot.outerHTML)
    }
    // 列出所有 ant-modal 相关元素
    const allModals = document.querySelectorAll('[class*="ant-modal"]')
    console.log('=== all [class*=ant-modal] elements ===', allModals.length)
    allModals.forEach((el, i) => {
      console.log(`  [${i}]`, el.className, el.outerHTML?.substring(0, 200))
    })
    expect(true).toBe(true)
  })
})