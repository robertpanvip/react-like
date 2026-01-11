@react-like/vue
===========
react-shim


[![NPM Version](https://img.shields.io/npm/v/@es-pkg/doc?color=33cd56&logo=npm)](https://www.npmjs.com/package/@es-pkg/doc)  [![NPM Version](https://img.shields.io/npm/dm/@es-pkg/doc.svg?style=flat-square)](https://www.npmjs.com/package/@es-pkg/doc)  [![unpacked size](https://img.shields.io/npm/unpacked-size/@es-pkg/doc?color=green)](https://www.npmjs.com/package/@es-pkg/doc)  [![Author](https://img.shields.io/badge/docs_by-robertpanvip-blue)](https://github.com/robertpanvip/es-pkg-doc.git)

## 🔧 Install
    npm install @react-like/vue
### 🔖 React

**类型**：``typeof default``
  
**简介**：无说明





### 🔖 defineComponent

**类型**：``typeof defineComponent``
  
**简介**：无说明





### 🔖 useState

**类型**：``typeof default.useState``
  
**简介**：无说明





### 🔖 useEffect

**类型**：``typeof default.useEffect``
  
**简介**：无说明





### 🔖 useMemo

**类型**：``typeof default.useMemo``
  
**简介**：无说明





### 🔖 useRef

**类型**：``typeof default.useRef``
  
**简介**：无说明





### 🔖 useCallback

**类型**：``typeof default.useCallback``
  
**简介**：无说明





### 🔖 createContext

**类型**：``typeof default.createContext``
  
**简介**：无说明





### 🔖 useContext

**类型**：``typeof default.useContext``
  
**简介**：无说明





### 🔖 useImperativeHandle

**类型**：``typeof default.useImperativeHandle``
  
**简介**：无说明





### 🔖 useInsertionEffect

**类型**：``typeof default.useEffect``
  
**简介**：无说明





### 🔖 useReducer

**类型**：``typeof default.useReducer``
  
**简介**：无说明





### 🔖 useTransition

**类型**：``typeof default.useTransition``
  
**简介**：无说明





### 🔖 useLayoutEffect

**类型**：``typeof default.useEffect``
  
**简介**：无说明





### 🔖 useId

**类型**：``typeof default.useId``
  
**简介**：无说明





### 🔖 createElement

**类型**：``typeof default.createElement``
  
**简介**：无说明





### 🔖 memo

**类型**：``<T>(component: T) => T``
  
**简介**：无说明





### 🔖 Children

**类型**：``{ map(children: any[], fn: (child: any, index: number) => any): any[]; forEach(children: any[], fn: (child: any, index: number) => void): void; count(children: any[]): number; only(children: any[]): any; toArray(children: any[]): any[]; }``
  
**简介**：无说明





### 🔖 cloneElement

**类型**：``typeof default.cloneElement``
  
**简介**：无说明





### 🔖 createRef

**类型**：``typeof default.createRef``
  
**简介**：无说明





### 🔖 forwardRef

**类型**：``typeof default.forwardRef``
  
**简介**：无说明





### 🔖 Fragment

**类型**：``{ new (): { $props: VNodeProps; }; __isFragment: true; }``
  
**简介**：无说明





### 🔖 isValidElement

**类型**：``typeof default.isValidElement``
  
**简介**：无说明





### 🔖 version

**类型**：``"18.2.0"``
  
**简介**：无说明





### 🔖 Component

**类型**：``typeof default.Component``
  
**简介**：无说明





### 🔖 PureComponent

**类型**：``typeof default.PureComponent``
  
**简介**：无说明





### 🔖 ReactNode

**类型**：``default.ReactNode``
  
**简介**：无说明





### 🔖 ReactElement

**类型**：``default.ReactElement``
  
**简介**：无说明
#### ⚙️  API 参数
| 属性           | 说明                                                                                                                    | 类型                                      | 默认值 |
| ------------ | --------------------------------------------------------------------------------------------------------------------- | --------------------------------------- | --- |
| type         |                                                                                                                       | ` VNodeTypes`                           |     |
| props        |                                                                                                                       | ` (VNodeProps & ExtraProps) \| null`    |     |
| key          |                                                                                                                       | ` PropertyKey \| null`                  |     |
| ref          |                                                                                                                       | ` VNodeNormalizedRef \| null`           |     |
| scopeId      | SFC only. This is assigned on vnode creation using currentScopeId<br>which is set alongside currentRenderingInstance. | ` string \| null`                       |     |
| children     |                                                                                                                       | ` VNodeNormalizedChildren`              |     |
| component    |                                                                                                                       | ` ComponentInternalInstance \| null`    |     |
| dirs         |                                                                                                                       | ` DirectiveBinding\[\] \| null`         |     |
| transition   |                                                                                                                       | ` TransitionHooks<HostElement> \| null` |     |
| el           |                                                                                                                       | ` HostNode \| null`                     |     |
| placeholder  |                                                                                                                       | ` HostNode \| null`                     |     |
| anchor       |                                                                                                                       | ` HostNode \| null`                     |     |
| target       |                                                                                                                       | ` HostElement \| null`                  |     |
| targetStart  |                                                                                                                       | ` HostNode \| null`                     |     |
| targetAnchor |                                                                                                                       | ` HostNode \| null`                     |     |
| suspense     |                                                                                                                       | ` SuspenseBoundary \| null`             |     |
| shapeFlag    |                                                                                                                       | ` number`                               |     |
| patchFlag    |                                                                                                                       | ` number`                               |     |
| appContext   |                                                                                                                       | ` AppContext \| null`                   |     |
        




### 🔖 SetStateAction

**类型**：``SetStateAction<T>``
  
**简介**：无说明





### 🔖 Dispatch

**类型**：``Dispatch<T>``
  
**简介**：无说明





### 🔖 Reducer

**类型**：``Reducer<T, A>``
  
**简介**：无说明





### 🔖 FC

**类型**：``FC<P>``
  
**简介**：无说明
#### ⚙️  API 参数
| 属性                                    | 说明 | 类型              | 默认值 |
| ------------------------------------- | -- | --------------- | --- |
| (props: P, context?: any): ReactNode; |    | ``              |     |
| displayName                           |    | `?: string`     |     |
| defaultProps                          |    | `?: Partial<P>` |     |
        




### 🔖 Ref

**类型**：``Ref<P>``
  
**简介**：无说明





### 🔖 RefObject

**类型**：``RefObject<T>``
  
**简介**：无说明
#### ⚙️  API 参数
| 属性      | 说明 | 类型                     | 默认值 |
| ------- | -- | ---------------------- | --- |
| current |    | `readonly : T \| null` |     |
        




### 🔖 MutableRefObject

**类型**：``MutableRefObject<T>``
  
**简介**：无说明
#### ⚙️  API 参数
| 属性      | 说明 | 类型   | 默认值 |
| ------- | -- | ---- | --- |
| current |    | ` T` |     |
        




### 🔖 ForwardRefExoticComponent

**类型**：``ForwardRefExoticComponent<P>``
  
**简介**：无说明
#### ⚙️  API 参数
| 属性           | 说明 | 类型                           | 默认值 |
| ------------ | -- | ---------------------------- | --- |
| defaultProps |    | `?: Partial<P> \| undefined` |     |
| propTypes    |    | `?: never`                   |     |
        




### 🔖 PropsWithoutRef

**类型**：``PropsWithoutRef<P>``
  
**简介**：无说明





### 🔖 RefAttributes

**类型**：``RefAttributes<T>``
  
**简介**：无说明
#### ⚙️  API 参数
| 属性  | 说明 | 类型                             | 默认值 |
| --- | -- | ------------------------------ | --- |
| ref |    | `?: LegacyRef<T> \| undefined` |     |
        


