const {exec} = require('child_process')
const fs = require('fs')
const util = require('util')

/**
 * FFMpeg wrapper class used for interfacing with the ffmpeg binary
 * @type {FFMpeg}
 */
let FFMpeg = class {
  constructor (binPath) {
    this.binPath = binPath
    if (!fs.existsSync(binPath)) throw new Error('FFMpeg binary not found')
  }

  /**
   * Checks if the data stored on the input object is a valid definition of a slice
   * @param sliceData
   */
  validateSliceData (sliceData) {
    if (typeof sliceData !== 'object') throw Error('Slice data must be an array')
    if (typeof sliceData.start !== 'number') throw Error('Start must be an integer')
    if (typeof sliceData.duration !== 'number') throw Error('Duration must be an integer')
    if (typeof sliceData.input !== 'string') throw Error('Input must be a string')
    if (typeof sliceData.input !== 'string') throw Error('Output must be a string')
  }

  /**
   * Returns the FFMpeg command used to produce the requested slice
   * @param sliceData
   * @return {string}
   */
  getSliceCommand (sliceData) {
    return `${this.binPath} -y -ss ${sliceData.start} -t ${sliceData.duration} -i ${sliceData.input} ${sliceData.output}`
  }

  /**
   * Returns a ffmpeg command that generates a waveform date
   * @param data
   * @return {string}
   */
  getWaveformGeneratorCommand (data) {
    let defaultData = {
      channels: 1,
      samplesPerSecond: 44000,
      format: 's16le',
      codec: 'pcm_s16le',
      audioRate: 128
    }

    data = Object.assign(defaultData, data)

    // let command = `${this.binPath} -i ${data.inputPath} -ac ${data.channels} -filter:a aresample=${data.samplesPerSecond} -map 0:a -c:a ${data.codec} -f data - ${data.outputPath}`

    let command = `${this.binPath} -i "${data.inputPath}" -f ${data.format} -acodec ${data.codec} -ar ${data.audioRate} -ac ${data.channels} "${data.outputPath}"`
    return command
  }

  getWaveformToImageGeneratorCommand (data) {
    let defaultData = {
      width: 1000,
      height: 200,
      color: '888888'
    }

    data = Object.assign(defaultData, data)
    return `${this.binPath} -i "${data.inputPath}" -filter_complex "showwavespic=s=${data.width}x${data.height}:split_channels=1:colors=#${data.color}" -frames:v 1 "${data.outputPath}"`
  }
  /**
   * Slices audio files into tracks
   * Receives an array with the following data:
   * - input
   * - output
   * - start second
   * - duration (in seconds)
   * @param slicesData
   */
  sliceSync (slicesData) {
    slicesData.forEach((sliceData) => {
      this.validateSliceData(sliceData)
      let command = this.getSliceCommand(sliceData)
      exec(command, (err, stdout, stderr) => {
        if (err) console.log(err)
      })
    })
  }

  /**
   * Runs a terminal command asyncronously
   * @param command
   * @return {*}
   */
  static execTerminalCommandAsync (command) {
    const execAsync = util.promisify(exec)
    return execAsync(command)
  }

  /**
   * Slices audio files asyncronously
   * @param slicesData
   * @return {*}
   */
  slice (slicesData) {
    let actions

    actions = slicesData.map((sliceData) => {
      this.validateSliceData(sliceData)
      let command = this.getSliceCommand(sliceData)
      return FFMpeg.execTerminalCommandAsync(command)
    })

    return Promise.all(actions)
  }

  /**
   * Extract data needed to draw a waveform
   * @param data
   */
  extractWaveformToFile (data) {
    let command = this.getWaveformGeneratorCommand(data)
    console.log(command)
    return FFMpeg.execTerminalCommandAsync(command)
  }

  /**
   * Extracts the audio data into an image
   * @param data
   * @return {*}
   */
  extractWaveformToImage (data) {
    let command = this.getWaveformToImageGeneratorCommand(data)
    console.log(command)
    return FFMpeg.execTerminalCommandAsync(command)
  }

  /**
   *
   * @param data
   * @return {*}
   */
  readWaveformFromFile (data) {
    let readFile = util.promisify(fs.readFile)
    return readFile(data.filePath)
      .then((buffer) => {
        return new Promise((resolve) => {
          let result = []
          for (let f = 0; f < buffer.byteLength / 2; f++) {
            result.push(buffer.readInt16LE(f))
          }
          resolve(result)
          // resolve([...buffer])
        })
      })
  }
}

export { FFMpeg }
