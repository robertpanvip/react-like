/**
 * antd Upload 组件测试
 */
import {describe, it, expect, beforeEach, afterEach} from 'vitest'
import {createElement, resetReactScheduler} from 'react'
import {Upload} from 'antd'
import {mountAntd, cleanup} from '../../test-setup'

let currentWrapper: any = null
beforeEach(() => { resetReactScheduler(); currentWrapper = null })
afterEach(() => { cleanup(); currentWrapper = null })

describe('antd-form-upload', () => {
  it('Upload 渲染上传组件', () => {
    const wrapper = mountAntd(Upload, null, createElement('button', null, 'Upload'))
    currentWrapper = wrapper
    expect(wrapper.exists()).toBe(true)
  })
  it('Upload 支持 disabled 状态', () => {
    const wrapper = mountAntd(Upload, {disabled: true}, createElement('button', null, 'Disabled'))
    currentWrapper = wrapper
    expect(wrapper.exists()).toBe(true)
  })
})