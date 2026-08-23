import * as antd from 'antd';

const SYM_FORWARD_REF = Symbol.for('react.forward_ref');
const SYM_MEMO = Symbol.for('react.memo');

const comps = ['Tree', 'Drawer', 'Tooltip', 'Popover', 'Popconfirm', 'Timeline', 'Carousel', 'Menu', 'Pagination', 'Anchor', 'Affix', 'FloatButton', 'Watermark', 'Tour', 'Splitter'];

comps.forEach(name => {
  const c = antd[name];
  if (!c) { console.log(name + ': undefined'); return; }
  const t = typeof c;
  const s = c['$$typeof'] ? c['$$typeof'].toString() : 'none';
  const fr = c['$$typeof'] === SYM_FORWARD_REF;
  const memo = c['$$typeof'] === SYM_MEMO;
  const rt = c.render ? typeof c.render : 'N/A';
  console.log(name + ': type=' + t + ', $$typeof=' + s + ', forwardRef=' + fr + ', memo=' + memo + ', renderType=' + rt);
});