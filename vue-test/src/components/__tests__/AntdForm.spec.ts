/**
 * antd 表单相关组件测试
 */
import {describe, it, expect, vi, beforeEach, afterEach} from 'vitest'
import {resetReactScheduler} from 'react'
import {Form, DatePicker, TimePicker} from 'antd'
import {mountAntd, cleanup} from '../../test-setup'

let currentWrapper: any = null
beforeEach(() => { resetReactScheduler(); currentWrapper = null })
afterEach(() => { cleanup(); currentWrapper = null })

describe('antd-form', () => {
  it('Form 渲染表单', () => {
    const wrapper = mountAntd(Form, {style: {width: 500}})
    expect(wrapper.find('.ant-form').exists()).toBe(true)
  })
  it('Form 支持 layout=vertical', () => {
    const wrapper = mountAntd(Form, {layout: 'vertical'})
    expect(wrapper.find('.ant-form-vertical').exists()).toBe(true)
  })
  it('Form 支持 layout=horizontal', () => {
    const wrapper = mountAntd(Form, {layout: 'horizontal'})
    expect(wrapper.find('.ant-form-horizontal').exists()).toBe(true)
  })
  it('DatePicker 渲染日期选择器', () => {
    const wrapper = mountAntd(DatePicker, {placeholder: 'Select date'})
    expect(wrapper.find('.ant-picker').exists()).toBe(true)
    expect(wrapper.find('input').exists()).toBe(true)
  })
  it('DatePicker 支持 disabled 状态', () => {
    const wrapper = mountAntd(DatePicker, {disabled: true})
    expect(wrapper.find('.ant-picker-disabled').exists()).toBe(true)
  })
  it('DatePicker 支持 picker=month', () => {
    const wrapper = mountAntd(DatePicker, {picker: 'month', placeholder: 'Select month'})
    expect(wrapper.find('.ant-picker').exists()).toBe(true)
  })
  it('DatePicker 支持 showTime', () => {
    const wrapper = mountAntd(DatePicker, {showTime: true, placeholder: 'Select datetime'})
    expect(wrapper.find('.ant-picker').exists()).toBe(true)
  })
  it('DatePicker.RangePicker 渲染范围选择器', () => {
    const wrapper = mountAntd(DatePicker.RangePicker, {placeholder: ['Start', 'End']})
    expect(wrapper.find('.ant-picker').exists()).toBe(true)
  })
  it('TimePicker 渲染时间选择器', () => {
    const wrapper = mountAntd(TimePicker, {placeholder: 'Select time'})
    expect(wrapper.find('.ant-picker').exists()).toBe(true)
  })
})