function is_alphanum(char) {
  return (
    (char >= 0x30 && char <= 0x39) || // [0-9]
    (char >= 0x41 && char <= 0x5a) || // [A-Z]
    (char >= 0x61 && char <= 0x7a) // [a-z]
  )
}

function is_alphanum_hyphen(char) {
  return char === 0x2d || is_alphanum(char)
}

function slugify(s, used_slugs) {
  const tokens = s.replace(/[^0-9A-z\s]/g, '').split(/\s+/)
  const base = tokens.map(t => t.toLowerCase()).join('-')

  if (!used_slugs.has(base)) {
    used_slugs.add(base)
    return base
  }

  let n = 1
  while (used_slugs.has(base + '-' + n)) n++

  const real = base + '-' + n
  used_slugs.add(real)
  return real
}

const SELECTOR_DEFAULT = 0
const SELECTOR_CLASS = 1
const SELECTOR_ID = 2

function parse_selector(selector) {
  let tag = null
  const classes = []
  const ids = []

  let mode = SELECTOR_DEFAULT
  let name = ''

  for (let i = 0; i < selector.length; i++) {
    const c = selector[i]

    switch (mode) {
      case SELECTOR_DEFAULT:
        if (c === '.') {
          if (name !== '') {
            tag = name
            name = ''
          }
          mode = SELECTOR_CLASS
        } else if (c === '#') {
          if (name !== '') {
            tag = name
            name = ''
          }
          mode = SELECTOR_ID
        } else {
          name += c
        }
        break
      case SELECTOR_CLASS:
        if (c === '.') {
          if (name !== '') {
            classes.push(name)
            name = ''
          }
        } else if (c === '#') {
          if (name !== '') {
            classes.push(name)
            name = ''
          }
          mode = SELECTOR_ID
        } else {
          name += c
        }
        break
      case SELECTOR_ID:
        if (c === '.') {
          if (name !== '') {
            ids.push(name)
            name = ''
          }
          mode = SELECTOR_CLASS
        } else if (c === '#') {
          if (name !== '') {
            ids.push(name)
            name = ''
          }
        } else {
          name += c
        }
        break
    }
  }

  if (name !== '') {
    if (mode === SELECTOR_DEFAULT) {
      tag = name
    } else if (mode === SELECTOR_CLASS) {
      classes.push(name)
    } else if (mode === SELECTOR_ID) {
      ids.push(name)
    }
  }

  return [tag || 'div', classes, ids]
}

module.exports = {
  is_alphanum,
  is_alphanum_hyphen,
  slugify,
  parse_selector
}

