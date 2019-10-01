import { html, css } from "lit-element";
import { PageViewElement } from "../components/page-view-element.js";

import { connect } from "pwa-helpers/connect-mixin.js";
import { store } from "../store.js";

import "../tiny-graphql/graphql-query";
import gql from "../tiny-graphql/tag";
import { toRequestBody } from "../tiny-graphql/request";

import "../components/character-overview.js";
import "../components/delayed-loader.js";
import "../components/film-crawl.js";
import "../components/film-details.js";
import "../components/film-overview.js";
import "../components/planet-overview.js";
import "../components/starship-overview.js";
import "../components/vehicle-overview.js";
import { SharedStyles } from "../components/shared-styles.js";

import { moviePath } from "../actions/app";

const MovieViewQuery = gql`
  query MovieViewQuery($title: String) {
    Film(title: $title) {
      ...FilmCrawl_film
      ...FilmDetails_film
      ...FilmOverview_film
      characters(orderBy: name_ASC) {
        ...CharacterOverview_character
      }
      planets(orderBy: name_ASC) {
        ...PlanetOverview_planet
      }
      starships(orderBy: name_ASC) {
        ...StarshipOverview_starship
      }
      vehicles(orderBy: name_ASC) {
        ...VehicleOverview_vehicle
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

function renderPlanet(planet) {
  return html`
    <a href="/planets/${planet.name}">
      <planet-overview .planet=${planet}></planet-overview>
    </a>
  `;
}

function renderStarship(starship) {
  return html`
    <a href="/starships/${starship.name}">
      <starship-overview .starship=${starship}></starship-overview>
    </a>
  `;
}

function renderVehicle(vehicle) {
  return html`
    <a href="/vehicles/${vehicle.name}">
      <vehicle-overview .vehicle=${vehicle}></vehicle-overview>
    </a>
  `;
}

class MovieView extends connect(store)(PageViewElement) {
  static get properties() {
    return {
      _title: { type: String },
      _response: { type: Object }
    };
  }

  static get styles() {
    return [
      SharedStyles,
      css`
        .split-list {
          display: flex;
          flex-direction: column;
          justify-content: space-around;
        }

        .split-list > div {
          flex: 1;
        }

        .split-list > div > a {
          display: block;
          color: #000000;
          text-decoration: none;
        }

        .split-list > div > a:hover {
          text-decoration: underline;
        }

        .crawl-wrapper {
          max-height: 50vh;
        }

        @media (min-width: 460px) {
          .split-list > div {
            margin-left: 0.5rem;
          }
          .split-list > div:first-child {
            margin-left: 0;
          }
          .split-list {
            flex-direction: row;
          }
        }
      `
    ];
  }

  render() {
    const hasFilm =
      !!this._response && !!this._response.data && !!this._response.data.Film;

    const film = hasFilm ? this._response.data.Film : null;

    return html`
      <graphql-query
        id="MovieViewQuery"
        .query=${MovieViewQuery}
        .variables=${{ title: this._title }}
        @request=${this._handleRequest}
        @response=${this._handleResponse}
      >
        ${!hasFilm
          ? html``
          : html`
              <film-crawl .film=${film}></film-crawl>

              <section>
                <film-overview .film=${film}></film-overview>
                <film-details .film=${film}></film-details>
              </section>

              ${!film.planets
                ? html``
                : html`
                    <section>
                      <h2>Planets</h2>

                      <div class="split-list">
                        <div>
                          ${film.planets
                            .slice(0, Math.ceil(film.planets.length / 2))
                            .map(renderPlanet)}
                        </div>
                        <div>
                          ${film.planets
                            .slice(Math.ceil(film.planets.length / 2))
                            .map(renderPlanet)}
                        </div>
                      </div>
                    </section>
                  `}
              ${!film.characters
                ? html``
                : html`
                    <section>
                      <h2>Characters</h2>

                      <div class="split-list">
                        <div>
                          ${film.characters
                            .slice(0, Math.ceil(film.characters.length / 2))
                            .map(renderCharacter)}
                        </div>
                        <div>
                          ${film.characters
                            .slice(Math.ceil(film.characters.length / 2))
                            .map(renderCharacter)}
                        </div>
                      </div>
                    </section>
                  `}
              ${!film.starships || film.starships.length <= 0
                ? html``
                : html`
                    <section>
                      <h2>Starships</h2>

                      <div class="split-list">
                        <div>
                          ${film.starships
                            .slice(0, Math.ceil(film.starships.length / 2))
                            .map(renderStarship)}
                        </div>
                        <div>
                          ${film.starships
                            .slice(Math.ceil(film.starships.length / 2))
                            .map(renderStarship)}
                        </div>
                      </div>
                    </section>
                  `}
              ${!film.vehicles || film.vehicles.length <= 0
                ? html``
                : html`
                    <section>
                      <h2>Vehicles</h2>

                      <div class="split-list">
                        <div>
                          ${film.vehicles
                            .slice(0, Math.ceil(film.vehicles.length / 2))
                            .map(renderVehicle)}
                        </div>
                        <div>
                          ${film.vehicles
                            .slice(Math.ceil(film.vehicles.length / 2))
                            .map(renderVehicle)}
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
    const match = moviePath.test(encodeURI(state.app.page));
    this._title = match && match.title;
  }
}

window.customElements.define("movie-view", MovieView);
