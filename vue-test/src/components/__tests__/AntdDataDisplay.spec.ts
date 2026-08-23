/**
 * antd 数据展示组件测试
 * 从 AntdFeedback.spec.ts 分离以避免单个文件内存过大
 */
import {describe, it, expect, beforeEach, afterEach} from 'vitest'
import {createElement, resetReactScheduler} from 'react'
import {Tree, Calendar, Timeline, Image, QRCode, Segmented, Carousel} from 'antd'
import {mountAntd, cleanup} from '../../test-setup'

let currentWrapper: any = null
beforeEach(() => { resetReactScheduler(); currentWrapper = null })
afterEach(() => { cleanup(); currentWrapper = null })

/* ===================================================================
   数据展示组件
   =================================================================== */
describe('antd-data-display - 数据展示组件', () => {

  it('Tree 渲染树形控件', () => {
    const treeData = [
      {title: 'Parent 1', key: '0-0', children: [
        {title: 'Child 1', key: '0-0-0'},
      ]},
    ]
    const wrapper = mountAntd(Tree, {treeData, defaultExpandedKeys: ['0-0']})
    expect(wrapper.exists()).toBe(true)
  })

  it('Tree 支持 checkable', () => {
    const treeData = [
      {title: 'Node 1', key: '1'},
      {title: 'Node 2', key: '2'},
    ]
    const wrapper = mountAntd(Tree, {treeData, checkable: true})
    expect(wrapper.exists()).toBe(true)
  })

  it('Tree 支持 defaultSelectedKeys', () => {
    const treeData = [
      {title: 'Selected', key: '1'},
      {title: 'Not', key: '2'},
    ]
    const wrapper = mountAntd(Tree, {treeData, defaultSelectedKeys: ['1']})
    expect(wrapper.exists()).toBe(true)
  })

  it('Calendar 渲染日历', () => {
    const wrapper = mountAntd(Calendar, {style: {width: 300}})
    expect(wrapper.find('.ant-picker-calendar').exists()).toBe(true)
    expect(wrapper.find('.ant-picker-body').exists()).toBe(true)
  })

  it('Timeline 渲染时间轴', () => {
    const items = [
      {children: 'Event 1'},
      {children: 'Event 2'},
      {children: 'Event 3'},
    ]
    const wrapper = mountAntd(Timeline, {items})
    expect(wrapper.find('.ant-timeline-item').exists()).toBe(true)
    expect(wrapper.text()).toContain('Event 1')
    expect(wrapper.text()).toContain('Event 2')
  })

  it('Timeline 支持 color 属性', () => {
    const items = [
      {children: 'Red', color: 'red'},
      {children: 'Green', color: 'green'},
    ]
    const wrapper = mountAntd(Timeline, {items})
    expect(wrapper.find('.ant-timeline-item').exists()).toBe(true)
  })

  it('Timeline 支持 pending 模式', () => {
    const items = [
      {children: 'Done'},
    ]
    const wrapper = mountAntd(Timeline, {items, pending: 'Loading...'})
    expect(wrapper.find('.ant-timeline-item').exists()).toBe(true)
  })

  it('Image 渲染图片', () => {
    const wrapper = mountAntd(Image, {src: 'https://example.com/test.png', width: 200})
    expect(wrapper.find('.ant-image').exists()).toBe(true)
    expect(wrapper.find('img').exists()).toBe(true)
  })

  it('Image 支持 fallback', () => {
    const wrapper = mountAntd(Image, {src: 'bad-url', fallback: 'https://example.com/fallback.png'})
    expect(wrapper.find('.ant-image').exists()).toBe(true)
  })

  it('Image 支持 preview 配置', () => {
    const wrapper = mountAntd(Image, {src: 'https://example.com/img.png', preview: false})
    expect(wrapper.find('.ant-image').exists()).toBe(true)
  })

  it('QRCode 渲染二维码', () => {
    const wrapper = mountAntd(QRCode, {value: 'https://example.com'})
    expect(wrapper.find('.ant-qrcode').exists()).toBe(true)
    expect(wrapper.find('canvas').exists()).toBe(true)
  })

  it('QRCode 支持 errorLevel', () => {
    const wrapper = mountAntd(QRCode, {value: 'https://test.com', errorLevel: 'H'})
    expect(wrapper.find('.ant-qrcode').exists()).toBe(true)
  })

  it('QRCode 支持 icon 配置', () => {
    const wrapper = mountAntd(QRCode, {value: 'https://test.com', icon: 'https://example.com/icon.png'})
    expect(wrapper.find('.ant-qrcode').exists()).toBe(true)
  })

  it('Segmented 渲染分段控制器', () => {
    const options = ['Daily', 'Weekly', 'Monthly']
    const wrapper = mountAntd(Segmented, {options, defaultValue: 'Weekly'})
    expect(wrapper.find('.ant-segmented').exists()).toBe(true)
    expect(wrapper.text()).toContain('Daily')
    expect(wrapper.text()).toContain('Weekly')
    expect(wrapper.text()).toContain('Monthly')
  })

  it('Segmented 支持 disabled 状态', () => {
    const options = ['A', 'B']
    const wrapper = mountAntd(Segmented, {options, disabled: true})
    expect(wrapper.find('.ant-segmented-disabled').exists()).toBe(true)
  })

  it('Segmented 支持 block 属性', () => {
    const options = ['X', 'Y']
    const wrapper = mountAntd(Segmented, {options, block: true})
    expect(wrapper.find('.ant-segmented').exists()).toBe(true)
  })

  it('Carousel 渲染走马灯', () => {
    const wrapper = mountAntd(Carousel, null, [
      createElement('div', null, 'Slide 1'),
      createElement('div', null, 'Slide 2'),
    ])
    expect(wrapper.find('.ant-carousel').exists()).toBe(true)
  })
})