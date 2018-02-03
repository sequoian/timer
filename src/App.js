import React, { Component } from 'react';
import moment from 'moment';
import 'moment-duration-format';
//import './App.css';
import TimerInput from './TimerInput'
import TimerDisplay from './TimerDisplay'

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
    this.createTimer = this.createTimer.bind(this)
    this.startTimer = this.startTimer.bind(this)
    this.stopTimer = this.stopTimer.bind(this)
    this.tick = this.tick.bind(this)
    this.changeTimer = this.changeTimer.bind(this)
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

  createTimer() {
    const inputs = [
      this.state.hours,
      this.state.minutes,
      this.state.seconds
    ];

    // parse inputs
    const time = inputs.map((item) => {
      if (item === '') {
        return 0;
      }
      else {
        // string to number.  enforce positive integer.
        return Math.round(Math.abs(parseInt(item, 10)));
      }
    });

    // make sure there is a non-zero input
    if (!time.every(item => item === 0)) {
      const duration = moment.duration({
        hours: time[0],
        minutes: time[1],
        seconds: time[2]
      });
      
      this.setState({
        timer: duration
      })

      this.startTimer();

      // check user for notification permission
      if (!this.state.notify) {
        Notification.requestPermission().then((result) => {
          if (result === 'granted') {
            this.setState({
              notify: true
            });
          }
        });
      }   
    }
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
    clearInterval(this.state.intervalID);
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
      //this.alert()
    }
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
      <button
        onClick={this.startTimer}
        disabled={this.state.timeRemaining.asSeconds() <= 0}
      >Start</button>
      
      </div>
    )
  }
}

export default App;
