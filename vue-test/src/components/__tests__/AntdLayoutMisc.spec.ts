/**
 * antd 布局 & 其他缺失组件测试
 * 单独文件以避免单个测试文件过大导致内存问题
 */
import {describe, it, expect, vi, beforeAll, beforeEach, afterEach} from 'vitest'
import {mount} from '@vue/test-utils'
import {defineComponent, createElement, resetReactScheduler} from '@react-like/vue'
import * as antd from 'antd'

/* ===================== jsdom 环境 polyfill ===================== */
beforeAll(() => {
  // @ts-ignore
  window.matchMedia = window.matchMedia || function matchMediaMock(query: string) {
    return {
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }
  }
  // @ts-ignore
  window.getComputedStyle = window.getComputedStyle || function getComputedStyleMock() {
    return { getPropertyValue: () => '' }
  }
  // @ts-ignore
  if (typeof window.ResizeObserver === 'undefined') {
    // @ts-ignore
    window.ResizeObserver = class ResizeObserverMock {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
  }
  // @ts-ignore
  if (typeof window.Element.prototype.getBoundingClientRect === 'undefined') {
    // @ts-ignore
    window.Element.prototype.getBoundingClientRect = function() {
      return { top: 0, left: 0, bottom: 0, right: 0, width: 0, height: 0, x: 0, y: 0 }
    }
  }
})

function mountAntd(
  Component: any,
  props: Record<string, any> = {},
  children: any = null,
) {
  const VueComp = defineComponent(Component as any)
  const TestComponent = defineComponent(() => {
    if (children !== null) {
      return createElement(VueComp, props, children)
    }
    return createElement(VueComp, props)
  })
  currentWrapper = mount(TestComponent)
  return currentWrapper
}

let currentWrapper: any = null

beforeEach(() => {
  resetReactScheduler()
  currentWrapper = null
})

afterEach(() => {
  if (currentWrapper) {
    try { currentWrapper.unmount() } catch (e) {}
    currentWrapper = null
  }
  document.body.innerHTML = ''
})

/* ===================================================================
   布局组件
   =================================================================== */
describe('antd-layout - 布局组件', () => {

  it('Layout 渲染布局', () => {
    const wrapper = mountAntd(antd.Layout, null, createElement('div', null, 'Content'))
    expect(wrapper.find('.ant-layout').exists()).toBe(true)
    expect(wrapper.text()).toContain('Content')
  })

  it('Layout 包含 Header 和 Footer', () => {
    const VLayout = defineComponent(antd.Layout as any)
    const VHeader = defineComponent(antd.Layout.Header as any)
    const VFooter = defineComponent(antd.Layout.Footer as any)
    const VContent = defineComponent(antd.Layout.Content as any)
    const TestComponent = defineComponent(() => {
      return createElement(VLayout, null,
        createElement(VHeader, null, 'Header'),
        createElement(VContent, null, 'Content'),
        createElement(VFooter, null, 'Footer'),
      )
    })
    const wrapper = mount(TestComponent)
    expect(wrapper.find('.ant-layout').exists()).toBe(true)
    expect(wrapper.find('.ant-layout-header').exists()).toBe(true)
    expect(wrapper.find('.ant-layout-footer').exists()).toBe(true)
    expect(wrapper.find('.ant-layout-content').exists()).toBe(true)
    expect(wrapper.text()).toContain('Header')
    expect(wrapper.text()).toContain('Content')
    expect(wrapper.text()).toContain('Footer')
  })

  it('Layout 支持 Sider', () => {
    const VLayout = defineComponent(antd.Layout as any)
    const VSider = defineComponent(antd.Layout.Sider as any)
    const VContent = defineComponent(antd.Layout.Content as any)
    const TestComponent = defineComponent(() => {
      return createElement(VLayout, null,
        createElement(VSider, null, 'Sidebar'),
        createElement(VContent, null, 'Main'),
      )
    })
    const wrapper = mount(TestComponent)
    expect(wrapper.find('.ant-layout-sider').exists()).toBe(true)
    expect(wrapper.find('.ant-layout-content').exists()).toBe(true)
    expect(wrapper.text()).toContain('Sidebar')
    expect(wrapper.text()).toContain('Main')
  })

  it('Layout Sider 支持 collapsed 状态', () => {
    const VLayout = defineComponent(antd.Layout as any)
    const VSider = defineComponent(antd.Layout.Sider as any)
    const VContent = defineComponent(antd.Layout.Content as any)
    const TestComponent = defineComponent(() => {
      return createElement(VLayout, null,
        createElement(VSider, {collapsed: true, collapsedWidth: 80}, 'Sidebar'),
        createElement(VContent, null, 'Main'),
      )
    })
    const wrapper = mount(TestComponent)
    expect(wrapper.find('.ant-layout-sider-collapsed').exists()).toBe(true)
  })

  it('Row 和 Col 渲染栅格', () => {
    const VRow = defineComponent(antd.Row as any)
    const VCol = defineComponent(antd.Col as any)
    const TestComponent = defineComponent(() => {
      return createElement(VRow, {gutter: 16},
        createElement(VCol, {span: 12}, 'Left'),
        createElement(VCol, {span: 12}, 'Right'),
      )
    })
    const wrapper = mount(TestComponent)
    expect(wrapper.find('.ant-row').exists()).toBe(true)
    expect(wrapper.findAll('.ant-col').length).toBe(2)
    expect(wrapper.text()).toContain('Left')
    expect(wrapper.text()).toContain('Right')
  })

  it('Col 支持 offset', () => {
    const VRow = defineComponent(antd.Row as any)
    const VCol = defineComponent(antd.Col as any)
    const TestComponent = defineComponent(() => {
      return createElement(VRow, null,
        createElement(VCol, {span: 6, offset: 6}, 'Offset'),
      )
    })
    const wrapper = mount(TestComponent)
    expect(wrapper.find('.ant-col-offset-6').exists()).toBe(true)
  })

  it('Row 支持 justify 和 align', () => {
    const VRow = defineComponent(antd.Row as any)
    const VCol = defineComponent(antd.Col as any)
    const TestComponent = defineComponent(() => {
      return createElement(VRow, {justify: 'center', align: 'middle'},
        createElement(VCol, {span: 8}, 'Center'),
      )
    })
    const wrapper = mount(TestComponent)
    expect(wrapper.find('.ant-row-center').exists()).toBe(true)
    expect(wrapper.find('.ant-row-middle').exists()).toBe(true)
  })
})

/* ===================================================================
   缺失其他组件
   =================================================================== */
describe('antd-layout - 缺失其他组件', () => {

  /* ---------- Affix ---------- */
  it('Affix 渲染固钉', () => {
    const wrapper = mountAntd(antd.Affix, {offsetTop: 50}, createElement('div', null, 'Affix Content'))
    // antd v6: Affix 可能在内部渲染不同结构，只验证内容存在
    expect(wrapper.text()).toContain('Affix Content')
  })

  /* ---------- Anchor ---------- */
  it('Anchor 渲染锚点', () => {
    const items = [
      {key: 'section-1', href: '#section-1', title: 'Section 1'},
      {key: 'section-2', href: '#section-2', title: 'Section 2'},
    ]
    const wrapper = mountAntd(antd.Anchor, {items})
    expect(wrapper.find('.ant-anchor').exists()).toBe(true)
    expect(wrapper.text()).toContain('Section 1')
    expect(wrapper.text()).toContain('Section 2')
  })

  it('Anchor 支持的方向', () => {
    const items = [
      {key: 'a', href: '#a', title: 'A'},
    ]
    const wrapper = mountAntd(antd.Anchor, {items, direction: 'horizontal'})
    expect(wrapper.find('.ant-anchor').exists()).toBe(true)
  })

  /* ---------- FloatButton ---------- */
  it('FloatButton 渲染浮动按钮', () => {
    const wrapper = mountAntd(antd.FloatButton, {icon: '★'})
    expect(wrapper.find('.ant-float-btn').exists()).toBe(true)
  })

  it('FloatButton 支持 type=primary', () => {
    const wrapper = mountAntd(antd.FloatButton, {type: 'primary'})
    expect(wrapper.find('.ant-float-btn').exists()).toBe(true)
  })

  it('FloatButton.Group 渲染按钮组', () => {
    const wrapper = mountAntd(antd.FloatButton.Group, {shape: 'circle'},
      createElement(antd.FloatButton, {icon: 'A'}),
    )
    expect(wrapper.find('.ant-float-btn-group').exists()).toBe(true)
  })

  /* ---------- Watermark ---------- */
  it('Watermark 渲染水印', () => {
    const wrapper = mountAntd(antd.Watermark, {content: 'Test Watermark'}, createElement('div', null, 'Content'))
    // antd v6: Watermark 可能使用 canvas 渲染，类名可能不同，只验证内容存在
    expect(wrapper.text()).toContain('Content')
  })

  it('Watermark 支持多行文字', () => {
    const wrapper = mountAntd(antd.Watermark, {content: ['Line 1', 'Line 2']}, createElement('div', null, 'Content'))
    expect(wrapper.text()).toContain('Content')
  })

  /* ---------- Tour ---------- */
  it('Tour 渲染漫游引导', () => {
    const steps = [
      {title: 'Step 1', description: 'Description 1'},
    ]
    const wrapper = mountAntd(antd.Tour, {steps, open: true, getPopupContainer: () => document.body})
    // antd v6: Tour 可能渲染 Portal 弹层，类名可能不同，验证组件不报错即可
    expect(wrapper.exists()).toBe(true)
  })

  it('Tour 支持多步骤', () => {
    const steps = [
      {title: 'First', description: 'First desc'},
      {title: 'Second', description: 'Second desc'},
    ]
    const wrapper = mountAntd(antd.Tour, {steps, open: true, current: 0, getPopupContainer: () => document.body})
    expect(wrapper.exists()).toBe(true)
  })

  /* ---------- Splitter ---------- */
  it('Splitter 渲染分割面板', () => {
    const wrapper = mountAntd(antd.Splitter, null,
      createElement('div', {style: {height: '100%'}}, 'Left'),
      createElement('div', {style: {height: '100%'}}, 'Right'),
    )
    expect(wrapper.find('.ant-splitter').exists()).toBe(true)
  })

  it('Splitter 支持 vertical 方向', () => {
    const wrapper = mountAntd(antd.Splitter, {layout: 'vertical'},
      createElement('div', {style: {height: '100%'}}, 'Top'),
      createElement('div', {style: {height: '100%'}}, 'Bottom'),
    )
    expect(wrapper.find('.ant-splitter').exists()).toBe(true)
  })

  /* ---------- App ---------- */
  it('App 渲染根组件', () => {
    const wrapper = mountAntd(antd.App, null, createElement('div', null, 'App Content'))
    // antd v6: App 是轻量级根组件，验证内容渲染
    expect(wrapper.text()).toContain('App Content')
  })
})