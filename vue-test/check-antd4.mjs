import {mount} from '@vue/test-utils'
import {defineComponent, createElement, toVNode, Fragment} from '@react-like/vue'
import * as antd from 'antd'

// Setup matchMedia
window.matchMedia = window.matchMedia || function() {
    return {matches: false, media: '', onchange: null, addListener: () => {}, removeListener: () => {}, addEventListener: () => {}, removeEventListener: () => {}, dispatchEvent: () => false}
}
window.getComputedStyle = window.getComputedStyle || function() {
    return {getPropertyValue: () => ''}
}

// Test 1: Call antd.Button directly inside defineComponent
console.log('=== Test 1: defineComponent wrapping antd.Button ===')
const VueButton = defineComponent(antd.Button)
console.log('VueButton:', typeof VueButton, Object.keys(VueButton).join(', '))

// Test 2: Use defineComponent with a render function that uses createElement(VueButton)
console.log('\n=== Test 2: mount via createElement ===')
const TestComp = defineComponent(() => {
    return createElement(VueButton, {type: 'primary'}, 'Click Me')
})

try {
    const wrapper = mount(TestComp)
    console.log('HTML:', wrapper.html())
    console.log('Text:', wrapper.text())
    console.log('Button exists:', wrapper.find('button').exists())
} catch (e) {
    console.log('Mount error:', e.message)
}

// Test 3: Simplified - just call antd.Button inside defineComponent
console.log('\n=== Test 3: Call antd.Button directly in defineComponent ===')
const TestComp2 = defineComponent(() => {
    const result = antd.Button({type: 'primary', children: 'Direct Call'})
    console.log('Direct call result type:', typeof result)
    if (result && typeof result === 'object') {
        console.log('Result keys:', Object.keys(result).join(', '))
        console.log('Result $$typeof:', result.$$typeof?.toString())
    }
    return result
})

try {
    const wrapper2 = mount(TestComp2)
    console.log('HTML2:', wrapper2.html())
    console.log('Text2:', wrapper2.text())
} catch (e) {
    console.log('Mount error 2:', e.message)
}

// Test 4: Check what antd.Button's internal symbols look like
console.log('\n=== Test 4: Internal checks ===')
const mod = await import('@react-like/vue/react-element.ts')
console.log('DEFINE_COMPONENT:', mod.DEFINE_COMPONENT.toString())
console.log('Button.$typeof === DEFINE_COMPONENT:', antd.Button.$typeof === mod.DEFINE_COMPONENT)
console.log('Button.$typeof === REACT_FORWARD_REF_TYPE:', antd.Button.$typeof === mod.REACT_FORWARD_REF_TYPE)
console.log('Button.$typeof === Symbol(forward-ref):', antd.Button.$typeof === Symbol('forward-ref'))

// The value of $typeof
console.log('Button.$typeof description:', antd.Button.$typeof?.description)
console.log('REACT_FORWARD_REF_TYPE description:', mod.REACT_FORWARD_REF_TYPE.description)