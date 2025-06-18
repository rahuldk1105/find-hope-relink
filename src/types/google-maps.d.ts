
declare global {
  interface Window {
    google: typeof google;
    initMap: () => void;
    selectPerson: (personId: string) => void;
  }
}

declare namespace google {
  namespace maps {
    class Map {
      constructor(element: HTMLElement, options: MapOptions);
    }

    interface MapOptions {
      zoom: number;
      center: LatLng | LatLngLiteral;
      styles?: MapTypeStyle[];
    }

    interface LatLngLiteral {
      lat: number;
      lng: number;
    }

    class LatLng {
      constructor(lat: number, lng: number);
    }

    class Marker {
      constructor(options: MarkerOptions);
      addListener(eventName: string, handler: () => void): void;
    }

    interface MarkerOptions {
      position: LatLng | LatLngLiteral;
      map: Map;
      title?: string;
      icon?: string | Icon;
    }

    interface Icon {
      url: string;
      scaledSize: Size;
    }

    class Size {
      constructor(width: number, height: number);
    }

    class InfoWindow {
      constructor(options: InfoWindowOptions);
      open(map: Map, anchor: Marker): void;
    }

    interface InfoWindowOptions {
      content: string;
    }

    interface MapTypeStyle {
      featureType?: string;
      elementType?: string;
      stylers?: Array<{ [key: string]: string }>;
    }

    namespace visualization {
      class HeatmapLayer {
        constructor(options: HeatmapLayerOptions);
        set(property: string, value: any): void;
      }

      interface HeatmapLayerOptions {
        data: LatLng[];
        map: Map;
      }
    }
  }
}

export {};
