module.exports = idxToOffset

idxToOffset._cache = {}

function idxToOffset(src, TEXT_WIDTH, TEXT_HEIGHT) {
  var cache_key = TEXT_WIDTH + ':' + TEXT_HEIGHT

  if(idxToOffset._cache[cache_key]) {
    return idxToOffset._cache[cache_key]
  }

  var map = idxToOffset._cache[cache_key] = []
    , line = 0
    , col = 0

  for(var i = 0, len = src.length; i < len; ++i) {
    if(src[i] === '\n') {
      col = 0
      ++line
    } else {
      ++col
    }

    map[i] = {
        x: col * TEXT_WIDTH
      , y: line * TEXT_HEIGHT
    }
  }

  map[i] = {x: 0, y: (col + 1) * TEXT_WIDTH}

  return map
}

