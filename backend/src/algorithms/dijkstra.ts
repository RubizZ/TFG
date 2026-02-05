import { singleton } from "tsyringe";
import type { DijkstraFlightEdge } from "../modules/serpapi-storage/dijkstra.types.js";
import { PriorityQueue } from "../structures/priority-queue.js";

@singleton()
export class Dijkstra {
    public findPath(
        inicio: string,
        fin: string,
        edges: DijkstraFlightEdge[],
        priority: "balanced" | "cheap" | "fast"
    ): DijkstraFlightEdge[] | null {
        
        const distancias: Record<string, number> = {};
        const prevEdge: Record<string, DijkstraFlightEdge | null> = {};
        const pq = new PriorityQueue<string>();

        const nodos = new Set<string>();
        edges.forEach(e => {
            nodos.add(e.from);
            nodos.add(e.to);
        });

        for (const nodo of nodos) {
            distancias[nodo] = Infinity;
            prevEdge[nodo] = null;
        }

        if (!nodos.has(inicio)) return null;

        distancias[inicio] = 0;
        pq.enqueue(inicio, 0);

        while (!pq.isEmpty()) {
            const u = pq.dequeue();
            if (!u || u === fin) break;

            const aristasVecinas = edges.filter(e => e.from === u);

            for (const edge of aristasVecinas) {
                const peso = this.calculateWeight(edge, priority);
                const alt = distancias[u]! + peso;

                if (alt < distancias[edge.to]!) {
                    distancias[edge.to] = alt;
                    prevEdge[edge.to] = edge;
                    pq.enqueue(edge.to, alt);
                }
            }
        }

        return this.reconstructPath(prevEdge, fin);
    }

    private calculateWeight(edge: DijkstraFlightEdge, priority: string): number {
        switch (priority) {
            case "cheap":
                return edge.price;
            case "fast":
                return edge.duration;
            case "balanced":
                return edge.price + (edge.duration / 10);
            default:
                return edge.price;
        }
    }

    private reconstructPath(
        prevEdge: Record<string, DijkstraFlightEdge | null>, 
        target: string
    ): DijkstraFlightEdge[] | null {
        const path: DijkstraFlightEdge[] = [];
        let curr: string | null = target;
        while (curr !== null && prevEdge[curr] !== null) {
            const edge: DijkstraFlightEdge = prevEdge[curr]!; 
            
            path.unshift(edge);
            curr = edge.from;
        }

        return path.length > 0 ? path : null;
    }
    }