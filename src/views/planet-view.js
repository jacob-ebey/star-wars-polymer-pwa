import { html, css } from "lit-element";
import { PageViewElement } from "../components/page-view-element.js";

import { connect } from "pwa-helpers/connect-mixin.js";
import { store } from "../store.js";

import "../tiny-graphql/graphql-query";
import gql from "../tiny-graphql/tag";
import { toRequestBody } from "../tiny-graphql/request";

import "../components/character-overview.js";
import "../components/film-overview.js";
import "../components/planet-details.js";
import "../components/planet-overview.js";
import { SharedStyles } from "../components/shared-styles.js";

import { planetPath } from "../actions/app";

const PlanetViewQuery = gql`
  query PlanetViewQuery($name: String) {
    Planet(name: $name) {
      ...PlanetDetails_planet
      ...PlanetOverview_planet
      residents(orderBy: name_ASC) {
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

class PlanetView extends connect(store)(PageViewElement) {
  static get properties() {
    return {
      _name: { type: String },
      _response: { type: Object }
    };
  }

  static get styles() {
    return [
      SharedStyles,
      css`
        .crawl-wrapper {
          max-height: 50vh;
        }
      `
    ];
  }

  render() {
    const hasPlanet =
      !!this._response && !!this._response.data && !!this._response.data.Planet;

    const planet = hasPlanet ? this._response.data.Planet : null;

    return html`
      <graphql-query
        id="PlanetViewQuery"
        .query=${PlanetViewQuery}
        .variables=${{ name: this._name }}
        @request=${this._handleRequest}
        @response=${this._handleResponse}
      >
        ${!hasPlanet
          ? html``
          : html`
              <section>
                <planet-overview header .planet=${planet}></planet-overview>
                <planet-details .planet=${planet}></planet-details>
              </section>

              ${!planet.residents || planet.residents.length <= 0
                ? html``
                : html`
                    <section>
                      <h2>Residents</h2>

                      <div class="split-list">
                        <div>
                          ${planet.residents
                            .slice(0, Math.ceil(planet.residents.length / 2))
                            .map(renderCharacter)}
                        </div>
                        <div>
                          ${planet.residents
                            .slice(Math.ceil(planet.residents.length / 2))
                            .map(renderCharacter)}
                        </div>
                      </div>
                    </section>
                  `}
              ${!planet.films || planet.films.length <= 0
                ? html``
                : html`
                    <section>
                      <h2>Films</h2>

                      <div class="split-list">
                        <div>
                          ${planet.films
                            .slice(0, Math.ceil(planet.films.length / 2))
                            .map(renderFilm)}
                        </div>
                        <div>
                          ${planet.films
                            .slice(Math.ceil(planet.films.length / 2))
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
    const match = planetPath.test(encodeURI(state.app.page));
    this._name = match && match.name;
  }
}

window.customElements.define("planet-view", PlanetView);
