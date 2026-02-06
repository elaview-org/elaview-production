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
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
  },
};

export default function ThemedTileLayer() {
  const { resolvedTheme } = useTheme();
  const layer = TILE_LAYERS[resolvedTheme === "dark" ? "dark" : "light"];

  return <TileLayer key={resolvedTheme} url={layer.url} attribution={layer.attribution} />;
}