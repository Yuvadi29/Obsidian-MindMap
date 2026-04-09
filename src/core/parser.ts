import fs from "fs"

export type ParsedFile = {
    fileName: string;
    links: string[];
    tags: string[];
};

export class MarkdownParser {
    private linkRegex = /\[\[(.*?)\]\]/g;
    private tagRegex = /#(\w+)/g;

    parseFile(filePath: string): ParsedFile {
        const content = fs.readFileSync(filePath, "utf-8");

        const links = this.extractLinks(content);
        const tags = this.extractTags(content);

        return {
            fileName: this.getFileName(filePath),
            links,
            tags,
        };
    }

    private extractLinks(content: string): string[] {
        const matches = [...content.matchAll(this.linkRegex)];
        return matches.map((m) => m[1].trim());
    }

    private extractTags(content: string): string[] {
        const matches = [...content.matchAll(this.tagRegex)];
        return matches.map((m) => m[1].trim());
    }

    private getFileName(path: string): string {
        return path.split("/").pop()?.replace(".md", "") || "";
    }
}