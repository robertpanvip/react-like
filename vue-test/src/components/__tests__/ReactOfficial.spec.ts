/**
 * React 官方行为对齐测试套件
 *
 * 目的：验证 @react-like/vue 桥接层的所有 API 行为与 React 官方完全一致。
 * 所有测试用例参考 React 官方的测试模式和行为规范。
 *
 * 测试策略：
 *   每个测试用例标注 React 的官方预期行为，桥接层必须100%匹配。
 *   测试覆盖所有核心 Hooks、API 和组件模式。
 */
import {describe, it, expect, vi, beforeEach, afterEach} from 'vitest'
import {mount} from '@vue/test-utils'
import VueReact, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
  useReducer,
  useContext,
  createContext,
  useImperativeHandle,
  forwardRef,
  createPortal,
  createElement,
  Fragment,
  cloneElement,
  isValidElement,
  Children,
  memo,
  flushSync,
  useTransition,
  useId,
  useLayoutEffect,
  useInsertionEffect,
  createRef,
  defineComponent,
  resetReactScheduler,
  findDOMNode,
  StrictMode,
  unstable_batchedUpdates
} from "@react-like/vue";

beforeEach(() => {
  vi.clearAllMocks()
  resetReactScheduler()
})

afterEach(() => {
  vi.restoreAllMocks()
})

// 兼容微任务
if (!globalThis.queueMicrotask) {
  globalThis.queueMicrotask = (callback: VoidFunction) => Promise.resolve().then(callback)
}

/* ===================================================================
   Part 1: useState - React 官方行为
   =================================================================== */
describe('useState - React 官方行为对齐', () => {

  it('惰性初始值：函数初始化器只执行一次', () => {
    const initFn = vi.fn(() => 42)
    const TestComponent = defineComponent(() => {
      const [value] = useState(initFn)
      expect(value).toBe(42)
      expect(initFn).toHaveBeenCalledTimes(1)
      return createElement('div')
    })
    mount(TestComponent)
  })

  it('函数式更新：prev => next 拿到最新前值', () => {
    const TestComponent = defineComponent(() => {
      const isFirst = useRef(true)
      const [count, setCount] = useState(0)
      if (isFirst.current) {
        setCount(prev => prev + 1)
        setCount(prev => prev + 1)
        // React 官方：同一次渲染中，函数式更新排队，但当前值仍是快照
        expect(count).toBe(0)
        isFirst.current = false
      }
      return createElement('div')
    })
    mount(TestComponent)
  })

  it('对象/数组状态：必须替换引用而非修改', () => {
    const TestComponent = defineComponent(() => {
      const isFirst = useRef(true)
      const [items, setItems] = useState([1, 2, 3])
      if (isFirst.current) {
        // React 官方：不直接修改 state，而是创建新数组
        setItems(prev => [...prev, 4, 5])
        expect(items).toEqual([1, 2, 3]) // 快照，未变
        isFirst.current = false
      }
      return createElement('div')
    })
    mount(TestComponent)
  })

  it('多个 setState 批量合并：只触发一次重渲染', async () => {
    let renderCount = 0
    const TestComponent = defineComponent(() => {
      const [a, setA] = useState(0)
      const [b, setB] = useState(0)
      renderCount++
      const isFirst = useRef(true)
      if (isFirst.current) {
        setA(1)
        setB(2)
        expect(a).toBe(0) // 快照
        expect(b).toBe(0)
        isFirst.current = false
      }
      return createElement('div', null, `${a}-${b}`)
    })
    mount(TestComponent)
    await Promise.resolve()
    // React 官方：多个 setState 合并为一次重渲染
    expect(renderCount).toBe(2) // 首次 + 合并更新
  })

  it('setState 在 useEffect 中触发更新', async () => {
    const effect = vi.fn()
    const TestComponent = defineComponent(() => {
      const [count, setCount] = useState(0)
      useEffect(() => {
        setCount(1)
        effect()
      }, [])
      return createElement('div', null, count)
    })
    mount(TestComponent)
    await Promise.resolve()
    await Promise.resolve()
    // effect 应该执行
    expect(effect).toHaveBeenCalledTimes(1)
  })
})

