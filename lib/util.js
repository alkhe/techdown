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

module.exports = {
  is_alphanum,
  is_alphanum_hyphen,
  slugify
}

