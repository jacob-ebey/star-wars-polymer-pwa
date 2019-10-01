import { LitElement, html } from "lit-element";

import { toRequestBody, getRequest } from "../tiny-graphql/request";

import "@polymer/iron-ajax/iron-ajax.js";
import "../components/delayed-loader";

class GraphQLQuery extends LitElement {
  static get properties() {
    return {
      id: { type: String },
      query: { type: Object },
      variables: { type: Object },
      bubbles: { type: Boolean, value: false },
      method: { type: String },
      debounce: { type: Number },
      skipquery: { type: Boolean },
      _reloadCount: { type: Number },
      _response: { type: Object },
      _loading: { type: Boolean }
    };
  }

  constructor() {
    super();

    this._reloadCount = 0;
  }

  render() {
    const method = this.method || "POST";

    return this.skipquery
      ? html``
      : html`
          <iron-ajax
            .auto=${!this.skipquery}
            id=${this.id}
            method=${method}
            headers='{ "Content-Type": "application/json" }'
            url="https://swapi.graph.cool/"
            params="${JSON.stringify({
              retry: this._reloadCount,
              ...(method === "GET"
                ? getRequest({
                    query: this.query,
                    variables: this.variables
                  })
                : {})
            })}"
            body="${method === "POST"
              ? toRequestBody({
                  query: this.query,
                  variables: this.variables
                })
              : undefined}"
            handle-as="json"
            debounce-duration=${!this._loading ? this.debounce || 0 : 3000}
            @request=${this._handleRequest}
            @response=${this._handleResponse}
            @error=${this._handleError}
          >
          </iron-ajax>

          <delayed-loader .loading=${this._loading}>
            <slot></slot>
          </delayed-loader>
        `;
  }

  _handleRequest(event) {
    event.preventDefault();
    event.stopPropagation();

    this._loading = true;

    this.dispatchEvent(new CustomEvent("request"));
  }

  _handleResponse(event) {
    event.preventDefault();
    event.stopPropagation();

    this._loading = false;
    this._response = event.detail.response;

    this.dispatchEvent(
      new CustomEvent("response", {
        detail: { response: event.detail.response }
      })
    );
  }

  _handleError(event) {
    console.error("A critical error has occured.");
  }

  reload(variables = undefined) {
    if (this._loading) {
      return;
    }

    if (variables) {
      this.variables = variables;
    }

    this._reloadCount += 1;
  }
}

window.customElements.define("graphql-query", GraphQLQuery);
