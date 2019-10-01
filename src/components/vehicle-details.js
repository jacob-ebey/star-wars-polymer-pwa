import { LitElement, html, css } from "lit-element";

import gql from "../tiny-graphql/tag";
import registerFragment from "../tiny-graphql/register-fragment.js";

class VehicleDetails extends LitElement {
  static get properties() {
    return {
      vehicle: { type: Object }
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
          <div>
            ${!this.vehicle.model
              ? html``
              : html`
                  <p>Model: <small>${this.vehicle.model}</small></p>
                `}
            <div>
              ${!this.vehicle.class
                ? html``
                : html`
                    <p>Class: <small>${this.vehicle.class}</small></p>
                  `}
              ${!this.vehicle.cargoCapacity
                ? html``
                : html`
                    <p>
                      Cargo capacity:
                      <small>${this.vehicle.cargoCapacity}</small>
                      kg
                    </p>
                  `}
              ${!this.vehicle.consumables
                ? html``
                : html`
                    <p>
                      Consumables:
                      <small>${this.vehicle.consumables}</small>
                    </p>
                  `}
              ${!this.vehicle.costInCredits
                ? html``
                : html`
                    <p>
                      Cost:
                      <small>${this.vehicle.costInCredits} credits</small>
                    </p>
                  `}
              ${!this.vehicle.crew
                ? html``
                : html`
                    <p>
                      Minimum crew:
                      <small>${this.vehicle.crew}</small>
                    </p>
                  `}
              ${!this.vehicle.length
                ? html``
                : html`
                    <p>
                      Ship length:
                      <small>${this.vehicle.length} meters</small>
                    </p>
                  `}
              ${!this.vehicle.maxAtmospheringSpeed
                ? html``
                : html`
                    <p>
                      Max atmosphering speed:
                      <small>${this.vehicle.maxAtmospheringSpeed} kph</small>
                    </p>
                  `}
              ${!this.vehicle.passengers
                ? html``
                : html`
                    <p>
                      Max passengers:
                      <small>
                        ${this.vehicle.passengers} people
                      </small>
                    </p>
                  `}
            </div>
          </div>
        `;
  }
}

registerFragment(gql`
  fragment VehicleDetails_vehicle on Vehicle {
    model
    cargoCapacity
    class
    consumables
    costInCredits
    crew
    length
    maxAtmospheringSpeed
    passengers
  }
`);

window.customElements.define("vehicle-details", VehicleDetails);
