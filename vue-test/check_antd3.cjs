const {Row, Col, Layout, Watermark, Affix, App, Button, Space, Empty, Spin, ConfigProvider, Dropdown} = require('antd');

const items = {Row, Col, Layout, Watermark, Affix, App, Button, Space, Empty, Spin, ConfigProvider, Dropdown};
for (const [name, comp] of Object.entries(items)) {
  const dt = comp.hasOwnProperty('$typeof') ? comp.$typeof : 'N/A';
  const dtType = typeof dt;
  console.log(name + ': $typeof = ' + (dt && dt.toString ? dt.toString() : dt) + ', typeof = ' + dtType);
}

// Test what happens when we call Row as a function
console.log('\n--- Testing Row call ---');
const rowResult = Row({children: 'test'});
console.log('Row result type:', typeof rowResult);
console.log('Row result:', rowResult);
console.log('Row result type of $$typeof:', rowResult && typeof rowResult.$$typeof);
console.log('Row result $$typeof:', rowResult && rowResult.$$typeof && rowResult.$$typeof.toString());

// Check if Row calls React.createElement internally
console.log('\nRow prototype:', typeof Row.prototype);
console.log('Row prototype keys:', Row.prototype ? Object.keys(Row.prototype) : 'N/A');