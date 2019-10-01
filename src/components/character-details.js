import { LitElement, html, css } from "lit-element";

import gql from "../tiny-graphql/tag";
import registerFragment from "../tiny-graphql/register-fragment.js";

class CharacterDetails extends LitElement {
  static get properties() {
    return {
      character: { type: Object }
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
          <div>
            ${!this.character.birthYear
              ? html``
              : html`
                  <p>Birth year: <small>${this.character.birthYear}</small></p>
                `}
            ${!this.character.gender
              ? html``
              : html`
                  <p>Gender: <small>${this.character.gender}</small></p>
                `}
            ${!this.character.height
              ? html``
              : html`
                  <p>Height: <small>${this.character.height} cm</small></p>
                `}
            ${!this.character.mass
              ? html``
              : html`
                  <p>Mass: <small>${this.character.mass} kg</small></p>
                `}
            ${!this.character.eyeColor || this.character.eyeColor.length === 0
              ? html``
              : html`
                  <p>
                    Hair color:
                    <small>${this.character.eyeColor.join(", ")}</small>
                  </p>
                `}
            ${!this.character.hairColor || this.character.hairColor.length === 0
              ? html``
              : html`
                  <p>
                    Hair color:
                    <small>${this.character.hairColor.join(", ")}</small>
                  </p>
                `}
            ${!this.character.skinColor || this.character.skinColor.length === 0
              ? html``
              : html`
                  <p>
                    Skin color:
                    <small>${this.character.skinColor.join(", ")}</small>
                  </p>
                `}
          </div>
        `;
  }
}

registerFragment(gql`
  fragment CharacterDetails_character on Person {
    birthYear
    eyeColor
    gender
    hairColor
    height
    mass
    skinColor
  }
`);

window.customElements.define("character-details", CharacterDetails);
