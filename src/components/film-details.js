import { LitElement, html, css } from "lit-element";

import gql from "../tiny-graphql/tag";
import registerFragment from "../tiny-graphql/register-fragment.js";

class FilmDetails extends LitElement {
  static get properties() {
    return {
      film: { type: Object }
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
    return !this.film
      ? html``
      : html`
          <div>
            <p>Director: <small>${this.film.director}</small></p>
            ${!this.film.producers | (this.film.producers.length === 0)
              ? html``
              : html`
                  <p>
                    Producers: <small>${this.film.producers.join(", ")}</small>
                  </p>
                `}
          </div>
        `;
  }
}

registerFragment(gql`
  fragment FilmDetails_film on Film {
    director
    producers
  }
`);

window.customElements.define("film-details", FilmDetails);
