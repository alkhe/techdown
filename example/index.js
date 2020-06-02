const hbs = require('handlebars')
const fs = require('fs')
const renderer = require('../renderer')

const raw_template = fs.readFileSync('./template.html', 'utf8')
const raw_content = fs.readFileSync('./content.md', 'utf8')
const template = hbs.compile(raw_template)

const content = renderer.render(raw_content)
fs.writeFileSync('./index.html', template({ content }))


