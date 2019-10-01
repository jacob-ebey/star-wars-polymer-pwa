import { html, css } from "lit-element";
import { PageViewElement } from "../components/page-view-element.js";

import { connect } from "pwa-helpers/connect-mixin.js";
import { store } from "../store.js";

import "../tiny-graphql/graphql-query";
import gql from "../tiny-graphql/tag";
import { toRequestBody } from "../tiny-graphql/request";

import "../components/character-overview.js";
import "../components/film-overview.js";
import "../components/vehicle-details.js";
import "../components/vehicle-overview.js";
import { SharedStyles } from "../components/shared-styles.js";

import { vehiclePath } from "../actions/app";

const VehicleViewQuery = gql`
  query VehicleViewQuery($name: String) {
    Vehicle(name: $name) {
      ...VehicleDetails_vehicle
      ...VehicleOverview_vehicle
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

class VehicleView extends connect(store)(PageViewElement) {
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
    const hasVehicle =
      !!this._response &&
      !!this._response.data &&
      !!this._response.data.Vehicle;

    const vehicle = hasVehicle ? this._response.data.Vehicle : null;

    return html`
      <graphql-query
        id="VehicleViewQuery"
        .query=${VehicleViewQuery}
        .variables=${{ name: this._name }}
        @request=${this._handleRequest}
        @response=${this._handleResponse}
      >
        ${!hasVehicle
          ? html``
          : html`
              <section>
                <vehicle-overview
                  header
                  .vehicle=${vehicle}
                ></vehicle-overview>
                <vehicle-details .vehicle=${vehicle}></vehicle-details>
              </section>
              ${!vehicle.pilots || vehicle.pilots.length <= 0
                ? html``
                : html`
                    <section>
                      <h2>Pilots</h2>

                      <div class="split-list">
                        <div>
                          ${vehicle.pilots
                            .slice(0, Math.ceil(vehicle.pilots.length / 2))
                            .map(renderCharacter)}
                        </div>
                        <div>
                          ${vehicle.pilots
                            .slice(Math.ceil(vehicle.pilots.length / 2))
                            .map(renderCharacter)}
                        </div>
                      </div>
                    </section>
                  `}
              ${!vehicle.films || vehicle.films.length <= 0
                ? html``
                : html`
                    <section>
                      <h2>Films</h2>

                      <div class="split-list">
                        <div>
                          ${vehicle.films
                            .slice(0, Math.ceil(vehicle.films.length / 2))
                            .map(renderFilm)}
                        </div>
                        <div>
                          ${vehicle.films
                            .slice(Math.ceil(vehicle.films.length / 2))
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
    const match = vehiclePath.test(encodeURI(state.app.page));
    this._name = match && match.name;
  }
}

window.customElements.define("vehicle-view", VehicleView);
