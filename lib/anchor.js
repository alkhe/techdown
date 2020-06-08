/* This module parses anchors. This allows us to create hyperlink-accessible
 * locations in our page. An anchor like @content will be accessible by
 * visiting the #content link hash.
 */

const { is_alphanum_hyphen } = require('./util')

function parse_anchor(state, start_line, end_line, silent) {
  const start = state.bMarks[start_line] + state.tShift[start_line]

  const marker = state.src.charCodeAt(start)

  if (marker !== 0x40 || silent) { // @
    return false
  }

  const max = state.eMarks[start_line]

  let name = ''
  let pos = start + 1

  for (
    let c = state.src[pos];
    pos < max && is_alphanum_hyphen(c.charCodeAt(0));
    pos++, c = state.src[pos]
  ) {
    name += c
  }

  state.tokens.push({
    type: 'anchor',
    content: name,
    level: state.level
  })

  state.line = start_line + 1

  return true
}

module.exports = function(globals) {

  function render_anchor(tokens, idx) {
    const slug = tokens[idx].content

    if (globals.used_slugs.has(slug)) {
      console.log(`warning: anchor '${ slug }' already taken`)
    } else {
      globals.used_slugs.add(slug)
    }

    return `<div id='${ slug }' style='display: hidden'></div>`
  }

  return {
    parse_anchor,
    render_anchor
  }

}

