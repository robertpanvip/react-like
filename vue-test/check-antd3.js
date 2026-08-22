import * as antd from 'antd'
import React from '@react-like/vue'

console.log('=== antd.Button details ===')
console.log('Button $typeof:', antd.Button.$typeof?.toString())
console.log('Button.__ANT_BUTTON:', antd.Button.__ANT_BUTTON)
console.log('Button.$$typeof:', antd.Button.$$typeof?.toString())

// Check if Button is a function and what it returns
console.log('\n=== Calling Button directly ===')
try {
    const result = antd.Button({type: 'primary', children: 'Click Me'})
    console.log('Result type:', typeof result)
    console.log('Result:', result)
    if (result && typeof result === 'object') {
        console.log('Result keys:', Object.keys(result))
        console.log('Result $$typeof:', result.$$typeof?.toString())
    }
} catch (e: any) {
    console.log('Error calling Button:', e.message)
}

// Try calling through React.createElement
console.log('\n=== React.createElement ===')
const el = React.createElement(antd.Button, {type: 'primary'}, 'Click Me')
console.log('Element type:', typeof el.type)
console.log('Element type is function:', typeof el.type === 'function')
console.log('Element type $typeof:', el.type?.$typeof?.toString())
console.log('Element props:', JSON.stringify(el.props, (k, v) => typeof v === 'function' ? '[Function]' : v))

// Check what React.createElement does with Button
const {createElement, toVNode, REACT_FORWARD_REF_TYPE, REACT_ELEMENT_TYPE} = await import('@react-like/vue/react-element.ts')
console.log('\n=== REACT_FORWARD_REF_TYPE ===')
console.log('REACT_FORWARD_REF_TYPE:', REACT_FORWARD_REF_TYPE.toString())
console.log('Button.$typeof matches:', antd.Button.$typeof === REACT_FORWARD_REF_TYPE)

// Check if Button is wrapped by createElement
console.log('\n=== createElement with Button ===')
const el2 = createElement(antd.Button, {type: 'primary'}, 'Click Me')
console.log('el2 type is function:', typeof el2.type === 'function')
console.log('el2 type.$typeof:', el2.type?.$typeof?.toString())
console.log('el2 type.$typeof === REACT_FORWARD_REF_TYPE:', el2.type?.$typeof === REACT_FORWARD_REF_TYPE)