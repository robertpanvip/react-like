/**
 * antd (Ant Design) 组件集成测试套件
 *
 * 目的：验证 antd v6 的所有核心组件在 @react-like/vue 桥接层下
 * 能够正确渲染、交互，行为与 React 原生环境完全一致。
 *
 * 测试策略：
 *   - 每个 antd 组件通过 defineComponent 包装为 Vue 组件
 *   - 使用 @vue/test-utils 的 mount 挂载渲染
 *   - 断言 DOM 输出、属性传递、事件回调、子组件渲染
 *   - 对比 React 原生行为（通过注释标注 React 预期）
 */
import {describe, it, expect, vi, beforeAll, beforeEach, afterEach} from 'vitest'
import {mount} from '@vue/test-utils'
import {defineComponent, createElement, Fragment, useState, useEffect, useRef, useMemo, resetReactScheduler} from '@react-like/vue'
import * as antd from 'antd'

/* ===================== jsdom 环境 polyfill ===================== */

// antd 的 responsiveObserver 依赖 window.matchMedia
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
    return {
      getPropertyValue: () => '',
    }
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

/* ===================== 辅助函数 ===================== */

/**
 * 将 antd 组件包装为 Vue 可挂载的测试组件。
 * 通过 createElement 模拟 JSX 用法，确保经过 ReactElement → toVNode 链路。
 */
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
  return mount(TestComponent)
}

/* ===================== 测试隔离 ===================== */
const _origBeforeEach = globalThis.beforeEach
if (typeof resetReactScheduler === 'function') {
  // @ts-ignore
  beforeEach(() => {
    resetReactScheduler()
  })
}

/* ===================================================================
   1. 基础展示组件
   =================================================================== */

