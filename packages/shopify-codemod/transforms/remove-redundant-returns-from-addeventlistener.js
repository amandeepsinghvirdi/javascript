export default function removeAddEventListener(file, api) {
  const j = api.jscodeshift;
  return j(file.source)
    .find(j.CallExpression, {
      callee: {
        type: 'MemberExpression',
        property: {
          name: 'addEventListener',
        },
      },
    })
    .forEach((nodes) => {
      const functionExpression = nodes.value.arguments[1];
      const {body} = functionExpression.body;
      const lastStatement = body[body.length - 1];
      if (lastStatement.type === 'ReturnStatement') {
        if (lastStatement.argument === null) {
          body.pop();
        }
        body[body.length - 1] = j.expressionStatement(body[body.length - 1].argument);
      } else {
        return nodes;
      }
      return body;
    }
  )
  .toSource();
}
