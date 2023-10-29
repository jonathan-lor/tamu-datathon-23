type Vertex = string;
type Weight = number;

export class CourseGraph {
    private adjacencyList: Map<Vertex, Map<Vertex, Weight>>;

    constructor() {
        this.adjacencyList = new Map();
    }

    addVertex(vertex: Vertex): void {
        if (!this.adjacencyList.has(vertex)) {
            this.adjacencyList.set(vertex, new Map());
        }
    }

    addEdge(source: Vertex, target: Vertex, weight: Weight): void {
        if (!this.adjacencyList.has(source)) {
            this.addVertex(source);
        }

        if (!this.adjacencyList.has(target)) {
            this.addVertex(target);
        }

        // Since its a DAG, we don't need to check for cycles
        this.adjacencyList.get(source)!.set(target, weight);
    }

    getNeighbors(vertex: Vertex): Map<Vertex, Weight> | undefined {
        return this.adjacencyList.get(vertex);
    }

    display(): void {
        for (const [vertex, edges] of this.adjacencyList.entries()) {
            const neighbors = Array.from(edges.keys()).map(neighbor => `${neighbor}(${edges.get(neighbor)})`).join(', ');
            console.log(`${vertex} -> ${neighbors}`);
        }
    }
}

