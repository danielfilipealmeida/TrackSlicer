import { FFMpeg } from '../../../src/modules/ffmpeg'
import fs from 'fs'
import rimraf from 'rimraf'

let createOutputFolder = (folder) => {
  if (fs.existsSync(folder)) {
    rimraf.sync(folder)
  }
  fs.mkdirSync(folder)
}

let testFile = 'test/unit/specs/files/input.wav'
let sliceTestData = [
  {
    start: 0,
    duration: 10,
    input: testFile,
    output: 'test/unit/specs/files/output/slice1.wav'
  },
  {
    start: 10,
    duration: 10,
    input: testFile,
    output: 'test/unit/specs/files/output/slice2.wav'
  },
  {
    start: 20,
    duration: 10,
    input: testFile,
    output: 'test/unit/specs/files/output/slice3.wav'
  },
  {
    start: 30,
    duration: 10,
    input: testFile,
    output: 'test/unit/specs/files/output/slice4.wav'
  }
]

/**
 * Location of the FFMpeg binary
 * @type {string}
 */
let ffmpegPath = '/usr/local/bin/ffmpeg'

/**
 * Location used for storing all generated files in this tests
 * @type {string}
 */
let outputPath = 'test/unit/specs/files/output'

/**
 * Location of the waveform that will be created and opened
 * @type {string}
 */
let outputWaveformPath = `${outputPath}/waveform.raw`

describe('ffmpeg', () => {
  it('should find ffmpeg', () => {
    expect(() => { FFMpeg('') }).to.throw()
    expect(() => { FFMpeg('/usr/bin/fakefile') }).to.throw()
    expect(() => {
      let ffmpeg = new FFMpeg(ffmpegPath)
      expect(ffmpeg).to.be.an('object')
    }).not.to.throw()
  })

  it('should sliceSync', () => {
    let ffmpeg = new FFMpeg(ffmpegPath)
    createOutputFolder(outputPath)
    ffmpeg.sliceSync(sliceTestData)
    expect(fs.existsSync(`${outputPath}/slice1.wav`))
    expect(fs.existsSync(`${outputPath}/slice2.wav`))
    expect(fs.existsSync(`${outputPath}/slice3.wav`))
    expect(fs.existsSync(`${outputPath}/slice4.wav`))
  })

  it('should slice', (done) => {
    let ffmpeg = new FFMpeg(ffmpegPath)
    createOutputFolder(outputPath)
    ffmpeg.slice(sliceTestData).then((res) => {
      // res.forEach((res) => { expect(res).to.be.empty })
      done()
    }).catch((res) => { done(res) })
  }).timeout(10000)

  it('should generate a waveform', (done) => {
    let ffmpeg = new FFMpeg(ffmpegPath)
    let waveformTestData = {
      inputPath: testFile,
      outputPath: outputWaveformPath
    }
    ffmpeg.extractWaveformToFile(waveformTestData).then((res) => {
      done()
    })
      .catch((res) => {
        done(res)
      })
  })

  it('can open waveform file', (done) => {
    let ffmpeg = new FFMpeg(ffmpegPath)
    ffmpeg.readWaveformFromFile({filePath: outputWaveformPath})
      .then(
        (data) => {
          console.log(typeof data)
          expect(data).to.be.an('array')
          expect(data).to.not.be.empty
          done()
        }
      )
      .catch((errorMessage) => {
        done(errorMessage)
      })
  })

  it('can create an image with the waveform of audio data', (done) => {
    let ffmpeg = new FFMpeg(ffmpegPath)
    let waveformTestData = {
      inputPath: testFile,
      outputPath: outputWaveformPath + '.png'
    }
    ffmpeg.extractWaveformToImage(waveformTestData).then((res) => {
      done()
    })
      .catch((res) => {
        done(res)
      })
  })
})
