import { html, css } from "lit-element";
import { PageViewElement } from "../components/page-view-element.js";

import { connect } from "pwa-helpers/connect-mixin.js";
import { store } from "../store.js";

import "../tiny-graphql/graphql-query";
import gql from "../tiny-graphql/tag";
import { toRequestBody } from "../tiny-graphql/request";

import "../components/character-overview.js";
import "../components/film-overview.js";
import "../components/starship-details.js";
import "../components/starship-overview.js";
import { SharedStyles } from "../components/shared-styles.js";

import { starshipPath } from "../actions/app";

const StarshipViewQuery = gql`
  query StarshipViewQuery($name: String) {
    Starship(name: $name) {
      ...StarshipDetails_starship
      ...StarshipOverview_starship
      pilots(orderBy: name_ASC) {
        ...CharacterOverview_character
      }
      films(orderBy: title_ASC) {
        ...FilmOverview_film
      }
    }
  }
`;

function renderCharacter(character) {
  return html`
    <a href="/characters/${character.name}">
      <character-overview .character=${character}></character-overview>
    </a>
  `;
}

function renderFilm(film) {
  return html`
    <a href="/movies/${film.title}">
      <film-overview small .film=${film}></film-overview>
    </a>
  `;
}

class StarshipView extends connect(store)(PageViewElement) {
  static get properties() {
    return {
      _name: { type: String },
      _response: { type: Object }
    };
  }

  static get styles() {
    return [SharedStyles];
  }

  render() {
    const hasStarship =
      !!this._response &&
      !!this._response.data &&
      !!this._response.data.Starship;

    const starship = hasStarship ? this._response.data.Starship : null;

    return html`
      <graphql-query
        id="StarshipViewQuery"
        .query=${StarshipViewQuery}
        .variables=${{ name: this._name }}
        @request=${this._handleRequest}
        @response=${this._handleResponse}
      >
        ${!hasStarship
          ? html``
          : html`
              <section>
                <starship-overview
                  header
                  .starship=${starship}
                ></starship-overview>
                <starship-details .starship=${starship}></starship-details>
              </section>
              ${!starship.pilots || starship.pilots.length <= 0
                ? html``
                : html`
                    <section>
                      <h2>Pilots</h2>

                      <div class="split-list">
                        <div>
                          ${starship.pilots
                            .slice(0, Math.ceil(starship.pilots.length / 2))
                            .map(renderCharacter)}
                        </div>
                        <div>
                          ${starship.pilots
                            .slice(Math.ceil(starship.pilots.length / 2))
                            .map(renderCharacter)}
                        </div>
                      </div>
                    </section>
                  `}
              ${!starship.films || starship.films.length <= 0
                ? html``
                : html`
                    <section>
                      <h2>Films</h2>

                      <div class="split-list">
                        <div>
                          ${starship.films
                            .slice(0, Math.ceil(starship.films.length / 2))
                            .map(renderFilm)}
                        </div>
                        <div>
                          ${starship.films
                            .slice(Math.ceil(starship.films.length / 2))
                            .map(renderFilm)}
                        </div>
                      </div>
                    </section>
                  `}
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
    const match = starshipPath.test(encodeURI(state.app.page));
    this._name = match && match.name;
  }
}

window.customElements.define("starship-view", StarshipView);
