import {describe, it, expect, beforeEach, afterEach} from 'vitest'
import {mount} from '@vue/test-utils'
import {defineComponent, createElement, resetReactScheduler} from 'react'
import {Row, Col, ConfigProvider} from 'antd'

describe('debug Row vnode3', () => {
  beforeEach(() => resetReactScheduler())
  afterEach(() => { document.body.innerHTML = '' })

  // Test 1: Col works standalone  
  it('Col standalone works', () => {
    const VCol = defineComponent(Col as any)
    const TestComponent = defineComponent(() => {
      return createElement(VCol, {span: 12}, 'Column 1')
    })
    const wrapper = mount(TestComponent)
    expect(wrapper.find('.ant-col').exists()).toBe(true)
    expect(wrapper.text()).toBe('Column 1')
  })

  // Test 2: Row with text children works
  it('Row with text works', () => {
    const VRow = defineComponent(Row as any)
    const TestComponent = defineComponent(() => {
      return createElement(VRow, null, 'Hello Row')
    })
    const wrapper = mount(TestComponent)
    expect(wrapper.find('.ant-row').exists()).toBe(true)
    expect(wrapper.text()).toBe('Hello Row')
  })

  // Test 3: ConfigProvider with children works (another Provider)
  it('ConfigProvider with children', () => {
    const VConfigProvider = defineComponent(ConfigProvider as any)
    const TestComponent = defineComponent(() => {
      return createElement(VConfigProvider, null,
        createElement('div', null, 'Config Content')
      )
    })
    const wrapper = mount(TestComponent)
    expect(wrapper.text()).toContain('Config Content')
  })

  // Test 4: Row with Col - but Col is NOT wrapped in defineComponent
  it('Row with raw Col (not wrapped)', () => {
    const VRow = defineComponent(Row as any)
    // Don't wrap Col - pass it directly
    const TestComponent = defineComponent(() => {
      return createElement(VRow, null,
        createElement(Col, {span: 12}, 'Column 1'),
        createElement(Col, {span: 12}, 'Column 2'),
      )
    })
    const wrapper = mount(TestComponent)
    console.log('Raw Col HTML:', wrapper.html())
    expect(wrapper.find('.ant-row').exists()).toBe(true)
  })

  // Test 5: Create a div with children directly (no Provider)
  it('direct div with children', () => {
    const TestComponent = defineComponent(() => {
      return createElement('div', {className: 'test-div'},
        createElement('span', null, 'Span 1'),
        createElement('span', null, 'Span 2'),
      )
    })
    const wrapper = mount(TestComponent)
    console.log('Direct div HTML:', wrapper.html())
    expect(wrapper.find('.test-div').exists()).toBe(true)
    expect(wrapper.findAll('span').length).toBe(2)
  })
})