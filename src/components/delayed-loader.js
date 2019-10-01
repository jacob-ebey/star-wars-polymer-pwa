import { LitElement, html } from "lit-element";

class DelayedLoader extends LitElement {
  static get properties() {
    return {
      loading: { type: Boolean, value: false },
      timeout: { type: Number },
      _timeoutKey: { type: Number }
    };
  }

  render() {
    return this.loading && typeof this._timeoutKey !== "undefined"
      ? html``
      : html`
          <slot></slot>
        `;
  }

  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      switch (propName) {
        case "loading": {
          if (!oldValue && this.loading) {
            if (typeof this._timeoutKey !== "undefined") {
              return;
            }

            this._timeoutKey = setTimeout(() => {
              this._timeoutKey = undefined;
            }, this.timeout || 5000);
          } else if (!this.loading && this._timeoutKey) {
            this._timeoutKey = undefined;
          }
          break;
        }
      }
    });
  }
}

window.customElements.define("delayed-loader", DelayedLoader);
