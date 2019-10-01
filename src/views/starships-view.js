import { html, css } from "lit-element";
import { PageViewElement } from "../components/page-view-element.js";

import { connect } from "pwa-helpers/connect-mixin.js";
import { store } from "../store.js";

import "../tiny-graphql/graphql-query";
import gql from "../tiny-graphql/tag";
import { toRequestBody } from "../tiny-graphql/request";

import "../components/starship-overview.js";
import { SharedStyles } from "../components/shared-styles.js";

const StarshipsViewQuery = gql`
  query StarshipsViewQuery($skip: Int) {
    allStarships(orderBy: name_ASC, first: 22, skip: $skip) {
      ...StarshipOverview_starship
    }
    _allStarshipsMeta {
      count
    }
  }
`;

function renderStarship(starship) {
  return html`
    <a href="/starships/${starship.name}">
      <starship-overview .starship=${starship}></starship-overview>
    </a>
  `;
}

function getUrlParameter(name) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
  var results = regex.exec(location.search);
  return results === null
    ? ""
    : decodeURIComponent(results[1].replace(/\+/g, " "));
}

class StarshipsView extends connect(store)(PageViewElement) {
  static get properties() {
    return {
      _response: { type: Object },
      _page: { type: Number }
    };
  }

  static get styles() {
    return [
      SharedStyles,
      css`
        .page-buttons {
          display: flex;
          justify-content: flex-end;
        }

        .page-button {
          display: inline-block;
          color: var(--app-header-text-color);
          text-decoration: none;
          line-height: 30px;
          padding: 0.25rem 0;
          margin: 0 0.25rem;
          border: 2px solid var(--app-secondary-color);
          font-weight: 700;
          color: var(--app-secondary-color);
          width: 100px;
          text-align: center;
        }

        .page-button:last-child {
          margin-right: 0;
          color: var(--app-primary-color);
          border: 2px solid var(--app-primary-color);
        }
      `
    ];
  }

  render() {
    const hasStarships =
      !!this._response &&
      !!this._response.data &&
      !!this._response.data.allStarships;

    const starships = hasStarships ? this._response.data.allStarships : [];

    const parsedPage = this._page && Number.parseInt(this._page);
    const page =
      typeof parsedPage !== "number"
        ? false
        : Number.isSafeInteger(parsedPage)
        ? parsedPage > 0
          ? parsedPage
          : 1
        : 1;

    const total =
      (hasStarships &&
        this._response.data._allStarshipsMeta &&
        this._response.data._allStarshipsMeta.count) ||
      0;

    return html`
      <graphql-query
        id="StarshipsViewQuery"
        .query=${StarshipsViewQuery}
        .variables=${{ skip: (parsedPage - 1) * 22 }}
        .skipquery="${page === false}"
        @request=${this._handleRequest}
        @response=${this._handleResponse}
      >
        <section>
          <h1>Starships</h1>
        </section>

        ${!hasStarships
          ? html``
          : html`
              <section>
                <div class="split-list">
                  <div>
                    ${starships
                      .slice(0, Math.ceil(starships.length / 2))
                      .map(renderStarship)}
                  </div>
                  <div>
                    ${starships
                      .slice(Math.ceil(starships.length / 2))
                      .map(renderStarship)}
                  </div>
                </div>
              </section>

              <section>
                <div class="page-buttons">
                  ${parsedPage <= 1
                    ? html``
                    : html`
                        <a
                          class="page-button"
                          href="/starships?page=${parsedPage - 1}"
                          >Previous</a
                        >
                      `}
                  ${parsedPage * 22 >= total
                    ? html``
                    : html`
                        <a
                          class="page-button"
                          href="/starships?page=${parsedPage + 1}"
                          >Next</a
                        >
                      `}
                </div>
              </section>
            `}
      </graphql-query>
    `;
  }

  _handleRequest() {
    this._response = undefined;
  }

  _handleResponse(event) {
    this._response = event.detail.response;
  }

  stateChanged(state) {
    this._page = getUrlParameter("page") || "1";
  }
}

window.customElements.define("starships-view", StarshipsView);
