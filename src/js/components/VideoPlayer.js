// Video Streaming Player
import React, { Component } from 'react'
import videojs from 'video.js'

export default class VideoPlayer extends Component {
  componentDidMount() {
    this.player = videojs(this.videoNode, this.props)
  }


  componentWillUnmount() {
    // Dispose player on unmount
    if (this.player) {
      this.player.dispose()
      this.player = null
      this.videoNode = null
    }
  }

  // wrap the player in a div with a `data-vjs-player` attribute
  // so videojs won't create additional wrapper in the DOM
  // see https://github.com/videojs/video.js/pull/3856
  render() {
    return (
      <div data-vjs-player>
        <video
          ref={component => {
            this.videoNode = component
          }} className="video-js"
        />
      </div>
    )
  }
}
