import React from 'react'
import moment from 'moment'

const TimerDisplay = ({duration}) => {
  const ms = Math.ceil(duration.asMilliseconds() * .001) * 1000
  duration = moment.duration(ms)
  let h = Math.floor(duration.asHours())
  let m = duration.minutes()
  let s = duration.seconds()

  if (h) {
    m = m.toString().padStart(2, '0')
    s = s.toString().padStart(2, '0')
  }
  else if (m) {
    h = null
    s = s.toString().padStart(2, '0')
  }
  else {
    h = null
    m = null
  }

  return (
    <div>
      <Time
        value={h}
        unit="h"
      />
      <Time
        value={m}
        unit="m"
      />
      <Time
        value={s}
        unit="s"
      />
    </div>
  )
}

const Time = ({value, unit}) => {
  if (value == null) return null
  return (
    <span>
      <span>{value}</span>
      <span>{unit}</span>
    </span>
  )
}

export default TimerDisplay