import { GraphEngine } from "./core/graph";
import { MarkdownParser } from "./core/parser";
import { VaultWatcher } from "./core/watcher";
import { startServer } from "./server";

const VAULT_PATH = "/Users/adityatrivedi/Desktop/Obsidian/Wiki-Base";

const watcher = new VaultWatcher(VAULT_PATH);
const parser = new MarkdownParser();
const graph = new GraphEngine();

watcher.onEvent((event, path) => {
    if (!path.endsWith(".md")) return;

    if (event === "unlink") {
        console.log(`🗑️ deleted: ${path}`);
        return;
    }

    const parsed = parser.parseFile(path);
    // console.log("📄 Parsed File:");
    // console.log(parsed);

    graph.updateFromParsed(parsed);
    graph.printGraph();
    startServer(graph);
});

