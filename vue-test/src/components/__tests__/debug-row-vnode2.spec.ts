import {describe, it, expect, beforeEach, afterEach} from 'vitest'
import {mount} from '@vue/test-utils'
import {defineComponent, createElement, resetReactScheduler, toVNode} from 'react'
import {Row, Col} from 'antd'
import {h} from 'vue'

describe('debug Row vnode2', () => {
  beforeEach(() => resetReactScheduler())
  afterEach(() => { document.body.innerHTML = '' })

  it('direct toVNode of Col element', () => {
    const VCol = defineComponent(Col as any)
    const colEl = createElement(VCol, {span: 12}, 'Column 1')
    
    console.log('VCol type:', typeof VCol, 'keys:', Object.keys(VCol))
    console.log('VCol.$typeof:', VCol.$typeof?.toString?.())
    console.log('VCol.$$typeof:', (VCol as any).$$typeof?.toString?.())
    
    const vnode = toVNode(colEl)
    console.log('vnode type:', typeof vnode, 'vnode.__v_isVNode:', vnode?.__v_isVNode)
    console.log('vnode:', vnode?.type?.toString?.() || vnode?.type, 'vnode.props:', vnode?.props ? Object.keys(vnode.props) : 'N/A')
  })

  it('simple Col without Row', () => {
    const VCol = defineComponent(Col as any)
    const TestComponent = defineComponent(() => {
      return createElement(VCol, {span: 12}, 'Column 1')
    })
    const wrapper = mount(TestComponent)
    console.log('Col HTML:', wrapper.html())
    expect(wrapper.find('.ant-col').exists()).toBe(true)
  })

  it('Row with manual Col toVNode', () => {
    // Simulate what Row does internally
    const {createElement: ce, REACT_ELEMENT_TYPE, REACT_PROVIDER_TYPE} = require('react')
    
    const VCol = defineComponent(Col as any)
    const colEl = ce(VCol, {span: 12}, 'Column 1')
    console.log('colEl from require react:', colEl.$$typeof?.toString())
    
    // Create a div with children (like Row does)
    const divEl = ce('div', {className: 'test-row'}, colEl)
    console.log('divEl props:', Object.keys(divEl.props))
    console.log('divEl props.children type:', typeof divEl.props.children, 
      Array.isArray(divEl.props.children) ? 'array(' + divEl.props.children.length + ')' : '')
    
    const divVNode = toVNode(divEl)
    console.log('divVNode:', divVNode?.type, divVNode?.__v_isVNode)
  })
})