import * as antd from 'antd'

console.log('Button type:', typeof antd.Button)
console.log('Button is function:', typeof antd.Button === 'function')
console.log('Button is object:', typeof antd.Button === 'object' && antd.Button !== null)
console.log('Button keys:', Object.keys(antd.Button))
console.log('Button $$typeof:', antd.Button.$$typeof?.toString())
console.log('Button displayName:', antd.Button.displayName)
console.log('Button prototype:', antd.Button.prototype?.constructor?.name)