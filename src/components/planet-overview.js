import { LitElement, html, css } from "lit-element";

import gql from "../tiny-graphql/tag";
import registerFragment from "../tiny-graphql/register-fragment.js";

class PlanetOverview extends LitElement {
  static get properties() {
    return {
      planet: { type: Object },
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
    return !this.planet
      ? html``
      : html`
          ${this.header
            ? html`
                <h1>
                  ${this.planet.name}
                </h1>
              `
            : html`
                <h3>
                  ${this.planet.name}
                </h3>
              `}
          <p>
            Terrain:
            <small>
              ${this.planet.terrain && this.planet.terrain.length > 0
                ? this.planet.terrain.join(", ")
                : "unknown"}
            </small>
          </p>
        `;
  }
}

registerFragment(gql`
  fragment PlanetOverview_planet on Planet {
    name
    terrain
  }
`);

window.customElements.define("planet-overview", PlanetOverview);
