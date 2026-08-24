import {describe, it, expect, beforeEach, afterEach} from 'vitest'
import {mount} from '@vue/test-utils'
import {defineComponent, createElement, resetReactScheduler, createContext} from 'react'
import {Row, Col} from 'antd'

describe('debug Row vnode4', () => {
  beforeEach(() => resetReactScheduler())
  afterEach(() => { document.body.innerHTML = '' })

  // Test: div with Col as children (no Provider)
  it('div with Col as children (no Provider)', () => {
    const VCol = defineComponent(Col as any)
    const TestComponent = defineComponent(() => {
      return createElement('div', {className: 'wrapper'},
        createElement(VCol, {span: 12}, 'Column 1'),
        createElement(VCol, {span: 12}, 'Column 2'),
      )
    })
    const wrapper = mount(TestComponent)
    console.log('Div+Col HTML:', wrapper.html())
    expect(wrapper.findAll('.ant-col').length).toBe(2)
  })

  // Test: Manually create a Provider  
  it('manual Provider with children', () => {
    const TestCtx = createContext<string>('test')
    const TestComponent = defineComponent(() => {
      return createElement(TestCtx.Provider, {value: 'hello' as any},
        createElement('div', null, 'Provider Child')
      )
    })
    const wrapper = mount(TestComponent)
    console.log('Provider HTML:', wrapper.html())
    expect(wrapper.text()).toContain('Provider Child')
  })

  // Test: Row with single child
  it('Row with single child', () => {
    const VRow = defineComponent(Row as any)
    const VCol = defineComponent(Col as any)
    const TestComponent = defineComponent(() => {
      return createElement(VRow, null,
        createElement(VCol, {span: 24}, 'Single Col')
      )
    })
    const wrapper = mount(TestComponent)
    console.log('Row+SingleCol HTML:', wrapper.html())
    expect(wrapper.find('.ant-row').exists()).toBe(true)
  })
})