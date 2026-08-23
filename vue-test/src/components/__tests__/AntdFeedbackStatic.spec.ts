/**
 * antd notification/message 静态方法测试
 */
import {describe, it, expect, beforeAll} from 'vitest'
import * as antd from 'antd'

beforeAll(() => {
  window.matchMedia = window.matchMedia || function(q: string) { return { matches: false, media: q, addListener: () => {}, removeListener: () => {}, addEventListener: () => {}, dispatchEvent: () => false } } as any
  window.getComputedStyle = window.getComputedStyle || function() { return { getPropertyValue: () => '' } } as any
  if (!window.ResizeObserver) window.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} } as any
  if (!window.Element.prototype.getBoundingClientRect) window.Element.prototype.getBoundingClientRect = function() { return { top: 0, left: 0, bottom: 0, right: 0, width: 0, height: 0, x: 0, y: 0 } }
})

describe('antd-feedback-static', () => {
  it('notification 静态方法存在', () => {
    expect(typeof antd.notification.open).toBe('function')
    expect(typeof antd.notification.info).toBe('function')
    expect(typeof antd.notification.success).toBe('function')
    expect(typeof antd.notification.warning).toBe('function')
    expect(typeof antd.notification.error).toBe('function')
  })
  it('message 静态方法存在', () => {
    expect(typeof antd.message.open).toBe('function')
    expect(typeof antd.message.info).toBe('function')
    expect(typeof antd.message.success).toBe('function')
    expect(typeof antd.message.warning).toBe('function')
    expect(typeof antd.message.error).toBe('function')
  })
})