/**
 * Debug: 排查 Divider 渲染问题
 */
import {describe, it, expect, beforeEach, afterEach} from 'vitest'
import {mount} from '@vue/test-utils'
import {defineComponent, createElement, resetReactScheduler} from 'react'
import {Divider} from 'antd'
import {mountAntd, cleanup} from '../../test-setup'

beforeEach(() => { resetReactScheduler() })
afterEach(() => { cleanup() })

describe('debug divider2', () => {
  it('Divider with text - direct', () => {
    const DividerComp = defineComponent(Divider)
    const TestComp = defineComponent(() => {
      return createElement('div', { id: 'wrapper' },
        createElement(DividerComp, null, 'Text')
      )
    })
    const wrapper = mount(TestComp)
    console.log('WRAPPER HTML:', wrapper.html())
    console.log('WRAPPER text:', wrapper.text())
    expect(wrapper.find('.ant-divider').exists()).toBe(true)
    expect(wrapper.find('.ant-divider-inner-text').exists()).toBe(true)
  })
})