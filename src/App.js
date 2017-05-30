import React, { Component } from 'react';
import moment from 'moment';
import 'moment-duration-format';
import './App.css';

class TimerInputs extends Component {
  render() {
    const categories = ['hours', 'minutes', 'seconds'];
    const inputs = categories.map((item, idx) => {
      return (
        <div key={idx}>
          <label htmlFor={item}>{item}</label>
          <input 
            id={item}      
            type="number"
            min="0"
            max="99"
            name={item}
            value={this.props[item]}
            onChange={this.props.handleChange}
          />
        </div>
      );
    })

    return (
      <form className="timer-inputs">
        {inputs}
      </form>
    );
  }
}

class TimeDisplay extends Component {
  render() {
    return (
      <div className="display">
        {this.props.timer.format('h:mm:ss')}
      </div>
    );
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hours: '0',
      minutes: '0',
      seconds: '0',
      timer: null,
      intervalID: null,
      alert: false,
      notify: false
    }
    this.changeInput = this.changeInput.bind(this);
    this.createTimer = this.createTimer.bind(this);
    this.startTimer = this.startTimer.bind(this);
    this.stopTimer = this.stopTimer.bind(this);
    this.removeTimer = this.removeTimer.bind(this);
    this.tick = this.tick.bind(this);
    this.clear = this.clear.bind(this);
  }

  changeInput(event) {
    const input = event.target;
    const value = input.value.slice(0, 2);  // limit value to 2 digits
    this.setState({
      [input.name]: value
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
    const interval = setInterval(this.tick, 1000);
    this.setState({
      intervalID: interval
    });
  }

  stopTimer() {
    clearInterval(this.state.intervalID);
    this.setState({
      intervalID: null
    });
  }

  removeTimer() {
    this.setState({
      timer: null
    });
  }

  tick() {
    const timer = this.state.timer;
    const decrement = moment.duration(1, 's');
    timer.subtract(decrement);
    this.setState({
      timer: timer
    });
    this.checkTimer(timer)
  }

  checkTimer(time) {
    if (time.asSeconds() <= 0) {
      this.stopTimer();
      this.setState({
        alert: true
      });

      // notify user
      if (this.state.notify) {
        const n = new Notification ("Alert", {
          body: `Your timer has gone off.`
        });
      }
    }
  }

  clear() {
    this.stopTimer();
    this.removeTimer();
    this.setState({
      hours: '0',
      minutes: '0',
      seconds: '0'
    });
  }

  render() {
    let timer = null;
    let controlButton = null;
    if (!this.state.timer) {
      timer = (
        <TimerInputs 
          hours={this.state.hours}
          minutes={this.state.minutes}
          seconds={this.state.seconds}
          handleChange={this.changeInput}
        />
      );

      controlButton = (
        <button
          className="start"
          onClick={this.createTimer}
        >
          Start
        </button>
      );
    }
    else {
      timer = (
        <TimeDisplay
          timer={this.state.timer}
        />
      );
      
      // if a timer exists, decide which control button to use
      if (this.state.intervalID) {
        controlButton = (
          <button
            className="stop"
            onClick={this.stopTimer}
          >
            Stop
          </button>
        )
      }
      else if (!this.state.alert) {
        controlButton = (
          <button
            className="start"
            onClick={this.startTimer}
          >
            Start
          </button>
        );
      }
      else {
        controlButton = (
          <button
            className="end"
            onClick={this.removeTimer}
          >
            End
          </button>
        );
      }
    }

    return (
      <div className="App">
        <div className="timer">
          {timer}
        </div>
        <div className="controls">
          {controlButton}
          <button
            className="clear"
            onClick={this.clear}
          >
            Clear
          </button>
        </div>
      </div>
    );
  }
}

export default App;
