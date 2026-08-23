import {describe, it, expect, vi, beforeAll} from 'vitest'
import {mount} from '@vue/test-utils'
import {defineComponent, createElement, Fragment, resetReactScheduler} from '@react-like/vue'
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

describe('debug Typography text issue', () => {
  it('Typography.Text renders text', () => {
    const VText = defineComponent(antd.Typography.Text)
    const TestComp = defineComponent(() => {
      return createElement(VText, null, 'Hello Typography')
    })
    const wrapper = mount(TestComp)
    console.log('=== Typography.Text HTML ===')
    console.log(wrapper.html())
    console.log('=== Text ===')
    console.log(JSON.stringify(wrapper.text()))
    expect(wrapper.find('.ant-typography').exists()).toBe(true)
  })
})