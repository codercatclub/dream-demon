import { html, css } from "./utils";

export default class Tutorial extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    const template = document.createElement("template");
    template.innerHTML = html` <div class="tutorial">
      <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        x="0px"
        y="0px"
        viewBox="0 0 1000 1000"
        enable-background="new 0 0 1000 1000"
        xml:space="preserve"
        width="35px"
        height="35px"
      >
        <g>
          <path
            d="M500,757.8L10,271.5l29.3-29.3L500,706.6l460.7-464.4l29.3,29.3L500,757.8z"
            stroke="white"
            fill="white"
          />
        </g>
      </svg>
    </div>`.toString();

    const styleString = css`
      .tutorial {
        position: absolute;
        bottom: 10px;
        left: 50%;
        z-index: 999;
        opacity: 0.6;
      }

      span {
        line-height: 20px;
      }

      @media screen and (max-width: 768px) {
      }
    `;

    const style = document.createElement("style");
    style.textContent = styleString[0];

    this.shadowRoot?.append(style, template.content.cloneNode(true));
  }
}
