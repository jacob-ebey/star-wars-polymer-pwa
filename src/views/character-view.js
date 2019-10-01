import { html, css } from "lit-element";
import { PageViewElement } from "../components/page-view-element.js";

import { connect } from "pwa-helpers/connect-mixin.js";
import { store } from "../store.js";

import "../tiny-graphql/graphql-query";
import gql from "../tiny-graphql/tag";
import { toRequestBody } from "../tiny-graphql/request";

import "../components/character-details.js";
import "../components/character-overview.js";
import "../components/film-overview.js";
import "../components/planet-overview.js";
import "../components/starship-overview.js";
import "../components/vehicle-overview.js";
import { SharedStyles } from "../components/shared-styles.js";

import { characterPath } from "../actions/app";

const CharacterViewQuery = gql`
  query CharacterViewQuery($name: String) {
    Person(name: $name) {
      ...CharacterDetails_character
      ...CharacterOverview_character
      homeworld {
        ...PlanetOverview_planet
      }
      starships(orderBy: name_ASC) {
        ...StarshipOverview_starship
      }
      vehicles(orderBy: name_ASC) {
        ...VehicleOverview_vehicle
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

function renderPlanet(planet) {
  return html`
    <a href="/planet/${planet.name}">
      <planet-overview .planet=${planet}></planet-overview>
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

class CharacterView extends connect(store)(PageViewElement) {
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
    const hasCharacter =
      !!this._response && !!this._response.data && !!this._response.data.Person;

    const character = hasCharacter ? this._response.data.Person : null;

    return html`
      <graphql-query
        id="CharacterViewQuery"
        .query=${CharacterViewQuery}
        .variables=${{ name: this._name }}
        @request=${this._handleRequest}
        @response=${this._handleResponse}
      >
        ${!hasCharacter
          ? html``
          : html`
              <section>
                <character-overview
                  header
                  .character=${character}
                ></character-overview>

                <character-details .character=${character}></character-details>
              </section>

              ${!character.homeworld
                ? html``
                : html`
                    <section>
                      <h2>Homeworld</h2>
                      <a
                        class="list-card"
                        href="/planets/${character.homeworld.name}"
                      >
                        <planet-overview
                          .planet=${character.homeworld}
                        ></planet-overview>
                      </a>
                    </section>
                  `}
              ${!character.starships || character.starships.length <= 0
                ? html``
                : html`
                    <section>
                      <h2>Starships</h2>
                      ${character.starships.map(
                        starship => html`
                          <a
                            class="list-card"
                            href="/starships/${starship.name}"
                          >
                            <starship-overview
                              .starship=${starship}
                            ></starship-overview>
                          </a>
                        `
                      )}
                    </section>
                  `}
              ${!character.vehicles || character.vehicles.length <= 0
                ? html``
                : html`
                    <section>
                      <h2>Vehicles</h2>
                      ${character.vehicles.map(
                        vehicle => html`
                          <a class="list-card" href="/vehicles/${vehicle.name}">
                            <vehicle-overview
                              .vehicle=${vehicle}
                            ></vehicle-overview>
                          </a>
                        `
                      )}
                    </section>
                  `}
              ${!character.films || character.films.length <= 0
                ? html``
                : html`
                    <section>
                      <h2>Films</h2>

                      <div class="split-list">
                        <div>
                          ${character.films
                            .slice(0, Math.ceil(character.films.length / 2))
                            .map(renderFilm)}
                        </div>
                        <div>
                          ${character.films
                            .slice(Math.ceil(character.films.length / 2))
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
    const match = characterPath.test(encodeURI(state.app.page));
    this._name = match && match.name;
  }
}

window.customElements.define("character-view", CharacterView);
