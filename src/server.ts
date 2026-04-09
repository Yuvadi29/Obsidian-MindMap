import express from "express";
import cors from "cors";
import { GraphEngine } from "./core/graph";

export function startServer(graph: GraphEngine) {
    const app = express();
    app.use(cors());

    app.get("/graph", (req, res) => {
        res.json(graph.getGraphData());
    });

    app.listen(4000, () => {
        console.log("🚀 Server running on http://localhost:4000");
    });
}