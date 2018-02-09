import React, {Component} from 'react'

class TimerInput extends Component {
  constructor(props) {
    super(props)
    this.state = {
      focused: false
    }
    this.setInputRef = this.setInputRef.bind(this)
    this.focusInput = this.focusInput.bind(this)
    this.setFocus = this.setFocus.bind(this)
  }

  componentDidMount() {
    this.focusInput()
  }

  focusInput() {
    this.timerInput.focus()
  }

  setFocus(focused) {
    this.setState({
      focused
    })
  }

  setInputRef(ref) {
    this.timerInput = ref
  }

  render() {
    const {value, onChange} = this.props
    return (
      <div
        onClick={this.focusInput}
        className="display"
      >
        <Input
          value={value}
          onChange={onChange}
          setRef={this.setInputRef}
          setFocus={this.setFocus}
        />
        <InputDisplay
          value={value}
          onFocus={this.focusInput}
          focused={this.state.focused}
        />
      </div>
    )
  }
}

const Input = ({value, onChange, setRef, setFocus}) => (
  <input
    id="input"
    type="number"
    min="0"
    autoComplete="off"
    value={value}
    onChange={onChange}
    ref={setRef}
    // set cursor at end of input
    onFocus={e => {
      const tmp = e.target.value
      e.target.value = ''
      e.target.value = tmp
      setFocus(true)
    }}
    onBlur={e => {
      setFocus(false)
    }}
    // prevent anything other than digits from being input
    onKeyPress={e => {
      if (e.charCode >= 48 && e.charCode <= 57)
        return e
      e.preventDefault()
    }}
    // hide input from view
    style={{
      position: 'absolute',
      top: '-999px'
    }}
  />
)

const InputDisplay = ({value, focused}) => {
  const nums = value.split('').reverse()
  return (
    <div
      className={focused ? 'input-display focused' : 'input-display'}
    >
      <Number
        value={nums[5]}
      />
      <Number
        value={nums[4]}
      />
      <Unit value={nums[4]}>h</Unit>
      <Number
        value={nums[3]}
      />
      <Number
        value={nums[2]}
      />
      <Unit value={nums[2]}>m</Unit>
      <Number
        value={nums[1]}
      />
      <Number value={nums[0]} />
      <Unit value={nums[0]}>s</Unit>
    </div>
  )
}

const Number = ({value, style}) => (
  <span
    className={value ? 'number used' : 'number mask'}
  >
    {value || '0'}
  </span>
)

const Unit = ({value, children, style}) => (
  <span
    className={value ? 'unit used' : 'unit mask'}
  >
    {children}
  </span>
)

export default TimerInput