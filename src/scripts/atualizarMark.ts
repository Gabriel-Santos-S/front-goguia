import maplibregl, { GeoJSONSource } from "maplibre-gl";
import { Dispatch, MutableRefObject, SetStateAction } from "react";

type Waypoint = [number, number];

interface AtualizarMarkProps {
    markersRef: MutableRefObject<maplibregl.Marker[]>
    mapRef:  MutableRefObject<maplibregl.Map>
    waypoints: Waypoint[]
    setWaypoints: Dispatch<SetStateAction<Waypoint[]>>
}

export function atualizarMark({markersRef, mapRef, waypoints, setWaypoints}: AtualizarMarkProps) {
    const map = mapRef.current;

    if (!map) return;

    markersRef.current.forEach((marker) =>
        marker.remove()
    );

    markersRef.current = [];

    waypoints.forEach((point, index) => {
        const marker = new maplibregl.Marker({
            draggable: true,
            color:
                index === 0
                    ? "green"
                    : index === waypoints.length - 1
                        ? "red"
                        : "blue",
        })
            .setLngLat(point)
            .setPopup(
                new maplibregl.Popup().setText(
                    index === 0
                        ? "Origem"
                        : index ===
                            waypoints.length - 1
                            ? "Destino"
                            : `Parada ${index}`
                )
            )
            .addTo(map);

        // arrastar waypoint
        marker.on("dragend", () => {
            const lngLat = marker.getLngLat();

            setWaypoints((current) => {
                const updated = [...current];

                updated[index] = [
                    lngLat.lng,
                    lngLat.lat,
                ];

                return updated;
            });
        });

        // remover waypoint com duplo clique
        marker
            .getElement()
            .addEventListener("dblclick", () => {
                setWaypoints((current) =>
                    current.filter(
                        (_, i) => i !== index
                    )
                );
            });

        markersRef.current.push(marker);
    });
}