const techdown = require('../..')
const fs = require('fs')

const render = techdown()

const md = fs.readFileSync('./notes.md', 'utf8')

const output = render(md)

console.log(output)

