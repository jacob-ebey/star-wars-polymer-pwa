import { LitElement, html, css } from "lit-element";

import gql from "../tiny-graphql/tag";
import registerFragment from "../tiny-graphql/register-fragment.js";
import { romanize } from "../tools.js";

class FilmCrawl extends LitElement {
  static get properties() {
    return {
      film: { type: Object }
    };
  }

  static get styles() {
    return [
      css`
        .star-wars-intro {
          background: url("images/stars-bg.jpg") center center;
          width: 100%;
          font-family: "Droid Sans", arial, verdana, sans-serif;
          font-weight: 700;
          color: #ebd71c;
          background-color: #000;
          overflow: hidden;
          position: relative;
          cursor: pointer;
          user-select: none;
        }

        .star-wars-intro p.intro-text {
          position: relative;
          max-width: 16em;
          font-size: 200%;
          font-weight: 400;
          margin: 20% auto;
          color: #4ee;
          opacity: 0;
          text-align: center;
          -webkit-animation: intro 2s ease-out;
          -moz-animation: intro 2s ease-out;
          -ms-animation: intro 2s ease-out;
          -o-animation: intro 2s ease-out;
          animation: intro 2s ease-out;
        }

        .star-wars-intro .sw-main-content {
          margin-left: auto;
          margin-right: auto;
          position: absolute;
          width: 98%;
          height: 50em;
          bottom: 0;
          font-size: 80px;
          font-weight: bold;
          text-align: center;
          overflow: hidden;
          transform-origin: 50% 100%;
          transform: perspective(350px) rotateX(25deg);
        }

        .star-wars-intro .sw-main-content:after {
          position: absolute;
          content: " ";
          top: 0;
          bottom: 60%;
          background-image: linear-gradient(
            top,
            rgba(0, 0, 0, 1) 0%,
            transparent 100%
          );
          pointer-events: none;
        }

        .star-wars-intro .space-button {
          color: #ebd71c;
          border: 12px solid #ebd71c;
          padding: 20px;
          background: transparent;
          text-decoration: none;
          margin: 0 auto;
          display: block;
          text-align: center;
        }

        .star-wars-intro .space-button:hover {
          background-color: #d2be03;
          border-color: #d2be03;
          color: black;
        }

        .star-wars-intro .space-button:active,
        .star-wars-intro .space-button:focus {
          background-color: #b8a40a;
          border-color: #b8a40a;
          color: black;
        }

        .star-wars-intro .title-content {
          position: absolute;
          top: 100%;
          animation: scroll 120s linear 4s forwards;
          width: 100%;
        }

        .star-wars-intro .title-content > .content-header {
          text-align: center;
        }

        /* Main Image Styles */

        .star-wars-intro .main-logo {
          position: absolute;
          width: 2.6em;
          left: 50%;
          top: 5vh;
          font-size: 5em;
          text-align: center;
          margin-left: -1.3em;
          line-height: 0.8em;
          letter-spacing: -0.05em;
          color: #000;
          text-shadow: -2px -2px 0 #ebd71c, 2px -2px 0 #ebd71c,
            -2px 2px 0 #ebd71c, 2px 2px 0 #ebd71c;
          opacity: 0;
          -webkit-animation: logo 5s ease-out 2.5s;
          -moz-animation: logo 5s ease-out 2.5s;
          -ms-animation: logo 5s ease-out 2.5s;
          -o-animation: logo 5s ease-out 2.5s;
          animation: logo 5s ease-out 2.5s;
        }

        .star-wars-intro .main-logo > img {
          max-width: 100%;
        }

        @-webkit-keyframes intro {
          0% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }

        @-moz-keyframes intro {
          0% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }

        @-ms-keyframes intro {
          0% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }

        @-o-keyframes intro {
          0% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }

        @keyframes intro {
          0% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }

        @-webkit-keyframes logo {
          0% {
            -webkit-transform: scale(1);
            opacity: 1;
          }
          50% {
            opacity: 1;
          }
          100% {
            -webkit-transform: scale(0.1);
            opacity: 0;
          }
        }

        @-moz-keyframes logo {
          0% {
            -moz-transform: scale(1);
            opacity: 1;
          }
          50% {
            opacity: 1;
          }
          100% {
            -moz-transform: scale(0.1);
            opacity: 0;
          }
        }

        @-ms-keyframes logo {
          0% {
            -ms-transform: scale(1);
            opacity: 1;
          }
          50% {
            opacity: 1;
          }
          100% {
            -ms-transform: scale(0.1);
            opacity: 0;
          }
        }

        @-o-keyframes logo {
          0% {
            -o-transform: scale(1);
            opacity: 1;
          }
          50% {
            opacity: 1;
          }
          100% {
            -o-transform: scale(0.1);
            opacity: 0;
          }
        }

        @keyframes logo {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: scale(0.1);
            opacity: 0;
          }
        }

        @keyframes scroll {
          0% {
            top: 100%;
          }
          100% {
            top: -170%;
          }
        }

        @media screen and (max-width: 720px) {
          .star-wars-intro .sw-main-content {
            font-size: 35px;
          }
          .star-wars-intro .title-content {
            position: absolute;
            top: 100%;
            animation: scroll 100s linear 4s forwards;
          }
        }
      `
    ];
  }

  render() {
    return !this.film
      ? html``
      : html`
          <div class="crawl-wrapper" @click=${this._restart}>
            <div class="star-wars-intro">
              <p class="intro-text">
                A long time ago in a galaxy far, far away....
              </p>

              <h2 class="main-logo">
                <img src="images/star-wars-intro.png" alt="Star Wars" />
              </h2>

              <div class="sw-main-content">
                <div class="title-content">
                  <p class="content-header">
                    <small>EPISODE ${romanize(this.film.episodeId)}</small>
                    <br />
                    ${this.film.title}
                  </p>

                  <br />

                  <p class="content-body">
                    ${this.film.openingCrawl.split("\n").map(
                      part =>
                        html`
                          ${part}<br />
                        `
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        `;
  }

  _restart(event) {
    const intro = this.shadowRoot.querySelector(
      ".star-wars-intro p.intro-text"
    );
    const logo = this.shadowRoot.querySelector(".star-wars-intro .main-logo");
    const scroll = this.shadowRoot.querySelector(
      ".star-wars-intro .title-content"
    );
    intro.style.animation = "none";
    intro.style.webkitAnimation = "none";
    logo.style.animation = "none";
    logo.style.webkitAnimation = "none";
    scroll.style.animation = "none";
    scroll.style.webkitAnimation = "none";
    setTimeout(function() {
      intro.style.animation = "";
      intro.style.webkitAnimation = "";
      logo.style.animation = "";
      logo.style.webkitAnimation = "";
      scroll.style.animation = "";
      scroll.style.webkitAnimation = "";
    }, 10);
  }
}

registerFragment(gql`
  fragment FilmCrawl_film on Film {
    title
    episodeId
    openingCrawl
  }
`);

window.customElements.define("film-crawl", FilmCrawl);
