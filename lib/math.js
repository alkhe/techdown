const katex = require('katex')

function count_forwards(s, start, max, char) {
  let n = 0

  for (let i = start; i < max && s[i] === char; i++) {
    n++
  }

  return n
}

function count_backwards(s, before, char) {
  let n = 0

  for (let i = before - 1; i >= 0 && s[i] === char; i--) {
    n++
  }

  return n
}

function is_escaped(s, k) {
  return count_backwards(s, k, '\\') & 1 === 1
}

function parse_math(state, silent) {
  const { src, pos, posMax: max } = state

  if (src[pos] !== '$' || pos + 1 === max) return false

  const prefix_dollar_count = count_forwards(src, pos, max, '$')

  // start of text
  let k = pos + prefix_dollar_count

  // move k to end of text, exclusive
  while (k < max && (src[k] !== '$' || is_escaped(src, k))) {
    k++
  }

  const suffix_dollar_count = count_forwards(src, k, max, '$')

  if (suffix_dollar_count === 0 || silent) {
    return false
  }

  const usable_dollars = Math.min(2, prefix_dollar_count, suffix_dollar_count)

  // get content between start and end delimiters
  const text = src.slice(pos + usable_dollars, k + suffix_dollar_count - usable_dollars)

  if (text.trim().length === 0) return false

  state.push({
    type: 'math',
    content: { text, displayMode: usable_dollars === 2 },
    level: state.level
  })

  state.pos = k + suffix_dollar_count

  return true
}

function render_math(content, macros, displayMode = true) {
  return katex.renderToString(content, {
    displayMode,
    throwOnError: false,
    globalGroup: true,
    output: 'html',
    macros
  })
}

module.exports = function(globals) {

  function md_render_math(tokens, idx) {
    const { text, displayMode } = tokens[idx].content
    return render_math(text, globals.macros, displayMode)
  }

  function md_render_fence_math(tokens, idx) {
    return render_math(tokens[idx].content, globals.macros)
  }

  return {
    parse_math,
    render_math,
    md_render_math,
    md_render_fence_math
  }

}

