import { Node, Edge } from "../types/graph";
import { ParsedFile } from "./parser";

export class GraphEngine {
    private nodes: Map<string, Node> = new Map();
    private edges: Edge[] = [];

    // Add or update a node
    addNode(node: Node) {
        this.nodes.set(node.id, node);
    }

    // Add Edge
    addEdge(source: string, target: string) {
        this.edges.push({
            source,
            target
        })
    }

    // Remove edges from source (for updates)
    removeEdgesFromSource(source: string) {
        this.edges = this.edges.filter(e => e.source !== source);
    }

    // Main function: update graph from parsed file
    updateFromParsed(parsed: ParsedFile) {
        const { fileName, links, tags } = parsed;

        // Add/Update Node
        this.addNode({
            id: fileName,
            tags,
        });

        // Remove old edges (needed for updates)
        this.removeEdgesFromSource(fileName);

        // Add new edges
        for (const link of links) {
            this.addEdge(fileName, link);

            // Ensure target node exists 
            if (!this.nodes.has(link)) {
                this.addNode({
                    id: link, tags: []
                });
            }
        }
    }

    // Debug view
    printGraph() {
        console.log("\n🧠 GRAPH STATE");

        console.log("Nodes:");
        for (const node of this.nodes.values()) {
            console.log(`- ${node.id} [${node.tags.join(", ")}]`);
        }

        console.log("\nEdges:");
        for (const edge of this.edges) {
            console.log(`${edge.source} → ${edge.target}`);
        }

        console.log("\n------------------\n");
    }
}