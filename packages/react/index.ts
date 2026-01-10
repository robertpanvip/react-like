import * as React from "react";

export const useState = React.useState;
export const useEffect = React.useEffect;
export const useMemo = React.useMemo;
export const useRef = React.useRef;
export const useCallback = React.useCallback;
export const createContext = React.createContext;
export const useContext = React.useContext;
export const useImperativeHandle = React.useImperativeHandle;
export const useInsertionEffect = React.useInsertionEffect;
export const useReducer = React.useReducer;
export const useTransition = React.useTransition;
export const useLayoutEffect = React.useLayoutEffect;
export const useId = React.useId;

export const createElement = React.createElement;
export const memo = React.memo;
export const Children = React.Children;
export const cloneElement = React.cloneElement;
export const createRef = React.createRef;
export const forwardRef = React.forwardRef;
export const Fragment = React.Fragment;
export const isValidElement = React.isValidElement;
export const version = React.version;
export const Component = React.Component;
export const PureComponent = React.PureComponent;

export type ReactNode = React.ReactNode;
export type ReactElement = React.ReactElement;
export type SetStateAction<T> = React.SetStateAction<T>;
export type Dispatch<T> = React.Dispatch<T>;
export type Reducer<T, A> = React.Reducer<T, A>;
export type FC<P = {}> = React.FC<P>;
export type Ref<P = {}> = React.Ref<P>;
export type RefObject<T = null> = React.RefObject<T>;
export type MutableRefObject<T> = React.MutableRefObject<T>;
export type ForwardRefExoticComponent<P> = React.ForwardRefExoticComponent<P>;
export type PropsWithoutRef<P> = React.PropsWithoutRef<P>;
export type RefAttributes<T> = React.RefAttributes<T>;

export function defineComponent(fn: Function) {
    return fn
}

export default React