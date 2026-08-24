/**
 * Debug: 排查 Divider 渲染问题
 */
import {describe, it, expect, beforeEach, afterEach} from 'vitest'
import {mount} from '@vue/test-utils'
import {defineComponent, createElement, Fragment, resetReactScheduler} from 'react'
import {Divider} from 'antd'
import {mountAntd, cleanup} from '../../test-setup'

beforeEach(() => { resetReactScheduler() })
afterEach(() => { cleanup() })

describe('debug divider', () => {
  it('Fragment test', () => {
    // Test if Fragment rendering works
    const Comp = defineComponent(() => {
      return createElement('div', {id: 'frag-test'},
        createElement(Fragment, null,
          createElement('span', {id: 'child1'}, 'Child1'),
          createElement('span', {id: 'child2'}, 'Child2')
        )
      )
    })
    const wrapper = mount(Comp)
    console.log('Fragment test HTML:', wrapper.html())
    console.log('Fragment test text:', wrapper.text())
    expect(wrapper.find('#child1').exists()).toBe(true)
    expect(wrapper.find('#child2').exists()).toBe(true)
  })

  it('Divider with text', () => {
    const wrapper = mountAntd(Divider, null, 'Text')
    console.log('DIVIDER HTML:', wrapper.html())
    console.log('DIVIDER text:', wrapper.text())
    console.log('DIVIDER classes:', wrapper.find('.ant-divider').classes())
    console.log('DIVIDER children length:', wrapper.find('.ant-divider').element.children.length)
    expect(wrapper.find('.ant-divider').exists()).toBe(true)
    expect(wrapper.find('.ant-divider-inner-text').exists()).toBe(true)
  })
})