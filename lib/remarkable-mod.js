const { Remarkable } = require('remarkable')
const parse_emphasis = require('./parse_emphasis')

const md = new Remarkable({
  html: true,
  xhtmlOut: true,
  breaks: true,
  typographer: true
})

md.use(md => {
  md.inline.ruler.at('emphasis', parse_emphasis)
})

