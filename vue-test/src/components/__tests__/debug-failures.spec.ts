import {describe, it, expect} from 'vitest'
import {createElement} from '@react-like/vue'
import {Typography, Divider, Space, Statistic, Progress, Modal, Collapse} from 'antd'
import {mountAntd} from '../../test-setup'

describe('debug failures', () => {
  it('Typography.Paragraph', () => {
    const wrapper = mountAntd(Typography.Paragraph, null, 'Paragraph text')
    console.log('=== Typography.Paragraph HTML ===')
    console.log(wrapper.html())
    expect(wrapper.find('.ant-typography').exists()).toBe(true)
    expect(wrapper.text()).toContain('Paragraph text')
  })

  it('Divider orientation', () => {
    const wrapper = mountAntd(Divider, {titlePlacement: 'left'}, 'Left')
    console.log('=== Divider orientation HTML ===')
    console.log(wrapper.html())
    expect(wrapper.find('.ant-divider').exists()).toBe(true)
    expect(wrapper.find('.ant-divider-with-text-start').exists()).toBe(true)
  })

  it('Space', () => {
    const wrapper = mountAntd(
      Space,
      null,
      [createElement('span', null, 'Item 1'), createElement('span', null, 'Item 2')]
    )
    console.log('=== Space HTML ===')
    console.log(wrapper.html())
    expect(wrapper.find('.ant-space').exists()).toBe(true)
    expect(wrapper.text()).toContain('Item 1')
    expect(wrapper.text()).toContain('Item 2')
  })

  it('Statistic', () => {
    const wrapper = mountAntd(Statistic, {title: 'Sales', value: 12345})
    console.log('=== Statistic HTML ===')
    console.log(wrapper.html())
    expect(wrapper.find('.ant-statistic').exists()).toBe(true)
    expect(wrapper.find('.ant-statistic-content-value-int').exists()).toBe(true)
  })

  it('Progress', () => {
    const wrapper = mountAntd(Progress, {percent: 50})
    console.log('=== Progress HTML ===')
    console.log(wrapper.html())
    expect(wrapper.find('.ant-progress').exists()).toBe(true)
    expect(wrapper.find('.ant-progress-track').exists()).toBe(true)
  })

  it('Modal', () => {
    const wrapper = mountAntd(Modal, {open: true, title: 'Modal Title', getContainer: false, children: 'Modal Content'})
    console.log('=== Modal HTML ===')
    console.log(wrapper.html())
    expect(wrapper.find('.ant-modal').exists()).toBe(true)
    expect(wrapper.find('.ant-modal-title').text()).toBe('Modal Title')
    expect(wrapper.find('.ant-modal-body').text()).toContain('Modal Content')
  })

  it('Collapse expandIconPosition', () => {
    const items = [
      {key: '1', label: 'A', children: 'A'},
    ]
    const wrapper = mountAntd(Collapse, {items, expandIconPlacement: 'end'})
    console.log('=== Collapse HTML ===')
    console.log(wrapper.html())
    expect(wrapper.find('.ant-collapse').exists()).toBe(true)
    expect(wrapper.find('.ant-collapse-icon-placement-end').exists()).toBe(true)
  })
})