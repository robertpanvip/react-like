import {describe, it, expect, beforeEach, afterEach} from 'vitest'
import {mount} from '@vue/test-utils'
import {defineComponent, createElement, resetReactScheduler, toVNode} from 'react'
import {Row, Col} from 'antd'

describe('debug Row vnode', () => {
  beforeEach(() => resetReactScheduler())
  afterEach(() => { document.body.innerHTML = '' })

  it('Row renders ant-row class', () => {
    const VRow = defineComponent(Row as any)
    const VCol = defineComponent(Col as any)
    
    // Test 1: Check what createElement produces
    const colEl = createElement(VCol, {span: 12}, 'Column 1')
    console.log('colEl:', JSON.stringify(colEl, (k, v) => typeof v === 'symbol' ? v.toString() : v, 2))
    console.log('colEl.$$typeof:', colEl.$$typeof?.toString())
    console.log('colEl.props:', colEl.props)
    
    const rowEl = createElement(VRow, null, colEl)
    console.log('rowEl type:', typeof rowEl.type, rowEl.type?.$typeof?.toString())
    console.log('rowEl.props:', Object.keys(rowEl.props))
    console.log('rowEl.props.children:', typeof rowEl.props.children)
    
    // Test 2: Mount and check
    const TestComponent = defineComponent(() => {
      return createElement(VRow, null,
        createElement(VCol, {span: 12}, 'Column 1'),
        createElement(VCol, {span: 12}, 'Column 2'),
      )
    })
    const wrapper = mount(TestComponent)
    console.log('HTML:', wrapper.html())
    console.log('Text:', wrapper.text())
    expect(wrapper.find('.ant-row').exists()).toBe(true)
  })

  it('simple Row with just text', () => {
    const VRow = defineComponent(Row as any)
    const TestComponent = defineComponent(() => {
      return createElement(VRow, null, 'Hello Row')
    })
    const wrapper = mount(TestComponent)
    console.log('Simple Row HTML:', wrapper.html())
    expect(wrapper.find('.ant-row').exists()).toBe(true)
  })
})