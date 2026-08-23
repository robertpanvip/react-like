import {describe, it, expect} from 'vitest'
import {mount} from '@vue/test-utils'
import {defineComponent, createElement} from '@react-like/vue'
import {Steps} from 'antd'

describe('debug Steps', () => {
  it('Steps renders', () => {
    const items = [
      {title: 'Step 1', content: 'Description 1'},
      {title: 'Step 2', content: 'Description 2'},
      {title: 'Step 3'},
    ]
    const VueComp = defineComponent(Steps as any)
    const TestComponent = defineComponent(() => {
      return createElement(VueComp, {current: 1, items})
    })
    const wrapper = mount(TestComponent)
    console.log('=== Steps HTML ===')
    console.log(wrapper.html())
    console.log('=== Steps Text ===')
    console.log(wrapper.text())
    expect(wrapper.find('.ant-steps-filled').exists()).toBe(true)
  })
})