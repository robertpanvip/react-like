/**
 * antd notification/message 静态方法测试
 */
import {describe, it, expect} from 'vitest'
import {notification, message} from 'antd'

describe('antd-feedback-static', () => {
  it('notification 静态方法存在', () => {
    expect(typeof notification.open).toBe('function')
    expect(typeof notification.info).toBe('function')
    expect(typeof notification.success).toBe('function')
    expect(typeof notification.warning).toBe('function')
    expect(typeof notification.error).toBe('function')
  })
  it('message 静态方法存在', () => {
    expect(typeof message.open).toBe('function')
    expect(typeof message.info).toBe('function')
    expect(typeof message.success).toBe('function')
    expect(typeof message.warning).toBe('function')
    expect(typeof message.error).toBe('function')
  })
})