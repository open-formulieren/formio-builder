/**
 * Custom ttypescript transform to strip out the SCSS imports from the ts -> js
 * compilation.
 */
import * as ts from 'typescript';

function transform<T extends ts.Node>(): ts.TransformerFactory<T> {
  return context => {
    const visit: ts.Visitor = node => {
      // Check for import declarations and filter out .scss files
      if (ts.isImportDeclaration(node)) {
        const moduleSpecifier = node.moduleSpecifier;
        if (ts.isStringLiteral(moduleSpecifier) && moduleSpecifier.text.endsWith('.scss')) {
          return undefined; // Remove the import declaration
        }
      }
      return ts.visitEachChild(node, child => visit(child), context);
    };
    return node => ts.visitNode(node, visit);
  };
}

export default transform;
