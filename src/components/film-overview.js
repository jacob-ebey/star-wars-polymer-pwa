import { LitElement, html, css } from "lit-element";

import gql from "../tiny-graphql/tag";
import registerFragment from "../tiny-graphql/register-fragment.js";

import { romanize } from "../tools.js";

class FilmOverview extends LitElement {
  static get properties() {
    return {
      film: { type: Object },
      small: { type: Boolean }
    };
  }

  static get styles() {
    return [
      css`
        :host {
          display: block;
          box-sizing: border-box;
          max-width: var(--section-max-width);
          margin-left: auto;
          margin-right: auto;
        }

        .film-overview-image {
          width: 100%;
        }
      `
    ];
  }

  render() {
    return !this.film
      ? html``
      : html`
          <div>
            ${!this.film.episodeId
              ? html``
              : html`
                  <img
                    class="film-overview-image"
                    alt="Episode ${this.film.episodeId}"
                    src="images/episode-${this.film.episodeId}-wide.jpg"
                  />
                `}
            ${!this.small
              ? html`
                  <h1>
                    ${this.film.title} (Episode
                    ${romanize(this.film.episodeId)})
                  </h1>
                `
              : html`
                  <h3>
                    ${this.film.title} (Episode
                    ${romanize(this.film.episodeId)})
                  </h3>
                `}
            <p>
              Released:
              <small>
                ${new Date(this.film.releaseDate).toLocaleDateString("en-US")}
              </small>
            </p>
          </div>
        `;
  }
}

registerFragment(gql`
  fragment FilmOverview_film on Film {
    title
    episodeId
    releaseDate
  }
`);

window.customElements.define("film-overview", FilmOverview);
