import { useEffect, useMemo, useRef, useState } from "react";
import ForceGraph2D from "react-force-graph-2d";
import "./App.css";

type NodeType = {
  id: string;
  tags?: string[];
};

type LinkType = {
  source: string;
  target: string;
};

function App() {
  const [data, setData] = useState<{ nodes: NodeType[]; links: LinkType[] }>({
    nodes: [],
    links: [],
  });

  const [selectedNode, setSelectedNode] = useState<NodeType | null>(null);
  const [hoverNode, setHoverNode] = useState<NodeType | null>(null);
  const [search, setSearch] = useState("");
  const [focusMode, setFocusMode] = useState(false);

  const fgRef = useRef<any>();

  // 🔹 Fetch graph
  useEffect(() => {
    fetch("http://localhost:4000/graph")
      .then((res) => res.json())
      .then(setData)
      .catch((err) => console.error("Could not fetch graph data", err));
  }, []);

  // 🔹 Build adjacency + reverse adjacency
  const { adjacency, reverseAdjacency } = useMemo(() => {
    const adj = new Map<string, Set<string>>();
    const rev = new Map<string, Set<string>>();

    data.links.forEach((link) => {
      if (!adj.has(link.source)) adj.set(link.source, new Set());
      if (!adj.has(link.target)) adj.set(link.target, new Set());

      if (!rev.has(link.target)) rev.set(link.target, new Set());

      adj.get(link.source)!.add(link.target);
      adj.get(link.target)!.add(link.source);

      rev.get(link.target)!.add(link.source);
    });

    return { adjacency: adj, reverseAdjacency: rev };
  }, [data]);

  // 🔹 Focus Mode Graph Filter
  const filteredData = useMemo(() => {
    if (!focusMode || !selectedNode) return data;

    const connected = new Set<string>();
    connected.add(selectedNode.id);

    adjacency.get(selectedNode.id)?.forEach((n) => connected.add(n));
    reverseAdjacency.get(selectedNode.id)?.forEach((n) =>
      connected.add(n)
    );

    return {
      nodes: data.nodes.filter((n) => connected.has(n.id)),
      links: data.links.filter(
        (l) =>
          connected.has(l.source) && connected.has(l.target)
      ),
    };
  }, [focusMode, selectedNode, data, adjacency, reverseAdjacency]);

  // 🔹 Search focus
  const handleSearch = () => {
    const node = data.nodes.find((n) =>
      n.id.toLowerCase().includes(search.toLowerCase())
    );

    if (node && fgRef.current) {
      fgRef.current.centerAt(node.x, node.y, 800);
      fgRef.current.zoom(4, 800);
      setSelectedNode(node);
    }
  };

  // 🔹 Helpers
  const isNeighbor = (node: NodeType, other: NodeType) =>
    adjacency.get(node.id)?.has(other.id);

  const backlinks =
    selectedNode && reverseAdjacency.get(selectedNode.id)
      ? Array.from(reverseAdjacency.get(selectedNode.id)!)
      : [];

  return (
    <div className="app-container">

      {/* Sidebar */}
      <div className="sidebar glass-panel">
        <h2>🧠 Mind Map</h2>

        {/* Search */}
        <div className="search-box">
          <input
            placeholder="Search node..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button onClick={handleSearch}>Go</button>
        </div>

        {/* Focus Toggle */}
        <button
          className="focus-btn"
          onClick={() => setFocusMode(!focusMode)}
        >
          {focusMode ? "Disable Focus" : "Enable Focus"}
        </button>

        <div className="stat-box">
          <div className="stat-label">Nodes</div>
          <div className="stat-value">{filteredData.nodes.length}</div>
        </div>

        <div className="stat-box">
          <div className="stat-label">Links</div>
          <div className="stat-value">{filteredData.links.length}</div>
        </div>
      </div>

      {/* Graph */}
      <div className="graph-container">
        <ForceGraph2D
          ref={fgRef}
          graphData={filteredData}
          nodeLabel="id"
          backgroundColor="rgba(0,0,0,0)"

          d3VelocityDecay={0.3}
          d3AlphaDecay={0.02}

          nodeCanvasObject={(node: any, ctx, globalScale) => {
            const label = node.id;
            const fontSize = 12 / globalScale;

            const isSelected = selectedNode?.id === node.id;
            const isHovered = hoverNode?.id === node.id;

            const isConnected =
              hoverNode &&
              (isNeighbor(hoverNode, node) || hoverNode.id === node.id);

            const opacity = hoverNode
              ? isConnected
                ? 1
                : 0.2
              : 1;

            ctx.globalAlpha = opacity;

            ctx.beginPath();
            ctx.arc(node.x, node.y, isSelected ? 8 : 5, 0, 2 * Math.PI);
            ctx.fillStyle = isSelected
              ? "#818cf8"
              : isHovered
              ? "#22c55e"
              : "#4f46e5";
            ctx.fill();

            ctx.font = `${fontSize}px Inter`;
            ctx.fillStyle = "#fff";
            ctx.fillText(label, node.x + 8, node.y + 3);

            ctx.globalAlpha = 1;
          }}

          linkColor={(link: any) => {
            if (!hoverNode) return "rgba(255,255,255,0.2)";
            return link.source.id === hoverNode.id ||
              link.target.id === hoverNode.id
              ? "#6366f1"
              : "rgba(255,255,255,0.05)";
          }}

          linkWidth={(link: any) =>
            hoverNode &&
            (link.source.id === hoverNode.id ||
              link.target.id === hoverNode.id)
              ? 2
              : 1
          }

          onNodeClick={(node: any) => setSelectedNode(node)}
          onNodeHover={(node: any) => setHoverNode(node)}
        />
      </div>

      {/* Info Panel */}
      <div className="info-panel glass-panel">
        {selectedNode ? (
          <div className="node-details">
            <h3>{selectedNode.id}</h3>

            {/* Outgoing */}
            <p className="section-title">Outgoing Links</p>
            <ul>
              {data.links
                .filter((l) => l.source === selectedNode.id)
                .map((l, i) => (
                  <li key={i}>{l.target}</li>
                ))}
            </ul>

            {/* Backlinks */}
            <p className="section-title">Backlinks</p>
            <ul>
              {backlinks.length ? (
                backlinks.map((b, i) => <li key={i}>{b}</li>)
              ) : (
                <li>No backlinks</li>
              )}
            </ul>

            {/* Tags */}
            {selectedNode.tags?.length ? (
              <>
                <p className="section-title">Tags</p>
                <div className="tags-container">
                  {selectedNode.tags.map((tag, i) => (
                    <span key={i} className="tag">
                      #{tag}
                    </span>
                  ))}
                </div>
              </>
            ) : null}
          </div>
        ) : (
          <div className="empty-state">
            <p>Select a node to explore</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;