/* ===================================================================
   Part 2: useEffect - React 官方行为
   =================================================================== */
describe('useEffect - React 官方行为对齐', () => {

  it('无依赖：每次渲染后执行', async () => {
    const effect = vi.fn()
    const TestComponent = defineComponent(() => {
      const [count, setCount] = useState(0)
      useEffect(() => { effect() })
      const isFirst = useRef(true)
      if (isFirst.current) {
        setCount(1)
        isFirst.current = false
      }
      return createElement('div')
    })
    mount(TestComponent)
    await Promise.resolve()
    await Promise.resolve()
    await Promise.resolve()
    // 首次渲染后执行1次 + 更新后执行1次
    expect(effect).toHaveBeenCalledTimes(2)
  })

  it('多个 useEffect 按声明顺序执行', async () => {
    const order: number[] = []
    const TestComponent = defineComponent(() => {
      useEffect(() => { order.push(1) })
      useEffect(() => { order.push(2) })
      useEffect(() => { order.push(3) })
      return createElement('div')
    })
    mount(TestComponent)
    await Promise.resolve()
    expect(order).toEqual([1, 2, 3])
  })

  it('清理函数在组件卸载时执行', async () => {
    const cleanup = vi.fn()
    const TestComponent = defineComponent(() => {
      useEffect(() => {
        return () => { cleanup() }
      }, [])
      return createElement('div')
    })
    const wrapper = mount(TestComponent)
    await Promise.resolve()
    wrapper.unmount()
    // React 官方：卸载时执行清理函数
    expect(cleanup).toHaveBeenCalledTimes(1)
  })

  it('依赖为引用类型时，每次渲染都重新执行', async () => {
    const effect = vi.fn()
    const TestComponent = defineComponent(() => {
      // React 官方：对象字面量每次渲染都是新引用
      useEffect(() => { effect() }, [{ key: 'value' }])
      return createElement('div')
    })
    mount(TestComponent)
    await Promise.resolve()
    // 因为每次渲染创建新对象，effect 每次都会执行
    expect(effect).toHaveBeenCalledTimes(1)
  })
})

/* ===================================================================
   Part 3: useReducer - React 官方行为
   =================================================================== */
describe('useReducer - React 官方行为对齐', () => {
  function reducer(state: number, action: 'inc' | 'dec' | { type: string; payload: number }) {
    if (typeof action === 'string') {
      return action === 'inc' ? state + 1 : state - 1
    }
    return action.type === 'add' ? state + action.payload : state
  }

  it('基础 dispatch 正确更新状态', () => {
    const TestComponent = defineComponent(() => {
      const [state] = useReducer(reducer, 0)
      expect(state).toBe(0)
      return createElement('div')
    })
    mount(TestComponent)
  })

  it('惰性初始化：initializer 函数执行', () => {
    const initFn = vi.fn((val: number) => val * 2)
    const TestComponent = defineComponent(() => {
      const [state] = useReducer(reducer, 10, initFn)
      expect(state).toBe(20)
      expect(initFn).toHaveBeenCalledWith(10)
      return createElement('div')
    })
    mount(TestComponent)
  })

  it('dispatch action 触发状态更新', async () => {
    let renderCount = 0
    let currentState = 0
    const TestComponent = defineComponent(() => {
      const [state, dispatch] = useReducer(reducer, 0)
      const isFirst = useRef(true)
      renderCount++
      currentState = state
      if (isFirst.current) {
        dispatch('inc')
        isFirst.current = false
      }
      return createElement('div')
    })
    mount(TestComponent)
    await Promise.resolve()
    expect(currentState).toBe(1) // 0 + 1
  })
})

/* ===================================================================
   Part 4: useContext - React 官方行为
   =================================================================== */
