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

  })