import { LitElement, html, css } from "lit-element";

import gql from "../tiny-graphql/tag";
import registerFragment from "../tiny-graphql/register-fragment.js";

class VehicleOverview extends LitElement {
  static get properties() {
    return {
      vehicle: { type: Object },
      header: { type: Boolean }
    };
  }

  static get styles() {
    return [
      css`
        :host {
          display: block;
          box-sizing: border-box;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }
      `
    ];
  }

  render() {
    return !this.vehicle
      ? html``
      : html`
          ${this.header
            ? html`
                <h1>
                  ${this.vehicle.name}
                </h1>
              `
            : html`
                <h3>
                  ${this.vehicle.name}
                </h3>
              `}
          <p>
            Manufacturer:
            <small>
              ${this.vehicle.manufacturer &&
              this.vehicle.manufacturer.length > 0
                ? this.vehicle.manufacturer.join(", ")
                : "unknown"}
            </small>
          </p>
        `;
  }
}

registerFragment(gql`
  fragment VehicleOverview_vehicle on Vehicle {
    name
    manufacturer
  }
`);

window.customElements.define("vehicle-overview", VehicleOverview);
