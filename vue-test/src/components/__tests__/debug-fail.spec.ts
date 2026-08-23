import {describe, it, expect} from 'vitest'
import {mount} from '@vue/test-utils'
import {defineComponent, createElement, Fragment} from '@react-like/vue'
import {Tag, Badge, Select, Tabs, Collapse, Table} from 'antd'

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

describe('debug-fail', () => {
  it('Tag closable', () => {
    const wrapper = mountAntd(Tag, {closable: true}, 'Closable')
    console.log('Tag closable HTML:', wrapper.html())
    expect(wrapper.find('.ant-tag').exists()).toBe(true)
    expect(wrapper.find('.ant-tag-close-icon').exists()).toBe(true)
  })

  it('Badge count', () => {
    const wrapper = mountAntd(Badge, {count: 5}, createElement('span', null, 'Inbox'))
    console.log('Badge count HTML:', wrapper.html())
    expect(wrapper.find('.ant-badge').exists()).toBe(true)
    expect(wrapper.find('.ant-badge-count').exists()).toBe(true)
  })

  it('Badge standalone', () => {
    const wrapper = mountAntd(Badge, {count: 8})
    console.log('Badge standalone HTML:', wrapper.html())
    expect(wrapper.find('.ant-badge-count').exists()).toBe(true)
  })

  it('Select', () => {
    const wrapper = mountAntd(Select, {
      defaultValue: 'lucy',
      style: {width: 120},
      options: [
        {value: 'jack', label: 'Jack'},
        {value: 'lucy', label: 'Lucy'},
      ]
    })
    console.log('Select HTML:', wrapper.html().substring(0, 1000))
    expect(wrapper.find('.ant-select').exists()).toBe(true)
  })

  it('Tabs', () => {
    const wrapper = mountAntd(Tabs, {
      items: [
        {key: '1', label: 'Tab 1', children: 'Content 1'},
        {key: '2', label: 'Tab 2', children: 'Content 2'},
      ]
    })
    console.log('Tabs HTML:', wrapper.html().substring(0, 1000))
    expect(wrapper.find('.ant-tabs').exists()).toBe(true)
  })

  it('Collapse ghost', () => {
    const wrapper = mountAntd(Collapse, {
      ghost: true,
      items: [{key: '1', label: 'Item', children: 'Content'}]
    })
    console.log('Collapse ghost HTML:', wrapper.html().substring(0, 500))
    expect(wrapper.find('.ant-collapse').exists()).toBe(true)
    expect(wrapper.find('.ant-collapse-ghost').exists()).toBe(true)
  })

  it('Table', () => {
    const dataSource = [{key: '1', name: 'John'}]
    const columns = [{title: 'Name', dataIndex: 'name', key: 'name'}]
    const wrapper = mountAntd(Table, {dataSource, columns})
    console.log('Table HTML:', wrapper.html().substring(0, 1000))
    expect(wrapper.find('.ant-table').exists()).toBe(true)
  })
})