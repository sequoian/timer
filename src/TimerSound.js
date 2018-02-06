const volume = 0.7

class TimerSound {
  constructor() {
    this.audio = new Audio('./timer.mp3')
    this.audio.loop = true
    this.audio.volume = volume
    this.playing = false
  }

  play() {
    if (this.playing) return
    this.audio.play()
    this.playing = true
  }

  stop() {
    if (!this.playing) return
    this.audio.pause()
    this.audio.volume = volume
    this.audio.currentTime = 0
    this.playing = false
  }
}

export default TimerSound