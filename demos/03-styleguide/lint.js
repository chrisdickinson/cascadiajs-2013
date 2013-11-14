var linter = require('jsl')()

module.exports = linter

linter.rule(
    'if[alternate] > .consequent > :any(continue, break, return)'
  , returnEarly
  , 'error'
)

function returnEarly(node, toSource, alert) {
  alert(node, 'consider returning early')
}

if(require.main === module) {
  linter.cli()
}
