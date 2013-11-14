var acorn = require('acorn')
  , TEXT_HEIGHT = 18
  , TEXT_WIDTH = 10

var idxToOffset = require('./idx-to-offset')
  , toChildren = require('./to-children')

module.exports = visualize

function visualize(d3, src) {
  var astNodes = []
    , tokens = []
    , token

  var srcAsChars = src.split('')

  var reader = acorn.tokenize(src, {
      locations: true
    , ranges: true
  })

  while(token = reader()) {
    tokens[tokens.length] = JSON.parse(JSON.stringify(token))

    if(token.type.type === 'eof') {
      break
    }
  }

  var ast = acorn.parse(src, {
      locations: true
    , ranges: true
  })

  return render

  function render(svg, ready) {
    var tokenElements =
      svg
        .selectAll('.token')
        .data(tokens, tokenAccessor)

    var group =
    tokenElements
      .enter()
        .append('g')
        .attr(tokenGroupAttributes(src))

    var rect =
    group
      .append('rect')
      .attr(tokenAttributes(src))
      .attr('opacity', 0)

    var letters =
    group
      .append('text')
      .text(perWord)
      .attr(textAttributes(src))

    setTimeout(function() {
      ready(function erruh(svg, ready) {
        rect.each(fadeIn(tokens.length, 88, ready))
      })
    })

    function perWord(datum, idx) {
      return src.slice(datum.start, datum.end)
    }
  }

  function fadeIn(len, delay, ready) {
    var remaining = len

    return eachElement

    function eachElement(datum, idx) {
      var sel = d3.select(this)

      setTimeout(done, delay * (idx + 1))

      sel
        .transition()
        .delay(delay * idx)
        .duration(delay)
        .attr('opacity', 1)
    }

    function done() {
      !--remaining && ready(spreadTokens)
    }
  }

  function spreadTokens(svg, ready) {
    var tokens =
      svg
        .selectAll('.token')

    tokens
      .transition()
      .duration(500)
        .attr(tokenGroupAttributes(src, 10, 5))

    tokens
      .transition()
      .delay(500)
      .duration(500)
          .selectAll('rect')
          .attr(newDimensions(src))

    setTimeout(function() {
      ready(assembleAST)
    }, 1000)
  }

  function assembleAST(svg, ready) {
    var group = svg.append('g')
      , astNodes = []
      , queue = []

    group.attr('class', 'ast')

    depthFirst(ast, function(node, via, parent) {
      if(!node) {
        return
      }

      var nodeTokens = between(tokens, node.start, node.end)

      queue.push(walk)

      function walk(ready) {
        var time = 150

        var tokens =
        d3.selectAll('.token')
          .data(nodeTokens, tokenAccessor)

        tokens
          .transition()
          .duration(time)
          .attr('opacity', 1)

        tokens
          .exit()
            .transition()
            .delay(time)
            .duration(time)
            .attr('opacity', 0.15)

        astNodes.push({
            node: node
          , via: via
          , parent: parent
        })

        // create a new AST node at
        // this location, then migrate
        // it off... someplace?

        var results =
          group
            .selectAll('.ast-node')
            .data(astNodes)
              .enter()
                .append('rect')
                .attr(astInitialAttributes(nodeTokens, tokens, d3))

        var element = results[0].filter(Boolean)[0]

        setTimeout(ready, time * 2)
      }
    })

    consume()

    function consume() {
      if(!queue.length) {
        return ready()
      }

      queue.shift()(consume)
    }

    function depthFirst(node, ready, via, parent) {
      var names = toChildren(node)
        , value

      for(var i = 0, len = names.length; i < len; ++i) {
        value = node[names[i]]
        value = Array.isArray(value) ? value : [value]

        for(var j = 0, jlen = value.length; j < jlen; ++j) {
          depthFirst(value[j], ready, names[i], parent)
        }
      }

      ready(node, via, parent)
    }
  }
}