describe('antd - 基础展示组件', () => {

  /* ---------- Button ---------- */
  it('Button 渲染文字子节点，支持 type/size 属性', () => {
    const wrapper = mountAntd(antd.Button, {type: 'primary'}, 'Primary Button')
    // React 预期：<button class="ant-btn ant-btn-primary">Primary Button</button>
    const btn = wrapper.find('button')
    expect(btn.exists()).toBe(true)
    expect(btn.text()).toBe('Primary Button')
    expect(btn.classes()).toContain('ant-btn')
    expect(btn.classes()).toContain('ant-btn-primary')
  })

  it('Button 支持 onClick 事件回调', () => {
    const onClick = vi.fn()
    const wrapper = mountAntd(antd.Button, {onClick}, 'Click Me')
    wrapper.find('button').trigger('click')
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('Button disabled 状态下不可点击', () => {
    const onClick = vi.fn()
    const wrapper = mountAntd(antd.Button, {disabled: true, onClick}, 'Disabled')
    const btn = wrapper.find('button')
    expect(btn.attributes('disabled')).toBeDefined()
    btn.trigger('click')
    expect(onClick).not.toHaveBeenCalled()
  })

  it('Button 支持不同 size (large/small)', () => {
    const largeWrapper = mountAntd(antd.Button, {size: 'large'}, 'Large')
    expect(largeWrapper.find('button').classes()).toContain('ant-btn-lg')

    const smallWrapper = mountAntd(antd.Button, {size: 'small'}, 'Small')
    expect(smallWrapper.find('button').classes()).toContain('ant-btn-sm')
  })

  it('Button loading 状态显示加载图标', () => {
    const wrapper = mountAntd(antd.Button, {loading: true}, 'Loading')
    // React 预期：loading 时 button 内会出现 .ant-btn-loading-icon
    const btn = wrapper.find('button')
    expect(btn.classes()).toContain('ant-btn-loading')
    expect(btn.exists()).toBe(true)
  })

  it('Button danger 类型', () => {
    const wrapper = mountAntd(antd.Button, {danger: true}, 'Danger')
    expect(wrapper.find('button').classes()).toContain('ant-btn-dangerous')
  })

  it('Button ghost 类型', () => {
    const wrapper = mountAntd(antd.Button, {ghost: true}, 'Ghost')
    expect(wrapper.find('button').classes()).toContain('ant-btn-background-ghost')
  })

  it('Button 支持 block 属性', () => {
    const wrapper = mountAntd(antd.Button, {block: true}, 'Block')
    expect(wrapper.find('button').classes()).toContain('ant-btn-block')
  })

  it('Button 支持 href 属性（渲染为 a 标签）', () => {
    const wrapper = mountAntd(antd.Button, {href: 'https://example.com'}, 'Link')
    expect(wrapper.find('a').exists()).toBe(true)
    expect(wrapper.text()).toBe('Link')
  })

  /* ---------- Tag ---------- */
  it('Tag 渲染文本内容', () => {
    const wrapper = mountAntd(antd.Tag, {color: 'blue'}, 'Blue Tag')
    // React 预期：<span class="ant-tag ant-tag-blue">Blue Tag</span>
    const tag = wrapper.find('.ant-tag')
    expect(tag.exists()).toBe(true)
    expect(tag.text()).toBe('Blue Tag')
  })

  it('Tag 支持 closable', () => {
    const wrapper = mountAntd(antd.Tag, {closable: true}, 'Closable')
    expect(wrapper.find('.ant-tag').exists()).toBe(true)
    expect(wrapper.find('.ant-tag-close-icon').exists()).toBe(true)
  })

  it('Tag 不同颜色渲染', () => {
    const wrapper = mountAntd(antd.Tag, {color: 'red'}, 'Red')
    expect(wrapper.find('.ant-tag').classes()).toContain('ant-tag-red')
  })

  /* ---------- Badge ---------- */
  it('Badge 显示计数徽标', () => {
    const wrapper = mountAntd(antd.Badge, {count: 5}, createElement('span', null, 'Inbox'))
    // React 预期：渲染包含 .ant-badge 的容器，内部有 .ant-badge-count
    expect(wrapper.find('.ant-badge').exists()).toBe(true)
    expect(wrapper.find('.ant-badge-count').exists()).toBe(true)
  })

  it('Badge dot 模式', () => {
    const wrapper = mountAntd(antd.Badge, {dot: true}, createElement('span', null, 'Dot'))
    expect(wrapper.find('.ant-badge-dot').exists()).toBe(true)
  })

  it('Badge 独立使用（无子元素）', () => {
    const wrapper = mountAntd(antd.Badge, {count: 8})
    expect(wrapper.find('.ant-badge-count').exists()).toBe(true)
  })

  it('Badge 支持 status 模式', () => {
    const wrapper = mountAntd(antd.Badge, {status: 'success'})
    expect(wrapper.find('.ant-badge-status-dot').exists()).toBe(true)
  })

  /* ---------- Typography ---------- */
  it('Typography.Text 渲染文本', () => {
    const wrapper = mountAntd(antd.Typography.Text, null, 'Hello Typography')
    expect(wrapper.find('.ant-typography').exists()).toBe(true)
    expect(wrapper.text()).toContain('Hello Typography')
  })

  it('Typography.Title 渲染标题', () => {
    const wrapper = mountAntd(antd.Typography.Title, {level: 1}, 'Title 1')
    const el = wrapper.find('.ant-typography')
    expect(el.exists()).toBe(true)
    expect(el.text()).toBe('Title 1')
    // h1 标签
    expect(wrapper.find('h1').exists()).toBe(true)
  })

  it('Typography.Paragraph 渲染段落', () => {
    const wrapper = mountAntd(antd.Typography.Paragraph, null, 'Paragraph text')
    expect(wrapper.find('.ant-typography').exists()).toBe(true)
    expect(wrapper.find('p').exists()).toBe(true)
    expect(wrapper.text()).toContain('Paragraph text')
  })

  it('Typography.Text type 属性', () => {
    const wrapper = mountAntd(antd.Typography.Text, {type: 'danger'}, 'Danger Text')
    expect(wrapper.find('.ant-typography-danger').exists()).toBe(true)
  })

  it('Typography.Text delete 属性', () => {
    const wrapper = mountAntd(antd.Typography.Text, {delete: true}, 'Deleted')
    expect(wrapper.find('del').exists()).toBe(true)
  })

  it('Typography.Text copyable 渲染复制图标', () => {
    const wrapper = mountAntd(antd.Typography.Text, {copyable: true}, 'Copy Me')
    // 渲染复制图标
    expect(wrapper.find('.ant-typography-copy').exists()).toBe(true)
  })

  it('Typography.Title 不同 level 渲染不同标题标签', () => {
    const h2 = mountAntd(antd.Typography.Title, {level: 2}, 'H2')
    expect(h2.find('h2').exists()).toBe(true)

    const h3 = mountAntd(antd.Typography.Title, {level: 3}, 'H3')
    expect(h3.find('h3').exists()).toBe(true)
  })

  /* ---------- Divider ---------- */
  it('Divider 渲染分割线', () => {
    const wrapper = mountAntd(antd.Divider, null, 'Text')
    expect(wrapper.find('.ant-divider').exists()).toBe(true)
    expect(wrapper.find('.ant-divider-inner-text').exists()).toBe(true)
    expect(wrapper.find('.ant-divider-inner-text').text()).toBe('Text')
  })

  it('Divider 无文字', () => {
    const wrapper = mountAntd(antd.Divider)
    expect(wrapper.find('.ant-divider').exists()).toBe(true)
  })

  it('Divider dashed 属性', () => {
    const wrapper = mountAntd(antd.Divider, {dashed: true})
    expect(wrapper.find('.ant-divider-dashed').exists()).toBe(true)
  })

  it('Divider orientation 属性', () => {
    const wrapper = mountAntd(antd.Divider, {titlePlacement: 'left'}, 'Left')
    expect(wrapper.find('.ant-divider-left').exists()).toBe(true)

    const rightWrapper = mountAntd(antd.Divider, {titlePlacement: 'right'}, 'Right')
    expect(rightWrapper.find('.ant-divider-right').exists()).toBe(true)
  })

  /* ---------- Empty ---------- */
  it('Empty 渲染空状态', () => {
    const wrapper = mountAntd(antd.Empty)
    expect(wrapper.find('.ant-empty').exists()).toBe(true)
    expect(wrapper.find('.ant-empty-image').exists()).toBe(true)
  })

  it('Empty 支持自定义 description', () => {
    const wrapper = mountAntd(antd.Empty, {description: 'No Data'})
    expect(wrapper.find('.ant-empty-description').exists()).toBe(true)
    expect(wrapper.find('.ant-empty-description').text()).toBe('No Data')
  })

  it('Empty 支持子节点作为额外内容', () => {
    const wrapper = mountAntd(antd.Empty, {description: 'Empty'}, createElement('button', null, 'Create'))
    expect(wrapper.find('.ant-empty').exists()).toBe(true)
    expect(wrapper.find('button').exists()).toBe(true)
  })
})

/* ===================================================================
   2. 表单控件组件
   =================================================================== */

describe('antd - 表单控件组件', () => {

  /* ---------- Input ---------- */
  it('Input 渲染输入框', () => {
    const wrapper = mountAntd(antd.Input, {placeholder: 'Enter text'})
    const input = wrapper.find('input')
    expect(input.exists()).toBe(true)
    expect(input.attributes('placeholder')).toBe('Enter text')
  })

  it('Input disabled 状态', () => {
    const wrapper = mountAntd(antd.Input, {disabled: true})
    expect(wrapper.find('input').attributes('disabled')).toBeDefined()
  })

  it('Input 支持 prefix', () => {
    const wrapper = mountAntd(antd.Input, {
      prefix: createElement('span', {className: 'prefix-icon'}, '$'),
    })
    expect(wrapper.find('.ant-input-affix-wrapper').exists()).toBe(true)
  })

  it('Input.Password 渲染密码输入框', () => {
    const wrapper = mountAntd(antd.Input.Password, {placeholder: 'Password'})
    expect(wrapper.find('input').exists()).toBe(true)
    expect(wrapper.find('input').attributes('type')).toBe('password')
  })

  it('Input.TextArea 渲染文本域', () => {
    const wrapper = mountAntd(antd.Input.TextArea, {rows: 3, placeholder: 'Textarea'})
    expect(wrapper.find('textarea').exists()).toBe(true)
    expect(wrapper.find('textarea').attributes('placeholder')).toBe('Textarea')
  })

  it('Input.Search 渲染搜索框', () => {
    const wrapper = mountAntd(antd.Input.Search, {placeholder: 'Search'})
    expect(wrapper.find('.ant-input-search').exists()).toBe(true)
    expect(wrapper.find('input').exists()).toBe(true)
  })

  /* ---------- Select ---------- */
  it('Select 渲染选择器', () => {
    const options = [
      {value: 'a', label: 'Option A'},
      {value: 'b', label: 'Option B'},
    ]
    const wrapper = mountAntd(antd.Select, {
      options,
      placeholder: 'Select option',
      style: {width: 200}
    })
    expect(wrapper.find('.ant-select').exists()).toBe(true)
  })

  it('Select disabled 状态', () => {
    const wrapper = mountAntd(antd.Select, {disabled: true})
    expect(wrapper.find('.ant-select-disabled').exists()).toBe(true)
  })

  /* ---------- Checkbox ---------- */
  it('Checkbox 渲染复选框', () => {
    const wrapper = mountAntd(antd.Checkbox, null, 'Checkbox Label')
    expect(wrapper.find('.ant-checkbox-wrapper').exists()).toBe(true)
    expect(wrapper.text()).toContain('Checkbox Label')
  })

  it('Checkbox checked 状态', () => {
    const wrapper = mountAntd(antd.Checkbox, {checked: true}, 'Checked')
    const checkbox = wrapper.find('.ant-checkbox')
    expect(checkbox.classes()).toContain('ant-checkbox-checked')
  })

  it('Checkbox disabled 状态', () => {
    const wrapper = mountAntd(antd.Checkbox, {disabled: true}, 'Disabled')
    expect(wrapper.find('.ant-checkbox-disabled').exists()).toBe(true)
  })

  it('Checkbox.Group 渲染多选组', () => {
    const options = ['Apple', 'Pear', 'Orange']
    const wrapper = mountAntd(antd.Checkbox.Group, {options, defaultValue: ['Apple']})
    expect(wrapper.find('.ant-checkbox-group').exists()).toBe(true)
  })

  /* ---------- Radio ---------- */
  it('Radio 渲染单选框', () => {
    const wrapper = mountAntd(antd.Radio, null, 'Radio Label')
    expect(wrapper.find('.ant-radio-wrapper').exists()).toBe(true)
    expect(wrapper.text()).toContain('Radio Label')
  })

  it('Radio checked 状态', () => {
    const wrapper = mountAntd(antd.Radio, {checked: true}, 'Checked')
    const radio = wrapper.find('.ant-radio')
    expect(radio.classes()).toContain('ant-radio-checked')
  })

  it('Radio disabled 状态', () => {
    const wrapper = mountAntd(antd.Radio, {disabled: true}, 'Disabled')
    expect(wrapper.find('.ant-radio-disabled').exists()).toBe(true)
  })

  it('Radio.Group 渲染单选组', () => {
    const wrapper = mountAntd(antd.Radio.Group, {
      options: [
        {value: 'a', label: 'A'},
        {value: 'b', label: 'B'},
      ],
      defaultValue: 'a'
    })
    expect(wrapper.find('.ant-radio-group').exists()).toBe(true)
  })

  /* ---------- Switch ---------- */
  it('Switch 渲染开关', () => {
    const wrapper = mountAntd(antd.Switch, null)
    expect(wrapper.find('.ant-switch').exists()).toBe(true)
  })

  it('Switch checked 状态', () => {
    const wrapper = mountAntd(antd.Switch, {checked: true})
    expect(wrapper.find('.ant-switch-checked').exists()).toBe(true)
  })

  it('Switch disabled 状态', () => {
    const wrapper = mountAntd(antd.Switch, {disabled: true})
    expect(wrapper.find('.ant-switch-disabled').exists()).toBe(true)
  })

  it('Switch 支持 checkedChildren 属性', () => {
    const wrapper = mountAntd(antd.Switch, {
      checkedChildren: 'ON',
      unCheckedChildren: 'OFF',
      checked: true
    })
    expect(wrapper.find('.ant-switch').exists()).toBe(true)
  })

  it('Switch 支持 loading 状态', () => {
    const wrapper = mountAntd(antd.Switch, {loading: true})
    expect(wrapper.find('.ant-switch-loading').exists()).toBe(true)
  })

  /* ---------- Rate ---------- */
  it('Rate 渲染评分组件', () => {
    const wrapper = mountAntd(antd.Rate, null)
    expect(wrapper.find('.ant-rate').exists()).toBe(true)
  })

  it('Rate 支持 count 属性', () => {
    const wrapper = mountAntd(antd.Rate, {count: 10})
    expect(wrapper.findAll('.ant-rate-star').length).toBeGreaterThanOrEqual(10)
  })

  it('Rate disabled 状态', () => {
    const wrapper = mountAntd(antd.Rate, {disabled: true, value: 3})
    expect(wrapper.find('.ant-rate-disabled').exists()).toBe(true)
  })

  /* ---------- InputNumber ---------- */
  it('InputNumber 渲染数字输入框', () => {
    const wrapper = mountAntd(antd.InputNumber, {min: 0, max: 10, value: 5})
    expect(wrapper.find('.ant-input-number').exists()).toBe(true)
    expect(wrapper.find('input').exists()).toBe(true)
  })

  it('InputNumber disabled 状态', () => {
    const wrapper = mountAntd(antd.InputNumber, {disabled: true})
    expect(wrapper.find('.ant-input-number-disabled').exists()).toBe(true)
  })

  /* ---------- Slider ---------- */
  it('Slider 渲染滑块', () => {
    const wrapper = mountAntd(antd.Slider, {defaultValue: 30, style: {width: 300}})
    expect(wrapper.find('.ant-slider').exists()).toBe(true)
    expect(wrapper.find('.ant-slider-handle').exists()).toBe(true)
  })

  it('Slider 支持 range 模式', () => {
    const wrapper = mountAntd(antd.Slider, {range: true, defaultValue: [20, 50], style: {width: 300}})
    expect(wrapper.find('.ant-slider').exists()).toBe(true)
  })

  it('Slider disabled 状态', () => {
    const wrapper = mountAntd(antd.Slider, {disabled: true, defaultValue: 30})
    expect(wrapper.find('.ant-slider-disabled').exists()).toBe(true)
  })
})

/* ===================================================================
   3. 数据展示组件
   =================================================================== */

describe('antd - 数据展示组件', () => {

  /* ---------- Card ---------- */
  it('Card 渲染标题和内容', () => {
    const wrapper = mountAntd(antd.Card, {title: 'Card Title'}, 'Card content')
    expect(wrapper.find('.ant-card').exists()).toBe(true)
    expect(wrapper.find('.ant-card-head-title').exists()).toBe(true)
    expect(wrapper.find('.ant-card-head-title').text()).toBe('Card Title')
    expect(wrapper.find('.ant-card-body').text()).toContain('Card content')
  })

  it('Card 无标题', () => {
    const wrapper = mountAntd(antd.Card, null, 'Content only')
    expect(wrapper.find('.ant-card').exists()).toBe(true)
    expect(wrapper.find('.ant-card-body').text()).toBe('Content only')
  })

  it('Card 支持 hoverable 属性', () => {
    const wrapper = mountAntd(antd.Card, {hoverable: true}, 'Hoverable')
    expect(wrapper.find('.ant-card-hoverable').exists()).toBe(true)
  })

  it('Card 支持 size=small', () => {
    const wrapper = mountAntd(antd.Card, {size: 'small'}, 'Small Card')
    expect(wrapper.find('.ant-card-small').exists()).toBe(true)
  })

  /* ---------- Avatar ---------- */
  it('Avatar 渲染头像', () => {
    const wrapper = mountAntd(antd.Avatar, null, 'U')
    expect(wrapper.find('.ant-avatar').exists()).toBe(true)
  })

  it('Avatar 支持 size 和 shape 属性', () => {
    const wrapper = mountAntd(antd.Avatar, {size: 64, shape: 'square'}, 'A')
    const avatar = wrapper.find('.ant-avatar')
    expect(avatar.classes()).toContain('ant-avatar-square')
  })

  it('Avatar 支持 src 图片', () => {
    const wrapper = mountAntd(antd.Avatar, {src: 'https://example.com/avatar.png'})
    expect(wrapper.find('.ant-avatar').exists()).toBe(true)
    expect(wrapper.find('img').exists()).toBe(true)
  })

  it('Avatar 支持 icon 属性', () => {
    const wrapper = mountAntd(antd.Avatar, {
      icon: createElement('span', {className: 'test-icon'}, '★')
    })
    expect(wrapper.find('.ant-avatar').exists()).toBe(true)
  })

  /* ---------- Space ---------- */
  it('Space 渲染间距组件', () => {
    const wrapper = mountAntd(
      antd.Space,
      null,
      [createElement('span', null, 'Item 1'), createElement('span', null, 'Item 2')]
    )
    expect(wrapper.find('.ant-space').exists()).toBe(true)
    expect(wrapper.findAll('.ant-space-item').length).toBeGreaterThanOrEqual(2)
  })

  it('Space 支持 size 属性', () => {
    const wrapper = mountAntd(
      antd.Space,
      {size: 'large'},
      [createElement('span', null, 'A'), createElement('span', null, 'B')]
    )
    expect(wrapper.find('.ant-space').exists()).toBe(true)
  })

  it('Space 支持 wrap 属性', () => {
    const wrapper = mountAntd(
      antd.Space,
      {wrap: true},
      [createElement('span', null, 'A'), createElement('span', null, 'B')]
    )
    expect(wrapper.find('.ant-space').exists()).toBe(true)
  })

  /* ---------- Flex ---------- */
  it('Flex 渲染弹性布局', () => {
    const wrapper = mountAntd(
      antd.Flex,
      {wrap: 'wrap', gap: 'middle'},
      [createElement('span', null, '1'), createElement('span', null, '2')]
    )
    expect(wrapper.find('.ant-flex').exists()).toBe(true)
  })

  it('Flex 支持 vertical 方向', () => {
    const wrapper = mountAntd(
      antd.Flex,
      {vertical: true},
      [createElement('span', null, 'A'), createElement('span', null, 'B')]
    )
    expect(wrapper.find('.ant-flex-vertical').exists()).toBe(true)
  })

  /* ---------- Statistic ---------- */
  it('Statistic 渲染统计数值', () => {
    const wrapper = mountAntd(antd.Statistic, {title: 'Sales', value: 12345})
    expect(wrapper.find('.ant-statistic').exists()).toBe(true)
    expect(wrapper.find('.ant-statistic-title').text()).toBe('Sales')
    expect(wrapper.find('.ant-statistic-content-value').exists()).toBe(true)
  })

  it('Statistic 支持 prefix/suffix', () => {
    const wrapper = mountAntd(antd.Statistic, {
      title: 'Growth',
      value: 11.28,
      prefix: '↑',
      suffix: '%'
    })
    expect(wrapper.find('.ant-statistic').exists()).toBe(true)
  })

  /* ---------- Progress ---------- */
  it('Progress 渲染进度条', () => {
    const wrapper = mountAntd(antd.Progress, {percent: 50})
    expect(wrapper.find('.ant-progress').exists()).toBe(true)
    // line 模式下显示进度条轨迹
    expect(wrapper.find('.ant-progress-bg').exists()).toBe(true)
  })

  it('Progress 支持 type=circle', () => {
    const wrapper = mountAntd(antd.Progress, {type: 'circle', percent: 75})
    expect(wrapper.find('.ant-progress-circle').exists()).toBe(true)
  })

  it('Progress 支持 status=exception', () => {
    const wrapper = mountAntd(antd.Progress, {percent: 100, status: 'exception'})
    expect(wrapper.find('.ant-progress-status-exception').exists()).toBe(true)
  })

  it('Progress 支持 success 段', () => {
    const wrapper = mountAntd(antd.Progress, {percent: 50, success: {percent: 30}})
    expect(wrapper.find('.ant-progress').exists()).toBe(true)
  })

  /* ---------- Spin ---------- */
  it('Spin 渲染加载中', () => {
    const wrapper = mountAntd(antd.Spin, {spinning: true})
    expect(wrapper.find('.ant-spin').exists()).toBe(true)
    expect(wrapper.find('.ant-spin-spinning').exists()).toBe(true)
  })

  it('Spin 不 spinning 时隐藏', () => {
    const wrapper = mountAntd(antd.Spin, {spinning: false}, createElement('div', null, 'Content'))
    // 不 spinning 时不显示 .ant-spin-spinning
    expect(wrapper.find('.ant-spin-spinning').exists()).toBe(false)
  })

  it('Spin 支持 description 属性', () => {
    const wrapper = mountAntd(antd.Spin, {spinning: true, description: 'Loading...'})
    expect(wrapper.find('.ant-spin').exists()).toBe(true)
  })

  it('Spin 作为容器包裹子元素', () => {
    const wrapper = mountAntd(antd.Spin, null, createElement('div', {className: 'content'}, 'Content'))
    expect(wrapper.find('.ant-spin-container').exists()).toBe(true)
    expect(wrapper.find('.content').exists()).toBe(true)
  })

  /* ---------- Alert ---------- */
  it('Alert 渲染警告提示', () => {
    const wrapper = mountAntd(antd.Alert, {title: 'Success Message', type: 'success'})
    expect(wrapper.find('.ant-alert').exists()).toBe(true)
    expect(wrapper.find('.ant-alert-success').exists()).toBe(true)
    expect(wrapper.find('.ant-alert-title').text()).toBe('Success Message')
  })

  it('Alert 支持 description', () => {
    const wrapper = mountAntd(antd.Alert, {
      title: 'Title',
      description: 'Description text',
      type: 'info'
    })
    expect(wrapper.find('.ant-alert-description').text()).toBe('Description text')
    expect(wrapper.find('.ant-alert-info').exists()).toBe(true)
  })

  it('Alert closable 显示关闭按钮', () => {
    const wrapper = mountAntd(antd.Alert, {title: 'Closable', closable: true})
    expect(wrapper.find('.ant-alert-close-icon').exists()).toBe(true)
  })

  it('Alert 支持 type=warning/error', () => {
    const warningWrapper = mountAntd(antd.Alert, {title: 'Warning', type: 'warning'})
    expect(warningWrapper.find('.ant-alert-warning').exists()).toBe(true)

    const errorWrapper = mountAntd(antd.Alert, {title: 'Error', type: 'error'})
    expect(errorWrapper.find('.ant-alert-error').exists()).toBe(true)
  })

  it('Alert banner 模式', () => {
    const wrapper = mountAntd(antd.Alert, {title: 'Banner', banner: true})
    expect(wrapper.find('.ant-alert-banner').exists()).toBe(true)
  })

  /* ---------- Skeleton ---------- */
  it('Skeleton 渲染骨架屏', () => {
    const wrapper = mountAntd(antd.Skeleton, {active: true})
    expect(wrapper.find('.ant-skeleton').exists()).toBe(true)
    expect(wrapper.find('.ant-skeleton-active').exists()).toBe(true)
  })

  it('Skeleton 支持 avatar/paragraph/title 配置', () => {
    const wrapper = mountAntd(antd.Skeleton, {avatar: true, paragraph: {rows: 2}})
    expect(wrapper.find('.ant-skeleton-avatar').exists()).toBe(true)
    expect(wrapper.find('.ant-skeleton-paragraph').exists()).toBe(true)
  })

  it('Skeleton 结合 loading 属性', () => {
    const wrapper = mountAntd(antd.Skeleton, {loading: false}, createElement('span', null, 'Content'))
    // loading=false 时直接渲染子节点
    expect(wrapper.text()).toContain('Content')
  })

  /* ---------- Result ---------- */
  it('Result 渲染结果页', () => {
    const wrapper = mountAntd(antd.Result, {
      status: 'success',
      title: 'Success!',
      subTitle: 'Operation completed successfully'
    })
    expect(wrapper.find('.ant-result').exists()).toBe(true)
    expect(wrapper.find('.ant-result-success').exists()).toBe(true)
    expect(wrapper.find('.ant-result-title').text()).toBe('Success!')
    expect(wrapper.find('.ant-result-subtitle').text()).toBe('Operation completed successfully')
  })

  it('Result 支持 extra 操作区', () => {
    const wrapper = mountAntd(antd.Result, {
      status: '404',
      title: '404',
      extra: createElement('button', null, 'Back Home')
    })
    expect(wrapper.find('.ant-result').exists()).toBe(true)
    expect(wrapper.find('button').exists()).toBe(true)
  })

  it('Result 404 状态', () => {
    const wrapper = mountAntd(antd.Result, {status: '404', title: 'Not Found'})
    expect(wrapper.find('.ant-result-404').exists()).toBe(true)
  })
})

/* ===================================================================
   4. 导航组件
   =================================================================== */

describe('antd - 导航组件', () => {

  /* ---------- Breadcrumb ---------- */
  it('Breadcrumb 渲染面包屑', () => {
    const items = [
      {title: 'Home'},
      {title: 'Category'},
      {title: 'Current'},
    ]
    const wrapper = mountAntd(antd.Breadcrumb, {items})
    expect(wrapper.find('.ant-breadcrumb').exists()).toBe(true)
    expect(wrapper.text()).toContain('Home')
    expect(wrapper.text()).toContain('Category')
    expect(wrapper.text()).toContain('Current')
  })

  it('Breadcrumb 支持 separator 自定义', () => {
    const items = [
      {title: 'Home'},
      {title: 'Page'},
    ]
    const wrapper = mountAntd(antd.Breadcrumb, {items, separator: '>'})
    expect(wrapper.find('.ant-breadcrumb').exists()).toBe(true)
  })

  it('Breadcrumb 支持 params 路由参数', () => {
    const items = [
      {title: 'Home', href: '/'},
      {title: 'Page', href: '/page'},
    ]
    const wrapper = mountAntd(antd.Breadcrumb, {items})
    expect(wrapper.find('.ant-breadcrumb-link').exists()).toBe(true)
  })

  /* ---------- Steps ---------- */
  it('Steps 渲染步骤条', () => {
    const items = [
      {title: 'Step 1', content: 'Description 1'},
      {title: 'Step 2', content: 'Description 2'},
      {title: 'Step 3'},
    ]
    const wrapper = mountAntd(antd.Steps, {current: 1, items})
    expect(wrapper.find('.ant-steps').exists()).toBe(true)
    // 当前步骤在第 2 步（索引 1）
    expect(wrapper.findAll('.ant-steps-item').length).toBe(3)
    expect(wrapper.text()).toContain('Step 1')
    expect(wrapper.text()).toContain('Step 2')
    expect(wrapper.text()).toContain('Step 3')
  })

  it('Steps 支持 size=small', () => {
    const items = [
      {title: 'A'},
      {title: 'B'},
    ]
    const wrapper = mountAntd(antd.Steps, {items, size: 'small'})
    expect(wrapper.find('.ant-steps-small').exists()).toBe(true)
  })
})

/* ===================================================================
   5. 反馈与弹层组件
   =================================================================== */

describe('antd - 反馈与弹层组件', () => {

  /* ---------- Modal ---------- */
  it('Modal 渲染弹窗', () => {
    const wrapper = mountAntd(antd.Modal, {
      open: true,
      title: 'Modal Title',
      children: 'Modal Content'
    })
    expect(wrapper.find('.ant-modal').exists()).toBe(true)
    expect(wrapper.find('.ant-modal-title').text()).toBe('Modal Title')
    expect(wrapper.find('.ant-modal-body').text()).toContain('Modal Content')
  })

  it('Modal 关闭时不显示', () => {
    const wrapper = mountAntd(antd.Modal, {open: false, title: 'Hidden'})
    expect(wrapper.find('.ant-modal').exists()).toBe(false)
  })

  it('Modal 支持 footer 自定义', () => {
    const wrapper = mountAntd(antd.Modal, {
      open: true,
      title: 'Custom',
      footer: createElement('button', null, 'Custom Footer')
    })
    expect(wrapper.find('.ant-modal').exists()).toBe(true)
    if (wrapper.find('.ant-modal-footer').exists()) {
      expect(wrapper.find('.ant-modal-footer').text()).toContain('Custom Footer')
    }
  })

  it('Modal.confirm 静态方法存在', () => {
    // 静态方法直接调用，不通过 defineComponent
    expect(typeof antd.Modal.confirm).toBe('function')
    expect(typeof antd.Modal.info).toBe('function')
    expect(typeof antd.Modal.success).toBe('function')
    expect(typeof antd.Modal.error).toBe('function')
    expect(typeof antd.Modal.warning).toBe('function')
  })
})

/* ===================================================================
   6. 复合数据展示组件
   =================================================================== */

describe('antd - 复合数据展示组件', () => {

  /* ---------- Tabs ---------- */
  it('Tabs 渲染标签页', () => {
    const items = [
      {key: '1', label: 'Tab 1', children: 'Content 1'},
      {key: '2', label: 'Tab 2', children: 'Content 2'},
    ]
    const wrapper = mountAntd(antd.Tabs, {items, activeKey: '1'})
    expect(wrapper.find('.ant-tabs').exists()).toBe(true)
    expect(wrapper.text()).toContain('Tab 1')
    expect(wrapper.text()).toContain('Tab 2')
  })

  it('Tabs 支持 type=card', () => {
    const items = [
      {key: '1', label: 'Card Tab', children: 'Content'},
    ]
    const wrapper = mountAntd(antd.Tabs, {items, type: 'card'})
    expect(wrapper.find('.ant-tabs-card').exists()).toBe(true)
  })

  it('Tabs 支持 tabPlacement=left', () => {
    const items = [
      {key: '1', label: 'A', children: 'A content'},
    ]
    const wrapper = mountAntd(antd.Tabs, {items, tabPlacement: 'left'})
    expect(wrapper.find('.ant-tabs-left').exists()).toBe(true)
  })

  it('Tabs 支持 centered', () => {
    const items = [
      {key: '1', label: 'A', children: 'A'},
    ]
    const wrapper = mountAntd(antd.Tabs, {items, centered: true})
    expect(wrapper.find('.ant-tabs-centered').exists()).toBe(true)
  })

  /* ---------- Collapse ---------- */
  it('Collapse 渲染折叠面板', () => {
    const items = [
      {key: '1', label: 'Panel 1', children: 'Content 1'},
      {key: '2', label: 'Panel 2', children: 'Content 2'},
    ]
    const wrapper = mountAntd(antd.Collapse, {items, defaultActiveKey: ['1']})
    expect(wrapper.find('.ant-collapse').exists()).toBe(true)
    expect(wrapper.findAll('.ant-collapse-item').length).toBe(2)
  })

  it('Collapse 支持 accordion 模式', () => {
    const items = [
      {key: '1', label: 'A', children: 'A content'},
      {key: '2', label: 'B', children: 'B content'},
    ]
    const wrapper = mountAntd(antd.Collapse, {items, accordion: true})
    expect(wrapper.find('.ant-collapse').exists()).toBe(true)
  })

  it('Collapse 支持 ghost 模式', () => {
    const items = [
      {key: '1', label: 'Ghost', children: 'Content'},
    ]
    const wrapper = mountAntd(antd.Collapse, {items, ghost: true})
    expect(wrapper.find('.ant-collapse-ghost').exists()).toBe(true)
  })

  it('Collapse 支持 expandIconPosition', () => {
    const items = [
      {key: '1', label: 'A', children: 'A'},
    ]
    const wrapper = mountAntd(antd.Collapse, {items, expandIconPosition: 'end'})
    expect(wrapper.find('.ant-collapse-icon-position-end').exists()).toBe(true)
  })

  /* ---------- Descriptions ---------- */
  it('Descriptions 渲染描述列表', () => {
    const items = [
      {key: '1', label: 'Name', children: 'John'},
      {key: '2', label: 'Age', children: 30},
    ]
    const wrapper = mountAntd(antd.Descriptions, {items, title: 'User Info'})
    expect(wrapper.find('.ant-descriptions').exists()).toBe(true)
    expect(wrapper.find('.ant-descriptions-title').text()).toBe('User Info')
    expect(wrapper.text()).toContain('Name')
    expect(wrapper.text()).toContain('John')
    expect(wrapper.text()).toContain('Age')
  })

  it('Descriptions 支持 bordered 模式', () => {
    const items = [
      {key: '1', label: 'A', children: 'A'},
    ]
    const wrapper = mountAntd(antd.Descriptions, {items, bordered: true})
    expect(wrapper.find('.ant-descriptions-bordered').exists()).toBe(true)
  })

  it('Descriptions 支持 column 布局', () => {
    const items = [
      {key: '1', label: 'A', children: 'A'},
      {key: '2', label: 'B', children: 'B'},
      {key: '3', label: 'C', children: 'C'},
    ]
    const wrapper = mountAntd(antd.Descriptions, {items, column: 2})
    expect(wrapper.find('.ant-descriptions').exists()).toBe(true)
  })

  /* ---------- List ---------- */
  it('List 渲染列表', () => {
    const dataSource = ['Item 1', 'Item 2', 'Item 3']
    const wrapper = mountAntd(antd.List, {
      dataSource,
      renderItem: (item: any) => createElement('div', null, item)
    })
    expect(wrapper.find('.ant-list').exists()).toBe(true)
    expect(wrapper.text()).toContain('Item 1')
    expect(wrapper.text()).toContain('Item 2')
    expect(wrapper.text()).toContain('Item 3')
  })

  it('List 支持 header/footer', () => {
    const dataSource = ['A', 'B']
    const wrapper = mountAntd(antd.List, {
      dataSource,
      header: 'Header',
      footer: 'Footer',
      renderItem: (item: any) => createElement('div', null, item)
    })
    expect(wrapper.find('.ant-list-header').text()).toBe('Header')
    expect(wrapper.find('.ant-list-footer').text()).toBe('Footer')
  })

  it('List 支持 size=small', () => {
    const wrapper = mountAntd(antd.List, {
      dataSource: ['A'],
      size: 'small',
      renderItem: (item: any) => createElement('div', null, item)
    })
    expect(wrapper.find('.ant-list-sm').exists()).toBe(true)
  })

  /* ---------- Table ---------- */
  it('Table 渲染表格', () => {
    const columns = [
      {title: 'Name', dataIndex: 'name', key: 'name'},
      {title: 'Age', dataIndex: 'age', key: 'age'},
    ]
    const dataSource = [
      {key: '1', name: 'John', age: 30},
      {key: '2', name: 'Jane', age: 25},
    ]
    const wrapper = mountAntd(antd.Table, {columns, dataSource, pagination: false})
    expect(wrapper.find('.ant-table').exists()).toBe(true)
    expect(wrapper.text()).toContain('Name')
    expect(wrapper.text()).toContain('Age')
    expect(wrapper.text()).toContain('John')
    expect(wrapper.text()).toContain('Jane')
  })

  it('Table 支持 bordered 属性', () => {
    const columns = [
      {title: 'A', dataIndex: 'a', key: 'a'},
    ]
    const dataSource = [
      {key: '1', a: '1'},
    ]
    const wrapper = mountAntd(antd.Table, {columns, dataSource, bordered: true, pagination: false})
    expect(wrapper.find('.ant-table-bordered').exists()).toBe(true)
  })

  it('Table 支持 size 属性', () => {
    const columns = [
      {title: 'A', dataIndex: 'a', key: 'a'},
    ]
    const dataSource = [
      {key: '1', a: '1'},
    ]
    const wrapper = mountAntd(antd.Table, {columns, dataSource, size: 'small', pagination: false})
    expect(wrapper.find('.ant-table-small').exists()).toBe(true)
  })

  it('Table 支持 loading 状态', () => {
    const columns = [
      {title: 'A', dataIndex: 'a', key: 'a'},
    ]
    const dataSource = [
      {key: '1', a: '1'},
    ]
    const wrapper = mountAntd(antd.Table, {columns, dataSource, loading: true, pagination: false})
    expect(wrapper.find('.ant-table').exists()).toBe(true)
  })
})

/* ===================================================================
   7. ConfigProvider 配置
   =================================================================== */

describe('antd - ConfigProvider', () => {

  it('ConfigProvider 包裹子组件不报错', () => {
    const wrapper = mountAntd(
      antd.ConfigProvider,
      {theme: {token: {colorPrimary: '#1890ff'}}},
      createElement('div', null, 'Configured Content')
    )
    expect(wrapper.text()).toContain('Configured Content')
  })

  it('ConfigProvider 支持 prefixCls', () => {
    const wrapper = mountAntd(
      antd.ConfigProvider,
      {prefixCls: 'custom'},
      createElement('div', null, 'Custom Prefix')
    )
    expect(wrapper.text()).toContain('Custom Prefix')
  })
})

/* ===================================================================
   8. 组合场景：Hooks + antd 组件
   =================================================================== */

describe('antd + React Hooks 组合场景', () => {

  it('useState 控制 antd 组件状态', () => {
    const TestComponent = defineComponent(() => {
      const [checked, setChecked] = useState(false)
      return createElement(
        antd.Switch,
        {
          checked,
          onChange: (val: boolean) => setChecked(val)
        }
      )
    })
    const wrapper = mount(TestComponent)
    // 初始状态：未选中
    expect(wrapper.find('.ant-switch').exists()).toBe(true)
    expect(wrapper.find('.ant-switch-checked').exists()).toBe(false)
  })

  it('useEffect 不阻塞 antd 组件渲染', async () => {
    const effectFn = vi.fn()
    const TestComponent = defineComponent(() => {
      const [count, setCount] = useState(0)
      useEffect(() => {
        effectFn(count)
      }, [count])
      return createElement(
        antd.Button,
        {onClick: () => setCount(prev => prev + 1)},
        `Count: ${count}`
      )
    })
    const wrapper = mount(TestComponent)
    expect(wrapper.find('button').text()).toContain('Count: 0')
    await Promise.resolve()
    expect(effectFn).toHaveBeenCalledWith(0)
  })

  it('antd Button + useState 计数器', async () => {
    const TestComponent = defineComponent(() => {
      const [count, setCount] = useState(0)
      return createElement(
        antd.Button,
        {onClick: () => setCount(prev => prev + 1)},
        `Clicked ${count} times`
      )
    })
    const wrapper = mount(TestComponent)
    expect(wrapper.find('button').text()).toBe('Clicked 0 times')
    wrapper.find('button').trigger('click')
    await Promise.resolve()
    await Promise.resolve()
    expect(wrapper.find('button').text()).toBe('Clicked 1 times')
  })
})

/* ===================================================================
   9. 边缘情况
   =================================================================== */

describe('antd - 边缘情况', () => {

  it('组件不带任何 props 渲染', () => {
    const wrapper = mountAntd(antd.Divider)
    expect(wrapper.find('.ant-divider').exists()).toBe(true)
  })

  it('组件带 null children 渲染', () => {
    const wrapper = mountAntd(antd.Button, null, null)
    expect(wrapper.find('button').exists()).toBe(true)
  })

  it('组件带 undefined props 渲染', () => {
    const wrapper = mountAntd(antd.Tag, undefined, 'Tag')
    expect(wrapper.find('.ant-tag').exists()).toBe(true)
  })

  it('组件在 Fragment 中渲染', () => {
    const VBtn = defineComponent(antd.Button as any)
    const VTag = defineComponent(antd.Tag as any)
    const TestComponent = defineComponent(() => {
      return createElement(Fragment, null,
        createElement(VBtn, null, 'Button'),
        createElement(VTag, {color: 'green'}, 'Tag'),
      )
    })
    const wrapper = mount(TestComponent)
    expect(wrapper.find('button').exists()).toBe(true)
    expect(wrapper.find('.ant-tag').exists()).toBe(true)
  })
})