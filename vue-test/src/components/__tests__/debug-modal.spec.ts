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
})

function mountAntd(Component: any, props: Record<string, any> = {}, children: any = null) {
  const VueComp = defineComponent(Component as any)
  const TestComponent = defineComponent(() => {
    if (children !== null) {
      return createElement(VueComp, props, children)
    }
    return createElement(VueComp, props)
  })
  return mount(TestComponent)
}

describe('debug Modal', () => {
  it('Modal teleport', () => {
    const wrapper = mountAntd(antd.Modal, {open: true, title: 'Modal Title', children: 'Modal Content'})
    console.log('=== wrapper.html() ===')
    console.log(wrapper.html())
    console.log('=== document.body.innerHTML ===')
    console.log(document.body.innerHTML)
    // Check if modal content is in document.body
    const modalRoot = document.querySelector('.ant-modal')
    console.log('=== modal in document.body ===', !!modalRoot)
    if (modalRoot) {
      console.log('modalRoot.innerHTML:', modalRoot.innerHTML.substring(0, 200))
    }
  })
})