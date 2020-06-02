/* This module parses emphasis markers in techdown.
 * We deviate from the traditional markdown convention - bold and italic can
 * only be applied using asterisks. *One* for italic, **two** for bold, and
 * ***three*** for both bold and italic. This allows us to implement
 * _underline_, which is not possible in traditional markdown.
 *
 * Adapted from jonschlinkert/remarkable/lib/rules_inline/emphasis.js
 */

const { is_alphanum } = require('./util')

// parse sequence of emphasis markers,
// "start" should point at a valid marker
function scanDelims(state, start) {
  let pos = start
  let can_open = true
  let can_close = true

  const max = state.posMax
  const marker = state.src.charCodeAt(start) // * or _

  // character before start of emphasis sequence
  const prev_char = start > 0
    ? state.src.charCodeAt(start - 1)
    : null

  // scan through marker sequence
  while (pos < max && state.src.charCodeAt(pos) === marker) {
    pos++
  }

  // end of content. can't open an emphasis sequence
  if (pos === max) {
    can_open = false
  }

  const marker_count = pos - start

  if (marker_count > 3) {

    // emphasis only supported with up to three markers
    can_open = false
    can_close = false

  } else {

    const next_char = pos < max
      ? state.src.charCodeAt(pos)
      : null

    // emphasis content can't start or end with space or newline
    if (next_char === 0x20 || next_char === 0x0a) can_open = false
    if (prev_char === 0x20 || prev_char === 0x0a) can_close = false

    // don't underline if in the middle of a word
    if (marker === 0x5f) { // _
      if (is_alphanum(prev_char)) {
        can_open = false
      }

      if (is_alphanum(next_char)) {
        can_close = false
      }
    }

  }

  return {
    can_open,
    can_close,
    delims: marker_count,
  }
}

module.exports = function emphasis(state, silent) {
  var startCount,
    found,
    oldCount,
    newCount,
    stack,
    res,
    max = state.posMax,
    start = state.pos,
    marker = state.src.charCodeAt(start)

  if (marker !== 0x5f /* _ */ && marker !== 0x2a /* * */) {
    return false
  }

  if (silent) {
    return false
  } // don't run any pairs in validation mode

  res = scanDelims(state, start)
  startCount = res.delims
  if (!res.can_open) {
    state.pos += startCount
    if (!silent) {
      state.pending += state.src.slice(start, state.pos)
    }
    return true
  }

  if (state.level >= state.options.maxNesting) {
    return false
  }

  state.pos = start + startCount
  stack = [startCount]

  while (state.pos < max) {
    if (state.src.charCodeAt(state.pos) === marker) {
      res = scanDelims(state, state.pos)
      const count = res.delims
      if (res.can_close) {
        oldCount = stack.pop()
        newCount = count

        while (oldCount !== newCount) {
          if (newCount < oldCount) {
            stack.push(oldCount - newCount)
            break
          }

          // assert(newCount > oldCount)
          newCount -= oldCount

          if (stack.length === 0) {
            break
          }
          state.pos += oldCount
          oldCount = stack.pop()
        }

        if (stack.length === 0) {
          startCount = oldCount
          found = true
          break
        }
        state.pos += count
        continue
      }

      if (res.can_open) {
        stack.push(count)
      }
      state.pos += count
      continue
    }

    state.parser.skipToken(state)
  }

  if (!found) {
    // parser failed to find ending tag, so it's not valid emphasis
    state.pos = start
    return false
  }

  // found!
  state.posMax = state.pos
  state.pos = start + startCount

  if (!silent) {
    if (marker === 0x5f) {
      // _
      state.push({ type: 'ul_open', level: state.level++ })

      state.parser.tokenize(state)

      state.push({ type: 'ul_close', level: --state.level })
    } else {
      // *
      if (startCount === 2 || startCount === 3) {
        state.push({ type: 'strong_open', level: state.level++ })
      }
      if (startCount === 1 || startCount === 3) {
        state.push({ type: 'em_open', level: state.level++ })
      }

      state.parser.tokenize(state)

      if (startCount === 1 || startCount === 3) {
        state.push({ type: 'em_close', level: --state.level })
      }
      if (startCount === 2 || startCount === 3) {
        state.push({ type: 'strong_close', level: --state.level })
      }
    }
  }

  state.pos = state.posMax + startCount
  state.posMax = max
  return true
}

