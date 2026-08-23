/**
 * antd 表单相关组件测试
 * 单独文件以避免 Form/DatePicker 等重型组件导致内存问题
 */
import {describe, it, expect, vi, beforeAll, beforeEach, afterEach} from 'vitest'
import {mount} from '@vue/test-utils'
import {defineComponent, createElement, resetReactScheduler} from '@react-like/vue'
import * as antd from 'antd'

/* ===================== jsdom 环境 polyfill ===================== */
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
  window.getComputedStyle = window.getComputedStyle || function getComputedStyleMock() {
    return { getPropertyValue: () => '' }
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
  // @ts-ignore
  if (typeof window.Element.prototype.getBoundingClientRect === 'undefined') {
    // @ts-ignore
    window.Element.prototype.getBoundingClientRect = function() {
      return { top: 0, left: 0, bottom: 0, right: 0, width: 0, height: 0, x: 0, y: 0 }
    }
  }
})

let currentWrapper: any = null

function mountAntd(
  Component: any,
  props: Record<string, any> = {},
  children: any = null,
) {
  const VueComp = defineComponent(Component as any)
  const TestComponent = defineComponent(() => {
    if (children !== null) {
      return createElement(VueComp, props, children)
    }
    return createElement(VueComp, props)
  })
  currentWrapper = mount(TestComponent)
  return currentWrapper
}

beforeEach(() => {
  resetReactScheduler()
  currentWrapper = null
})

afterEach(() => {
  if (currentWrapper) {
    try { currentWrapper.unmount() } catch (e) {}
    currentWrapper = null
  }
  document.body.innerHTML = ''
})

/* ===================================================================
   表单组件
   =================================================================== */
describe('antd-form', () => {

  it('Form 渲染表单', () => {
    const wrapper = mountAntd(antd.Form, {style: {width: 500}})
    expect(wrapper.find('.ant-form').exists()).toBe(true)
  })

  it('Form 支持 layout=vertical', () => {
    const wrapper = mountAntd(antd.Form, {layout: 'vertical'})
    expect(wrapper.find('.ant-form-vertical').exists()).toBe(true)
  })

  it('Form 支持 layout=horizontal', () => {
    const wrapper = mountAntd(antd.Form, {layout: 'horizontal'})
    expect(wrapper.find('.ant-form-horizontal').exists()).toBe(true)
  })

  it('DatePicker 渲染日期选择器', () => {
    const wrapper = mountAntd(antd.DatePicker, {placeholder: 'Select date'})
    expect(wrapper.find('.ant-picker').exists()).toBe(true)
    expect(wrapper.find('input').exists()).toBe(true)
  })

  it('DatePicker 支持 disabled 状态', () => {
    const wrapper = mountAntd(antd.DatePicker, {disabled: true})
    expect(wrapper.find('.ant-picker-disabled').exists()).toBe(true)
  })

  it('DatePicker 支持 picker=month', () => {
    const wrapper = mountAntd(antd.DatePicker, {picker: 'month', placeholder: 'Select month'})
    expect(wrapper.find('.ant-picker').exists()).toBe(true)
  })

  it('DatePicker 支持 showTime', () => {
    const wrapper = mountAntd(antd.DatePicker, {showTime: true, placeholder: 'Select datetime'})
    expect(wrapper.find('.ant-picker').exists()).toBe(true)
  })

  it('DatePicker.RangePicker 渲染范围选择器', () => {
    const wrapper = mountAntd(antd.DatePicker.RangePicker, {placeholder: ['Start', 'End']})
    expect(wrapper.find('.ant-picker').exists()).toBe(true)
  })

  it('TimePicker 渲染时间选择器', () => {
    const wrapper = mountAntd(antd.TimePicker, {placeholder: 'Select time'})
    expect(wrapper.find('.ant-picker').exists()).toBe(true)
  })

  it('Upload 渲染上传组件', () => {
    const wrapper = mountAntd(antd.Upload, null, createElement('button', null, 'Upload'))
    expect(wrapper.find('.ant-upload').exists()).toBe(true)
    expect(wrapper.find('button').exists()).toBe(true)
  })

  it('Upload 支持 disabled 状态', () => {
    const wrapper = mountAntd(antd.Upload, {disabled: true}, createElement('button', null, 'Disabled'))
    expect(wrapper.find('.ant-upload').exists()).toBe(true)
  })

  it('AutoComplete 渲染自动完成', () => {
    const options = [
      {value: 'Option 1', label: 'Option 1'},
      {value: 'Option 2', label: 'Option 2'},
    ]
    const wrapper = mountAntd(antd.AutoComplete, {options, placeholder: 'Type here'})
    expect(wrapper.find('.ant-select').exists()).toBe(true)
    expect(wrapper.find('input').exists()).toBe(true)
  })

  it('TreeSelect 渲染树选择', () => {
    const treeData = [
      {title: 'Node 1', value: 'node1', children: [
        {title: 'Node 1-1', value: 'node11'},
      ]},
      {title: 'Node 2', value: 'node2'},
    ]
    const wrapper = mountAntd(antd.TreeSelect, {treeData, placeholder: 'Select node'})
    expect(wrapper.find('.ant-select').exists()).toBe(true)
  })

  it('TreeSelect 支持 disabled 状态', () => {
    const wrapper = mountAntd(antd.TreeSelect, {disabled: true})
    expect(wrapper.find('.ant-select-disabled').exists()).toBe(true)
  })

  it('Mentions 渲染提及组件', () => {
    const options = [
      {value: 'user1', label: 'User 1'},
      {value: 'user2', label: 'User 2'},
    ]
    const wrapper = mountAntd(antd.Mentions, {options, placeholder: '@mention'})
    expect(wrapper.find('.ant-mentions').exists()).toBe(true)
    expect(wrapper.find('textarea').exists()).toBe(true)
  })

  it('ColorPicker 渲染颜色选择器', () => {
    const wrapper = mountAntd(antd.ColorPicker, {value: '#1890ff'})
    expect(wrapper.find('.ant-color-picker-trigger').exists()).toBe(true)
  })

  it('Cascader 渲染级联选择', () => {
    const options = [
      {value: 'zhejiang', label: 'Zhejiang', children: [
        {value: 'hangzhou', label: 'Hangzhou'},
      ]},
    ]
    const wrapper = mountAntd(antd.Cascader, {options, placeholder: 'Select'})
    expect(wrapper.find('.ant-cascader').exists()).toBe(true)
  })

  it('Transfer 渲染穿梭框', () => {
    const dataSource = [
      {key: '1', title: 'Item 1'},
      {key: '2', title: 'Item 2'},
    ]
    const wrapper = mountAntd(antd.Transfer, {dataSource, targetKeys: ['1']})
    expect(wrapper.find('.ant-transfer').exists()).toBe(true)
  })
})