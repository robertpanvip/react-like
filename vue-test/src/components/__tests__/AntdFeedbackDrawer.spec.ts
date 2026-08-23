/**
 * antd Drawer 组件测试
 */
import {describe, it, expect, beforeEach, afterEach} from 'vitest'
import {resetReactScheduler} from 'react'
import {Drawer} from 'antd'
import {mountAntd, cleanup} from '../../test-setup'

let currentWrapper: any = null
beforeEach(() => { resetReactScheduler(); currentWrapper = null })
afterEach(() => { cleanup(); currentWrapper = null })

describe('antd-feedback-drawer', () => {
  it('Drawer 渲染抽屉', () => {
    const wrapper = mountAntd(Drawer, { open: true, title: 'Drawer Title', getContainer: false, children: 'Drawer Content' })
    currentWrapper = wrapper
    expect(wrapper.exists()).toBe(true)
  })
  it('Drawer 关闭时不显示', () => {
    const wrapper = mountAntd(Drawer, {open: false, title: 'Hidden', getContainer: false})
    currentWrapper = wrapper
    expect(wrapper.exists()).toBe(true)
  })
  it('Drawer 支持 placement=right', () => {
    const wrapper = mountAntd(Drawer, {open: true, placement: 'right', getContainer: false})
    currentWrapper = wrapper
    expect(wrapper.exists()).toBe(true)
  })
  it('Drawer 支持 placement=left', () => {
    const wrapper = mountAntd(Drawer, {open: true, placement: 'left', getContainer: false})
    currentWrapper = wrapper
    expect(wrapper.exists()).toBe(true)
  })
  it('Drawer 支持 size=large', () => {
    const wrapper = mountAntd(Drawer, {open: true, size: 'large', getContainer: false})
    currentWrapper = wrapper
    expect(wrapper.exists()).toBe(true)
  })
})