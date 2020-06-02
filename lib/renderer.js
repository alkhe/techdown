const { Remarkable } = require('remarkable')
const parse_emphasis = require('./parse-emphasis')
const chart = require('./chart')
const math = require('./math')

module.exports = function create_renderer(tex_prelude, nomnoml_prelude, logger) {
  const globals = { macros: null }

  const { render_fence_chart, render_fence_chart_inline } = chart(nomnoml_prelude)
  const { parse_math, render_math, md_render_math, md_render_fence_math } = math(globals)

  const md = new Remarkable({
    html: true,
    xhtmlOut: true,
    breaks: true,
    typographer: true
  })

  md.use(md => {
    md.inline.ruler.at('emphasis', parse_emphasis)
    md.inline.ruler.push('math', parse_math)

    md.renderer.rules.ul_open = () => '<u>'
    md.renderer.rules.ul_close = () => '</u>'

    md.renderer.rules.math = md_render_math
    md.renderer.rules.fence_custom.math = md_render_fence_math

    md.renderer.rules.fence_custom.chart = render_fence_chart
    md.renderer.rules.fence_custom['chart-inline'] = render_fence_chart_inline
  })

  return function render(content, options) {
    globals.macros = {} // reset macros

    let output = null

    try {
      if (tex_prelude != null) {
        output = render_math(tex_prelude, globals.macros, false)
      }

      output = (output !== null ? output : '') + md.render(content, options)
    } catch (e) {
      logger(e)
    }

    return output
  }
}

