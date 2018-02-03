import React, {Component} from 'react'

class TimerInput extends Component {
  constructor(props) {
    super(props)
    this.state = {
      focused: false
    }
    this.setInputRef = this.setInputRef.bind(this)
    this.focusInput = this.focusInput.bind(this)
  }

  componentDidMount() {
    this.focusInput()
  }

  focusInput() {
    this.timerInput.focus()
  }

  setInputRef(ref) {
    this.timerInput = ref
  }

  render() {
    const {value, onChange} = this.props
    return (
      <div
        onClick={this.focusInput}
        style={{
          display: 'inline-block',
          borderBottom: '2px solid blue',
          margin: '10px'
        }}
      >
        <Input
          value={value}
          onChange={onChange}
          setRef={this.setInputRef}
        />
        <InputDisplay
          value={value}
          onFocus={this.focusInput}
        />
      </div>
    )
  }
}

const Input = ({value, onChange, setRef}) => (
  <input
    type="number"
    min="0"
    value={value}
    onChange={onChange}
    ref={setRef}
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

const InputDisplay = ({value}) => {
  const nums = value.split('').reverse()
  return (
    <div>
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

const color1 = 'black'
const color2 = 'gray'

const Number = ({value, style}) => (
  <span
    style={{
      ...style,
      color: value ? color1 : color2,
      fontSize: '50px'
    }}
  >
    {value || '0'}
  </span>
)

const Unit = ({value, children, style}) => (
  <span
    style={{
      ...style,
      color: value ? color1 : color2
    }}
  >
    {children}
  </span>
)

export default TimerInput