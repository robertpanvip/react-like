/**
 * Debug: 排查文本渲染问题
 */
import {describe, it, expect, vi, beforeEach, afterEach} from 'vitest'
import {mount} from '@vue/test-utils'
import {defineComponent, createElement, Fragment, resetReactScheduler} from 'react'
import {Divider, Typography, Space} from 'antd'
import {mountAntd, cleanup} from '../../test-setup'

beforeEach(() => { resetReactScheduler() })
afterEach(() => { cleanup() })

describe('debug text rendering', () => {

  it('simple string children', () => {
    const Comp = defineComponent(() => {
      return createElement('div', null, 'Hello World')
    })
    const wrapper = mount(Comp)
    console.log('simple div HTML:', wrapper.html())
    expect(wrapper.text()).toContain('Hello World')
  })

  it('Divider basic', () => {
    const wrapper = mountAntd(Divider, null, 'Text')
    console.log('Divider HTML:', wrapper.html().substring(0, 500))
    console.log('Divider text:', wrapper.text())
    expect(wrapper.find('.ant-divider').exists()).toBe(true)
  })

  it('Typography.Text basic', () => {
    const wrapper = mountAntd(Typography.Text, null, 'Hello Typography')
    console.log('Typography HTML:', wrapper.html().substring(0, 500))
    console.log('Typography text:', wrapper.text())
    expect(wrapper.find('.ant-typography').exists()).toBe(true)
  })
})