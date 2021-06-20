import simpleCube from "./simpleCube";
import manyCubes from "./manyCubes";
import removeEntities from "./removeEntities";
import addEntity from "./addEntities";
import customShader from "./customShader";
import loadModel from "./loadModel";
import { World } from "../ecs/index";

/**
 * This is a bootstrap script for example page.
 * Please see individual example files for more info.
 */
(async () => {
  const worlds: [string, () => Promise<World>][] = [
    ["Simple Cube", simpleCube],
    ["Many Cubes", manyCubes],
    ["Remove Entities", removeEntities],
    ["Add Entities", addEntity],
    ["Custom Shader", customShader],
    ["Load Model", loadModel],
  ];

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  const worldIdx = parseInt(urlParams.get("w") || "0");

  if (worldIdx <= worlds.length) {
    const world = await worlds[worldIdx][1]();
    world.init();
  }

  /** Handle going back in browser history */
  window.onpopstate = async function () {
    const url = new URL(window.location.href);

    const idx = parseInt(url.searchParams.get("w") || "0");

    document.querySelector("#world")?.remove();

    const world = await worlds[idx][1]();
    world.init();
  };

  // Make buttons
  worlds.forEach((i, idx) => {
    const link = document.createElement("button");
    const linkText = document.createTextNode(i[0]);

    link.appendChild(linkText);

    link.addEventListener("click", async () => {
      document.querySelector("#world")?.remove();
      const world = await i[1]()
      world.init();

      const url = new URL(window.location.href);
      url.searchParams.set("w", idx.toString());
      history.pushState({}, "", url.search.toString());
    });

    document.querySelector(".nav")?.appendChild(link);
  });
})();
