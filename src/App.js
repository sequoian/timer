import React, { Component } from 'react';
import './App.css';

class TimerInputs extends Component {
  render() {
    const categories = ['hours', 'minutes', 'seconds'];
    const inputs = categories.map((item) => {
      return (
        <div>
          <label for={item}>{item}</label>
          <input 
            id={item}
            type="number"
            min="0"
            max="99"
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
  render() {
    return (
      <div className="App">
        <div className="timer">
          <TimeDisplay />
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
