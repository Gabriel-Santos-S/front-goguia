import { Map as MapLibreMap, Marker } from "maplibre-gl";
import { useEffect, useRef, useState } from "react";
import { atualizarMark } from "@/scripts/atualizarMark";
import { calcularRota } from "@/scripts/calcularRota";
import { criarMapa } from "@/scripts/criarMapa";
import "maplibre-gl/dist/maplibre-gl.css";

type Waypoint = [number, number];

export default function MapaEdit() {
    const mapContainer = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<MapLibreMap | null>(null);
    const markersRef = useRef<Marker[]>([]);
    const [waypoints, setWaypoints] = useState<Waypoint[]>([]);

    // cria mapa apenas uma vez
    useEffect(() => {
        criarMapa({ mapRef, setWaypoints, mapContainer })
    }, []);

    // atualiza markers
    useEffect(() => {
        atualizarMark({ markersRef, mapRef, waypoints, setWaypoints })
    }, [waypoints]);

    // recalcula rota
    useEffect(() => {
        calcularRota({ mapRef, waypoints });
    }, [waypoints]);

    console.log(waypoints);

    return (
        <>
            <div
                ref={mapContainer}
                style={{
                    width: "100%",
                    height: "50vh",
                }}
            />
            {waypoints.map((point, index) => (
                <div key={index}>
                    <span>
                        {index === 0
                            ? "Origem"
                            : index === waypoints.length - 1
                                ? "Destino"
                                : `Parada ${index}`}
                    </span>

                    <button
                        onClick={() =>
                            setWaypoints((current) =>
                                current.filter(
                                    (_, i) => i !== index
                                )
                            )
                        }
                    >
                        Remover
                    </button>
                </div>
            ))}
        </>
    );
}