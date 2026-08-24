import {describe, it, expect} from 'vitest'
import * as React from 'react'

describe('check Row5', () => {
  it('Check React.createContext', () => {
    console.log('React.createContext:', React.createContext?.toString()?.substring(0, 200))
    const ctx = React.createContext('test')
    console.log('ctx:', ctx)
    console.log('ctx.Provider:', ctx.Provider)
    console.log('ctx.Provider keys:', Object.keys(ctx.Provider))
    console.log('ctx.Provider $$typeof:', String(ctx.Provider.$$typeof))
    console.log('ctx.Consumer keys:', Object.keys(ctx.Consumer))
  })
})