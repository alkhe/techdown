const hbs = require('handlebars')
const fs = require('fs')
const techdown = require('..')

const tex_prelude = fs.readFileSync('./prelude.tex', 'utf8')

const render = techdown(tex_prelude)

const raw_template = fs.readFileSync('./template.html', 'utf8')
const raw_content = fs.readFileSync('./content.md', 'utf8')
const template = hbs.compile(raw_template)

const content = render(raw_content)
fs.writeFileSync('./index.html', template({ content }))


