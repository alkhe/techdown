const { Remarkable } = require('remarkable')
const parse_emphasis = require('./parse-emphasis')
const katex = require('katex')
const nomnoml = require('nomnoml')

const nomnoml_preprocess = markup =>
`#edgeMargin: 10
#font: Source Code Variable
#fill: transparent
#lineWidth: 2
#padding: 12
${ markup }
`

const md = new Remarkable({
  html: true,
  xhtmlOut: true,
  breaks: true,
  typographer: true
})

let macros = null

md.use(md => {
  md.inline.ruler.at('emphasis', parse_emphasis)

  md.inline.ruler.push('math', function(state, silent) {
    const { src, pos, posMax } = state

    if (src[pos] !== '$' || pos + 1 === posMax) return false

    const is_escaped = (src, pos) => {
      let backslash_count = 0

      for (let i = pos - 1; i >= 0 && src[i] === '\\'; i--) {
        backslash_count++
      }

      return backslash_count % 2 === 1
    }

    const count_dollars = (src, pos, posMax) => {
      let dollar_count = 0

      for (let i = pos; i < posMax && src[i] === '$'; i++) {
        dollar_count++
      }

      return dollar_count
    }

    const prefix_dollar_count = count_dollars(src, pos, posMax)
    let k = pos + prefix_dollar_count

    while (k < posMax) {
      if (src[k] === '$' && !is_escaped(src, k)) {
        break
      } else {
        k++
      }
    }

    const suffix_dollar_count = count_dollars(src, k, posMax)

    if (suffix_dollar_count === 0 || silent) {
      return false
    }

    const dollars = Math.min(2, prefix_dollar_count, suffix_dollar_count)
    const text = src.slice(pos + dollars, k + suffix_dollar_count - dollars)

    if (text.trim().length === 0) {
      return false
    }

    state.push({
      type: 'math',
      content: { text, displayMode: dollars === 2 },
      level: state.level
    })

    state.pos += 2 * dollars + text.length

    return true
  })

  md.renderer.rules.ul_open = function() {
    return '<u>'
  }

  md.renderer.rules.ul_close = function() {
    return '</u>'
  }

  md.renderer.rules.math = function(tokens, idx) {
    const { text, displayMode } = tokens[idx].content

    return katex.renderToString(text, {
      displayMode,
      throwOnError: false,
      globalGroup: true,
      output: 'html',
      macros
    })
  }

  md.renderer.rules.fence_custom.math = function(tokens, idx) {
    return katex.renderToString(tokens[idx].content, {
      throwOnError: false,
      globalGroup: true,
      output: 'html',
      macros
    })
  }

  md.renderer.rules.fence_custom.nomnoml = function(tokens, idx) {
    return nomnoml.renderSvg(nomnoml_preprocess(tokens[idx].content))
  }

  md.renderer.rules.fence_custom['nomnoml-block'] = function(tokens, idx) {
    return '<center>' + nomnoml.renderSvg(nomnoml_preprocess(tokens[idx].content)) + '</center>'
  }
})

const renderer = {
  render(content, options) {
    macros = {}

    let output = null

    try {
      output = md.render(content, options)
    } catch (e) {
      console.log(e)
    }

    return output
  }
}

module.exports = renderer

