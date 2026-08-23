import {describe, it, expect, beforeAll, beforeEach} from 'vitest'
import {mount} from '@vue/test-utils'
import {defineComponent, createElement, Fragment, useState, useRef, useEffect, resetReactScheduler} from '@react-like/vue'
import * as antd from 'antd'

beforeAll(() => {
  window.matchMedia = window.matchMedia || function(q: string) {
    return { matches: false, media: q, onchange: null, addListener: () => {}, removeListener: () => {}, addEventListener: () => {}, removeEventListener: () => {}, dispatchEvent: () => false }
  }
  window.getComputedStyle = window.getComputedStyle || function() { return { getPropertyValue: () => '' } }
  if (typeof window.ResizeObserver === 'undefined') {
    (window as any).ResizeObserver = class { observe() {} unobserve() {} disconnect() {} }
  }
  if (typeof window.Element.prototype.getBoundingClientRect === 'undefined') {
    (window.Element.prototype as any).getBoundingClientRect = function() { return { top: 0, left: 0, bottom: 0, right: 0, width: 0, height: 0, x: 0, y: 0 } }
  }
})

beforeEach(() => { resetReactScheduler() })

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

// Simple render prop component
function RenderPropComp(props: any) {
  const { children, label } = props
  if (typeof children === 'function') {
    return createElement('div', { className: 'render-prop' }, children('rendered via render prop'))
  }
  return createElement('div', { className: 'direct' }, children)
}

it('simple function component with render prop', () => {
  const Comp = defineComponent(RenderPropComp)
  const Test = defineComponent(() => {
    return createElement(Comp, { label: 'test' }, (value: string) => createElement('span', null, value))
  })
  const wrapper = mount(Test)
  console.log('HTML:', wrapper.html())
  console.log('Text:', wrapper.text())
})

it('Typography.Text without defineComponent', async () => {
  // Directly render the Text component without defineComponent wrapping
  const TestComp = defineComponent(() => {
    return createElement(antd.Typography.Text, null, 'Hello Direct')
  })
  const wrapper = mount(TestComp)
  await Promise.resolve()
  console.log('=== Typography.Text HTML ===')
  console.log(wrapper.html())
  console.log('=== Text ===')
  console.log(JSON.stringify(wrapper.text()))
})

it('simple span with text', () => {
  const TestComp = defineComponent(() => {
    return createElement('span', { className: 'test' }, 'Hello World')
  })
  const wrapper = mount(TestComp)
  console.log('=== Simple span HTML ===')
  console.log(wrapper.html())
})

it('Button with text', () => {
  const wrapper = mountAntd(antd.Button, {type: 'primary'}, 'Button Text')
  console.log('=== Button HTML ===')
  console.log(wrapper.html())
  console.log('=== Button Text ===')
  console.log(JSON.stringify(wrapper.text()))
})