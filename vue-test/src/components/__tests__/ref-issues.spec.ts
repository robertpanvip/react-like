/**
 * 排查 Slider 和 Carousel 的 ref 问题
 */
import {describe, it, expect, vi, beforeEach, afterEach} from 'vitest'
import {mount} from '@vue/test-utils'
import {defineComponent, createElement, useRef, useEffect, useImperativeHandle, forwardRef, resetReactScheduler} from 'react'
import {Slider, Carousel} from 'antd'
import {mountAntd, cleanup} from '../../test-setup'

beforeEach(() => { resetReactScheduler() })
afterEach(() => { cleanup() })

describe('Slider ref 排查', () => {

  it('Slider 渲染正常', () => {
    const wrapper = mountAntd(Slider, {defaultValue: 30, style: {width: 300}})
    expect(wrapper.find('.ant-slider').exists()).toBe(true)
  })

  it('通过 useRef 获取 Slider 的 DOM 元素', async () => {
    let sliderRef: any = null
    const TestComponent = defineComponent(() => {
      sliderRef = useRef(null)
      return createElement(Slider, {
        ref: sliderRef,
        defaultValue: 30,
        style: {width: 300}
      })
    })
    const wrapper = mount(TestComponent)
    expect(wrapper.find('.ant-slider').exists()).toBe(true)
    // 等待微任务和 onMounted 完成
    await Promise.resolve()
    await Promise.resolve()
    await Promise.resolve()
    console.log('sliderRef.current:', sliderRef?.current)
    console.log('sliderRef.current type:', typeof sliderRef?.current)
    if (sliderRef?.current && typeof sliderRef.current === 'object') {
      console.log('sliderRef.current keys:', Object.keys(sliderRef.current))
    }
    // 至少 ref 不为 null
    expect(sliderRef?.current).not.toBeNull()
  })

  it('Slider 内部 @rc-component/slider 的 useImperativeHandle 暴露 focus', async () => {
    let sliderRef: any = null
    const TestComponent = defineComponent(() => {
      sliderRef = useRef(null)
      return createElement(Slider, {
        ref: sliderRef,
        defaultValue: 30,
        style: {width: 300}
      })
    })
    const wrapper = mount(TestComponent)
    await Promise.resolve()
    await Promise.resolve()
    await Promise.resolve()
    console.log('slider ref current:', sliderRef?.current)
    // 检查 ref 上是否有 focus 方法（由 @rc-component/slider 的 useImperativeHandle 暴露）
    if (sliderRef?.current) {
      console.log('focus:', typeof (sliderRef.current as any).focus)
      console.log('blur:', typeof (sliderRef.current as any).blur)
      console.log('constructor:', (sliderRef.current as any).constructor?.name)
      console.log('isNode:', (sliderRef.current as any)?.nodeType)
    }
  })
  
  it('Slider ref 直接检查 @rc-component/slider 内部', async () => {
    // 直接测试 @rc-component/slider 而非 antd 的 Slider
    const RcSlider = require('@rc-component/slider').default
    let rcRef: any = null
    const TestComponent = defineComponent(() => {
      rcRef = useRef(null)
      return createElement(RcSlider, {
        ref: rcRef,
        defaultValue: 30,
        style: {width: 300}
      })
    })
    const wrapper = mount(TestComponent)
    await Promise.resolve()
    await Promise.resolve()
    await Promise.resolve()
    console.log('rcSlider ref current:', rcRef?.current)
    if (rcRef?.current) {
      console.log('rcSlider keys:', Object.keys(rcRef.current))
      console.log('rcSlider focus:', typeof (rcRef.current as any).focus)
      console.log('rcSlider blur:', typeof (rcRef.current as any).blur)
    }
  })
})

describe('Carousel ref 排查', () => {

  it('Carousel 渲染正常', () => {
    const wrapper = mountAntd(Carousel, null, [
      createElement('div', null, 'Slide 1'),
      createElement('div', null, 'Slide 2'),
    ])
    expect(wrapper.find('.ant-carousel').exists()).toBe(true)
  })

  it('通过 useRef 获取 Carousel 的 ref', async () => {
    let carouselRef: any = null
    const TestComponent = defineComponent(() => {
      carouselRef = useRef(null)
      return createElement(Carousel, {ref: carouselRef}, [
        createElement('div', null, 'Slide 1'),
        createElement('div', null, 'Slide 2'),
      ])
    })
    const wrapper = mount(TestComponent)
    await Promise.resolve()
    await Promise.resolve()
    await Promise.resolve()
    console.log('carouselRef.current:', carouselRef?.current)
    console.log('carouselRef.current type:', typeof carouselRef?.current)
    if (carouselRef?.current && typeof carouselRef.current === 'object') {
      console.log('carouselRef.current keys:', Object.keys(carouselRef.current))
      console.log('has goTo:', typeof (carouselRef.current as any).goTo)
      console.log('has slickPrev:', typeof (carouselRef.current as any).slickPrev)
      console.log('has innerSlider:', typeof (carouselRef.current as any).innerSlider)
    }
    expect(carouselRef?.current).not.toBeNull()
  })

  it('Carousel ref 暴露 goTo 方法', async () => {
    let carouselRef: any = null
    const TestComponent = defineComponent(() => {
      carouselRef = useRef(null)
      return createElement(Carousel, {ref: carouselRef}, [
        createElement('div', null, 'Slide 1'),
        createElement('div', null, 'Slide 2'),
      ])
    })
    const wrapper = mount(TestComponent)
    await Promise.resolve()
    await Promise.resolve()
    await Promise.resolve()
    console.log('carousel ref:', carouselRef?.current)
    expect(carouselRef?.current).not.toBeNull()
    // Carousel 的 useImperativeHandle 应该暴露 goTo 方法
    expect(typeof (carouselRef?.current as any)?.goTo).toBe('function')
  })
})

describe('自定义 forwardRef 组件 ref 排查', () => {
  it('forwardRef 组件 useImperativeHandle 暴露方法', async () => {
    const FancyInput = forwardRef((props: any, ref: any) => {
      const inputRef = useRef(null)
      useImperativeHandle(ref, () => ({
        focus: () => {
          (inputRef as any).current?.focus()
        },
        value: 'test'
      }), [])
      return createElement('input', {ref: inputRef, ...props})
    })

    let fancyRef: any = null
    const TestComponent = defineComponent(() => {
      fancyRef = useRef(null)
      return createElement(FancyInput, {ref: fancyRef, placeholder: 'Fancy'})
    })
    const wrapper = mount(TestComponent)
    await Promise.resolve()
    await Promise.resolve()
    await Promise.resolve()
    console.log('fancyRef:', fancyRef?.current)
    expect(fancyRef?.current).not.toBeNull()
    expect(typeof (fancyRef?.current as any)?.focus).toBe('function')
    expect((fancyRef?.current as any)?.value).toBe('test')
  })
})