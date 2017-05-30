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
      hours: '',
      minutes: '',
      seconds: '',
      timer: null,
      intervalID: null
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
  }

  clear() {
    this.stopTimer();
    this.removeTimer();
    this.setState({
      hours: '',
      minutes: '',
      seconds: ''
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
      
      if (this.state.intervalID) {
        controlButton = (
          <button
            onClick={this.stopTimer}
          >
            Stop
          </button>
        )
      }
      else {
        controlButton = (
          <button
            onClick={this.startTimer}
          >
            Start
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
