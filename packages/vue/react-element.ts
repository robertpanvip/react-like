/**
 * ReactElement 表示层 —— 带标准 $$typeof 符号的 React 元素树。
 *
 * 职责：
 *   - 以 ReactElement 作为对外交换格式（react-is / Children 等均基于此）
 *   - 内接 translator toVNode() 转为 Vue vnode，再由 Vue 渲染引擎上屏
 *
 * 符号对齐 React 18 符号族，兼容 antd v6 内部 $$typeof 判断。
 */
import {h, provide, inject, getCurrentInstance, createVNode, Fragment as VueFragment, defineComponent as defineVueComponent} from 'vue'
const Text = Symbol.for('v-txt')
import {normalizeStyle} from './util'

/* ===================== 符号族（React 19 transitional） ===================== */
export const REACT_ELEMENT_TYPE    = Symbol.for('react.element')
export const REACT_FRAGMENT_TYPE   = Symbol.for('react.fragment')
export const REACT_FORWARD_REF_TYPE = Symbol.for('react.forward_ref')
export const REACT_PROVIDER_TYPE   = Symbol.for('react.context')       // React19: Provider 用 react.context
export const REACT_CONSUMER_TYPE   = Symbol.for('react.consumer')
export const REACT_MEMO_TYPE       = Symbol.for('react.memo')
export const REACT_LAZY_TYPE       = Symbol.for('react.lazy')
export const REACT_PORTAL_TYPE     = Symbol.for('react.portal')
export const DEFINE_COMPONENT      = Symbol('define-component')        // 私有标记，非 react 标准

/* ===================== Types ===================== */
export interface ReactElement<P = any> {
  $$typeof: symbol
  type: any
  key: string | null
  ref: any
  props: P
  _owner: null
}

export type ReactNode = ReactElement | string | number | boolean | null | undefined

/* ===================== 创建元素 ===================== */
const typeCache = new WeakMap<Function, any>()

export function createElement(type: any, props: any | null, ...children: any[]): ReactElement {
  if (!props) props = {}

  // Handle Fragment and StrictMode function types
  if (type === Fragment) {
    type = REACT_FRAGMENT_TYPE
  }
  if (type === StrictModeFn) {
    type = REACT_FRAGMENT_TYPE
  }

  const {key, ref, ...rest} = props
  let child: any = rest.children
  if (children.length > 0) {
    child = children.length === 1 ? children[0] : children
  }
  delete (rest as any).children

  // 把未包装的纯函数组件 wrap 为 defineComponent（Vue 组件），
  // 但保留 forwardRef / memo 等 $$typeof 对象不包装，留给 toVNode 处理
  if (typeof type === 'function' && type.$typeof !== DEFINE_COMPONENT) {
    // 延迟导入避免循环依赖
    const {defineComponent: wrap} = await_import_defineComponent()
    let cached = typeCache.get(type)
    if (!cached) {
      cached = wrap(type as any)
      typeCache.set(type, cached)
    }
    type = cached
  }

  // 处理 className → class 转换（在 props 层保留 React 习惯，translate 时再处理）
  // 但这里保持 React 原样，toVNode 时转换
  if (rest.style) {
    rest.style = normalizeStyle(rest.style)
  }

  return {
    $$typeof: REACT_ELEMENT_TYPE,
    type,
    key: key ?? null,
    ref: ref ?? null,
    props: {...rest, children: child},
    _owner: null,
  }
}

/* 延迟加载，避免循环依赖 */
let _defineComponent: any = null
function await_import_defineComponent(): { defineComponent: any } {
  if (_defineComponent) return {defineComponent: _defineComponent}
  // 动态 require 在 ESM 中不可用，使用静态导入方案
  // 通过赋值方式解决，在 index.ts 中会调用 setDefineComponentRef
  return {defineComponent: _defineComponent || ((fn: any) => fn)}
}
export function __setDefineComponentRef(ref: any) {
  _defineComponent = ref
}

