"use client";

import { TileLayer } from "react-leaflet";
import { useTheme } from "next-themes";

const TILE_LAYERS = {
  light: {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  },
  dark: {
    url: "https://tiles.stadiamaps.com/tiles/stamen_toner_dark/{z}/{x}/{y}{r}.png",
    attribution:
      '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  },
};
export default function ThemedTileLayer() {
  const { resolvedTheme } = useTheme();
  const layer = TILE_LAYERS[resolvedTheme === "dark" ? "dark" : "light"];

  return (
    <TileLayer
      key={resolvedTheme}
      url={layer.url}
      attribution={layer.attribution}
    />
  );
}
