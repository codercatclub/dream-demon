import simpleCube from "./simpleCube";
import manyCubes from "./manyCubes";
import removeEntities from "./removeEntities";
import addEntity from "./addEntities";
import customShader from "./customShader";

/**
 * This is a bootstrap script for example page.
 * Please see individual example files for more info.
 */

const worlds: [string, () => { init: () => void; destroy: () => void }][] = [
  ["Simple Cube", simpleCube],
  ["Many Cubes", manyCubes],
  ["Remove Entities", removeEntities],
  ["Add Entities", addEntity],
  ["Custom Shader", customShader],
];

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

const worldIdx = parseInt(urlParams.get("w") || "0");

if (worldIdx <= worlds.length) {
  worlds[worldIdx][1]().init();
}

window.addEventListener('hashchange', () => {
  console.log('[D] hashchange')
})

/** Handle going back in browser history */
window.onpopstate = function () {
  const url = new URL(window.location.href);

  const idx = parseInt(url.searchParams.get("w") || "0");

  document.querySelector("#world")?.remove();

  worlds[idx][1]().init();
};

// Make buttons
worlds.forEach((i, idx) => {
  const link = document.createElement("button");
  const linkText = document.createTextNode(i[0]);

  link.appendChild(linkText);

  link.addEventListener("click", () => {
    document.querySelector("#world")?.remove();
    i[1]().init();
    
    const url = new URL(window.location.href);
    url.searchParams.set("w", idx.toString());
    history.pushState({}, "", url.search.toString());
  });

  document.querySelector(".nav")?.appendChild(link);
});

