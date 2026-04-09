import { useEffect, useRef, useState } from "react";
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

  const fgRef = useRef<any>();

  // 🔹 Fetch graph
  useEffect(() => {
    fetch("http://localhost:4000/graph")
      .then((res) => res.json())
      .then(setData)
      .catch((err) => console.error("Could not fetch graph data", err));
  }, []);

  // 🔹 Build adjacency map (IMPORTANT)
  const adjacency = new Map<string, Set<string>>();

  data.links.forEach((link) => {
    if (!adjacency.has(link.source)) adjacency.set(link.source, new Set());
    if (!adjacency.has(link.target)) adjacency.set(link.target, new Set());

    adjacency.get(link.source)!.add(link.target);
    adjacency.get(link.target)!.add(link.source);
  });

  // 🔹 Highlight logic
  const isNeighbor = (node: NodeType, other: NodeType) => {
    return adjacency.get(node.id)?.has(other.id);
  };

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

        <div className="stat-box">
          <div className="stat-label">Nodes</div>
          <div className="stat-value">{data.nodes.length}</div>
        </div>

        <div className="stat-box">
          <div className="stat-label">Links</div>
          <div className="stat-value">{data.links.length}</div>
        </div>
      </div>

      {/* Graph */}
      <div className="graph-container">
        <ForceGraph2D
          ref={fgRef}
          graphData={data}
          nodeLabel="id"
          backgroundColor="rgba(0,0,0,0)"

          // 🔥 Better physics
          d3VelocityDecay={0.3}
          d3AlphaDecay={0.02}

          // 🔥 Node styling
          nodeCanvasObject={(node: any, ctx, globalScale) => {
            const label = node.id;
            const fontSize = 12 / globalScale;

            const isSelected = selectedNode?.id === node.id;
            const isHovered = hoverNode?.id === node.id;

            const isConnected =
              hoverNode &&
              (isNeighbor(hoverNode, node) || hoverNode.id === node.id);

            // Fade non-related nodes
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

          // 🔥 Link styling
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

          // 🔥 Interactions
          onNodeClick={(node: any) => setSelectedNode(node)}
          onNodeHover={(node: any) => setHoverNode(node)}
        />
      </div>

      {/* Info Panel */}
      <div className="info-panel glass-panel">
        {selectedNode ? (
          <div className="node-details">
            <h3>{selectedNode.id}</h3>

            <p className="section-title">Connections</p>
            <ul>
              {data.links
                .filter((l) => l.source === selectedNode.id)
                .map((l, i) => (
                  <li key={i}>{l.target}</li>
                ))}
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