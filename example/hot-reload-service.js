const chokidar = require('chokidar')
const hbs = require('handlebars')
const fs = require('fs')
const techdown = require('..')

const [input_file, output_file] = process.argv.slice(2)

const raw_template = fs.readFileSync('./template.html', 'utf8')
const template = hbs.compile(raw_template)

const tex_prelude = String.raw`\gdef\overbar#1{\mkern 1.5mu\overline{\mkern-1.5mu#1\mkern-1.5mu}\mkern 1.5mu}`

const render = techdown(tex_prelude)

chokidar.watch(input_file, {
  awaitWriteFinish: {
    stabilityThreshold: 200,
    pollInterval: 50
  }
}).on('change', () => {

  fs.readFile(input_file, 'utf8', (err, data) => {
    if (err) throw err

    const output = template({
      content: render(data)
    })

    fs.writeFile(output_file, output, err => {
      if (err) throw err
    })
  })

})