/* ===================== 内建组件类型 ===================== */
export function Fragment() {}
export function StrictModeFn() {}

export function forwardRef(render: Function) {
  return {$$typeof: REACT_FORWARD_REF_TYPE, render}
}

export function createContext<T>(defaultValue?: T) {
  const _key = Symbol('context')
  const ctx: any = {
    $$typeof: REACT_CONSUMER_TYPE,
    _key,
    _defaultValue: defaultValue,
    _currentValue: defaultValue,
  }
  ctx.Provider = {$$typeof: REACT_PROVIDER_TYPE, _context: ctx}
  ctx.Consumer = ctx
  return ctx as any
}

export function memo(component: any) {
  return {$$typeof: REACT_MEMO_TYPE, type: component}
}

export function lazy(loader: () => Promise<{default: any}>) {
  return {$$typeof: REACT_LAZY_TYPE, _payload: {_result: loader, _status: -1}, _init: lazyInit}
}
function lazyInit(lazyNode: any) {
  const {_payload} = lazyNode
  if (_payload._status === -1) {
    _payload._status = 0
    _payload._result = _payload._result().then((mod: any) => {
      _payload._status = 1
      _payload._result = mod.default
    })
  }
  if (_payload._status === 1) return _payload._result
  throw _payload._result
}

export function isValidElement(obj: any): boolean {
  return typeof obj === 'object' && obj !== null && obj.$$typeof === REACT_ELEMENT_TYPE
}

export function cloneElement(element: ReactElement, props?: any, ...children: any[]): ReactElement {
  const merged = {...element.props, ...props}
  let child = merged.children
  if (children.length > 0) {
    child = children.length === 1 ? children[0] : children
  }
  merged.children = child
  return {
    ...element,
    key: props?.key ?? element.key,
    ref: props?.ref ?? element.ref,
    props: merged,
  }
}

/* ===================== Children ===================== */
export const Children = {
  map(children: any, fn: (child: any, index: number) => any): any[] {
    return normalizeReactChildren(children).map(fn)
  },
  forEach(children: any, fn: (child: any, index: number) => void): void {
    normalizeReactChildren(children).forEach(fn)
  },
  count(children: any): number {
    return normalizeReactChildren(children).length
  },
  only(children: any): any {
    const arr = normalizeReactChildren(children)
    if (arr.length !== 1) throw new Error('Children.only expects exactly one child')
    return arr[0]
  },
  toArray(children: any): any[] {
    return normalizeReactChildren(children)
  },
}

function normalizeReactChildren(children: any): any[] {
  if (children == null || typeof children === 'boolean') return []
  if (Array.isArray(children)) return children.flat(Infinity).filter(c => c != null && c !== false)
  return [children]
}

/* ===================== Translator: ReactElement → Vue vnode ===================== */
export interface ToVNodeOptions {
  /** forwardRef 场景下传入的 Vue ref 对象 */
  forwardRef?: any
}

/**
 * 把 ReactElement 树递归翻译为 Vue vnode 树。
 * 字符串元素 → h(type, props, children)
 * Fragment → h(VueFragment, ...)
 * forwardRef → 调用 type.render(props, ref) 后递归
 * memo → 解包后递归
 * Provider → 直接渲染子树（context value 交给 Vue 的 provide/inject）
 * Consumer → 以 render-prop 方式调用 children(contextValue)
 * 组件（defineComponent 包装过的）→ h(type, props, children)
 */
export function toVNode(node: any, options?: ToVNodeOptions): any {
  return toVNodeImpl(node, options)
}

