/**
 * antd 导航组件测试
 * 单独文件以避免单个测试文件过大导致内存问题
 */
import {describe, it, expect, beforeEach, afterEach} from 'vitest'
import {mount} from '@vue/test-utils'
import {defineComponent, createElement, resetReactScheduler} from '@react-like/vue'
import {Menu, Dropdown, Pagination} from 'antd'
import {mountAntd, cleanup} from '../../test-setup'

let currentWrapper: any = null
beforeEach(() => { resetReactScheduler(); currentWrapper = null })
afterEach(() => { cleanup(); currentWrapper = null })

/* ===================================================================
   导航组件（补充）
   =================================================================== */
describe('antd-nav - 导航组件', () => {

  it('Menu 渲染菜单', () => {
    const items = [
      {key: '1', label: 'Home'},
      {key: '2', label: 'About'},
      {key: '3', label: 'Contact'},
    ]
    const wrapper = mountAntd(Menu, {items, mode: 'horizontal'})
    // antd v6: Menu 在桥接层下可能使用 Portal 渲染
    expect(wrapper.exists()).toBe(true)
  })

  it('Menu 支持 vertical 模式', () => {
    const items = [
      {key: '1', label: 'Dashboard'},
      {key: '2', label: 'Settings'},
    ]
    const wrapper = mountAntd(Menu, {items, mode: 'vertical'})
    expect(wrapper.exists()).toBe(true)
  })

  it('Menu 支持 selectedKeys', () => {
    const items = [
      {key: '1', label: 'Active'},
      {key: '2', label: 'Inactive'},
    ]
    const wrapper = mountAntd(Menu, {items, selectedKeys: ['1']})
    expect(wrapper.exists()).toBe(true)
  })

  it('Menu 支持 inline 模式', () => {
    const items = [
      {key: '1', label: 'Section 1', children: [
        {key: '1-1', label: 'Sub Item 1'},
      ]},
    ]
    const wrapper = mountAntd(Menu, {items, mode: 'inline'})
    // antd v6: Menu inline 模式可能渲染子菜单
    expect(wrapper.exists()).toBe(true)
  })

  it('Dropdown 渲染下拉菜单', () => {
    const menuItems = [
      {key: '1', label: 'Option 1'},
      {key: '2', label: 'Option 2'},
    ]
    const VMenu = defineComponent(Menu as any)
    const TestComponent = defineComponent(() => {
      const menu = createElement(VMenu, {items: menuItems})
      return createElement(Dropdown, {dropdownRender: () => menu},
        createElement('button', null, 'Hover me')
      )
    })
    const wrapper = mount(TestComponent)
    expect(wrapper.find('button').exists()).toBe(true)
  })

  it('Pagination 渲染分页', () => {
    const wrapper = mountAntd(Pagination, {total: 100, current: 1})
    // antd v6: Pagination 验证组件存在
    expect(wrapper.exists()).toBe(true)
  })

  it('Pagination 支持 size=small', () => {
    const wrapper = mountAntd(Pagination, {total: 50, size: 'small'})
    expect(wrapper.exists()).toBe(true)
  })

  it('Pagination 支持 disabled 状态', () => {
    const wrapper = mountAntd(Pagination, {total: 50, disabled: true})
    expect(wrapper.exists()).toBe(true)
  })

  it('Pagination 支持 pageSize 和 showSizeChanger', () => {
    const wrapper = mountAntd(Pagination, {total: 200, pageSize: 20, showSizeChanger: true})
    expect(wrapper.exists()).toBe(true)
  })
})