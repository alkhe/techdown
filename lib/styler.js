const { parse_selector } = require('./util')

function parse_styler(state, start_line, end_line, silent) {
  if (silent || start_line > end_line) return false

  const block_start = state.bMarks[start_line] + state.tShift[start_line]
  const block_marker = state.src.charCodeAt(block_start)

  if (block_marker !== 0x7b) return false // {

  const max = state.eMarks[start_line]

  const name = state.src.slice(block_start + 1, max).trim()
  const [tag, classes, ids] = parse_selector(name)

  if (state.styler_tags == null) {
    state.styler_tags = [tag]
  } else {
    state.styler_tags.push(tag)
  }

  state.tokens.push({
    type: 'styler_open',
    tag,
    classes,
    ids,
    level: state.level++
  })

  state.line = start_line + 1

  for (let l = start_line + 1; l <= end_line; l++) {
    const start = state.bMarks[l] + state.tShift[l]
    const marker = state.src.charCodeAt(start)

    if (marker === 0x7b) {
      // bug in remarkable, must include indent size or else getLines will slice from NaN
      const content = state.getLines(state.line, l, state.tShift[l])
      state.parser.parse(content, state.options, state.env, state.tokens)

      const nested = parse_styler(state, l, end_line, false)
      if (!nested) return false

      l = state.line - 1
    } else if (marker === 0x7d) {
      if (state.styler_tags == null || state.styler_tags.length === 0) return false

      const content = state.getLines(state.line, l, state.tShift[l])
      state.parser.parse(content, state.options, state.env, state.tokens)

      state.tokens.push({
        type: 'styler_close',
        tag: state.styler_tags.pop(),
        level: --state.level
      })

      state.line = l + 1

      return true
    }
  }

  return false
}

function render_styler_open(tokens, idx) {
  const { tag, classes, ids } = tokens[idx]
  let html = `<${ tag }`
  if (classes.length !== 0) html += ` class='${ classes.join(' ') }'`
  if (ids.length !== 0) html += ` id='${ ids.join(' ') }`
  return html + '>'
}

function render_styler_close(tokens, idx) {
  return `</${ tokens[idx].tag }>`
}

module.exports = {
  parse_styler,
  render_styler_open,
  render_styler_close
}

