import { LitElement, html, css } from "lit-element";

import gql from "../tiny-graphql/tag";
import registerFragment from "../tiny-graphql/register-fragment.js";

class CharacterOverview extends LitElement {
  static get properties() {
    return {
      character: { type: Object },
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
    return !this.character
      ? html``
      : html`
          ${this.header
            ? html`
                <h1>
                  ${this.character.name}
                </h1>
              `
            : html`
                <h3>
                  ${this.character.name}
                </h3>
              `}
          <p>
            Species:
            <small>
              ${this.character.species && this.character.species.length > 0
                ? this.character.species.map(s => s.name).join(", ")
                : "unknown"}
            </small>
          </p>
        `;
  }
}

registerFragment(gql`
  fragment CharacterOverview_character on Person {
    name
    species {
      name
    }
  }
`);

window.customElements.define("character-overview", CharacterOverview);
