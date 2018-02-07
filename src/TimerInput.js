import React, {Component} from 'react'

class TimerInput extends Component {
  constructor(props) {
    super(props)
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
        className="display"
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