function toVNodeImpl(node: any, options?: ToVNodeOptions): any {
  // 1. 空 / 布尔 → 跳过
  if (node == null || typeof node === 'boolean') return null
  // 2. 文本 - use createVNode with Text symbol to create a proper text VNode
  // Using createVNode with Text symbol directly creates a text VNode that Vue won't try to mutate
  if (typeof node === 'string' || typeof node === 'number') return createVNode(Text, null, String(node))
  // 3. 数组
  if (Array.isArray(node)) {
    const mapped = node.map(n => toVNodeImpl(n, options))
    return mapped.length === 1 ? mapped[0] : mapped
  }
  // 4. 已经是 Vue VNode → 直接透传
  if (node.__v_isVNode) return node
  // 5. 非 ReactElement
  if (typeof node !== 'object' || node.$$typeof !== REACT_ELEMENT_TYPE) return null

  const {type, key, props, ref: elementRef} = node
  const vnodeKey = key != null ? key : undefined

  // 4a. Fragment
  if (type === REACT_FRAGMENT_TYPE) {
    const kids = normalizeReactChildren(props.children)
    const vnodes = kids.map((c: any) => toVNodeImpl(c, options))
    return h(VueFragment, vnodeKey != null ? {key: vnodeKey} : null, vnodes.length === 1 ? vnodes[0] : vnodes)
  }

  // 4b. 字符串标签（原生元素）
  if (typeof type === 'string') {
    const vp = buildVNodeProps(props, vnodeKey, elementRef)
    const kids = normalizeReactChildren(props.children)
    if (kids.length === 0) return h(type, vp)
    const vnodes = kids.map((c: any) => toVNodeImpl(c, options))
    return h(type, vp, vnodes.length === 1 ? vnodes[0] : vnodes)
  }

  // 4c. $$typeof 组件（forwardRef / memo / Provider / Consumer）
  if (typeof type === 'object' && type !== null) {
    // 优先检查 $typeof === DEFINE_COMPONENT：如果组件已被 defineComponent 包装，
    // 应使用 Vue 组件渲染机制（通过 h()），而不是 React 的 $$typeof 处理。
    // 否则 clone 拷贝的 $$typeof（如 REACT_FORWARD_REF_TYPE）会导致绕开 defineComponent 的 children 处理。
    if (type.$typeof === DEFINE_COMPONENT) {
      const _vp = buildVNodeProps(props, vnodeKey, undefined)
      if (elementRef != null) {
        _vp.__userRef = elementRef
      }
      const _kids = normalizeReactChildren(props.children)
      if (_kids.length > 0) {
        _vp.__reactChildren = _kids.length === 1 ? _kids[0] : _kids
      }
      return h(type, _vp)
    }
    // 非 defineComponent 组件：按 React $$typeof 处理
    switch (type.$$typeof) {
      case REACT_FORWARD_REF_TYPE: {
        // 优先使用 ReactElement 自带的 ref（如 <Comp ref={handlesRef}>），
        // 否则使用父组件通过 forwardRef 传递的 ref
        const ref = elementRef ?? options?.forwardRef ?? null
        const inner = type.render(props, ref)
        return toVNodeImpl(inner, options)
      }
      case REACT_MEMO_TYPE: {
        return toVNodeImpl(createElement(type.type, props), options)
      }
      case REACT_PROVIDER_TYPE: {
        // Provider 使用 Vue 的 provide 机制传递 context value。
        // 必须在当前组件实例的 provides 上设置值，而不是创建子组件，
        // 因为 CJS shim 的 useContext 通过 inject 查找父级 provides 链。
        // ProviderWrapper 子组件方式会导致 inject 从当前组件的父级开始查找，
        // 而 ProviderWrapper 是当前组件的子级，不在查找链上。
        const ctx = type._context
        const value = props.value ?? ctx._defaultValue
        const inst = getCurrentInstance()
        if (inst) {
          // 模拟 Vue 3 provide() 的行为：
          // 创建一个继承自当前 provides 的新对象，并设置 key-value
          const parentProvides = inst.provides
          const newProvides = Object.create(parentProvides)
          newProvides[ctx._key] = value
          inst.provides = newProvides
        }
        // 直接渲染 children
        const kids = normalizeReactChildren(props.children)
        if (kids.length === 0) return null
        const vnodes = kids.map((c: any) => toVNodeImpl(c, options))
        return vnodes.length === 1 ? vnodes[0] : vnodes
      }
      case REACT_CONSUMER_TYPE: {
        const childFn = props.children
        if (typeof childFn === 'function') {
          // Create a wrapper component that reads the injected value via Vue's inject
          const ConsumerWrapper = defineVueComponent({
            name: 'ContextConsumer',
            setup() {
              const injectedValue = inject(type._key, type._defaultValue)
              return () => toVNodeImpl(childFn(injectedValue), options)
            }
          })
          return h(ConsumerWrapper)
        }
        return null
      }
      default:
        // 未知 $$typeof 类型（或 Vue 组件对象）→ 尝试作为组件渲染，保留 children
        // 注意：这里 elementRef 直接传给 buildVNodeProps 会让 Vue 当作模板 ref 处理，
        // 但我们希望 ref 通过 __userRef 手动转发。对于 defineComponent 包装的组件，
        // 上面的 $typeof === DEFINE_COMPONENT 分支已处理。这里处理的是非 defineComponent 组件。
        const _vp = buildVNodeProps(props, vnodeKey, undefined)
        if (elementRef != null) {
          _vp.__userRef = elementRef
        }
        const _kids = normalizeReactChildren(props.children)
        if (_kids.length > 0) {
          _vp.__reactChildren = _kids.length === 1 ? _kids[0] : _kids
        }
        return h(type, _vp)
    }
  }

  // 4d. 函数组件（defineComponent 包装过的 Vue 组件）
  if (typeof type === 'function') {
    let resolvedType = type
    // 如果函数没有被 defineComponent 包装，说明是 antd 内部 CJS 代码创建的元素，
    // 需要包装为 Vue 可挂载的组件
    if (type.$typeof !== DEFINE_COMPONENT) {
      const {defineComponent: wrap} = await_import_defineComponent()
      let cached = typeCache.get(type)
      if (!cached) {
        cached = wrap(type as any)
        typeCache.set(type, cached)
      }
      resolvedType = cached
    }
    // 用户 ref 通过 __userRef 传递，而非 vp.ref。
    // 原因：vp.ref 会被 Vue 的 h() 当作模板 ref 处理，将组件 expose 的对象赋值给 ref.value，
    // 导致用户期望的 ref.current 指向 expose 对象而非组件内部 ref 值。
    // 使用 __userRef 作为自定义 prop，defineComponent 通过 attrs 读取并手动同步。
    const vp = buildVNodeProps(props, vnodeKey, undefined)
    if (elementRef != null) {
      vp.__userRef = elementRef
    }
    const kids = normalizeReactChildren(props.children)
    if (kids.length === 0) {
      return h(resolvedType, vp)
    }
    // 使用 __reactChildren 而非 children 传递原始 React 子节点。
    // 原因：h(type, vp) 中 vp.children 会被 Vue 视为 vnode 子节点（slots），
    // 导致 defineComponent 中 slots.default() 返回 Vue VNode 而非原始字符串/ReactElement。
    // 使用 __reactChildren 作为常规 prop 传递，defineComponent 通过 attrs 读取。
    vp.__reactChildren = kids.length === 1 ? kids[0] : kids
    return h(resolvedType, vp)
  }

  return null
}

/**
 * 把 React 风格 props 转为 Vue vnode 可用的 props 对象。
 * - className → class
 * - style 已在上层 normalizeStyle 处理
 * - key/ref/children 从 props 剥离
 */
function buildVNodeProps(props: any, key: any, ref: any): Record<string, any> {
  const result: Record<string, any> = {}
  if (key !== undefined) result.key = key
  if (ref != null) result.ref = ref

  if (!props) return result

  for (const k in props) {
    if (k === 'key' || k === 'ref' || k === 'children' || k === '__reactChildren') continue
    if (k === 'className') {
      result.class = props[k]
    } else {
      result[k] = props[k]
    }
  }
  return result
}