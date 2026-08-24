import {describe, it, expect} from 'vitest'
import {mount} from '@vue/test-utils'
import {defineComponent, createElement, resetReactScheduler} from 'react'
import {Row, Col} from 'antd'

describe('debug Row', () => {
  it('Row rendering', () => {
    resetReactScheduler()
    const TestComponent = defineComponent(() => {
      return createElement(Row, null, 
        createElement(Col, {span: 12}, 'Column 1'),
        createElement(Col, {span: 12}, 'Column 2')
      )
    })
    const wrapper = mount(TestComponent as any)
    console.log('Row html:', wrapper.html())
    console.log('Row text:', wrapper.text())
    expect(wrapper.find('.ant-row').exists()).toBe(true)
  })
})