const chokidar = require('chokidar')
const hbs = require('handlebars')
const fs = require('fs')
const renderer = require('../renderer')

const [input_file, output_file] = process.argv.slice(2)

const raw_template = fs.readFileSync('./template.html', 'utf8')
const template = hbs.compile(raw_template)

chokidar.watch(input_file, {
  awaitWriteFinish: {
    stabilityThreshold: 200,
    pollInterval: 50
  }
}).on('change', () => {
  fs.readFile(input_file, 'utf8', (err, data) => {
    if (err) throw err
    const output = template({
      content: renderer.render(data)
    })
    fs.writeFile(output_file, output, err => {
      if (err) throw err
    })
  })
})

