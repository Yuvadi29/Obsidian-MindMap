import { MarkdownParser } from "./core/parser";
import { VaultWatcher } from "./core/watcher";

const VAULT_PATH = "/Users/adityatrivedi/Desktop/Obsidian/Wiki-Base";

const watcher = new VaultWatcher(VAULT_PATH);
const parser = new MarkdownParser();

watcher.onEvent((event, path) => {
    if (!path.endsWith(".md")) return;

    if (event === "unlink") {
        console.log(`🗑️ deleted: ${path}`);
        return;
    }

    const parsed = parser.parseFile(path);
    console.log("📄 Parsed File:");
    console.log(parsed);
});

