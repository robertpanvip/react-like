const {Row, Col, Layout, Watermark, Affix, App, Button, Space, Empty, Spin, ConfigProvider, Menu, Dropdown} = require('antd');

const items = {Row, Col, Layout, Watermark, Affix, App, Button, Space, Empty, Spin, ConfigProvider, Menu, Dropdown};
for (const [name, comp] of Object.entries(items)) {
  const t = typeof comp;
  const ownKeys = Object.getOwnPropertyNames(comp).filter(k => k !== 'prototype' && k !== 'length' && k !== 'name').join(', ');
  const protoKeys = comp.prototype ? Object.getOwnPropertyNames(comp.prototype).join(', ') : 'N/A';
  const hasSymbols = Object.getOwnPropertySymbols(comp).map(s => s.toString()).join(', ');
  console.log(`${name}: type=${t}, ownKeys=[${ownKeys}], protoKeys=[${protoKeys}], symbols=[${hasSymbols}]`);
}