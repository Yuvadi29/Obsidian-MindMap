import chokidar, { FSWatcher } from "chokidar"

export type FileEvent = "add" | "change" | "unlink"

export class VaultWatcher {
    private watcher: FSWatcher;

    constructor(private vaultPath: string) {
        this.watcher = chokidar.watch(vaultPath, {
            persistent: true,
            ignoreInitial: false,
        })
    }

    onEvent(callback: (event: FileEvent, path: string) => void) {
        const watcher = this.watcher as any;
        watcher.on("add", (path: string) => callback("add", path));
        watcher.on("change", (path: string) => callback("change", path));
        watcher.on("unlink", (path: string) => callback("unlink", path));
    }
}