import { LitElement, html, css } from "lit-element";

import gql from "../tiny-graphql/tag";
import registerFragment from "../tiny-graphql/register-fragment.js";

class StarshipOverview extends LitElement {
  static get properties() {
    return {
      starship: { type: Object },
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
    return !this.starship
      ? html``
      : html`
          ${this.header
            ? html`
                <h1>
                  ${this.starship.name}
                </h1>
              `
            : html`
                <h3>
                  ${this.starship.name}
                </h3>
              `}
          <p>
            Manufacturer:
            <small>
              ${this.starship.manufacturer &&
              this.starship.manufacturer.length > 0
                ? this.starship.manufacturer.join(", ")
                : "unknown"}
            </small>
          </p>
        `;
  }
}

registerFragment(gql`
  fragment StarshipOverview_starship on Starship {
    name
    manufacturer
  }
`);

window.customElements.define("starship-overview", StarshipOverview);
