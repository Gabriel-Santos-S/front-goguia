import maplibregl from "maplibre-gl";
import { Dispatch, MutableRefObject, RefObject, SetStateAction } from "react";

type Waypoint = [number, number];

interface CriarMapaProps {
    mapRef: MutableRefObject<maplibregl.Map>
    mapContainer: RefObject<HTMLDivElement | null>
    setWaypoints: Dispatch<SetStateAction<Waypoint[]>>
}


export async function criarMapa({ mapRef, setWaypoints, mapContainer }: CriarMapaProps) {

    if (!mapContainer.current || mapRef.current) return;

    const map = new maplibregl.Map({
        container: mapContainer.current,
        style: {
            version: 8,
            sources: {
                'osm': {
                    type: 'raster',
                    tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
                    tileSize: 256,
                    attribution: '© OpenStreetMap'
                }
            },
            layers: [{
                id: 'osm-layer',
                type: 'raster',
                source: 'osm',
                minzoom: 0,
                maxzoom: 19
            }]
        },
        center: [-47.8645, -15.7998],
        zoom: 12,
    });

    mapRef.current = map;

    map.addControl(
        new maplibregl.NavigationControl(),
        "top-right"
    );

    map.on("load", () => {
        map.addSource("route", {
            type: "geojson",
            data: {
                type: "Feature",
                properties: {},
                geometry: {
                    type: "LineString",
                    coordinates: [],
                },
            },
        });

        map.addLayer({
            id: "route",
            type: "line",
            source: "route",
            layout: {
                "line-join": "round",
                "line-cap": "round",
            },
            paint: {
                "line-color": "#F47B2A",
                "line-width": 6,
                "line-opacity": 0.8,
            },
        });
    });

    // clique adiciona waypoint
    map.on("click", (e) => {
        const point: Waypoint = [
            e.lngLat.lng,
            e.lngLat.lat,
        ];

        setWaypoints((prev) => [...prev, point]);
    });

    return () => {
        map.remove();
        mapRef.current = null;
    };

}