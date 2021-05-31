export const html = strings => strings;
export const css = strings => strings;

export default class Header extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    console.log('[D] Initializing header')

    const template = document.createElement("template");
    template.innerHTML = `
      <div id="title-container" part="container">
        <a href="#">
          <div id="title">BLOCK ZERO</div>
        </a>
        <nav id="nav">
          <a href="projects.html">projects</a>
          <div class="nav-div">|</div>
          <a class="about" href="#?s=about">about us</a>
          <div class="nav-div">|</div>
          <a href="news.html">news</a>
          <div class="nav-div">|</div>
          <a href="contacts.html">contacts</a>
        </nav>
      </div>
    `;

    const tab = window.location.pathname.split("/").pop();

    const styleString = css`
      @font-face {
        font-family: AbolitionRegular;
        src: url(assets/fonts/Abolition-Regular.ttf);
      }

      @font-face {
        font-family: Lato;
        src: url(assets/fonts/Lato-Regular.ttf);
      }

      @font-face {
        font-family: LatoBold;
        src: url(assets/fonts/Lato-Bold.ttf);
      }

      #title {
        font-family: AbolitionRegular;
        font-size: 48px;
        letter-spacing: 52px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0;
        text-align: center;
      }

      #title-container {
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      nav {
        display: flex;
        margin-top: 40px;
      }

      nav a[href="<tab>"] {
        text-decoration: underline;
      }

      .nav-div {
        margin: 0 10px 0 10px;
        line-height: 1.6;
      }

      a {
        text-decoration: none;
        color: black;
        font-family: Lato;
        font-size: 20px;
        letter-spacing: 5px;
      }

      nav a:nth-child(1) {
        color: #e83731;
        /* color: #c82d28; */
      }

      nav a:nth-child(3) {
        color: #e2b422;
        /* color: #bd9516; */
      }

      nav a:nth-child(5) {
        color: #008bc5;
        /* color: #0678a8; */
      }

      nav a:nth-child(7) {
        color: #3da9a4;
        /* color: #34918c; */
      }

      @media screen and (max-width: 768px) {
        #title {
          letter-spacing: 10px;
        }

        nav {
          margin-top: 25px;
        }

        a {
          text-decoration: none;
          color: black;
          font-family: Lato;
          font-size: 18px;
          letter-spacing:1px;
        }
      }
    `;

    const style = document.createElement("style");
    style.textContent = styleString[0].replace("<tab>", tab);

    this.shadowRoot.append(style, template.content.cloneNode(true));

    const about = this.shadowRoot.querySelector('.about')

    about.addEventListener('click', e => {
      if (location.href !== process.env.HOST_URL) {
        location.href = `${process.env.HOST_URL}/#?s=about`;
      };

      const cam = document.querySelector('a-camera');

      cam.components['scroll'].scrollToAbout();
    });
  }
}
