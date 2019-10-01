import { parse } from "./graphql/language/parser";

const registeries = new Map();
const defaultKey = "";

export default function registerFragment(
  fragmentDefinition,
  cacheKey = undefined
) {
  const key = cacheKey || defaultKey;
  let registry = registeries.get(key);

  if (!registry) {
    registry = new Map();
    registeries.set(key, registry);
  }

  const parsed =
    typeof fragmentDefinition === "string"
      ? parse(fragmentDefinition)
      : fragmentDefinition;

  if (!parsed || !parsed.definitions || parsed.definitions.length !== 1) {
    throw new Error(
      `Input fragment must contain a single fragment definition.`
    );
  }

  if (parsed.definitions[0].kind !== "FragmentDefinition") {
    throw new Error(
      `Input fragment contains a "${parsed.definitions[0].kind}", but must be a "FragmentDefinition".`
    );
  }

  const fragment = parsed.definitions[0];

  if (registry.has(fragment.name.value)) {
    throw new Error(`Can not re-register fragment ${fragment.name.value}.`);
  }

  registry.set(fragment.name.value, fragment);
}

export function getFragment(fragmentName, cacheKey = undefined) {
  const registry = registeries.get(cacheKey || defaultKey);
  return registry && registry.get(fragmentName);
}
