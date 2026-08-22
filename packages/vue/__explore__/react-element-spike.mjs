/**
 * SPICK —— 探路用，独立于主库，验证两件事：
 *   1) 自建 ReactElement 带标准 $$typeof 后，react-is 的判断是否全部通过
 *   2) 能否把 ReactElement 树 translator 成 Vue vnode 并完成 SSR(证明能上屏)
 * 本文件不改主库，只作证据。
 */
import { createSSRApp, h, Fragment as VueFragment } from 'vue';
import { renderToString } from '@vue/server-renderer';
import * as reactIs from 'react-is';

/* ================= 标准符号(与 react-is 同源, Symbol.for 全局注册表) ================= */
// 注意:React 19 把元素符号从 'react.element' 改成 'react.transitional.element',
// react-is@19 按后者判断。见 __explore__ 根因:两个符号并存,需按目标版本对齐。
export const REACT_ELEMENT_TYPE = Symbol.for('react.transitional.element');
export const REACT_FRAGMENT_TYPE = Symbol.for('react.fragment');
// React 19: Provider 用 react.context, Consumer 用 react.consumer; 18 是 react.provider
export const REACT_PROVIDER_TYPE = Symbol.for('react.context');
export const REACT_CONSUMER_TYPE = Symbol.for('react.consumer');
export const REACT_FORWARD_REF_TYPE = Symbol.for('react.forward_ref');
export const REACT_MEMO_TYPE = Symbol.for('react.memo');
export const REACT_LAZY_TYPE = Symbol.for('react.lazy');
export const REACT_PORTAL_TYPE = Symbol.for('react.portal');

/* ================= ReactElement: 壳(过 react-is) + type/props/key/ref ================= */
export function createElement(type, props = {}, ...children) {
  if (props == null) props = {};
  const { key, ref, ...rest } = props;
  let child = rest.children;
  if (children.length > 0) child = children.length === 1 ? children[0] : children;
  return { $$typeof: REACT_ELEMENT_TYPE, type, key: key ?? null, ref: ref ?? null, props: { ...rest, children: child } };
}

export const Fragment = REACT_FRAGMENT_TYPE;

export function forwardRef(render) {
  return { $$typeof: REACT_FORWARD_REF_TYPE, render };
}

export function createContext(defaultValue) {
  // React19: Context 本身即 Consumer(react.consumer), Provider 用 react.context
  const ctx = { $$typeof: REACT_CONSUMER_TYPE, _defaultValue: defaultValue, _currentValue: defaultValue };
  ctx.Provider = { $$typeof: REACT_PROVIDER_TYPE, _context: ctx };
  ctx.Consumer = ctx;
  return ctx;
}

export function memo(component) {
  return { $$typeof: REACT_MEMO_TYPE, type: component };
}

/* ================= translator: ReactElement → Vue vnode ================= */
const mapTag = (props) => {
  const { className, ...rest } = props;
  if (className !== undefined) rest.class = className;
  return rest;
};

export function toVNode(node) {
  if (node === null || node === undefined || node === false) return null;
  if (typeof node === 'string' || typeof node === 'number') return node;
  if (Array.isArray(node)) return node.map(toVNode);
  if (typeof node !== 'object' || node.$$typeof !== REACT_ELEMENT_TYPE) return null;

  const { type, key, props } = node;
  const children = props.children;
  const rest = mapTag(props);
  delete rest.children;

  // 保留字符串元素 / Fragment / 组件类型的递归处理
  if (type === REACT_FRAGMENT_TYPE) {
    const kids = children == null ? [] : (Array.isArray(children) ? children : [children]).map(toVNode);
    return h(VueFragment, key == null ? null : { key }, kids);
  }
  if (typeof type === 'string') {
    const ch = children == null ? undefined : (Array.isArray(children) ? children.map(toVNode) : toVNode(children));
    return h(type, { ...rest, key: key ?? undefined }, ch);
  }
  if (typeof type === 'function') {
    return toVNode(type({ ...rest, children }));
  }
  if (typeof type === 'object' && type) {
    switch (type.$$typeof) {
      case REACT_FORWARD_REF_TYPE:
        return toVNode(type.render({ ...rest, children }));
      case REACT_PROVIDER_TYPE: // Provider 仅仅透传子树(不模拟 provide 注入, 探路只看结构)
        return toVNode(children);
      default:
        throw new Error(`[spike] 暂未支持该组件类型: ${String(type.$$typeof)}`);
    }
  }
  return null;
}

/* ================= 验证主体 ================= */
const failures = [];
const expect = (desc, cond) => {
  if (!cond) failures.push(desc);
  else console.log('  ✓', desc);
};

console.log('== [1] react-is 全部过门 ==');
const el = createElement('div', { id: 'x' }, 'hi');
expect('isElement(el)', reactIs.isElement(el));
expect('typeOf(el) === react.transitional.element', reactIs.typeOf(el) === Symbol.for('react.transitional.element'));

const fragEl = createElement(Fragment, null, createElement('span'));
expect('isFragment(fragEl)', reactIs.isFragment(fragEl));
expect('Fragment type is REACT_FRAGMENT_TYPE', fragEl.type === Symbol.for('react.fragment'));

const FW = forwardRef((props) => createElement('div', null, props.children));
const fwEl = createElement(FW, null, 'x');
// 注: react-is@19 对"裸 forwardRef 对象" isForwardRef 为 false(需作为元素 type 才识别)
expect('forwardRef 元素 isForwardRef', reactIs.isForwardRef(fwEl));
expect('forwardRef 元素 typeOf', reactIs.typeOf(fwEl) === Symbol.for('react.forward_ref'));

const Ctx = createContext(1);
const provEl = createElement(Ctx.Provider, { value: 2 }, 'content');
expect('isContextProvider(provEl)', reactIs.isContextProvider(provEl));
// react-is@19: isContextConsumer 同样要对「type=context 的元素」判, 裸对象 typeOf 为 null
const consumerEl = createElement(Ctx, null, 'cons');
expect('isContextConsumer(consumerEl)', reactIs.isContextConsumer(consumerEl));

const Memo = memo(() => createElement('div'));
const memoEl = createElement(Memo, null, 'x');
expect('isMemo(memoEl)', reactIs.isMemo(memoEl));
expect('memo 元素 typeOf', reactIs.typeOf(memoEl) === Symbol.for('react.memo'));

const portal = { $$typeof: REACT_PORTAL_TYPE, containerInfo: {}, children: [] };
expect('isPortal(portal)', reactIs.isPortal(portal));

console.log('== [2] translator → vnode + SSR ==');
const tree = createElement('div', { id: 'root', className: 'box' },
  createElement('span', { className: 'a' }, 'hello'),
  createElement(Fragment, null,
    createElement('b', null, 'frag'),
    createElement('i', null, 'item'),
  ),
  createElement(Ctx.Provider, { value: 1 }, createElement('em', null, 'prov')),
  createElement(FW, null, 'fw'),
);
const root = h('div', null, toVNode(tree));
const html = await renderToString(root);
console.log('  html =', html);
expect('SSR 包含 span/a', /a"/.test(html) || /class="a"/.test(html));
expect('SSR 包含分发内容 hello', /hello/.test(html));
expect('SSR 包含 frag', /frag/.test(html));
expect('SSR 包含 item', /item/.test(html));
expect('SSR 包含 prov 内容', /prov/.test(html));
expect('SSR 包含 fw(forwardRef 渲染)', /fw/.test(html));

console.log('== [3] 结果 ==');
if (failures.length) {
  console.error('FAILED:', failures.join(' | '));
  process.exit(1);
}
console.log('ALL PASS ✅');