/**
 * antd 反馈弹层 & 数据展示组件测试
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
   反馈弹层组件（补充）
   =================================================================== */
describe('antd-feedback - 反馈弹层组件', () => {

  it('Drawer 渲染抽屉', () => {
    const wrapper = mountAntd(antd.Drawer, {
      open: true,
      title: 'Drawer Title',
      getContainer: false,
      children: 'Drawer Content'
    })
    expect(wrapper.find('.ant-drawer').exists()).toBe(true)
    expect(wrapper.find('.ant-drawer-title').text()).toBe('Drawer Title')
    expect(wrapper.find('.ant-drawer-body').text()).toContain('Drawer Content')
  })

  it('Drawer 关闭时不显示', () => {
    const wrapper = mountAntd(antd.Drawer, {open: false, title: 'Hidden', getContainer: false})
    expect(wrapper.find('.ant-drawer').exists()).toBe(false)
  })

  it('Drawer 支持 placement=right', () => {
    const wrapper = mountAntd(antd.Drawer, {open: true, placement: 'right', getContainer: false})
    expect(wrapper.find('.ant-drawer-right').exists()).toBe(true)
  })

  it('Drawer 支持 placement=left', () => {
    const wrapper = mountAntd(antd.Drawer, {open: true, placement: 'left', getContainer: false})
    expect(wrapper.find('.ant-drawer-left').exists()).toBe(true)
  })

  it('Drawer 支持 size=large', () => {
    const wrapper = mountAntd(antd.Drawer, {open: true, size: 'large', getContainer: false})
    expect(wrapper.find('.ant-drawer').exists()).toBe(true)
  })

  it('Tooltip 渲染提示组件', () => {
    const wrapper = mountAntd(antd.Tooltip, {title: 'Tooltip text'}, createElement('span', null, 'Hover'))
    expect(wrapper.find('.ant-tooltip-trigger').exists()).toBe(true)
    expect(wrapper.text()).toContain('Hover')
  })

  it('Tooltip 支持 color 属性', () => {
    const wrapper = mountAntd(antd.Tooltip, {title: 'Red tip', color: 'red'}, createElement('span', null, 'Red'))
    expect(wrapper.find('.ant-tooltip-trigger').exists()).toBe(true)
  })

  it('Popover 渲染弹出卡片', () => {
    const wrapper = mountAntd(antd.Popover, {title: 'Popover Title', content: 'Popover content'}, createElement('span', null, 'Click'))
    expect(wrapper.find('.ant-popover-trigger').exists()).toBe(true)
    expect(wrapper.text()).toContain('Click')
  })

  it('Popover 支持不同 trigger', () => {
    const wrapper = mountAntd(antd.Popover, {title: 'Title', content: 'Content', trigger: 'click'}, createElement('span', null, 'Click me'))
    expect(wrapper.find('.ant-popover-trigger').exists()).toBe(true)
  })

  it('Popconfirm 渲染确认弹出', () => {
    const wrapper = mountAntd(antd.Popconfirm, {title: 'Confirm?', description: 'Are you sure?'}, createElement('span', null, 'Delete'))
    expect(wrapper.find('.ant-popover-trigger').exists()).toBe(true)
    expect(wrapper.text()).toContain('Delete')
  })

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

/* ===================================================================
   数据展示组件（补充）
   =================================================================== */
describe('antd-feedback - 数据展示组件', () => {

  it('Tree 渲染树形控件', () => {
    const treeData = [
      {title: 'Parent 1', key: '0-0', children: [
        {title: 'Child 1', key: '0-0-0'},
      ]},
    ]
    const wrapper = mountAntd(antd.Tree, {treeData, defaultExpandedKeys: ['0-0']})
    expect(wrapper.find('.ant-tree').exists()).toBe(true)
    expect(wrapper.text()).toContain('Parent 1')
    expect(wrapper.text()).toContain('Child 1')
  })

  it('Tree 支持 checkable', () => {
    const treeData = [
      {title: 'Node 1', key: '1'},
      {title: 'Node 2', key: '2'},
    ]
    const wrapper = mountAntd(antd.Tree, {treeData, checkable: true})
    expect(wrapper.find('.ant-tree-checkbox').exists()).toBe(true)
  })

  it('Tree 支持 defaultSelectedKeys', () => {
    const treeData = [
      {title: 'Selected', key: '1'},
      {title: 'Not', key: '2'},
    ]
    const wrapper = mountAntd(antd.Tree, {treeData, defaultSelectedKeys: ['1']})
    expect(wrapper.find('.ant-tree-node-selected').exists()).toBe(true)
  })

  it('Calendar 渲染日历', () => {
    const wrapper = mountAntd(antd.Calendar, {style: {width: 300}})
    expect(wrapper.find('.ant-picker-calendar').exists()).toBe(true)
    expect(wrapper.find('.ant-picker-body').exists()).toBe(true)
  })

  it('Timeline 渲染时间轴', () => {
    const items = [
      {children: 'Event 1'},
      {children: 'Event 2'},
      {children: 'Event 3'},
    ]
    const wrapper = mountAntd(antd.Timeline, {items})
    expect(wrapper.find('.ant-timeline').exists()).toBe(true)
    expect(wrapper.findAll('.ant-timeline-item').length).toBe(3)
    expect(wrapper.text()).toContain('Event 1')
    expect(wrapper.text()).toContain('Event 2')
  })

  it('Timeline 支持 color 属性', () => {
    const items = [
      {children: 'Red', color: 'red'},
      {children: 'Green', color: 'green'},
    ]
    const wrapper = mountAntd(antd.Timeline, {items})
    expect(wrapper.find('.ant-timeline').exists()).toBe(true)
  })

  it('Timeline 支持 pending 模式', () => {
    const items = [
      {children: 'Done'},
    ]
    const wrapper = mountAntd(antd.Timeline, {items, pending: 'Loading...'})
    expect(wrapper.find('.ant-timeline').exists()).toBe(true)
  })

  it('Image 渲染图片', () => {
    const wrapper = mountAntd(antd.Image, {src: 'https://example.com/test.png', width: 200})
    expect(wrapper.find('.ant-image').exists()).toBe(true)
    expect(wrapper.find('img').exists()).toBe(true)
  })

  it('Image 支持 fallback', () => {
    const wrapper = mountAntd(antd.Image, {src: 'bad-url', fallback: 'https://example.com/fallback.png'})
    expect(wrapper.find('.ant-image').exists()).toBe(true)
  })

  it('Image 支持 preview 配置', () => {
    const wrapper = mountAntd(antd.Image, {src: 'https://example.com/img.png', preview: false})
    expect(wrapper.find('.ant-image').exists()).toBe(true)
  })

  it('QRCode 渲染二维码', () => {
    const wrapper = mountAntd(antd.QRCode, {value: 'https://example.com'})
    expect(wrapper.find('.ant-qrcode').exists()).toBe(true)
    expect(wrapper.find('canvas').exists()).toBe(true)
  })

  it('QRCode 支持 errorLevel', () => {
    const wrapper = mountAntd(antd.QRCode, {value: 'https://test.com', errorLevel: 'H'})
    expect(wrapper.find('.ant-qrcode').exists()).toBe(true)
  })

  it('QRCode 支持 icon 配置', () => {
    const wrapper = mountAntd(antd.QRCode, {value: 'https://test.com', icon: 'https://example.com/icon.png'})
    expect(wrapper.find('.ant-qrcode').exists()).toBe(true)
  })

  it('Segmented 渲染分段控制器', () => {
    const options = ['Daily', 'Weekly', 'Monthly']
    const wrapper = mountAntd(antd.Segmented, {options, defaultValue: 'Weekly'})
    expect(wrapper.find('.ant-segmented').exists()).toBe(true)
    expect(wrapper.text()).toContain('Daily')
    expect(wrapper.text()).toContain('Weekly')
    expect(wrapper.text()).toContain('Monthly')
  })

  it('Segmented 支持 disabled 状态', () => {
    const options = ['A', 'B']
    const wrapper = mountAntd(antd.Segmented, {options, disabled: true})
    expect(wrapper.find('.ant-segmented-disabled').exists()).toBe(true)
  })

  it('Segmented 支持 block 属性', () => {
    const options = ['X', 'Y']
    const wrapper = mountAntd(antd.Segmented, {options, block: true})
    expect(wrapper.find('.ant-segmented').exists()).toBe(true)
  })

  it('Carousel 渲染走马灯', () => {
    const wrapper = mountAntd(antd.Carousel, null, [
      createElement('div', null, 'Slide 1'),
      createElement('div', null, 'Slide 2'),
    ])
    expect(wrapper.find('.ant-carousel').exists()).toBe(true)
    expect(wrapper.find('.slick-slider').exists()).toBe(true)
  })
})