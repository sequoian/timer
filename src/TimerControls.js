import React from 'react'

const TimerControlsContainer = ({start, stop, clear, reset, mode, input}) => {
    switch (mode) {
      case 'input': return (
        <TimerControls
          primaryLabel={'Start'}
          primaryAction={start}
          secondaryLabel={'Clear'}
          secondaryAction={clear}
          primaryDisabled={input === '' || parseInt(input, 10) < 1}
        />
      )
      case 'running': return (
        <TimerControls
          primaryLabel={'Stop'}
          primaryAction={stop}
          secondaryLabel={'Reset'}
          secondaryAction={reset}
        />
      )
      case 'paused': return (
        <TimerControls
          primaryLabel={'Start'}
          primaryAction={start}
          secondaryLabel={'Reset'}
          secondaryAction={reset}
        />
      )
      case 'alert': return (
        <TimerControls
          primaryLabel={'Done'}
          primaryAction={reset}
          secondaryLabel={'Reset'}
          secondaryAction={reset}
        />
      )
      default: 
        console.log('Invalid mode')
        return null
    }
}

const TimerControls = ({primaryLabel, primaryAction, secondaryLabel, secondaryAction, primaryDisabled}) => (
  <div id="controls">
    <button
      id="primary-btn"
      onClick={primaryAction}
      disabled={primaryDisabled}
    >
      {primaryLabel}
    </button>
    <button
      onClick={secondaryAction}
    >
      {secondaryLabel}
    </button>
  </div>
)

export default TimerControlsContainer