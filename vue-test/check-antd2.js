import * as antd from 'antd'
import React from '@react-like/vue'

console.log('=== antd.Button details ===')
console.log('Button $typeof:', antd.Button.$typeof?.toString())
console.log('Button.__ANT_BUTTON:', antd.Button.__ANT_BUTTON)

// Check if Button is a forwardRef or memo
const {REACT_FORWARD_REF_TYPE, REACT_MEMO_TYPE, REACT_ELEMENT_TYPE} = await import('./packages/vue/react-element.ts')

console.log('\n=== React symbol comparison ===')
console.log('Button $$typeof === REACT_FORWARD_REF_TYPE:', antd.Button.$$typeof === REACT_FORWARD_REF_TYPE)
console.log('Button $$typeof === REACT_MEMO_TYPE:', antd.Button.$$typeof === REACT_MEMO_TYPE)

// Try calling Button directly
console.log('\n=== Calling Button directly ===')
try {
    const result = antd.Button({type: 'primary', children: 'Click Me'})
    console.log('Result type:', typeof result)
    console.log('Result:', result)
    if (result && typeof result === 'object') {
        console.log('Result keys:', Object.keys(result))
        console.log('Result $$typeof:', result.$$typeof?.toString())
    }
} catch (e) {
    console.log('Error calling Button:', e.message)
}

// Check what React.createElement returns for antd.Button
console.log('\n=== React.createElement with antd.Button ===')
const el = React.createElement(antd.Button, {type: 'primary'}, 'Click Me')
console.log('Element type:', typeof el.type)
console.log('Element type is function:', typeof el.type === 'function')
console.log('Element type $typeof:', el.type?.$typeof?.toString())
console.log('Element type $$typeof:', el.type?.$$typeof?.toString())
console.log('Element props:', JSON.stringify(el.props, (k, v) => typeof v === 'function' ? '[Function]' : v))