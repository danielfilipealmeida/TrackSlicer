<template>
    <div>
        <canvas  
          id="waveformCanvas" 
          ref="canvas" 
          :width="width" 
          :height="height"
          v-on:mousemove="handleMouseMove"
          v-on:click="handleMouseClick"
          v-on:mousedown="handleMouseDown"
          v-on:mouseup="handleMouseUp"
          ></canvas>
          <p>{{caption}}</p>
    </div>

</template>

<script>
  const md5 = require('md5')
  const fs = require('fs')
  const {promisify} = require('util')

  export default {
    name: 'waveform',
    data () {
      return {
        context: null,
        width: 200,
        height: 80,
        image: null,
        waveformImageFilePath: null,
        dragging: false,
        draggedCutpoint: null,
        mouseLocation: null,
        snapAmount: 0.01
      }
    },

    props: {
      filePath: {
        type: String,
        required: true
      },
      cutpoints: {
        type: Array,
        required: false
      }
    },

    created: function () {
      this.waveformImageFilePath = this.getWaveformPath(this.filePath)

      let access = promisify(fs.access)
      access(this.fullPath)
        .then((result) => {

        })
        .catch(() => {
          this.$ffmpeg.extractWaveformToImage({
            inputPath: this.filePath,
            outputPath: this.fullPath
          })
        })

      this.$nextTick(() => {
        window.addEventListener('resize', this.updateWidth)
      })
    },

    mounted: function () {
      this.context = this.$refs['canvas'].getContext('2d')
      this.width = this.$el.clientWidth
      this.createImage()
      this.image.src = 'file://' + this.fullPath
    },

    methods: {

      /**
       * Starts the <img> and sets up the loading of the waveform image
       */
      createImage () {
        this.image = new Image()
        this.image.onload = this.onLoadImage
      },

      /**
       * method to be executed when <img> loads the waveform image
       */
      onLoadImage () {
        createImageBitmap(this.image)
          .then((img) => {
            this.context.drawImage(this.image, 0, 0, this.width, this.height)
            this.draw()
          })
          .catch((err) => {
            console.log(err)
          })
      },

      /**
       * Returns the location of the waveform image file inside the Application's Data folder
       * @paran {string} filePath
       */
      getWaveformPath (filePath) {
        return 'Local Storage/ ' + md5(filePath) + '.png'
      },

      /**
       * Updates the width and redraws
       * @param {object} event
       */
      updateWidth (event) {
        this.width = this.$el.clientWidth
        this.$nextTick(() => {
          this.draw()
        })
      },

      /**
       * Draws the cutpoints on top of the waveform
       */
      drawCutpoints () {
        let vue = this
        this.cutpoints.forEach((cutpoint) => {
          let x = vue.width * cutpoint
          // if (Math.abs(cutpoint - this.normalizedX) > this.snapAmount) {
          let hoveredCutpoint = this.hoveredCutpoint
          if (!!hoveredCutpoint && cutpoint === hoveredCutpoint.cutpoint) {
            vue.context.lineWidth = 3
            vue.context.strokeStyle = 'red'
            vue.context.setLineDash([])
          } else {
            vue.context.lineWidth = 1
            vue.context.strokeStyle = 'black'
            vue.context.setLineDash([2, 2])
          }
          vue.context.beginPath()
          vue.context.moveTo(x, 0)
          vue.context.lineTo(x, vue.height)
          vue.context.stroke()
        })
      },

      /**
       * Draw everything
       */
      draw () {
        this.context.clearRect(0, 0, this.width, this.height)
        this.context.drawImage(this.image, 0, 0, this.width, this.height)
        this.drawCutpoints()
      },

      /**
       * Sets the mouseLocation data variable with the correct position of the mouse on the element
       */
      setMouseLocationFromEvent (event) {
        this.mouseLocation = {
          x: event.clientX - this.$el.offsetLeft,
          y: event.clientY - this.$el.offsetTop
        }
      },

      /**
       * Handles Mouse Move event and takes care of dragging while the mouse button is down.
       * @param event the event object
       */
      handleMouseMove (event) {
        this.setMouseLocationFromEvent(event)
        if (this.dragging) {
          this.draggedCutpoint = this.hoveredCutpoint
          if (!this.draggedCutpoint) return
          let currentIndex = this.draggedCutpoint.index

          // stop drag before previous cutpoint
          if (
            currentIndex > 0 &&
            ((this.normalizedX - this.cutpoints[currentIndex - 1]) < (this.snapAmount * 2))
          ) return

          // stop drag before next cutpoint
          if (
            currentIndex < this.cutpoints.length - 1 &&
            ((this.cutpoints[currentIndex + 1] - this.normalizedX) < (this.snapAmount * 2))
          ) return

          this.cutpoints[currentIndex] = this.normalizedX
        }
        this.draw()
      },

      /**
       * Currently unused
       */
      handleMouseClick () {},

      /**
       * Handles the mouse down event. Drag starts.
       */
      handleMouseDown () {
        this.dragging = true
      },

      /**
       * Handle mouse up event.
       * Drag stops and cleanups.
       */
      handleMouseUp () {
        this.dragging = false
        this.draggedCutpoint = null
      }

    },

    computed: {
      /**
       * Returns the full path where the waveform image should be located for the current audio file being displayed
       * @return {string}
       */
      fullPath: function () {
        return this.$path.join(this.$remote.app.getPath('userData'), this.waveformImageFilePath || '')
      },

      /**
       * Returns the caption text (TODO)
       */
      caption: function () {
        return this.normalizedX
      },

      /**
       * return the hovered cutpoint information as an array or null if no cutpoint is being hovered by the mouse
       * @returns {array|null} hovered cutpoint information. object with the normalized cutpoint location on the x axis and what index it is located on the cutpoints array
       */
      hoveredCutpoint () {
        let result = null
        this.cutpoints.forEach((cutpoint, index) => {
          if (Math.abs(cutpoint - this.normalizedX) < this.snapAmount) {
            result = {
              cutpoint: cutpoint,
              index: index
            }
          }
        })
        return result
      },

      /**
       * Returns the normalized mouse position on the X axis. Values from 0 to 1.
       * @returns {int} mouse position from 0 to 1
       */
      normalizedX () {
        return this.mouseLocation !== null ? this.mouseLocation.x / this.width : null
      }
    }
  }
</script>