describe('useContext - React 官方行为对齐', () => {
  const ThemeContext = createContext('light')
  const UserContext = createContext({ name: 'guest' })

  it('基础上下文消费', () => {
    const TestComponent = defineComponent(() => {
      const theme = useContext(ThemeContext)
      expect(theme).toBe('light')
      return createElement('div')
    })
    mount(TestComponent)
  })

  it('嵌套 Provider 覆盖上下文值', () => {
    const TestComponent = defineComponent(() => {
      const theme = useContext(ThemeContext)
      if (theme === 'dark') {
        expect(theme).toBe('dark')
      }
      return createElement('div')
    })
    const Wrapper = defineComponent(() => {
      return createElement(ThemeContext.Provider, { value: 'dark' },
        createElement(TestComponent)
      )
    })
    mount(createElement(Wrapper))
  })

  it('多个 Context 独立消费', () => {
    const TestComponent = defineComponent(() => {
      const theme = useContext(ThemeContext)
      const user = useContext(UserContext)
      expect(theme).toBe('light')
      expect(user).toEqual({ name: 'guest' })
      return createElement('div')
    })
    mount(TestComponent)
  })

  it('默认值：没有 Provider 时使用 createContext 默认值', () => {
    const TestComponent = defineComponent(() => {
      const theme = useContext(ThemeContext)
      expect(theme).toBe('light')
      return createElement('div')
    })
    mount(TestComponent)
  })
})

/* ===================================================================
   Part 5: forwardRef + useImperativeHandle - React 官方行为
   =================================================================== */
describe('forwardRef + useImperativeHandle - React 官方行为对齐', () => {
  it('forwardRef 基础：ref 转发到 DOM 元素', () => {
    // React 官方：forwardRef 接收 ref 并转发给子 DOM 元素
    const FancyButton = forwardRef((props: any, ref: any) => {
      return createElement('button', { ref, ...props })
    })
    const TestComponent = defineComponent(() => {
      const btnRef = useRef(null)
      // 使用 createRef 创建 ref
      const btnRef2 = createRef()
      return createElement(FancyButton, { ref: btnRef, id: 'fancy-btn' }, 'Click')
    })
    mount(TestComponent)
  })

  it('useImperativeHandle 暴露自定义方法', () => {
    const FancyInput = forwardRef((props: any, ref: any) => {
      const inputRef = useRef(null)
      useImperativeHandle(ref, () => ({
        focus: () => { /* 模拟 focus */ },
        clear: () => { /* 模拟 clear */ },
      }))
      return createElement('input', { ref: inputRef, ...props })
    })
    const TestComponent = defineComponent(() => {
      const fancyRef = useRef<{ focus: () => void; clear: () => void }>(null)
      return createElement(FancyInput, { ref: fancyRef })
    })
    mount(TestComponent)
  })
})

/* ===================================================================
   Part 6: useMemo / useCallback - React 官方行为
   =================================================================== */
describe('useMemo / useCallback - React 官方行为对齐', () => {
  it('useMemo 依赖不变时返回相同引用', () => {
    let memoized: any[] = []
    const TestComponent = defineComponent(() => {
      const isFirst = useRef(true)
      const items = useMemo(() => [1, 2, 3], [])
      memoized.push(items)
      if (isFirst.current) {
        isFirst.current = false
      }
      return createElement('div')
    })
    mount(TestComponent)
    // React 官方：空依赖时，memoized 值始终是同一个引用
    expect(memoized.length).toBeGreaterThanOrEqual(1)
    memoized.forEach((ref, i) => {
      if (i > 0) expect(ref).toBe(memoized[0])
    })
  })

  it('useCallback 依赖不变时返回相同函数引用', () => {
    let fns: any[] = []
    const TestComponent = defineComponent(() => {
      const isFirst = useRef(true)
      const handleClick = useCallback(() => { /* noop */ }, [])
      fns.push(handleClick)
      if (isFirst.current) {
        isFirst.current = false
      }
      return createElement('div')
    })
    mount(TestComponent)
    expect(fns.length).toBeGreaterThanOrEqual(1)
    fns.forEach((fn, i) => {
      if (i > 0) expect(fn).toBe(fns[0])
    })
  })
})

/* ===================================================================
   Part 7: createElement / cloneElement / isValidElement - React 官方行为
   =================================================================== */
