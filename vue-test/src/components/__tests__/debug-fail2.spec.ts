import {describe, it, expect} from 'vitest'
import {mount} from '@vue/test-utils'
import {defineComponent, createElement} from '@react-like/vue'
import {Select, Tabs} from 'antd'

function mountAntd(Component: any, props: any = {}, children: any = null) {
  const VueComp = defineComponent(Component)
  const TestComponent = defineComponent(() => {
    if (children !== null) {
      return createElement(VueComp, props, children)
    }
    return createElement(VueComp, props)
  })
  return mount(TestComponent)
}

describe('debug-fail2', () => {
  it('Select', () => {
    const wrapper = mountAntd(Select, {
      defaultValue: 'lucy',
      style: {width: 120},
      options: [
        {value: 'jack', label: 'Jack'},
        {value: 'lucy', label: 'Lucy'},
      ]
    })
    console.log('Select HTML:')
    console.log(wrapper.html())
    expect(wrapper.find('.ant-select').exists()).toBe(true)
  })

  it('Tabs', () => {
    const wrapper = mountAntd(Tabs, {
      items: [
        {key: '1', label: 'Tab 1', children: 'Content 1'},
        {key: '2', label: 'Tab 2', children: 'Content 2'},
      ]
    })
    console.log('Tabs HTML:')
    console.log(wrapper.html())
    expect(wrapper.find('.ant-tabs').exists()).toBe(true)
  })
})