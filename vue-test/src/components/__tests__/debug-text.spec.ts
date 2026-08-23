import {describe, it, expect, beforeAll, beforeEach} from 'vitest'
import {mount} from '@vue/test-utils'
import {defineComponent, createElement, Fragment, resetReactScheduler} from '@react-like/vue'
import * as antd from 'antd'

beforeAll(() => {
  // @ts-ignore
  window.matchMedia = window.matchMedia || function(q: string) {
    return { matches: false, media: q, onchange: null, addListener: () => {}, removeListener: () => {}, addEventListener: () => {}, removeEventListener: () => {}, dispatchEvent: () => false }
  }
  // @ts-ignore
  if (typeof window.ResizeObserver === 'undefined') {
    // @ts-ignore
    window.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} }
  }
  // @ts-ignore
  if (typeof window.Element.prototype.getBoundingClientRect === 'undefined') {
    // @ts-ignore
    window.Element.prototype.getBoundingClientRect = function() { return { top: 0, left: 0, bottom: 0, right: 0, width: 0, height: 0, x: 0, y: 0 } }
  }
})

beforeEach(() => { resetReactScheduler() })

describe('debug text', () => {
  it('Typography.Text renders', () => {
    const VText = defineComponent(antd.Typography.Text)
    const TestComp = defineComponent(() => {
      return createElement(VText, null, 'Hello Typography')
    })
    const wrapper = mount(TestComp)
    console.log('=== HTML ===')
    console.log(wrapper.html())
    console.log('=== Text ===')
    console.log(JSON.stringify(wrapper.text()))
    expect(wrapper.find('.ant-typography').exists()).toBe(true)
  })

  it('Simple span with text', () => {
    const TestComp = defineComponent(() => {
      return createElement('span', { className: 'test' }, 'Hello World')
    })
    const wrapper = mount(TestComp)
    console.log('=== Simple span HTML ===')
    console.log(wrapper.html())
    expect(wrapper.find('span').exists()).toBe(true)
    expect(wrapper.text()).toBe('Hello World')
  })

  it('Fragment with text', () => {
    const TestComp = defineComponent(() => {
      return createElement(Fragment, null, 'Hello Fragment')
    })
    const wrapper = mount(TestComp)
    console.log('=== Fragment HTML ===')
    console.log(wrapper.html())
    console.log('=== Text ===')
    console.log(JSON.stringify(wrapper.text()))
  })

  it('Nested Fragment with string array', () => {
    const TestComp = defineComponent(() => {
      return createElement('div', null,
        createElement(Fragment, null, ['Hello ', 'World'])
      )
    })
    const wrapper = mount(TestComp)
    console.log('=== Nested Fragment HTML ===')
    console.log(wrapper.html())
    console.log('=== Text ===')
    console.log(JSON.stringify(wrapper.text()))
  })
})