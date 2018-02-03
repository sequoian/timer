import React, { Component } from 'react';
import moment from 'moment';
import 'moment-duration-format';
//import './App.css';
import TimerInput from './TimerInput'
import TimerDisplay from './TimerDisplay'
import TimerControls from './TimerControls'

class App extends Component {
  constructor(props) {
    super(props)
    this.timerSpeed = 100
    this.state = {
      timerInput: '',
      endTime: null,
      timeRemaining: moment.duration(0),
      intervalID: null,
    }
    this.startTimer = this.startTimer.bind(this)
    this.stopTimer = this.stopTimer.bind(this)
    this.tick = this.tick.bind(this)
    this.changeTimer = this.changeTimer.bind(this)
    this.clearTimer = this.clearTimer.bind(this)
    this.resetTimer = this.resetTimer.bind(this)
    this.stopAlert = this.stopAlert.bind(this)
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
        endTime: moment().add(prevState.timeRemaining)
      }
    })
  }

  stopTimer() {
    clearInterval(this.state.intervalID)
    this.setState({
      intervalID: null
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
    }
  }

  alert() {
    console.log('done!')
  }

  stopAlert() {
    console.log('alert stopped')
  }

  clearTimer() {
    clearInterval(this.state.intervalID)
    this.setState({
      timerInput: '',
      intervalID: null,
      endTime: null,
      timeRemaining: moment.duration(0),
    })
  }

  resetTimer() {
    clearInterval(this.state.intervalID)
    this.setState(prevState => {
      return {
        intervalID: null,
        endTime: null,
        timeRemaining: this.stringToDuration(prevState.timerInput)
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
    return (
      <div>
        <TimerInput
          value={this.state.timerInput}
          onChange={this.changeTimer}
        />
        <TimerDisplay
          duration={this.state.timeRemaining}
        />
        <TimerControls
          start={this.startTimer}
          stop={this.stopTimer}
          clear={this.clearTimer}
          reset={this.resetTimer}
          endAlert={this.stopAlert}
        />
      </div>
    )
  }
}

export default App