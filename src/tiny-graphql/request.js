import { parse } from "./graphql/language/parser";
import { print } from "./graphql/language/printer";
import { getFragment } from "./register-fragment";

function getFragmentSpreadsRecursive(selectionSet, results = []) {
  if (selectionSet && selectionSet.selections) {
    selectionSet.selections.forEach(selection => {
      if (selection.kind === "FragmentSpread") {
        results.push(selection.name.value);
      } else if (selection.selectionSet) {
        getFragmentSpreadsRecursive(selection.selectionSet, results);
      }
    });
  }

  return results;
}

export function getRequest({ query, variables, cacheKey }) {
  const parsed = typeof query === "string" ? parse(query) : { ...query };

  const definitions =
    parsed &&
    parsed.definitions &&
    parsed.definitions.filter(d => d.kind === "OperationDefinition");

  if (!definitions || definitions.length !== 1) {
    throw new Error(`Input query must contain a single OperationDefinition.`);
  }

  const definition = definitions[0];

  const spreads = getFragmentSpreadsRecursive(definition.selectionSet).filter(
    (v, i, a) => a.indexOf(v) === i
  );

  spreads.forEach(spread => {
    const fragment = getFragment(spread);

    if (!fragment) {
      throw new Error(`Fragment "${spread}" is not registered.`);
    }

    parsed.definitions.push(fragment);
  });

  return { query: print(parsed), variables };
}

export function toRequestBody({ query, variables, cacheKey }) {
  return JSON.stringify(getRequest({ query, variables, cacheKey }));
}