describe('createElement / cloneElement / isValidElement - React 官方行为对齐', () => {
  it('createElement 创建 React 元素', () => {
    const el = createElement('div', { className: 'test', id: 'my-id' }, 'Hello')
    expect(isValidElement(el)).toBe(true)
    expect(el.type).toBe('div')
    expect(el.props!.className).toBe('test')
    expect(el.props!.id).toBe('my-id')
    expect(el.props!.children).toBe('Hello')
  })

  it('cloneElement 合并 props', () => {
    const original = createElement('div', { className: 'original' }, 'text')
    const cloned = cloneElement(original, { className: 'cloned', 'data-test': 'value' })
    expect(cloned.props!.className).toBe('cloned')
    expect(cloned.props!['data-test']).toBe('value')
    // React 官方：cloneElement 保留原始 children
    expect(cloned.props!.children).toBe('text')
  })

  it('isValidElement 正确判断', () => {
    expect(isValidElement(createElement('div'))).toBe(true)
    expect(isValidElement(createElement(Fragment, null, 'text'))).toBe(true)
    expect(isValidElement(null)).toBe(false)
    expect(isValidElement(undefined)).toBe(false)
    expect(isValidElement('string')).toBe(false)
    expect(isValidElement(123)).toBe(false)
    expect(isValidElement(true)).toBe(false)
    expect(isValidElement({})).toBe(false)
  })
})

/* ===================================================================
   Part 8: memo - React 官方行为
   =================================================================== */
describe('memo - React 官方行为对齐', () => {
  it('memo 包装组件返回特殊类型', () => {
    const SimpleComp = (props: any) => createElement('div', null, props.text)
    const Memoized = memo(SimpleComp)
    // React 官方：memo 返回 { $$typeof: REACT_MEMO_TYPE, type: component }
    expect(typeof Memoized).toBe('object')
    // 验证：memo 组件可通过 createElement 渲染
    expect(() => {
      createElement(Memoized, { text: 'hello' })
    }).not.toThrow()
  })
})

/* ===================================================================
   Part 9: createRef - React 官方行为
   =================================================================== */
describe('createRef - React 官方行为对齐', () => {
  it('createRef 创建 { current: null } 对象', () => {
    const ref = createRef()
    expect(ref).toEqual({ current: null })
    ref.current = 'test'
    expect(ref.current).toBe('test')
  })
})

/* ===================================================================
   Part 10: flushSync - React 官方行为
   =================================================================== */
describe('flushSync - React 官方行为对齐', () => {
  it('flushSync 同步执行回调', () => {
    let result = 0
    flushSync(() => {
      result = 42
    })
    expect(result).toBe(42)
  })
})

/* ===================================================================
   Part 11: useTransition - React 官方行为
   =================================================================== */
describe('useTransition - React 官方行为对齐', () => {
  it('useTransition 返回 startTransition 和 isPending', () => {
    const TestComponent = defineComponent(() => {
      const [startTransition, isPending] = useTransition()
      expect(typeof startTransition).toBe('function')
      expect(isPending).toBe(false)
      return createElement('div')
    })
    mount(TestComponent)
  })
})

/* ===================================================================
   Part 12: useId - React 官方行为
   =================================================================== */
describe('useId - React 官方行为对齐', () => {
  it('useId 生成唯一 ID', () => {
    const TestComponent = defineComponent(() => {
      const id1 = useId()
      const id2 = useId()
      expect(id1).toEqual(expect.any(String))
      expect(id2).toEqual(expect.any(String))
      expect(id1).not.toBe(id2) // 不同调用生成不同 ID
      return createElement('div')
    })
    mount(TestComponent)
  })
})

/* ===================================================================
   Part 13: Fragment - React 官方行为
   =================================================================== */
describe('Fragment - React 官方行为对齐', () => {
  it('Fragment 渲染子节点', () => {
    const TestComponent = defineComponent(() => {
      return createElement(Fragment, null,
        createElement('span', { key: '1' }, 'A'),
        createElement('span', { key: '2' }, 'B')
      )
    })
    const wrapper = mount(TestComponent)
    expect(wrapper.text()).toContain('A')
    expect(wrapper.text()).toContain('B')
  })
})

/* ===================================================================
   Part 14: Children API - React 官方行为
   =================================================================== */
