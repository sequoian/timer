import React, { Component } from 'react';
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
      <div className="display">11:14:26</div>
    );
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hours: '2',
      minutes: '4',
      seconds: '65'
    }
    this.changeInput = this.changeInput.bind(this);
  }

  changeInput(event) {
    const input = event.target;
    const value = input.value.slice(0, 2);  // limit value to 2 digits
    this.setState({
      [input.name]: value
    })
  }

  render() {
    return (
      <div className="App">
        <div className="timer">
          <TimerInputs 
            hours={this.state.hours}
            minutes={this.state.minutes}
            seconds={this.state.seconds}
            handleChange={this.changeInput}
          />
        </div>
        <div className="controls">
          <button>Start</button>
          <button>Clear</button>
        </div>
      </div>
    );
  }
}

export default App;
