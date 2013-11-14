var lang = require('cssauron-falafel')

var selectRequire = '!variable > *:first-child + call' +
'> id[name=require] + literal:contains(assert)'

var selectSetupTeardown = 'call > id[name=suite] + function > block' +
'> !call > :any([name=teardown], [name=setup]) + function'

var preamble = []
  , suites = []

module.exports = {
    ':root': rewriteRoot
  , ':root > !expr > :not(call)': collectPreamble
  , '!call > id[name=test]': collectTest
  , '!call > id[name=suite]': collectSuite
}

module.exports[selectRequire] = rewriteRequire
module.exports[selectSetupTeardown] = collectSetupTeardown

function rewriteRoot(node) {
  var out = suites.map(function(suite) {
    return recurse(suite, [], [], 1)
  }).join('\n')

  preamble = preamble.map(function(node) {
    return node.source()
  }).join('\n')

  function recurse(suite, setups, teardowns, depth) {

    setups = setups.concat(suite.setups)
    teardowns = teardowns.concat(suite.teardowns)

    var suiteOut = suite.suites.map(function(child) {
      return recurse(
          child
        , setups
        , teardowns
        , depth + 1
      )
    }).join('\n')

    var testsOut = suite.tests.map(function(test) {
      var setupOut = setups.map(function(node) {
        
      }).join('\n')

      var tearDownOut = teardowns.map(function(node) {

      }).join('\n') 

      return setupOut + testOut + tearDownOut 
    })

    return suiteOut + testsOut
  }
}

function collectPreamble(node) {
  preamble.push(node)
}

function collectSetupTeardown(node) {
  var cur = node

  while(!lang('function')(cur)) {
    cur = cur.parent
  }

  // grab the parent suite call
  cur = cur.parent

  cur.setups = cur.setups || []
  cur.teardowns = cur.teardowns || []
  cur.suites = cur.suites || []
  cur.tests = cur.tests || []

  cur[node.parent.callee.id.value + 's'].push(node)
}

function collectTest(node) {
  var cur = node

  while(!lang('function')(cur)) {
    cur = cur.parent
  }

  // grab the parent suite call
  cur = cur.parent

  cur.setups = cur.setups || []
  cur.teardowns = cur.teardowns || []
  cur.suites = cur.suites || []
  cur.tests = cur.tests || []

  cur.tests.push(node)
}

function collectSuite(node) {
  var cur = node

  while(!lang('function')(cur)) {
    cur = cur.parent

    if(!cur) {
      suites.push(node)

      return
    }
  }

  // grab the parent suite call
  cur = cur.parent

  cur.setups = cur.setups || []
  cur.teardowns = cur.teardowns || []
  cur.suites = cur.suites || []
  cur.tests = cur.tests || []

  cur.suites.push(node)
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

function dedent(src, times) {
  src = src.split('\n')

  for(var i = 0, len = src.length; i < len; ++i) {
    for(var j = 0; j < times; ++j) {
      if(!/^\s{2}/.test(src[i])) {
        src[i] = src[i].slice(2)
      }
    }
  }

  return src.join('\n')
}
