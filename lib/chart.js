const nomnoml = require('nomnoml')

module.exports = function(raw_prelude) {

  const prelude = raw_prelude + '\n'

  function render_fence_chart(tokens, idx) {
    return `<center>${ nomnoml.renderSvg(prelude + tokens[idx].content) }</center>`
  }

  function render_fence_chart_inline(tokens, idx) {
    return nomnoml.renderSvg(prelude + tokens[idx].content)
  }

  return {
    render_fence_chart,
    render_fence_chart_inline
  }

}

