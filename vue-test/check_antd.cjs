const {Row, Col, Layout, Watermark, Affix, App, Button, Space, Empty, Spin, ConfigProvider} = require('antd');

const items = {Row, Col, Layout, Watermark, Affix, App, Button, Space, Empty, Spin, ConfigProvider};
for (const [name, comp] of Object.entries(items)) {
  const t = typeof comp;
  const st = comp && comp.$$typeof ? comp.$$typeof.toString() : 'N/A';
  const isObj = t === 'object' && !Array.isArray(comp);
  const keys = isObj ? Object.keys(comp).join(', ') : 'N/A';
  const isFn = t === 'function';
  console.log(`${name}: type=${t}, $$typeof=${st}, isPlainObj=${isObj}, keys=[${keys}], isFn=${isFn}`);
}