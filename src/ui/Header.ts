import { html, css } from './utils';

export default class Header extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    const template = document.createElement("template");
    template.innerHTML = html`
      <div class="container" part="container">
        <nav id="nav">
          <a href="#">codercat</a>
          <a href="#">about</a>
        </nav>
      </div>
    `.toString();

    const styleString = css`
      .container {
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 20px;
        width: 100%;
      }

      @media screen and (max-width: 768px) {

      }
    `;

    const style = document.createElement("style");
    style.textContent = styleString[0];

    this.shadowRoot?.append(style, template.content.cloneNode(true));
  }
}
