import {describe, it, expect} from 'vitest'
import {mount} from '@vue/test-utils'
import {defineComponent, createElement} from '@react-like/vue'
import {Button} from 'antd'
import {h} from 'vue'

describe('simple', () => {
  it('test 1: mount defineComponent(Button) directly', () => {
    const VueWrapped = defineComponent(Button)
    console.log('VueWrapped keys:', Object.keys(VueWrapped))
    // Check if setup is still a function
    console.log('VueWrapped.setup is function:', typeof VueWrapped.setup === 'function')
    const wrapper = mount(VueWrapped)
    console.log('HTML:', wrapper.html())
  })

  it('test 2: mount with h() directly (no clone side effects)', () => {
    // Create a component directly without clone()
    const VueWrapped = {
      inheritAttrs: false,
      setup() {
        console.log('Manual setup called!')
        const Button2 = Button
        return () => {
          console.log('Manual render called!')
          return h('div', 'test')
        }
      }
    }
    const wrapper = mount(VueWrapped)
    console.log('HTML:', wrapper.html())
  })

  it('test 3: Button with inheritAttrs: true', () => {
    const VueWrapped = defineComponent(Button)
    // Check if clone() added render property
    console.log('Has render key:', 'render' in VueWrapped)
    if ('render' in VueWrapped) {
      console.log('render type:', typeof (VueWrapped as any).render)
    }
    const wrapper = mount(VueWrapped)
    console.log('HTML:', wrapper.html())
  })
})