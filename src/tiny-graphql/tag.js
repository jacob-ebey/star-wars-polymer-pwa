import { print } from "./graphql/language/printer";

export default function gql(templates, ...variables) {
  return templates.reduce(
    (p, template, i) =>
      p +
      template +
      (typeof variables[i] === "object"
        ? print(variables[i])
        : variables[i] || ""),
    ""
  );
}
