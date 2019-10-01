import { html, css } from "lit-element";
import { PageViewElement } from "../components/page-view-element.js";

import "../tiny-graphql/graphql-query";
import gql from "../tiny-graphql/tag";
import { toRequestBody } from "../tiny-graphql/request";

import "../components/delayed-loader.js";
import "../components/film-overview.js";
import { SharedStyles } from "../components/shared-styles.js";

const MoviesViewQuery = gql`
  query MoviesViewQuery {
    allFilms(orderBy: episodeId_ASC) {
      ...FilmOverview_film
    }
  }
`;

class MoviesView extends PageViewElement {
  static get properties() {
    return {
      _response: { type: Object }
    };
  }

  static get styles() {
    return [
      SharedStyles,
      css`
        .episode-overview {
          position: relative;
          display: block;
          color: #000000;
          text-decoration: none;
        }

        .episode-overview::before,
        .episode-overview::after {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          transform: scale3d(0, 0, 1);
          transition: transform 0.3s ease-out 0s;
          background: rgba(255, 255, 255, 0.1);
          content: "";
          pointer-events: none;
        }
        .episode-overview::before {
          transform-origin: left top;
        }
        .episode-overview::after {
          transform-origin: right bottom;
        }
        .episode-overview:hover::before,
        .episode-overview:hover::after,
        .episode-overview:focus::before,
        .episode-overview:focus::after {
          transform: scale3d(1, 1, 1);
        }
      `
    ];
  }

  render() {
    const hasFilms =
      !!this._response &&
      !!this._response.data &&
      !!this._response.data.allFilms;

    const films = hasFilms ? this._response.data.allFilms : [];

    return html`
      <graphql-query
        id="MoviesViewQuery"
        .query=${MoviesViewQuery}
        @request=${this._handleRequest}
        @response=${this._handleResponse}
      >
        <section>
          <h1>Movies</h1>
        </section>

        ${!hasFilms
          ? html``
          : html`
              <section>
                ${films.map(
                  (film, i) => html`
                    <a class="episode-overview" href="/movies/${film.title}">
                      <film-overview .film=${film}></film-overview>
                    </a>
                    ${i === films.length - 1
                      ? html``
                      : html`
                          <hr class="list-spacer" />
                        `}
                  `
                )}
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
}

window.customElements.define("movies-view", MoviesView);
