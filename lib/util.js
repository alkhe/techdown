function is_alphanum(char) {
  return (
    (char >= 0x30 && char <= 0x39) || // [0-9]
    (char >= 0x41 && char <= 0x5a) || // [A-Z]
    (char >= 0x61 && char <= 0x7a) // [a-z]
  )
}

module.exports = {
  is_alphanum
}

