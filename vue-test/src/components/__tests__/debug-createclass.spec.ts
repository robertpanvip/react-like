import {describe, it, expect} from 'vitest'
import {mount} from '@vue/test-utils'
import {defineComponent, createElement, Component, forwardRef} from 'react'

describe('debug createClassComponent', () => {
  it('check class component handling', () => {
    // Create a simple class component
    class MyComp extends Component<any, any> {
      render() {
        return createElement('div', {class: 'my-class'}, 'Hello')
      }
    }
    
    console.log('MyComp.prototype instanceof Component:', MyComp.prototype instanceof Component)
    console.log('typeof MyComp:', typeof MyComp)
    console.log('MyComp.$typeof:', (MyComp as any).$typeof)
    console.log('typeof MyComp === object:', typeof MyComp === 'object')
    
    const Wrapped = defineComponent(() => {
      return createElement(MyComp, {extra: 'prop'})
    })
    
    const wrapper = mount(Wrapped)
    console.log('HTML:', wrapper.html())
    expect(wrapper.find('.my-class').exists()).toBe(true)
  })
})