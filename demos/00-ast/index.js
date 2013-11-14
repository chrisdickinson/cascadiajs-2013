var fs = require('fs')

var data = fs.readFileSync(__dirname + '/example.js', 'utf8')

var d3 = require('d3')

var visualize = require('./visualize')
  , svg

svg = d3.select('body').append('svg')

document.body.style.margin =
document.body.style.padding = '0px'
window.onresize = size
size()

visualize(d3, data)(svg, iter)

var next

function iter(_next) {
  console.log('got ', _next.name)
  if(!_next) {
    return
  }

  next = _next
}

document.body.addEventListener('keyup', function(ev) {
  if(next) {
    next(svg, iter)
    next = null
  }
}, false)

function size() {
  svg.attr({
      'width': window.innerWidth
    , 'height': window.innerHeight
  })
}
