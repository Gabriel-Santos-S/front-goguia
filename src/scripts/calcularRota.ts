import maplibregl, { GeoJSONSource } from "maplibre-gl";
import { MutableRefObject } from "react";

type Waypoint = [number, number];

interface CalcularRouteProps {
    mapRef:  MutableRefObject<maplibregl.Map>
    waypoints: Waypoint[]
}


export async function calcularRota({mapRef, waypoints}: CalcularRouteProps) {

        const map = mapRef.current;

        if (!map) return;

        if (waypoints.length < 2) {
            const source = map.getSource(
                "route"
            ) as GeoJSONSource;

            source?.setData({
                type: "Feature",
                properties: {},
                geometry: {
                    type: "LineString",
                    coordinates: [],
                },
            });

            return;
        }

        try {
            const coordinates = waypoints
                .map((coord) => coord.join(","))
                .join(";");

            const response = await fetch(
                `https://router.project-osrm.org/route/v1/driving/${coordinates}?overview=full&geometries=geojson`
            );

            const data = await response.json();

            const geojson = {
                type: "Feature" as const,
                properties: {},
                geometry:
                    data.routes[0].geometry,
            };

            const source = map.getSource(
                "route"
            ) as GeoJSONSource;

            source.setData(geojson);

            const route = data.routes[0];

            console.log(
                "Distância:",
                (
                    route.distance / 1000
                ).toFixed(2),
                "km"
            );

            console.log(
                "Tempo:",
                (
                    route.duration / 60
                ).toFixed(0),
                "min"
            );

            const bounds =
                new maplibregl.LngLatBounds();

            waypoints.forEach((point) =>
                bounds.extend(point)
            );

            map.fitBounds(bounds, {
                padding: 60,
            });
        } catch (error) {
            console.error(
                "Erro ao calcular rota:",
                error
            );
        }

}