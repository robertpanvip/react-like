import {describe, it, expect, afterEach} from 'vitest'
import {mount} from '@vue/test-utils'
import {defineComponent, createElement} from 'react'
import {Select, Button} from 'antd'

describe('debug', () => {
  afterEach(() => {
  })

  it('Button renders', () => {
    const VueBtn = defineComponent(Button)
    const TestBtn = defineComponent(() => {
      return createElement(VueBtn, null, 'Hello')
    })
    const wrapper = mount(TestBtn)
    console.log('Button HTML:', wrapper.html().substring(0, 500))
    expect(wrapper.find('.ant-btn').exists()).toBe(true)
  })

  it('Select renders', () => {
    console.log('Select type:', typeof Select, Select.name)
    // Check what the render function returns
    const VueSelect = defineComponent(Select)
    console.log('VueSelect keys:', Object.keys(VueSelect))
    
    const TestSelect = defineComponent(() => {
      const result = createElement(VueSelect, { 
        options: [{value: 'a', label: 'A'}],
        placeholder: 'Select'
      })
      console.log('createElement result:', JSON.stringify({
        $$typeof: result.$$typeof?.toString(),
        type: typeof result.type,
        key: result.key,
        ref: result.ref
      }))
      return result
    })
    const wrapper = mount(TestSelect)
    console.log('Select HTML:', wrapper.html().substring(0, 500))
    console.log('Select text:', wrapper.text())
    expect(wrapper.find('.ant-select').exists()).toBe(true)
  })
})