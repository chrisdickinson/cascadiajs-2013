module.exports = child_names_for

function child_names_for(node) {
  if(!node) {
    return []
  }

  switch(node.type) {
    case 'LabeledStatement':
      return ['label', 'body']
    case 'BlockStatement':
    case 'Program':
      return ['body']
    case 'ExpressionStatement':
      return ['expression']
    case 'ConditionalExpression':
    case 'IfStatement':
      if(node.alternate)
        return ['test', 'consequent', 'alternate']
      return ['test', 'consequent']
    case 'BreakStatement':
    case 'ContinueStatement':
      return node.label ? ['label'] : []
    case 'WithStatement':
      return ['object', 'body']
    case 'SwitchStatement':
      return ['discriminant', 'cases']
    case 'ReturnStatement':
    case 'ThrowStatement':
      return node.argument ? ['argument'] : null
    case 'TryStatement':
      var ret = ['block']
      if(node.handlers.length)
        ret.push('handlers')
      if(node.finalizer)
        ret.push('finalizer')
      return ret
    case 'WhileStatement':
      return ['test', 'body']
    case 'DoWhileStatement':
      return ['body', 'test']
    case 'ForStatement':
      return ['init', 'test', 'update', 'body']
    case 'ForInStatement':
      return ['left', 'right', 'body']
    case 'FunctionDeclaration':
      return ['id', 'params', 'body']
    case 'VariableDeclaration':
      return ['declarations']
    case 'VariableDeclarator':
      if(node.init) return ['id', 'init']
      return ['id']
    case 'LogicalExpression':
    case 'BinaryExpression':
    case 'AssignmentExpression':
      return ['left', 'right']
    case 'ArrayExpression':
      return ['elements']
    case 'ObjectExpression':
      return ['properties']
    case 'ObjectKeyExpression':
      return ['key', 'value']
    case 'FunctionExpression':
      return node.id ? ['id', 'params', 'body'] : ['params', 'body']
    case 'SequenceExpression':
      return 'expressions'
    case 'UpdateExpression':
    case 'UnaryExpression':
      return ['argument']

    case 'CallExpression':
    case 'NewExpression':
      return node.arguments ? ['callee', 'arguments'] : ['callee']

    case 'MemberExpression':
      return ['object', 'property']

    case 'SwitchCase':
      return node.consequent ? ['test', 'consequent'] : ['test']

    case 'CatchClause':
      return ['param', 'body']

    case 'DebuggerStatement':
    case 'ThisExpression':
    case 'Identifier':
    case 'Literal':
      return []
    case 'Property':
      return ['key', 'value']
  }

  if(node.kind === 'init') {
    return ['key', 'value']
  }

  console.log(node)
  return []
}

