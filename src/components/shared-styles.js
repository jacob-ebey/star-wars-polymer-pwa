/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { css } from "lit-element";

export const SharedStyles = css`
  :host {
    --section-padding: 24px;
    --section-max-width: 600px;
    display: block;
    box-sizing: border-box;
  }

  section {
    padding: var(--section-padding);
    background: var(--app-section-odd-color);
  }

  section > * {
    max-width: var(--section-max-width);
    margin-right: auto;
    margin-left: auto;
  }

  section:nth-of-type(even) {
    background: var(--app-section-even-color);
  }

  .circle {
    display: block;
    width: 64px;
    height: 64px;
    margin: 0 auto;
    text-align: center;
    border-radius: 50%;
    background: var(--app-primary-color);
    color: var(--app-light-text-color);
    font-size: 30px;
    line-height: 64px;
  }

  .list-spacer {
    margin: 2rem auto;
  }

  .split-list > div > a,
  .list-card {
    position: relative;
    display: block;
    color: #000000;
    text-decoration: none;
    padding: 0.5rem 1rem;
  }

  .split-list > div > a::before,
  .split-list > div > a::after,
  .list-card::before,
  .list-card::after {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    transform: scale3d(0, 0, 1);
    transition: transform 0.3s ease-out 0s;
    background: rgba(233, 30, 99, 0.05);
    content: "";
    pointer-events: none;
  }
  .split-list > div > a::before,
  .list-card::before {
    transform-origin: left top;
  }
  .split-list > div > a::after,
  .list-card::after {
    transform-origin: right bottom;
  }
  .split-list > div > a:hover::before,
  .split-list > div > a:hover::after,
  .split-list > div > a:focus::before,
  .split-list > div > a:focus::after,
  .list-card:hover::before,
  .list-card:hover::after {
    transform: scale3d(1, 1, 1);
  }

  .split-list {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }

  .split-list > div {
    flex: 1;
  }

  @media (min-width: 460px) {
    .split-list > div {
      margin-left: 0.5rem;
    }
    .split-list > div:first-child {
      margin-left: 0;
    }
    .split-list {
      flex-direction: row;
    }
  }
`;
