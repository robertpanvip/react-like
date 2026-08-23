import * as antd from 'antd';

const tree = antd.Tree;
console.log('Tree type:', typeof tree);
console.log('Tree $$typeof:', tree['$$typeof']?.toString());
console.log('Tree render type:', typeof tree.render);
console.log('Tree render prototype:', tree.render.prototype);
console.log('Tree render.prototype instanceof Object:', tree.render?.prototype instanceof Object);

// Also check Drawer
const drawer = antd.Drawer;
console.log('\nDrawer type:', typeof drawer);
console.log('Drawer $$typeof:', drawer['$$typeof']?.toString());
console.log('Drawer prototype:', drawer.prototype);
console.log('Drawer.prototype instanceof Object:', drawer.prototype instanceof Object);

// Check if the Tree render function is actually a class component
const render = tree.render;
console.log('\nrender.name:', render.name);
console.log('render.prototype:', render.prototype);
console.log('render.prototype.constructor:', render.prototype?.constructor?.name);
console.log('render.prototype.render:', typeof render.prototype?.render);
console.log('render.prototype.isReactComponent:', render.prototype?.isReactComponent);

// React.Component check
const React = { Component: class Component { constructor(props) { this.props = props; this.state = {}; } } };
console.log('\nrender.prototype instanceof React.Component:', render.prototype instanceof React.Component);