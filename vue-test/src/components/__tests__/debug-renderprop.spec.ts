import {describe, it, expect, beforeEach} from 'vitest'
import {mount} from '@vue/test-utils'
import {defineComponent, createElement, Fragment, useState, useRef, useEffect, resetReactScheduler} from '@react-like/vue'
import {Typography, Button} from 'antd'

beforeEach(() => { resetReactScheduler() })

function mountAntd(Component: any, props: Record<string, any> = {}, children: any = null) {
  const VueComp = defineComponent(Component as any)
  const TestComponent = defineComponent(() => {
    if (children !== null) {
      return createElement(VueComp, props, children)
    }
    return createElement(VueComp, props)
  })
  return mount(TestComponent)
}

// Simple render prop component
function RenderPropComp(props: any) {
  const { children, label } = props
  if (typeof children === 'function') {
    return createElement('div', { className: 'render-prop' }, children('rendered via render prop'))
  }
  return createElement('div', { className: 'direct' }, children)
}

it('simple function component with render prop', () => {
  const Comp = defineComponent(RenderPropComp)
  const Test = defineComponent(() => {
    return createElement(Comp, { label: 'test' }, (value: string) => createElement('span', null, value))
  })
  const wrapper = mount(Test)
  console.log('HTML:', wrapper.html())
  console.log('Text:', wrapper.text())
})

it('Typography.Text without defineComponent', async () => {
  const TestComp = defineComponent(() => {
    return createElement(Typography.Text, null, 'Hello Direct')
  })
  const wrapper = mount(TestComp)
  await Promise.resolve()
  console.log('=== Typography.Text HTML ===')
  console.log(wrapper.html())
  console.log('=== Text ===')
  console.log(JSON.stringify(wrapper.text()))
})

it('simple span with text', () => {
  const TestComp = defineComponent(() => {
    return createElement('span', { className: 'test' }, 'Hello World')
  })
  const wrapper = mount(TestComp)
  console.log('=== Simple span HTML ===')
  console.log(wrapper.html())
})

it('Button with text', () => {
  const wrapper = mountAntd(Button, {type: 'primary'}, 'Button Text')
  console.log('=== Button HTML ===')
  console.log(wrapper.html())
  console.log('=== Button Text ===')
  console.log(JSON.stringify(wrapper.text()))
})