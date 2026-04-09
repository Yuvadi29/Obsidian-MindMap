# 🧠 Obsidian Mind Map (TypeScript)

Turn your Obsidian vault into a **live, interactive knowledge graph** — built from your notes in real time.

This project watches your vault, extracts relationships between notes, builds a graph, and visualizes it as an **interactive mind map UI**.

---

# 🚀 What This Project Does

### 1. 📂 Watches Your Obsidian Vault

* Detects when files are:

  * Added
  * Updated
  * Deleted
* Uses an **event-driven system (chokidar)** — no polling

---

### 2. 🧠 Parses Your Notes

Extracts:

* `[[wikilinks]]` → relationships between notes
* `#tags` → metadata for each node

---

### 3. 🔗 Builds a Knowledge Graph

* Nodes = Notes
* Edges = Links between notes

Supports:

* Bidirectional linking
* Ghost nodes (links to non-existing notes still appear)
* Incremental updates (only changed files are reprocessed)

---

### 4. 🎨 Visualizes as a Mind Map

* Interactive graph UI
* Smooth force-directed layout
* Hover to highlight connections
* Click to explore nodes
* Search + zoom functionality

---

### 5. 🔁 Backlinks System

* Shows:

  * Outgoing links (this note → others)
  * Incoming links (who links to this note)

---

### 6. 🎯 Focus Mode

* Click a node → isolate its neighborhood
* Displays:

  * Selected node
  * Connected nodes
  * Backlinks

Helps reduce noise and improve exploration.

---

# 🧱 Tech Stack

## Backend

* Node.js
* TypeScript
* Express
* Chokidar (file watcher)

## Frontend

* React + Vite
* react-force-graph-2d

---

# 🧠 Architecture Overview

```text
Obsidian Vault
      ↓
File Watcher (chokidar)
      ↓
Markdown Parser
      ↓
Graph Engine (nodes + edges)
      ↓
API Server (Express)
      ↓
React UI (Force Graph)
```

---

# 📁 Project Structure

```text
obsidian-mindmap/
├── src/
│   ├── core/
│   │   ├── watcher.ts
│   │   ├── parser.ts
│   │   ├── graph.ts
│   │
│   ├── server.ts
│   ├── index.ts
│
├── vault/              # Your Obsidian notes
├── mindmap-ui/         # React frontend
```

---

# ⚙️ Setup Guide

---

## 🧩 1. Clone Repo

```bash
git clone https://github.com/Yuvadi29/Obsidian-MindMap
cd Obsidian-MindMap
```

---

## 🧩 2. Backend Setup

```bash
npm install
```

Run backend:

```bash
npm run dev
```

Server runs at:

```
http://localhost:4000
```

---

## 🧩 3. Add Your Vault

Replace `/vault` folder with your own notes.

### Option A — Copy Vault

```bash
cp -r /path/to/your/vault/* ./vault/
```

---

### Option B — Symlink (Recommended)

```bash
ln -s /path/to/your/vault ./vault
```

---

## 🧩 4. Frontend Setup

```bash
cd mindmap-ui
npm install
npm run dev
```

Open:

```
http://localhost:5173
```

---

# 🧪 Example Note

```md
# AI

- [[Machine Learning]]
- [[Deep Learning]]

#ai #future
```

---

# 🎯 Features Breakdown

---

## 🔍 Search + Focus

* Search a node → zoom into it
* Enable Focus Mode:

  * Shows only connected nodes

---

## 🔗 Backlinks

* Shows:

  * Who this node links to
  * Who links to this node

---

## 🎨 Graph Interactions

* Hover → highlight neighbors
* Click → select node
* Smooth force simulation

---

# 🧠 How It Works (Deep Insight)

---

## 1. Graph Model

```ts
Node = { id, tags }
Edge = { source, target }
```

---

## 2. Parsing Logic

* Regex-based extraction:

  * `[[link]]`
  * `#tag`

---

## 3. Incremental Updates

When a file changes:

* Remove old edges
* Re-parse file
* Update graph

---

## 4. Backlinks

Maintains reverse mapping:

```text
target → [sources]
```

---

## 5. Focus Mode

Filters graph to:

```text
Selected Node + Neighbors + Backlinks
```

---

# 🧭 Guide: Use With Your Own Obsidian Vault

---

## Step 1 — Locate Your Vault

Typical locations:

* Mac:

  ```
  ~/Documents/ObsidianVault
  ```
* Windows:

  ```
  C:\Users\...\Documents\ObsidianVault
  ```

---

## Step 2 — Connect It

### Option A: Copy Files

```bash
cp -r /your/vault/* ./vault/
```

---

### Option B: Symlink (Recommended)

```bash
ln -s /your/vault ./vault
```

---

## Step 3 — Use Wikilinks Properly

Use:

```md
[[Note Name]]
```

Avoid:

* Plain text references
* Inconsistent naming

---

## Step 4 — Use Tags

```md
#ai #ml
```

Tags help:

* Organize nodes
* Enable future filtering

---

## Step 5 — Run the System

1. Start backend
2. Start frontend
3. Open UI
4. Explore your knowledge graph

---

# ⚡ Best Practices

---

## 🧠 1. Keep Notes Atomic

Small, focused notes → better graph

---

## 🔗 2. Link Aggressively

More links = richer graph

---

## 🏷️ 3. Use Tags Meaningfully

Avoid random tagging

---

## 🧩 4. Maintain Naming Consistency

```
Machine Learning.md
```

≠

```
machine_learning.md
```

---

# 🚀 Future Enhancements

---

## 🎨 UI

* Node clustering
* Tag filtering
* Mini-map navigation

---

## ⚙️ Backend

* WebSockets (real-time sync)
* Persistent database
* Large graph optimizations

---

# 💡 Why This Matters

This is not just a visualization tool.

This is:

```text
A Personal Knowledge Graph
```

It helps you:

* See connections between ideas
* Navigate your notes visually
* Understand your knowledge structure

---

# 🙌 Contributing

PRs welcome.
Ideas, improvements, optimizations — all welcome.

---

# 📜 License

MIT

---

# 🔥 Final Thought

Obsidian gives you notes.
This gives you:

> **Structure. Connections. Clarity.**