function textAttributes(src) {
  return {
      'class': 'letter'
    , 'font-family': 'monospace'
    , 'font-size': '16px'
    , 'y': TEXT_HEIGHT - 4
  }
}

function tokenGroupAttributes(src, addW, addH) {
  addW = addW || 0
  addH = addH || 0

  var map = idxToOffset(src, TEXT_WIDTH + addW, TEXT_HEIGHT + addH)

  return {
      'transform': transform
    , 'class': 'token'
  }

  function transform(datum, idx) {
    return 'translate(' +
        initialX(datum, idx) + ',' +
        initialY(datum, idx) +
    ')'
  }

  function initialX(datum, idx) {
    return map[datum.start].x
  }

  function initialY(datum, idx) {
    return (map[datum.start].y - TEXT_HEIGHT + 2)
  }
}

function tokenAttributes(src) {
  var map = idxToOffset(src, TEXT_WIDTH, TEXT_HEIGHT)

  return {
      'class': 'token-rect'
    , 'x': 0
    , 'y': 0
    , 'width': width
    , 'height': height
    , 'fill': 'none'
    , 'stroke': '#999'
    , 'stroke-width': '2px'
  }

  function width(datum, idx) {
    var end = datum.end
      , result

    result = map[end].x - map[datum.start].x

    if(result < 0) {
      while(map[end].y !== map[datum.start].y) {
        --end
      }

      result = map[end].x - map[datum.start].x + TEXT_WIDTH
    }

    return Math.max(TEXT_WIDTH, result)
  }

  function height(datum, idx) {
    return TEXT_HEIGHT
  }
}

function newDimensions(src) {
  var base = tokenAttributes(src, TEXT_WIDTH, TEXT_HEIGHT)

  return {
      'x': getX
    , 'y': getY
    , 'width': getWidth
    , 'height': getHeight
  }

  function getWidth(datum, idx) {
    return base.width(datum, idx) + 10
  }

  function getHeight(datum, idx) {
    return base.height(datum, idx) + 5
  }

  function getX(datum, idx) {
    return -5
  }

  function getY(datum, idx) {
    return -2.5
  }
}

function astInitialAttributes(tokens, sel, d3) {
  sel = sel[0]

  var boxes  = sel.map(function(el) {
    return dimensions(d3.select(el))
  })

  var out = {x: Infinity, y: Infinity, dx: -Infinity, dy: -Infinity}

  for(var i = 0, len = boxes.length; i < len; ++i) {
    out.x = Math.min(out.x, boxes[i].x)
    out.y = Math.min(out.y, boxes[i].y)
    out.dx = Math.max(out.dx, boxes[i].dx)
    out.dy = Math.max(out.dy, boxes[i].dy)
  }

  return {
      'class': 'ast-node'
    , 'transform': 'translate(' + out.x + ',' + out.y + ')'
    , 'width': out.dx - out.x
    , 'height': out.dy - out.y
    , 'fill': 'black'
    , 'opacity': '0.2'
  }

  function dimensions(sel) {
    var xy = sel
      .attr('transform')
      .slice('transform('.length, -1)
          .split(',').map(Number)

    var rect = sel.select('rect')

    return {
        x: xy[0] - 10 
      , y: xy[1] - 5
      , dx: xy[0] + (+rect.attr('width'))
      , dy: xy[1] + (+rect.attr('height'))
    }
  }

  function x(datum, idx) {
    return left
  }

  function y(datum, idx) {
    return top
  }

  function width(datum, idx) {
    return 100
  }

  function height(height, idx) {
    return 32
  }
}

function between(tokens, start, end) {
  var out = []

  for(var i = 0, len = tokens.length; i < len; ++i) {
    if(tokens[i].start < start) {
      continue
    }

    out[out.length] = tokens[i]

    if(tokens[i].end >= end) {
      break
    }
  }

  return out
}

function tokenAccessor(token) {
  return token.start
}

function astAccessor(meta) {
  return meta.node.type + ':' + meta.node.start
}
