import { html, css } from "./utils";

interface ProgressEvent extends CustomEvent {
  detail: {
    idx: number;
    src: string;
  };
}

interface OnItemLoadEndEvent extends CustomEvent {
  detail: {
    idx: number;
    total: number;
  };
}

export default class LoadingScreen extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    const template = document.createElement("template");
    template.innerHTML = html`
      <div id="loading-screen">
        <div class="load-container">
          <div id="progress">
            <div id="bar"></div>
          </div>
          <div id="load-log">loading social affirmation</div>
        </div>
      </div>
    `.toString();

    const styleString = css`
      #loading-screen {
        display: none;
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: rgb(255, 255, 255);
        justify-content: center;
        align-items: center;
        z-index: 50;
      }

      .load-container {
        display: flex;
        flex-direction: column;
        font-family: Courier New, Courier, monospace;
        font-size: 12px;
        width: 240px;
      }

      #progress {
        width: 100%;
        border-style: solid;
        border-width: 1px;
        border-color: black;
        margin-bottom: 5px;
      }

      #bar {
        width: 1%;
        height: 10px;
        background-color: rgb(14, 14, 14);
      }

      @media screen and (max-width: 768px) {
      }
    `;

    const style = document.createElement("style");
    style.textContent = styleString[0];

    this.shadowRoot?.append(style, template.content.cloneNode(true));

    const loadingScreenEl = this.shadowRoot?.querySelector("#loading-screen") as HTMLElement;
    const barEl = this.shadowRoot?.getElementById("bar");
    const loadLogEl = this.shadowRoot?.getElementById("load-log");

    window.addEventListener("on-item-load-start", ((e: ProgressEvent) => {
      const { src } = e.detail;
      if (loadLogEl) {
        loadLogEl.innerHTML = `loading ${src}`;
      }
    }) as EventListener);

    window.addEventListener("on-item-load-end", ((e: OnItemLoadEndEvent) => {
      const { total, idx } = e.detail;
      const itemsLoaded = total - (total - (idx + 1));

      const width = (itemsLoaded / total) * 100;

      if (barEl) {
        barEl.style.width = width + "%";
      }
    }) as EventListener);

    window.addEventListener("on-load-start", (() => {
        if (loadingScreenEl) {
          loadingScreenEl.style.display = 'flex';
        }
    }) as EventListener);
  
    window.addEventListener("on-load-end", (() => {
        if (loadingScreenEl) {
          loadingScreenEl.style.display = 'none';
        }
    }) as EventListener);
  }
}
