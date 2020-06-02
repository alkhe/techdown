const create_renderer = require('./lib/renderer')

const default_nomnoml_prelude =
`#edgeMargin: 10
#font: Source Code Variable
#fill: transparent
#lineWidth: 2
#padding: 12`

function default_logger(x) {
  console.log(x)
}

const default_options = {
  tex_prelude: null,
  nomnoml_prelude: default_nomnoml_prelude,
  logger: default_logger
}

module.exports = function techdown(options) {
  return create_renderer({ ...default_options, ...options })
}

