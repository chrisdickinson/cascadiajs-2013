var acorn = require('acorn')
  , TEXT_HEIGHT = 18
  , TEXT_WIDTH = 10

var idxToOffset = require('./idx-to-offset')
  , toChildren = require('./to-children')

module.exports = visualize

function visualize(d3, src) {
  var ast = acorn.parse(src, {
      locations: true
    , ranges: true
  })

  return render

  function render(svg, ready) {
    var group = svg.append('g')
      , astNodes = []

    depthFirst(ast, function(node, via, parent) {
      astNodes.push({
          node: node
        , via: via
        , parent: parent
        , position: []
      })
    })

    astNodes.forEach(function(node) {
      node.width // width(node) === sum(width(child nodes))


    })
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
