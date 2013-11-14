var selectRequire = '!variable > *:first-child + call' +
'> id[name=require] + literal:contains(tape)'

module.exports = {
    ':root': wrapInSuite
  , 'call > id[name=test] ~ function > id': rewriteTest
  , '!call > lookup > id[name=assert] + id[name=end]': rewriteEnd
  , 'call > lookup > id[name=assert] + id[name=equal]': rewriteEqual
}

module.exports[selectRequire] = rewriteRequire

function rewriteTest(node) {
  if(node.parent.id === node) {
    return
  }

  node.update('done')
}

function rewriteEnd(node) {
  node.update('done()')
}

function rewriteEqual(node) {
  node.update('strictEqual')
}

function rewriteRequire(node) {
  node.update('assert = require(\'assert\')')
}

function wrapInSuite(node) {
  node.update('suite(\'test of bops\', function() {\n' + indent(node.source(), 1) + '\n})')
}

function indent(src, times) {
  src = src.split('\n')

  for(var i = 0, len = src.length; i < len; ++i) {
    for(var j = 0; j < times; ++j) {
      if(!/^\s*$/.test(src[i])) {
        src[i] = '  ' + src[i]
      }
    }
  }

  return src.join('\n')
}
