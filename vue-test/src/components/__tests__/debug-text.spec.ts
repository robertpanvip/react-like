import {describe, it, expect, beforeEach} from 'vitest'
import {mount} from '@vue/test-utils'
import {defineComponent, createElement, Fragment, resetReactScheduler} from '@react-like/vue'
import {Typography} from 'antd'

beforeEach(() => { resetReactScheduler() })

describe('debug text', () => {
  it('Typography.Text renders', () => {
    const VText = defineComponent(Typography.Text)
    const TestComp = defineComponent(() => {
      return createElement(VText, null, 'Hello Typography')
    })
    const wrapper = mount(TestComp)
    console.log('=== HTML ===')
    console.log(wrapper.html())
    console.log('=== Text ===')
    console.log(JSON.stringify(wrapper.text()))
    expect(wrapper.find('.ant-typography').exists()).toBe(true)
  })

  it('Simple span with text', () => {
    const TestComp = defineComponent(() => {
      return createElement('span', { className: 'test' }, 'Hello World')
    })
    const wrapper = mount(TestComp)
    console.log('=== Simple span HTML ===')
    console.log(wrapper.html())
    expect(wrapper.find('span').exists()).toBe(true)
    expect(wrapper.text()).toBe('Hello World')
  })

  it('Fragment with text', () => {
    const TestComp = defineComponent(() => {
      return createElement(Fragment, null, 'Hello Fragment')
    })
    const wrapper = mount(TestComp)
    console.log('=== Fragment HTML ===')
    console.log(wrapper.html())
    console.log('=== Text ===')
    console.log(JSON.stringify(wrapper.text()))
  })

  it('Nested Fragment with string array', () => {
    const TestComp = defineComponent(() => {
      return createElement('div', null,
        createElement(Fragment, null, ['Hello ', 'World'])
      )
    })
    const wrapper = mount(TestComp)
    console.log('=== Nested Fragment HTML ===')
    console.log(wrapper.html())
    console.log('=== Text ===')
    console.log(JSON.stringify(wrapper.text()))
  })
})