import { html } from "lit-element";
import { PageViewElement } from "../components/page-view-element.js";

// These are the shared styles needed by this element.
import { SharedStyles } from "../components/shared-styles.js";

class MyView404 extends PageViewElement {
  static get styles() {
    return [SharedStyles];
  }

  render() {
    return html`
      <section>
        <h1>Oops! You hit a 404</h1>
        <p>
          The page you're looking for doesn't seem to exist. Head back
          <a href="/">home</a> and try again?
        </p>
      </section>
    `;
  }
}

window.customElements.define("my-view404", MyView404);
