import { html, css } from "lit-element";
import { PageViewElement } from "../components/page-view-element.js";

import { connect } from "pwa-helpers/connect-mixin.js";
import { store } from "../store.js";

import "../tiny-graphql/graphql-query";
import gql from "../tiny-graphql/tag";
import { toRequestBody } from "../tiny-graphql/request";

import "../components/vehicle-overview.js";
import { SharedStyles } from "../components/shared-styles.js";

const VehiclesViewQuery = gql`
  query VehiclesViewQuery($skip: Int) {
    allVehicles(orderBy: name_ASC, first: 22, skip: $skip) {
      ...VehicleOverview_vehicle
    }
    _allVehiclesMeta {
      count
    }
  }
`;

function renderVehicle(vehicle) {
  return html`
    <a href="/vehicles/${vehicle.name}">
      <vehicle-overview .vehicle=${vehicle}></vehicle-overview>
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

class VehiclesView extends connect(store)(PageViewElement) {
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
    const hasVehicles =
      !!this._response &&
      !!this._response.data &&
      !!this._response.data.allVehicles;

    const vehicles = hasVehicles ? this._response.data.allVehicles : [];

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
      (hasVehicles &&
        this._response.data._allVehiclesMeta &&
        this._response.data._allVehiclesMeta.count) ||
      0;

    return html`
      <graphql-query
        id="VehiclesViewQuery"
        .query=${VehiclesViewQuery}
        .variables=${{ skip: (parsedPage - 1) * 22 }}
        .skipquery="${page === false}"
        @request=${this._handleRequest}
        @response=${this._handleResponse}
      >
        <section>
          <h1>Vehicles</h1>
        </section>

        ${!hasVehicles
          ? html``
          : html`
              <section>
                <div class="split-list">
                  <div>
                    ${vehicles
                      .slice(0, Math.ceil(vehicles.length / 2))
                      .map(renderVehicle)}
                  </div>
                  <div>
                    ${vehicles
                      .slice(Math.ceil(vehicles.length / 2))
                      .map(renderVehicle)}
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
                          href="/vehicles?page=${parsedPage - 1}"
                          >Previous</a
                        >
                      `}
                  ${parsedPage * 22 >= total
                    ? html``
                    : html`
                        <a
                          class="page-button"
                          href="/vehicles?page=${parsedPage + 1}"
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

window.customElements.define("vehicles-view", VehiclesView);
