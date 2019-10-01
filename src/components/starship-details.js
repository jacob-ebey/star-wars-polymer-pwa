import { LitElement, html, css } from "lit-element";

import gql from "../tiny-graphql/tag";
import registerFragment from "../tiny-graphql/register-fragment.js";

class StarshipDetails extends LitElement {
  static get properties() {
    return {
      starship: { type: Object }
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
    return !this.starship
      ? html``
      : html`
          <div>
            ${!this.starship.class
              ? html``
              : html`
                  <p>Class: <small>${this.starship.class}</small></p>
                `}
            ${!this.starship.cargoCapacity
              ? html``
              : html`
                  <p>
                    Cargo capacity:
                    <small>${this.starship.cargoCapacity}</small>
                    kg
                  </p>
                `}
            ${!this.starship.consumables
              ? html``
              : html`
                  <p>
                    Consumables:
                    <small>${this.starship.consumables}</small>
                  </p>
                `}
            ${!this.starship.costInCredits
              ? html``
              : html`
                  <p>
                    Cost:
                    <small>${this.starship.costInCredits} credits</small>
                  </p>
                `}
            ${!this.starship.crew
              ? html``
              : html`
                  <p>
                    Minimum crew:
                    <small>${this.starship.crew}</small>
                  </p>
                `}
            ${!this.starship.hyperdriveRating
              ? html``
              : html`
                  <p>
                    Hyperdrive rating:
                    <small>${this.starship.hyperdriveRating}</small>
                  </p>
                `}
            ${!this.starship.length
              ? html``
              : html`
                  <p>
                    Ship length:
                    <small>${this.starship.length} meters</small>
                  </p>
                `}
            ${!this.starship.maxAtmospheringSpeed
              ? html``
              : html`
                  <p>
                    Max atmosphering speed:
                    <small>${this.starship.maxAtmospheringSpeed} kph</small>
                  </p>
                `}
            ${!this.starship.mglt
              ? html``
              : html`
                  <p>
                    Max speed:
                    <small>
                      ${this.starship.maxAtmospheringSpeed} megalights /
                      standard hour
                    </small>
                  </p>
                `}
            ${!this.starship.passengers
              ? html``
              : html`
                  <p>
                    Max passengers:
                    <small>
                      ${this.starship.passengers} people
                    </small>
                  </p>
                `}
          </div>
        `;
  }
}

registerFragment(gql`
  fragment StarshipDetails_starship on Starship {
    cargoCapacity
    class
    consumables
    costInCredits
    crew
    hyperdriveRating
    length
    maxAtmospheringSpeed
    mglt
    passengers
  }
`);

window.customElements.define("starship-details", StarshipDetails);
