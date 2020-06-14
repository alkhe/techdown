const { Remarkable } = require('remarkable')
const parse_emphasis = require('./parse-emphasis')
const chart = require('./chart')
const math = require('./math')
const anchor = require('./anchor')
const styler = require('./styler')
const { slugify } = require('./util')

module.exports = function create_renderer({ tex_prelude, nomnoml_prelude, logger }) {
  const globals = { macros: null, used_slugs: null }

  const { render_fence_chart, render_fence_chart_inline } = chart(nomnoml_prelude)
  const { parse_math, render_math, md_render_math, md_render_fence_math } = math(globals)
  const { parse_anchor, render_anchor } = anchor(globals)
  const { parse_styler, render_styler_open, render_styler_close } = styler

  const md = new Remarkable({
    html: true,
    xhtmlOut: true,
    breaks: true,
    typographer: true
  })

  md.use(md => {
    md.inline.ruler.at('emphasis', parse_emphasis)
    md.inline.ruler.push('math', parse_math)

    md.block.ruler.before('heading', 'id', parse_anchor)
    md.block.ruler.before('htmlblock', 'styler', parse_styler)

    md.renderer.rules.ul_open = () => '<u>'
    md.renderer.rules.ul_close = () => '</u>'

    md.renderer.rules.heading_open = function(tokens, idx) {
      const slug = slugify(tokens[idx + 1].content, globals.used_slugs)
      return `<h${ tokens[idx].hLevel } id='${ slug }'><a href='#${ slug }' style='display: inline-block; text-decoration: none; color: inherit !important;'>`
    }

    md.renderer.rules.heading_close = function(tokens, idx) {
      return `</a></h${ tokens[idx].hLevel }>\n`
    }

    md.renderer.rules.styler_open = render_styler_open
    md.renderer.rules.styler_close = render_styler_close

    md.renderer.rules.anchor = render_anchor

    md.renderer.rules.math = md_render_math
    md.renderer.rules.fence_custom.math = md_render_fence_math

    md.renderer.rules.fence_custom.chart = render_fence_chart
    md.renderer.rules.fence_custom['chart-inline'] = render_fence_chart_inline
  })

  return function render(content, options) {
    globals.macros = {} // reset macros
    globals.used_slugs = new Set // reset used_slugs

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

