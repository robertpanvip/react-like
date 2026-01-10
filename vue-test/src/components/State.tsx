import React, {useState, defineComponent} from '@react-like/vue'
import {ref as vueRef, useTemplateRef} from 'vue'
import useEffect = React.useEffect;
import useMemo = React.useMemo;
import useRef = React.useRef;

const Context = React.createContext({a: 123})
const Provider = defineComponent((props: any) => {
  return <Context.Provider value={{a: 789}}>{props.children}</Context.Provider>
})

const Test = defineComponent(React.forwardRef((props, ref) => {
  React.useImperativeHandle(ref, () => {
    return {a: 123}
  })
  return <div>123</div>
}))

const Class = defineComponent(class extends React.Component<any, any> {
  state = {a: 78}
  ref=React.createRef<any>();

  componentDidMount() {
    this.setState({a: 123})
    console.log('Component mounted.',this.ref)
  }

  render() {
    return <div ref={this.ref}>{this.state.a}</div>
  }
})

function StateTest() {
  const [state, setState] = useState(1)
  //const v = useTemplateRef('sxxx')
  const ref1 = vueRef()
  const ref = useRef()
  const memo = useMemo(() => 1 + state, [state])
  /*useEffect(() => {
    console.log(state)
    return () => {
      console.log('cleanup', state)
    }
  }, [state]);*/

  useEffect(() => {
    console.log(ref.current);
  }, []);
  /*<Test ref={ref}/>
  {state}
  {memo}
  <button onClick={() => {
    setState(1)
    console.log('z1', state)
    setState(2)
    console.log('z2', state)
  }}>改变
  </button>*/
  return (
    <Class ref={ref}>
      <div>123</div>
    </Class>
  )
}

export default defineComponent(StateTest)
