import {describe, it, expect} from 'vitest'
import {Row} from 'antd'

describe('check Row3', () => {
  it('RowContext type', () => {
    // Check Row's internal context
    const rowStr = Row.toString()
    console.log('Row source (first 500 chars):', rowStr.substring(0, 500))
    
    // Check if Row has any context
    const keys = Object.getOwnPropertyNames(Row)
    console.log('Row own props:', keys)
    
    // Try to examine the Row component's behavior
    // Check if Row has a context property
    for (const key of Object.keys(Row)) {
      const val = (Row as any)[key]
      if (val && typeof val === 'object') {
        console.log('Row.', key, 'type:', typeof val, 'keys:', Object.keys(val))
        if (val.Provider) {
          console.log('Row.', key, '.Provider $$typeof:', String(val.Provider.$$typeof))
          console.log('Row.', key, '.Provider own keys:', Object.getOwnPropertyNames(val.Provider))
          // Check all symbols
          const syms = Object.getOwnPropertySymbols(val.Provider)
          console.log('Row.', key, '.Provider symbols:', syms.map(s => s.toString()))
        }
      }
    }
  })
})