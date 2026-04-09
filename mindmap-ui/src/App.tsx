import { useEffect, useState } from "react";
import ForceGraph2D from "react-force-graph-2d";

type GraphData = {
  nodes: { id: string }[];
  links: { source: string; target: string }[];
};

function App() {
  const [data, setData] = useState<GraphData>({
    nodes: [],
    links: [],
  });

  useEffect(() => {
    fetch("http://localhost:4000/graph")
      .then(res => res.json())
      .then(setData);
  }, []);

  return (
    <div style={{ height: "100vh" }}>
      <ForceGraph2D
        graphData={data}
        nodeLabel="id"
        linkDirectionalArrowLength={3}
        nodeAutoColorBy="id"
      />
    </div>
  );
}

export default App;