import * as L from "leaflet";

declare module "leaflet" {
  namespace MarkerClusterGroup {
    interface Options {
      maxClusterRadius?: number;
      chunkedLoading?: boolean;
      chunkInterval?: number;
      chunkDelay?: number;
      singleMarkerMode?: boolean;
      spiderfyOnMaxZoom?: boolean;
      showCoverageOnHover?: boolean;
      zoomToBoundsOnClick?: boolean;
      removeOutsideVisibleBounds?: boolean;
      animate?: boolean;
      animateAddingMarkers?: boolean;
      disableClusteringAtZoom?: number;
      maxClusterSize?: number;
      iconCreateFunction?: (cluster: MarkerClusterGroup) => L.Icon | L.DivIcon;
      spiderfyDistanceMultiplier?: number;
      polygonOptions?: L.PolylineOptions;
    }
  }

  class MarkerClusterGroup extends L.LayerGroup {
    constructor(options?: MarkerClusterGroup.Options);
    addLayers(layers: L.Layer[]): this;
    removeLayers(layers: L.Layer[]): this;
    clearLayers(): this;
    refreshClusters(): this;
    getVisibleParent(marker: L.Marker): L.Marker | null;
    zoomToShowLayer(layer: L.Layer, callback?: () => void): void;
    getBounds(): L.LatLngBounds;
    getMaxZoom(): number;
    getParent(): L.MarkerClusterGroup | null;
    getAllChildMarkers(): L.Marker[];
    hasLayer(layer: L.Layer): boolean;
  }

  function markerClusterGroup(
    options?: MarkerClusterGroup.Options
  ): MarkerClusterGroup;
}
