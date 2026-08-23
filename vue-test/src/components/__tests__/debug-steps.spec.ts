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

describe('debug Steps', () => {
  it('Steps renders', () => {
    const items = [
      {title: 'Step 1', content: 'Description 1'},
      {title: 'Step 2', content: 'Description 2'},
      {title: 'Step 3'},
    ]
    const VueComp = defineComponent(antd.Steps as any)
    const TestComponent = defineComponent(() => {
      return createElement(VueComp, {current: 1, items})
    })
    const wrapper = mount(TestComponent)
    console.log('=== Steps HTML ===')
    console.log(wrapper.html())
    console.log('=== Steps Text ===')
    console.log(wrapper.text())
    expect(wrapper.find('.ant-steps').exists()).toBe(true)
  })
})