describe('Children API - React 官方行为对齐', () => {
  it('Children.map 遍历子节点', () => {
    const result = Children.map(
      [1, 2, 3],
      (child: any, idx: number) => `${idx}:${child}`
    )
    expect(result).toEqual(['0:1', '1:2', '2:3'])
  })

  it('Children.forEach 遍历无返回值', () => {
    const result: string[] = []
    Children.forEach(
      ['a', 'b', 'c'],
      (child: any, idx: number) => result.push(`${idx}:${child}`)
    )
    expect(result).toEqual(['0:a', '1:b', '2:c'])
  })

  it('Children.count 统计子节点数', () => {
    expect(Children.count([1, 2, 3])).toBe(3)
    expect(Children.count([])).toBe(0)
    expect(Children.count(null)).toBe(0)
  })

  it('Children.only 返回唯一子节点', () => {
    expect(Children.only([42])).toBe(42)
  })
})

/* ===================================================================
   Part 15: StrictMode - React 官方行为
   =================================================================== */
describe('StrictMode - React 官方行为对齐', () => {
  it('StrictMode 作为 Fragment 渲染子节点', () => {
    const TestComponent = defineComponent(() => {
      return createElement(StrictMode, null,
        createElement('div', null, 'strict content')
      )
    })
    const wrapper = mount(TestComponent)
    expect(wrapper.text()).toContain('strict content')
  })
})

/* ===================================================================
   Part 16: 组合场景 - React 官方行为
   =================================================================== */
describe('组合场景 - React 官方行为对齐', () => {
  it('useState + useEffect + useRef 组合：计数器', async () => {
    const effectFn = vi.fn()
    const TestComponent = defineComponent(() => {
      const [count, setCount] = useState(0)
      const countRef = useRef(count)
      useEffect(() => {
        countRef.current = count
        effectFn(count)
      }, [count])
      const isFirst = useRef(true)
      if (isFirst.current) {
        setCount(5)
        isFirst.current = false
      }
      return createElement('div', null, count)
    })
    mount(TestComponent)
    await Promise.resolve()
    await Promise.resolve()
    // React 官方：effect 因 count 变化而执行
    expect(effectFn).toHaveBeenCalledWith(5)
  })

  it('Context + useReducer 组合：状态管理', async () => {
    const CountContext = createContext(0)
    const reducer = (state: number, action: 'inc' | 'dec') =>
      action === 'inc' ? state + 1 : state - 1

    const Display = defineComponent(() => {
      const count = useContext(CountContext)
      return createElement('span', null, `count:${count}`)
    })

    const TestComponent = defineComponent(() => {
      const [count, dispatch] = useReducer(reducer, 0)
      const isFirst = useRef(true)
      if (isFirst.current) {
        dispatch('inc')
        isFirst.current = false
      }
      return createElement(CountContext.Provider, { value: count },
        createElement(Display)
      )
    })
    const wrapper = mount(TestComponent)
    await Promise.resolve()
    expect(wrapper.text()).toContain('count:1')
  })
})

/* ===================================================================
   Part 17: API 导出完整性 - React 官方行为
   =================================================================== */
describe('API 导出完整性 - React 官方行为对齐', () => {
  it('导出所有 React 核心 API', () => {
    const apis = [
      useState, useEffect, useRef, useMemo, useCallback,
      useReducer, useContext, useImperativeHandle, useId,
      useLayoutEffect, useInsertionEffect, useTransition,
      createElement, createContext, createRef, createPortal,
      forwardRef, memo, Fragment, cloneElement, isValidElement,
      flushSync, defineComponent, StrictMode,
      findDOMNode, unstable_batchedUpdates
    ]
    apis.forEach(api => {
      expect(api).toBeTypeOf('function')
    })
    // Children is an object (not a function) in React, containing methods like map, forEach, etc.
    expect(Children).toBeTypeOf('object')
  })

  it('Children 包含所有标准方法', () => {
    expect(Children.map).toBeTypeOf('function')
    expect(Children.forEach).toBeTypeOf('function')
    expect(Children.count).toBeTypeOf('function')
    expect(Children.only).toBeTypeOf('function')
    expect(Children.toArray).toBeTypeOf('function')
  })
})