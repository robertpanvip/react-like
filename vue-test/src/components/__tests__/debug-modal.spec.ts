/**
 * 调试 Modal 组件 teleport 问题的专用测试文件
 */
import {describe, it, expect} from 'vitest'
import {mount} from '@vue/test-utils'
import {defineComponent, createElement} from '@react-like/vue'
import {Modal} from 'antd'

function mountAntd(Component: any, props: Record<string, any> = {}, children: any = null) {
  const VueComp = defineComponent(Component as any)
  const TestComponent = defineComponent(() => {
    if (children !== null) {
      return createElement(VueComp, props, children)
    }
    return createElement(VueComp, props)
  })
  return mount(TestComponent, {attachTo: document.body})
}

describe('debug Modal', () => {
  it('Modal teleport', async () => {
    const wrapper = mountAntd(Modal, {open: true, title: 'Modal Title', children: 'Modal Content'})
    await new Promise(r => setTimeout(r, 100))
    console.log('=== wrapper.html() ===')
    console.log(wrapper.html())
    console.log('=== document.body.innerHTML ===')
    console.log(document.body.innerHTML)
    const modalRoot = document.querySelector('.ant-modal')
    console.log('=== modal in document.body ===', !!modalRoot)
    if (modalRoot) {
      console.log('=== modal outerHTML ===')
      console.log(modalRoot.outerHTML)
    }
    const allModals = document.querySelectorAll('[class*="ant-modal"]')
    console.log('=== all [class*=ant-modal] elements ===', allModals.length)
    allModals.forEach((el, i) => {
      console.log(`  [${i}]`, el.className, el.outerHTML?.substring(0, 200))
    })
    expect(true).toBe(true)
  })
})