import {describe, it, expect} from 'vitest'
import {mount} from '@vue/test-utils'
import {defineComponent, createElement} from '@react-like/vue'
import {Typography} from 'antd'

describe('debug Typography text issue', () => {
  it('Typography.Text renders text', () => {
    const VText = defineComponent(Typography.Text)
    const TestComp = defineComponent(() => {
      return createElement(VText, null, 'Hello Typography')
    })
    const wrapper = mount(TestComp)
    console.log('=== Typography.Text HTML ===')
    console.log(wrapper.html())
    console.log('=== Text ===')
    console.log(JSON.stringify(wrapper.text()))
    expect(wrapper.find('.ant-typography').exists()).toBe(true)
  })
})