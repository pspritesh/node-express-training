const fs = require('fs')
const path = require('path')

module.exports = class Data {
  constructor(data = [
    'Express Model using ES6 Classes',
    'Working with constructors'
  ]) {
    this.data = data
  }

  writeMyFile() {
    const output_file = path.join(
      path.dirname(process.mainModule.filename),
      'src/public/files/databases',
      'data.json'
    )
    fs.readFile(output_file, (err, fileContent) => {
      let data = []
      if (!err) {
        data = JSON.parse(fileContent)
      }
      data.push(this)
      fs.writeFile(output_file, JSON.stringify(data), (err) => console.log(err))
    })
  }

  get() {
    let output = []
    const output_file = path.join(
      path.dirname(process.mainModule.filename),
      'src/public/files/databases',
      'data.json'
    )

    const readingFile = (resolve, reject) => {
      fs.readFile(output_file, (err, fileContent) => {
        let data = []
        if (!err) {
          data.push(JSON.parse(fileContent))
        } else {
          reject(data)
        }
        output.push(data)
        resolve(output)
      })
    }
    return new Promise(readingFile)
  }
}
