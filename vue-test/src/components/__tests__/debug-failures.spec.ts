import {describe, it, expect, beforeAll} from 'vitest'
import {mount} from '@vue/test-utils'
import {defineComponent, createElement} from '@react-like/vue'
import * as antd from 'antd'

beforeAll(() => {
  // @ts-ignore
  window.matchMedia = window.matchMedia || function matchMediaMock(query: string) {
    return {
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }
  }
  // @ts-ignore
  if (typeof window.ResizeObserver === 'undefined') {
    // @ts-ignore
    window.ResizeObserver = class ResizeObserverMock {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
  }
})

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

describe('debug failures', () => {
  it('Typography.Paragraph', () => {
    const wrapper = mountAntd(antd.Typography.Paragraph, null, 'Paragraph text')
    console.log('=== Typography.Paragraph HTML ===')
    console.log(wrapper.html())
    expect(wrapper.find('.ant-typography').exists()).toBe(true)
    expect(wrapper.text()).toContain('Paragraph text')
  })

  it('Divider orientation', () => {
    const wrapper = mountAntd(antd.Divider, {titlePlacement: 'left'}, 'Left')
    console.log('=== Divider orientation HTML ===')
    console.log(wrapper.html())
    expect(wrapper.find('.ant-divider').exists()).toBe(true)
    expect(wrapper.find('.ant-divider-with-text-start').exists()).toBe(true)
  })

  it('Space', () => {
    const wrapper = mountAntd(
      antd.Space,
      null,
      [createElement('span', null, 'Item 1'), createElement('span', null, 'Item 2')]
    )
    console.log('=== Space HTML ===')
    console.log(wrapper.html())
    expect(wrapper.find('.ant-space').exists()).toBe(true)
    expect(wrapper.text()).toContain('Item 1')
    expect(wrapper.text()).toContain('Item 2')
  })

  it('Statistic', () => {
    const wrapper = mountAntd(antd.Statistic, {title: 'Sales', value: 12345})
    console.log('=== Statistic HTML ===')
    console.log(wrapper.html())
    expect(wrapper.find('.ant-statistic').exists()).toBe(true)
    expect(wrapper.find('.ant-statistic-content-value-int').exists()).toBe(true)
  })

  it('Progress', () => {
    const wrapper = mountAntd(antd.Progress, {percent: 50})
    console.log('=== Progress HTML ===')
    console.log(wrapper.html())
    expect(wrapper.find('.ant-progress').exists()).toBe(true)
    expect(wrapper.find('.ant-progress-track').exists()).toBe(true)
  })

  it('Modal', () => {
    const wrapper = mountAntd(antd.Modal, {open: true, title: 'Modal Title', getContainer: false, children: 'Modal Content'})
    console.log('=== Modal HTML ===')
    console.log(wrapper.html())
    expect(wrapper.find('.ant-modal').exists()).toBe(true)
    expect(wrapper.find('.ant-modal-title').text()).toBe('Modal Title')
    expect(wrapper.find('.ant-modal-body').text()).toContain('Modal Content')
  })

  it('Collapse expandIconPosition', () => {
    const items = [
      {key: '1', label: 'A', children: 'A'},
    ]
    const wrapper = mountAntd(antd.Collapse, {items, expandIconPlacement: 'end'})
    console.log('=== Collapse HTML ===')
    console.log(wrapper.html())
    expect(wrapper.find('.ant-collapse').exists()).toBe(true)
    expect(wrapper.find('.ant-collapse-icon-placement-end').exists()).toBe(true)
  })
})