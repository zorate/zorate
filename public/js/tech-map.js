// Tech Map Visualization

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('tech-map-container');
  if (!container) return;

  // Very basic interactive ecosystem for the "Engineering Stack Visualization"
  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("width", "100%");
  svg.setAttribute("height", "300");
  svg.style.overflow = "visible";
  container.appendChild(svg);

  const nodesData = [
    { id: 'backend', x: 20, y: 50, label: 'Backend', type: 'category' },
    { id: 'python', x: 10, y: 80, label: 'Python', type: 'tech' },
    { id: 'fastapi', x: 20, y: 80, label: 'FastAPI', type: 'tech' },
    { id: 'flask', x: 30, y: 80, label: 'Flask', type: 'tech' },
    { id: 'express', x: 15, y: 90, label: 'Express', type: 'tech' },
    
    { id: 'data', x: 50, y: 50, label: 'Data', type: 'category' },
    { id: 'mongodb', x: 40, y: 80, label: 'MongoDB', type: 'tech' },
    { id: 'sqlite', x: 60, y: 80, label: 'SQLite', type: 'tech' },
    { id: 'gridfs', x: 50, y: 90, label: 'GridFS', type: 'tech' },
    
    { id: 'frontend', x: 80, y: 50, label: 'Frontend', type: 'category' },
    { id: 'js', x: 70, y: 80, label: 'JavaScript', type: 'tech' },
    { id: 'htmlcss', x: 90, y: 80, label: 'HTML/CSS', type: 'tech' },
    { id: 'pwa', x: 80, y: 90, label: 'PWA', type: 'tech' },
  ];

  const edges = [
    { source: 'backend', target: 'python' },
    { source: 'backend', target: 'fastapi' },
    { source: 'backend', target: 'flask' },
    { source: 'backend', target: 'express' },
    { source: 'data', target: 'mongodb' },
    { source: 'data', target: 'sqlite' },
    { source: 'data', target: 'gridfs' },
    { source: 'frontend', target: 'js' },
    { source: 'frontend', target: 'htmlcss' },
    { source: 'frontend', target: 'pwa' },
    // Cross connections
    { source: 'fastapi', target: 'mongodb' },
    { source: 'express', target: 'sqlite' },
    { source: 'flask', target: 'mongodb' },
  ];

  // Draw edges
  edges.forEach(edge => {
    const sourceNode = nodesData.find(n => n.id === edge.source);
    const targetNode = nodesData.find(n => n.id === edge.target);
    
    if (sourceNode && targetNode) {
      const line = document.createElementNS(svgNS, "line");
      line.setAttribute("x1", `${sourceNode.x}%`);
      line.setAttribute("y1", `${sourceNode.y}%`);
      line.setAttribute("x2", `${targetNode.x}%`);
      line.setAttribute("y2", `${targetNode.y}%`);
      line.setAttribute("stroke", "var(--border-bright)");
      line.setAttribute("stroke-width", "1");
      svg.appendChild(line);
    }
  });

  // Draw nodes
  nodesData.forEach(node => {
    const group = document.createElementNS(svgNS, "g");
    group.classList.add('tech-node');
    group.style.cursor = 'pointer';
    
    const isCategory = node.type === 'category';
    
    // Background dot/rect
    if (isCategory) {
      const rect = document.createElementNS(svgNS, "rect");
      rect.setAttribute("x", `calc(${node.x}% - 40px)`);
      rect.setAttribute("y", `calc(${node.y}% - 15px)`);
      rect.setAttribute("width", "80");
      rect.setAttribute("height", "30");
      rect.setAttribute("rx", "15");
      rect.setAttribute("fill", "var(--bg-surface-2)");
      rect.setAttribute("stroke", "var(--border-bright)");
      group.appendChild(rect);
    } else {
      const circle = document.createElementNS(svgNS, "circle");
      circle.setAttribute("cx", `${node.x}%`);
      circle.setAttribute("cy", `${node.y}%`);
      circle.setAttribute("r", "5");
      circle.setAttribute("fill", "var(--accent)");
      group.appendChild(circle);
    }

    // Label
    const text = document.createElementNS(svgNS, "text");
    text.setAttribute("x", `${node.x}%`);
    text.setAttribute("y", isCategory ? `${node.y}%` : `calc(${node.y}% + 15px)`);
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("dominant-baseline", "middle");
    text.setAttribute("fill", isCategory ? "var(--text-primary)" : "var(--text-secondary)");
    text.setAttribute("font-family", "var(--font-mono)");
    text.setAttribute("font-size", isCategory ? "0.75rem" : "0.65rem");
    text.textContent = node.label;
    group.appendChild(text);

    // Hover effect
    group.addEventListener('mouseenter', () => {
      text.setAttribute("fill", "var(--accent)");
      if (!isCategory) {
        const circle = group.querySelector('circle');
        if (circle) {
          circle.setAttribute("r", "8");
          circle.setAttribute("fill", "#fff");
        }
      }
    });
    
    group.addEventListener('mouseleave', () => {
      text.setAttribute("fill", isCategory ? "var(--text-primary)" : "var(--text-secondary)");
      if (!isCategory) {
        const circle = group.querySelector('circle');
        if (circle) {
          circle.setAttribute("r", "5");
          circle.setAttribute("fill", "var(--accent)");
        }
      }
    });

    svg.appendChild(group);
  });
});