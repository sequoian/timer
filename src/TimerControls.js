import React from 'react'

const TimerControls = ({start, stop, clear, reset, endAlert}) => (
  <div>
    <button
      onClick={start}
    >Start</button>
    <button
      onClick={stop}
    >Stop</button>
    <button
      onClick={clear}
    >Clear</button>
    <button
      onClick={reset}
    >Reset</button>
    <button
      onClick={endAlert}
    >Done</button>
  </div>
)

export default TimerControls