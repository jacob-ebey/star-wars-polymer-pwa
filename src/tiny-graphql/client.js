import fetch from 'unfetch/dist/unfetch.mjs';

export function createClient(options) {
  return {
    cache: options.cache,
    execute: async (
      executeOptions
    ) => {
      return ((options.cache &&
        !executeOptions.skipCache &&
        (await options.cache.read({
          query: executeOptions.query,
          variables: executeOptions.variables
        }))) ||
        (options.fetch || fetch)(options.url, {
          body: JSON.stringify({
            query: executeOptions.query,
            variables: executeOptions.variables
          }),
          headers: {
            ...(options.headers || {}),
            ...(executeOptions.headers || {}),
            'Content-Type': 'application/json'
          },
          method: 'POST'
        })
          .then(res => res.json())
          .then(
            json =>
              new Promise((resolve, reject) => {
                // tslint:disable-next-line: no-if-statement
                if (options.cache && json) {
                  // tslint:disable-next-line: no-expression-statement
                  options.cache
                    .write(
                      {
                        query: executeOptions.query,
                        variables: executeOptions.variables
                      },
                      json
                    )
                    .then(() => resolve(json))
                    .catch(reject);
                } else {
                  // tslint:disable-next-line: no-expression-statement
                  resolve(json);
                }
              })
          ));
    }
  };
}
