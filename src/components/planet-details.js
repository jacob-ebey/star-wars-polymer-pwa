import { LitElement, html, css } from "lit-element";

import gql from "../tiny-graphql/tag";
import registerFragment from "../tiny-graphql/register-fragment.js";

class PlanetDetails extends LitElement {
  static get properties() {
    return {
      planet: { type: Object }
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
    return !this.planet
      ? html``
      : html`
          <div>
            ${!this.planet.population
              ? html``
              : html`
                  <p>Population: <small>${this.planet.population}</small></p>
                `}
            ${!this.planet.climate
              ? html``
              : html`
                  <p>Climate: <small>${this.planet.climate}</small></p>
                `}
            ${!this.planet.surfaceWater
              ? html``
              : html`
                  <p>
                    Surface water coverage: <small>${this.planet.surfaceWater}%</small>
                  </p>
                `}
            ${!this.planet.diameter
              ? html``
              : html`
                  <p>Diameter: <small>${this.planet.diameter} km</small></p>
                `}
            ${!this.planet.rotationPeriod
              ? html``
              : html`
                  <p>
                    Rotation period:
                    <small>${this.planet.rotationPeriod} days</small>
                  </p>
                `}
            ${!this.planet.orbitalPeriod
              ? html``
              : html`
                  <p>
                    Orbital period:
                    <small>${this.planet.orbitalPeriod} days</small>
                  </p>
                `}
            ${!this.planet.gravity
              ? html``
              : html`
                  <p>
                    Gravity:
                    <small>${this.planet.gravity}</small>
                  </p>
                `}
          </div>
        `;
  }
}

registerFragment(gql`
  fragment PlanetDetails_planet on Planet {
    population
    climate
    surfaceWater
    diameter
    rotationPeriod
    orbitalPeriod
    gravity
  }
`);

window.customElements.define("planet-details", PlanetDetails);
