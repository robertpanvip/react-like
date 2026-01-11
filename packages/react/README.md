@react-like/react
===========



[![NPM Version](https://img.shields.io/npm/v/@es-pkg/doc?color=33cd56&logo=npm)](https://www.npmjs.com/package/@es-pkg/doc)  [![NPM Version](https://img.shields.io/npm/dm/@es-pkg/doc.svg?style=flat-square)](https://www.npmjs.com/package/@es-pkg/doc)  [![unpacked size](https://img.shields.io/npm/unpacked-size/@es-pkg/doc?color=green)](https://www.npmjs.com/package/@es-pkg/doc)  [![Author](https://img.shields.io/badge/docs_by-robertpanvip-blue)](https://github.com/robertpanvip/es-pkg-doc.git)

## 🔧 Install
    npm install @react-like/react
### 🔖 React

**类型**：``typeof React``
  
**简介**：无说明





### 🔖 defineComponent

**类型**：``typeof defineComponent``
  
**简介**：无说明





### 🔖 useState

**类型**：``typeof React.useState``
  
**简介**：无说明





### 🔖 useEffect

**类型**：``typeof React.useEffect``
  
**简介**：无说明





### 🔖 useMemo

**类型**：``typeof React.useMemo``
  
**简介**：无说明





### 🔖 useRef

**类型**：``typeof React.useRef``
  
**简介**：无说明





### 🔖 useCallback

**类型**：``typeof React.useCallback``
  
**简介**：无说明





### 🔖 createContext

**类型**：``typeof React.createContext``
  
**简介**：无说明





### 🔖 useContext

**类型**：``typeof React.useContext``
  
**简介**：无说明





### 🔖 useImperativeHandle

**类型**：``typeof React.useImperativeHandle``
  
**简介**：无说明





### 🔖 useInsertionEffect

**类型**：``typeof React.useInsertionEffect``
  
**简介**：无说明





### 🔖 useReducer

**类型**：``typeof React.useReducer``
  
**简介**：无说明





### 🔖 useTransition

**类型**：``typeof React.useTransition``
  
**简介**：无说明





### 🔖 useLayoutEffect

**类型**：``typeof React.useLayoutEffect``
  
**简介**：无说明





### 🔖 useId

**类型**：``typeof React.useId``
  
**简介**：无说明





### 🔖 createElement

**类型**：``typeof React.createElement``
  
**简介**：无说明





### 🔖 memo

**类型**：``typeof React.memo``
  
**简介**：无说明





### 🔖 Children

**类型**：``{ map<T, C>(children: C | readonly C[], fn: (child: C, index: number) => T): C extends null | undefined ? C : Exclude<T, boolean | null | undefined>[]; forEach<C>(children: C | readonly C[], fn: (child: C, index: number) => void): void; count(children: any): number; only<C>(children: C): C extends any[] ? never : C; toArray(children: React.ReactNode | React.ReactNode[]): (string | number | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal)[]; }``
  
**简介**：无说明





### 🔖 cloneElement

**类型**：``typeof React.cloneElement``
  
**简介**：无说明





### 🔖 createRef

**类型**：``typeof React.createRef``
  
**简介**：无说明





### 🔖 forwardRef

**类型**：``typeof React.forwardRef``
  
**简介**：无说明





### 🔖 Fragment

**类型**：``React.ExoticComponent<{ children?: React.ReactNode; }>``
  
**简介**：无说明





### 🔖 isValidElement

**类型**：``typeof React.isValidElement``
  
**简介**：无说明





### 🔖 version

**类型**：``string``
  
**简介**：无说明





### 🔖 Component

**类型**：``typeof React.Component``
  
**简介**：无说明





### 🔖 PureComponent

**类型**：``typeof React.PureComponent``
  
**简介**：无说明





### 🔖 ReactNode

**类型**：``React.ReactNode``
  
**简介**：无说明





### 🔖 ReactElement

**类型**：``ReactElement``
  
**简介**：无说明
#### ⚙️  API 参数
| 属性    | 说明 | 类型                | 默认值 |
| ----- | -- | ----------------- | --- |
| type  |    | ` T`              |     |
| props |    | ` P`              |     |
| key   |    | ` string \| null` |     |
        




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
| 属性                                                                                                                                                                                                                                                                                                                                   | 说明                                                                                                                                                                                                                                                                                                    | 类型                                     | 默认值 |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- | --- |
| (<br>            props: P,<br>            /\*\*<br>             \* @deprecated<br>             \*<br>             \* @see {@link https://legacy.reactjs.org/docs/legacy-context.html#referencing-context-in-lifecycle-methods React Docs}<br>             \*/<br>            deprecatedLegacyContext?: any,<br>        ): ReactNode; |                                                                                                                                                                                                                                                                                                       | ``                                     |     |
| propTypes                                                                                                                                                                                                                                                                                                                            | Used to declare the types of the props accepted by the<br>component. These types will be checked during rendering<br>and in development only.<br><br>We recommend using TypeScript instead of checking prop<br>types at runtime.                                                                      | `?: WeakValidationMap<P> \| undefined` |     |
| ⚠️~~contextTypes~~                                                                                                                                                                                                                                                                                                                   | <span style="color:red">\[Lets you specify which legacy context is consumed by<br>this component.\] </span>                                                                                                                                                                                           | `?: ValidationMap<any> \| undefined`   |     |
| ⚠️~~defaultProps~~                                                                                                                                                                                                                                                                                                                   | <span style="color:red">\[Use {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring\_assignment#default\_value\|default values for destructuring assignments instead}.\] </span> Used to define default values for the props accepted by<br>the component. | `?: Partial<P> \| undefined`           |     |
| displayName                                                                                                                                                                                                                                                                                                                          | Used in debugging messages. You might want to set it<br>explicitly if you want to display a different name for<br>debugging purposes.                                                                                                                                                                 | `?: string \| undefined`               |     |
        




### 🔖 Ref

**类型**：``Ref<P>``
  
**简介**：无说明





### 🔖 RefObject

**类型**：``RefObject<T>``
  
**简介**：无说明
#### ⚙️  API 参数
| 属性      | 说明                            | 类型                     | 默认值 |
| ------- | ----------------------------- | ---------------------- | --- |
| current | The current value of the ref. | `readonly : T \| null` |     |
        




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
| 属性                 | 说明                                                                                                                                                                                                                           | 类型                                     | 默认值 |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- | --- |
| ⚠️~~defaultProps~~ | <span style="color:red">\[Use {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring\_assignment#default\_value\|default values for destructuring assignments instead}.\] </span>  | `?: Partial<P> \| undefined`           |     |
| propTypes          |                                                                                                                                                                                                                              | `?: WeakValidationMap<P> \| undefined` |     |
        




### 🔖 PropsWithoutRef

**类型**：``PropsWithoutRef<P>``
  
**简介**：无说明





### 🔖 RefAttributes

**类型**：``RefAttributes<T>``
  
**简介**：无说明
#### ⚙️  API 参数
| 属性  | 说明                                                                                                                                                                                    | 类型                             | 默认值 |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------ | --- |
| ref | Allows getting a ref to the component instance.<br>Once the component unmounts, React will set `ref.current` to `null`<br>(or call the ref with `null` if you passed a callback ref). | `?: LegacyRef<T> \| undefined` |     |
        


