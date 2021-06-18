import { World } from "../ecs";
import simpleCube from "./simpleCube";
import manyCubes from "./manyCubes";

const worlds: [string, World][] = [
  ["Simple Cube", simpleCube],
  ["Many Cubes", manyCubes],
];

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

const worldIdx = parseInt(urlParams.get("w") || "0");

if (worldIdx <= worlds.length) {
  worlds[worldIdx][1].init();
}

worlds.forEach((i, idx) => {
  const link = document.createElement("button");
  const linkText = document.createTextNode(i[0]);

  link.appendChild(linkText);

  link.addEventListener("click", () => {
    worlds.forEach((i) => {
      i[1].destroy();
    });
    i[1].init();

    let url = new URL(window.location.href);
    url.searchParams.set("w", idx.toString());
    history.pushState(null, "", url.search.toString());
  });

  document.querySelector(".nav")?.appendChild(link);
});

/** Handle going back in browser history */
window.onpopstate = function () {
  let url = new URL(window.location.href);

  const idx = parseInt(url.searchParams.get("w") || '0');

  worlds.forEach((i) => {
    i[1].destroy();
  });

  worlds[idx][1].init();
};
