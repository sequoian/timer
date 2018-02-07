import React from 'react'

const TimerControlsContainer = ({start, stop, clear, reset, endAlert, mode}) => {
    switch (mode) {
      case 'input': return (
        <TimerControls
          primaryLabel={'Start'}
          primaryAction={start}
          secondaryLabel={'Clear'}
          secondaryAction={clear}
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
          primaryAction={endAlert}
          secondaryLabel={'Reset'}
          secondaryAction={reset}
        />
      )
      default: 
        console.log('Invalid mode')
        return null
    }
}

const TimerControls = ({primaryLabel, primaryAction, secondaryLabel, secondaryAction}) => (
  <div>
    <button
      onClick={primaryAction}
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