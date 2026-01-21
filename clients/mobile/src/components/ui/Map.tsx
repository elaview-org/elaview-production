import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { borderRadius, colors, fontSize, spacing } from "@/constants/theme";

interface MapMarker {
  id: string;
  latitude: number;
  longitude: number;
  price: number;
}

interface MapProps {
  markers: MapMarker[];
  initialRegion: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  onMarkerPress?: (id: string) => void;
}

let hasNativeMaps: boolean | null = null;
let hasWebView: boolean | null = null;

function checkNativeMaps(): boolean {
  if (hasNativeMaps !== null) return hasNativeMaps;
  try {
    const { TurboModuleRegistry } = require("react-native");
    TurboModuleRegistry.getEnforcing("RNMapsAirModule");
    hasNativeMaps = true;
  } catch {
    hasNativeMaps = false;
  }
  return hasNativeMaps;
}

function checkWebView(): boolean {
  if (hasWebView !== null) return hasWebView;
  try {
    const { TurboModuleRegistry } = require("react-native");
    TurboModuleRegistry.getEnforcing("RNCWebViewModule");
    hasWebView = true;
  } catch {
    hasWebView = false;
  }
  return hasWebView;
}

function LeafletMap({ markers, initialRegion, onMarkerPress }: MapProps) {
  const { WebView } = require("react-native-webview");
  const markersJson = JSON.stringify(
    markers.map((m) => ({
      id: m.id,
      lat: m.latitude,
      lng: m.longitude,
      price: m.price,
    }))
  );

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body, #map { width: 100%; height: 100%; }
        .marker-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .marker-pin {
          font-size: 36px;
          color: ${colors.primary};
          filter: drop-shadow(0 2px 3px rgba(0,0,0,0.3));
        }
        .marker-price {
          background: white;
          color: black;
          padding: 2px 6px;
          border-radius: 4px;
          font-weight: 700;
          font-size: 10px;
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
          box-shadow: 0 1px 2px rgba(0,0,0,0.15);
          margin-top: -4px;
          white-space: nowrap;
        }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        const map = L.map("map").setView([${initialRegion.latitude}, ${initialRegion.longitude}], 11);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "© OpenStreetMap",
        }).addTo(map);

        const markers = ${markersJson};
        markers.forEach(m => {
          const icon = L.divIcon({
            className: "",
            html: '<div class="marker-wrapper"><i class="fa-solid fa-location-dot marker-pin"></i><div class="marker-price">$' + m.price + '</div></div>',
            iconSize: [36, 50],
            iconAnchor: [18, 36],
          });
          L.marker([m.lat, m.lng], { icon })
            .addTo(map)
            .on("click", () => {
              window.ReactNativeWebView.postMessage(JSON.stringify({ type: "markerPress", id: m.id }));
            });
        });
      </script>
    </body>
    </html>
  `;

  const handleMessage = (event: { nativeEvent: { data: string } }) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === "markerPress" && onMarkerPress) {
        onMarkerPress(data.id);
      }
    } catch {}
  };

  return (
    <WebView
      source={{ html }}
      style={StyleSheet.absoluteFillObject}
      scrollEnabled={false}
      onMessage={handleMessage}
    />
  );
}

function NativeMap({ markers, initialRegion, onMarkerPress }: MapProps) {
  const MapView = require("react-native-maps").default;
  const { Marker } = require("react-native-maps");

  return (
    <MapView
      style={StyleSheet.absoluteFillObject}
      initialRegion={initialRegion}
      showsUserLocation
      showsMyLocationButton
    >
      {markers.map((marker) => (
        <Marker
          key={marker.id}
          coordinate={{
            latitude: marker.latitude,
            longitude: marker.longitude,
          }}
          onPress={() => onMarkerPress?.(marker.id)}
        >
          <View style={styles.markerContainer}>
            <FontAwesome name="map-marker" size={36} color={colors.primary} />
            <View style={styles.priceBubble}>
              <Text style={styles.priceText}>${marker.price}</Text>
            </View>
          </View>
        </Marker>
      ))}
    </MapView>
  );
}

function MapPlaceholder() {
  return (
    <View style={[StyleSheet.absoluteFillObject, styles.placeholder]}>
      <FontAwesome name="map" size={48} color={colors.gray500} />
      <Text style={styles.placeholderText}>Map requires native rebuild</Text>
    </View>
  );
}

export default function Map(props: MapProps) {
  const [mapType, setMapType] = useState<"native" | "webview" | "none" | null>(null);

  useEffect(() => {
    if (checkNativeMaps()) {
      setMapType("native");
    } else if (checkWebView()) {
      setMapType("webview");
    } else {
      setMapType("none");
    }
  }, []);

  if (mapType === null) {
    return <View style={StyleSheet.absoluteFillObject} />;
  }

  if (mapType === "native") return <NativeMap {...props} />;
  if (mapType === "webview") return <LeafletMap {...props} />;
  return <MapPlaceholder />;
}

const styles = StyleSheet.create({
  markerContainer: {
    alignItems: "center",
  },
  priceBubble: {
    backgroundColor: colors.white,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    marginTop: -4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  priceText: {
    fontSize: fontSize.xs,
    fontWeight: "700",
    color: colors.black,
  },
  placeholder: {
    backgroundColor: colors.gray100,
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.md,
  },
  placeholderText: {
    fontSize: fontSize.sm,
    color: colors.gray600,
  },
});
