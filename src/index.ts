import { VaultWatcher } from "./core/watcher";

const VAULT_PATH = "/Users/adityatrivedi/Desktop/Obsidian/Wiki-Base";

const watcher = new VaultWatcher(VAULT_PATH);

watcher.onEvent((event, path) => {
  console.log(`📁 Event: ${event} → ${path}`);
});
