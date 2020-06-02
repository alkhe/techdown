const create_renderer = require('./lib/renderer')

const default_nomnoml_prelude =
`#edgeMargin: 10
#fill: transparent
#lineWidth: 2
#padding: 12`

function default_logger(x) {
  console.log(x)
}

module.exports = function techdown(options) {
  options = options || {}

  return create_renderer({
    tex_prelude: options.tex_prelude,
    nomnoml_prelude: default_nomnoml_prelude + (options.nomnoml_prelude !== undefined ? '\n' + options.nomnoml_prelude : ''),
    logger: options.logger !== undefined ? options.logger : default_logger
  })
}

