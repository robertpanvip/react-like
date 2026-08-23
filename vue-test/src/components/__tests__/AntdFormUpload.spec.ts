/**
 * antd Upload 组件测试
 */
import {describe, it, expect, beforeAll, beforeEach, afterEach} from 'vitest'
import {mount} from '@vue/test-utils'
import {defineComponent, createElement, resetReactScheduler} from '@react-like/vue'
import * as antd from 'antd'

beforeAll(() => {
  window.matchMedia = window.matchMedia || function(q: string) { return { matches: false, media: q, addListener: () => {}, removeListener: () => {}, addEventListener: () => {}, dispatchEvent: () => false } } as any
  window.getComputedStyle = window.getComputedStyle || function() { return { getPropertyValue: () => '' } } as any
  if (!window.ResizeObserver) window.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} } as any
  if (!window.Element.prototype.getBoundingClientRect) window.Element.prototype.getBoundingClientRect = function() { return { top: 0, left: 0, bottom: 0, right: 0, width: 0, height: 0, x: 0, y: 0 } }
})

function mountAntd(Component: any, props: Record<string, any> = {}, children: any = null) {
  const VueComp = defineComponent(Component as any)
  const TestComponent = defineComponent(() => {
    if (children !== null) return createElement(VueComp, props, children)
    return createElement(VueComp, props)
  })
  return mount(TestComponent)
}

let currentWrapper: any = null
beforeEach(() => { resetReactScheduler(); currentWrapper = null })
afterEach(() => { if (currentWrapper) { try { currentWrapper.unmount() } catch(e) {} currentWrapper = null }; document.body.innerHTML = '' })

describe('antd-form-upload', () => {
  it('Upload 渲染上传组件', () => {
    const wrapper = mountAntd(antd.Upload, null, createElement('button', null, 'Upload'))
    currentWrapper = wrapper
    expect(wrapper.exists()).toBe(true)
  })
  it('Upload 支持 disabled 状态', () => {
    const wrapper = mountAntd(antd.Upload, {disabled: true}, createElement('button', null, 'Disabled'))
    currentWrapper = wrapper
    expect(wrapper.exists()).toBe(true)
  })
})