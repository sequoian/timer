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
    this.timerSpeed = 1000
    this.state = this.hydrateFromStorage() || {
      timerInput: '',
      endTime: null,
      timeRemaining: null,
      intervalID: null,
      mode: 'input',
      msInfo: {
        lastTickOrStart: null,
        timeToNextTick: 0,
        timeoutId: null
      }
      
    }
    this.startTimer = this.startTimer.bind(this)
    this.stopTimer = this.stopTimer.bind(this)
    this.tick = this.tick.bind(this)
    this.changeTimer = this.changeTimer.bind(this)
    this.clearTimer = this.clearTimer.bind(this)
    this.resetTimer = this.resetTimer.bind(this)
  }

  componentDidMount() {
    // if timer was already running, continue it
    if (this.state.mode === 'running') {
      this.setState(prevState => {
        let remaining = moment.duration(prevState.endTime.valueOf() - moment().valueOf())
        if (remaining < 0) return {
          timeRemaining: moment.duration(0),
          mode: 'alert',
          intervalID: null
        }
        else return {
          intervalID: setInterval(this.tick, this.timerSpeed),
          timeRemaining: remaining
        } 
      })
    }

    // listen for enter key, clicks primary button
    document.addEventListener('keypress', e => {
      if (e.key === 'Enter') {
        document.getElementById('primary-btn').click()
      }
    })
  }

  hydrateFromStorage() {
    const hydratedState = localStorage.getItem('timerstate')
    if (!hydratedState) return null
    const parsed = JSON.parse(hydratedState)
    return {
      ...parsed,
      timeRemaining: moment.duration(parsed.timeRemaining),
      endTime: moment(parsed.endTime)
    }
  }

  componentDidUpdate() {
    // store state in local storage
    localStorage.setItem('timerstate', JSON.stringify(this.state))
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
    const {mode} = this.state
    if (mode === 'paused') {
      // run timeout to next tick before restarting interval
      this.setState(prevState => {
        return {
          msInfo: {
            ...prevState.msInfo,
            timeoutId: setTimeout(() => {
              // timeout callback - call tick and start interval
              this.tick()
              this.setState({
                intervalID: setInterval(this.tick, this.timerSpeed)
              })
            }, prevState.msInfo.timeToNextTick)
          }
        }
      })
    }
    else {
      // start fresh timer
      this.setState(prevState => {
        return {
          intervalID: setInterval(this.tick, this.timerSpeed),
          msInfo: {
            ...prevState.msInfo,
            timeToNextTick: this.timerSpeed
          }
        }
      })
    }

    // more timer state
    this.setState(prevState => {
      return {
        mode: 'running',
        endTime: moment().add(prevState.timeRemaining),
        msInfo: {
          ...prevState.msInfo,
          lastTickOrStart: moment(),
        }
      }
    })
  }


  stopTimer() {
    const {intervalID, msInfo} = this.state
    // clear any possible intervals
    clearInterval(intervalID)
    clearTimeout(msInfo.timeoutId)

    // calculate the ms that has elapsed since last tick or stop
    const elapsed = moment().valueOf() - msInfo.lastTickOrStart.valueOf()

    this.setState(prevState => {
      return {
        mode: 'paused',
        intervalID: null,
        msInfo: {
          ...prevState.msInfo,
          timeToNextTick: prevState.msInfo.timeToNextTick - elapsed,
          timeoutId: null
        }
      } 
    })
  }

  tick() {
    const newTime = this.state.timeRemaining.subtract(this.timerSpeed, 'ms')
    this.setState(prevState => {
      return {
        timeRemaining: newTime,
        msInfo: {
          ...prevState.msInfo,
          lastTickOrStart: moment(),
          timeToNextTick: this.timerSpeed
        }
      }
    })
    if (newTime.asMilliseconds() <= 0) {
      this.alert()
    }
  }

  alert() {
    this.audio.play()
    clearInterval(this.state.intervalID)
    this.setState({
      mode: 'alert',
      intervalID: null
    })
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
      <div id="app">
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
          mode={mode}
          input={timerInput}
        />
      </div>
    )
  }
}

export default App