const hbs = require('handlebars')
const fs = require('fs')
const techdown = require('..')

const render = techdown()

const raw_template = fs.readFileSync('./template.html', 'utf8')
const raw_content = fs.readFileSync('./content.md', 'utf8')
const template = hbs.compile(raw_template)

const content = render(raw_content)
fs.writeFileSync('./index.html', template({ content }))


