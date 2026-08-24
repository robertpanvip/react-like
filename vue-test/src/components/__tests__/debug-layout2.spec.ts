import {describe, it, expect, beforeEach, afterEach} from 'vitest'
import {mount} from '@vue/test-utils'
import {defineComponent, createElement, toVNode, resetReactScheduler} from 'react'
import {Layout} from 'antd'

// Import the CJS shim to check it
const ReactShim = require('react')
console.log('Shim inject available:', typeof ReactShim.getInject === 'function')

describe('debug layout2', () => {
  beforeEach(() => resetReactScheduler())
  afterEach(() => { document.body.innerHTML = '' })

  it('simple layout', () => {
    const VLayout = defineComponent(Layout as any)
    const TestComponent = defineComponent(() => {
      const el = createElement(VLayout, null, createElement('div', null, 'Content'))
      return el
    })
    const wrapper = mount(TestComponent)
    console.log('Layout HTML:', wrapper.html())
    expect(wrapper.find('.ant-layout').exists()).toBe(true)
  })
  
  it('direct Layout with children', () => {
    const VLayout = defineComponent(Layout as any)
    const TestComponent = defineComponent(() => {
      const child = createElement('div', null, 'Content')
      console.log('child type:', typeof child, 'child.$$typeof:', child.$$typeof?.toString())
      const el = createElement(VLayout, null, child)
      console.log('el type:', typeof el.type, 'el.type.$typeof:', el.type?.$typeof?.toString())
      console.log('el props.children:', typeof el.props.children, el.props.children?.$$typeof?.toString())
      console.log('el props keys:', Object.keys(el.props))
      return el
    })
    try {
      const wrapper = mount(TestComponent)
      console.log('Layout HTML:', wrapper.html())
      console.log('Layout text:', wrapper.text())
    } catch (e) {
      console.log('Mount error:', e)
    }
  })

  it('Layout forwardRef check', () => {
    console.log('Layout type:', typeof Layout)
    console.log('Layout keys:', Object.keys(Layout))
    console.log('Layout.$$typeof:', (Layout as any)?.$$typeof?.toString())
    console.log('Layout.render:', typeof (Layout as any)?.render)
    // Check if Layout is a forwardRef
    const REACT_FORWARD_REF_TYPE = Symbol.for('react.forward_ref')
    console.log('Is forwardRef:', (Layout as any)?.$$typeof === REACT_FORWARD_REF_TYPE)
  })
})