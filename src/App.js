import React, { Component } from 'react'
import moment from 'moment'
import TimerInput from './TimerInput'
import TimerDisplay from './TimerDisplay'
import TimerControls from './TimerControls'
import TimerSound from './TimerSound'

class App extends Component {
  constructor(props) {
    super(props)
    this.audio = new TimerSound()
    this.timerSpeed = 100
    this.state = {
      timerInput: '',
      endTime: null,
      timeRemaining: moment.duration(0),
      intervalID: null,
      mode: 'input'
    }
    this.startTimer = this.startTimer.bind(this)
    this.stopTimer = this.stopTimer.bind(this)
    this.tick = this.tick.bind(this)
    this.changeTimer = this.changeTimer.bind(this)
    this.clearTimer = this.clearTimer.bind(this)
    this.resetTimer = this.resetTimer.bind(this)
    this.stopAlert = this.stopAlert.bind(this)
  }

  componentDidMount() {
    document.addEventListener('keypress', e => {
      if (e.key === 'Enter') {
        document.getElementById('primary-btn').click()
      }
    })
  }

  changeTimer(event) {
    let {value} = event.target
    value = value.slice(0, 6)
    if (value !== '' && !value.slice(-1).match(/\d/)) return
    this.setState({
      timerInput: value,
      timeRemaining: this.stringToDuration(value)
    })
  }

  startTimer() {
    this.setState(prevState => {
      clearInterval(prevState.intervalID) // clear possible loitering interval
      return {
        intervalID: setInterval(this.tick, this.timerSpeed),
        endTime: moment().add(prevState.timeRemaining),
        mode: 'running'
      }
    })
  }

  stopTimer() {
    clearInterval(this.state.intervalID)
    this.setState({
      intervalID: null,
      mode: 'paused'
    })
  }

  tick() {
    const {timeRemaining} = this.state
    const newTime = timeRemaining.subtract(this.timerSpeed, 'ms')
    this.setState({
      timeRemaining: newTime
    })
    if (newTime.asMilliseconds() <= 0) {
      this.stopTimer()
      this.alert()
      this.setState({
        mode: 'alert'
      })
    }
  }

  alert() {
    this.audio.play()
  }

  stopAlert() {
    this.resetTimer()
  }

  clearTimer() {
    clearInterval(this.state.intervalID)
    this.setState({
      timerInput: '',
      intervalID: null,
      endTime: null,
      timeRemaining: moment.duration(0),
    })
    document.getElementById('input').focus()
  }

  resetTimer() {
    this.audio.stop()
    clearInterval(this.state.intervalID)
    this.setState(prevState => {
      return {
        intervalID: null,
        endTime: null,
        timeRemaining: this.stringToDuration(prevState.timerInput),
        mode: 'input'
      }
    })
  }

  stringToDuration(str) {
    str = str.padStart(6, '0')
    const duration = moment.duration({
      hours: str.substr(0, 2),
      minutes: str.substr(2, 2),
      seconds: str.substr(4, 2)
    })
    if (duration.asHours() > 99) {
      return moment.duration({
        hours: 99,
        minutes: 59,
        seconds: 59
      })
    }
    else return duration
  }
  
  render() {
    const {mode, timerInput, timeRemaining} = this.state
    return (
      <div>
        {mode === 'input'
          ?
          <TimerInput
            value={timerInput}
            onChange={this.changeTimer}
          />
          :
          <TimerDisplay
            duration={timeRemaining}
          />
        }
        <TimerControls
          start={this.startTimer}
          stop={this.stopTimer}
          clear={this.clearTimer}
          reset={this.resetTimer}
          endAlert={this.stopAlert}
          mode={mode}
          input={timerInput}
        />
      </div>
    )
  }
}

export default App