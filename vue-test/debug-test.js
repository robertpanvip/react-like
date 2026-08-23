const { mount } = require('@vue/test-utils');
const { defineComponent, createElement } = require('./node_modules/@react-like/vue/index.js');
const { Tag, Badge, Select, Tabs, Collapse, Table } = require('antd');
const { h } = require('vue');

async function main() {
  // Test Tag closable
  const TagComp = defineComponent(Tag);
  const TestTag = defineComponent(() => createElement(TagComp, {closable: true}, 'Closable'));
  const tagWrapper = await mount(TestTag);
  console.log('Tag closable HTML:', tagWrapper.html().substring(0, 500));

  // Test Badge count
  const BadgeComp = defineComponent(Badge);
  const TestBadge = defineComponent(() => createElement(BadgeComp, {count: 5}, createElement('span', null, 'Inbox')));
  const badgeWrapper = await mount(TestBadge);
  console.log('Badge count HTML:', badgeWrapper.html().substring(0, 500));
}

main().catch(console.error);