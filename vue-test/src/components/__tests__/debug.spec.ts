import {describe, it, expect} from 'vitest'
import {mount} from '@vue/test-utils'
import {defineComponent, createElement} from 'react'
import {Button} from 'antd'

describe('debug', () => {
  it('simple button test', () => {
    const VueComp = defineComponent(Button)
    const TestComp = defineComponent(() => {
      console.log('TestComp render called')
      const el = createElement(VueComp, {type: 'primary'}, 'Click Me')
      console.log('TestComp createElement result type:', typeof el, 'props:', JSON.stringify({...el.props, children: typeof el.props?.children === 'string' ? el.props.children : '[' + typeof el.props?.children + ']'}, (key, val) => {
        if (typeof val === 'function') return 'fn:' + (val.name || 'anon')
        if (typeof val === 'symbol') return val.toString()
        return val
      }))
      return el
    })
    console.log('TestComp:', typeof TestComp, TestComp.$typeof)
    const wrapper = mount(TestComp)
    console.log('Wrapper HTML:', wrapper.html())
    expect(wrapper.find('button').exists()).toBe(true)
  })
})