import { useEffect, useRef, useMemo } from "react";
import * as d3 from "d3";

/**
 * D3 Radar (Spider) Chart — driven entirely by `skills` prop.
 * Each skill has { axis: string, value: 0–1 }.
 */
export default function RadarChart({ skills }) {
  const svgRef = useRef(null);

  /* Memoize config so it doesn't recreate every render */
  const cfg = useMemo(
    () => ({
      w: 420,
      h: 420,
      margin: 55,
      levels: 5,
      maxValue: 1,
      labelFactor: 1.18,
      dotRadius: 5,
      strokeWidth: 2.5,
      areaOpacity: 0.18,
      color: "#6c63ff",
      gridColor: "rgba(255,255,255,0.08)",
      axisColor: "rgba(255,255,255,0.12)",
      labelColor: "rgba(241,241,247,0.7)",
    }),
    []
  );

  useEffect(() => {
    if (!skills || skills.length === 0) return;

    const { w, h, margin, levels, maxValue, labelFactor, dotRadius, strokeWidth, areaOpacity, color, gridColor, axisColor, labelColor } = cfg;
    const radius = Math.min(w / 2 - margin, h / 2 - margin);
    const total = skills.length;
    const angleSlice = (Math.PI * 2) / total;

    const rScale = d3.scaleLinear().range([0, radius]).domain([0, maxValue]);

    /* Clear previous */
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3
      .select(svgRef.current)
      .attr("viewBox", `0 0 ${w} ${h}`)
      .append("g")
      .attr("transform", `translate(${w / 2},${h / 2})`);

    /* ── Grid circles ──────────────────────────────────────── */
    for (let level = 1; level <= levels; level++) {
      svg
        .append("circle")
        .attr("r", (radius / levels) * level)
        .attr("fill", "none")
        .attr("stroke", gridColor)
        .attr("stroke-width", 1);
    }

    /* ── Axis lines + labels ───────────────────────────────── */
    const axes = svg
      .selectAll(".axis")
      .data(skills)
      .enter()
      .append("g")
      .attr("class", "axis");

    axes
      .append("line")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", (_, i) => rScale(maxValue) * Math.cos(angleSlice * i - Math.PI / 2))
      .attr("y2", (_, i) => rScale(maxValue) * Math.sin(angleSlice * i - Math.PI / 2))
      .attr("stroke", axisColor)
      .attr("stroke-width", 1);

    axes
      .append("text")
      .attr("x", (_, i) => rScale(maxValue * labelFactor) * Math.cos(angleSlice * i - Math.PI / 2))
      .attr("y", (_, i) => rScale(maxValue * labelFactor) * Math.sin(angleSlice * i - Math.PI / 2))
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "central")
      .attr("fill", labelColor)
      .attr("font-size", "0.72rem")
      .attr("font-weight", 500)
      .text((d) => d.axis);

    /* ── Radar area ────────────────────────────────────────── */
    const radarLine = d3
      .lineRadial()
      .radius((d) => rScale(d.value))
      .angle((_, i) => i * angleSlice)
      .curve(d3.curveCardinalClosed.tension(0.4));

    /* Glow filter */
    const defs = svg.append("defs");
    const filter = defs.append("filter").attr("id", "glow");
    filter.append("feGaussianBlur").attr("stdDeviation", 3.5).attr("result", "coloredBlur");
    const feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "coloredBlur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");

    /* Area fill */
    svg
      .append("path")
      .datum(skills)
      .attr("d", radarLine)
      .attr("fill", color)
      .attr("fill-opacity", areaOpacity)
      .attr("stroke", color)
      .attr("stroke-width", strokeWidth)
      .attr("filter", "url(#glow)")
      .style("opacity", 0)
      .transition()
      .duration(900)
      .style("opacity", 1);

    /* ── Dots ──────────────────────────────────────────────── */
    const tooltip = d3
      .select(svgRef.current.parentNode)
      .selectAll(".radar-tooltip")
      .data([null])
      .join("div")
      .attr("class", "radar-tooltip")
      .style("position", "absolute")
      .style("pointer-events", "none")
      .style("padding", "6px 12px")
      .style("background", "rgba(10,10,26,0.9)")
      .style("backdrop-filter", "blur(8px)")
      .style("border", "1px solid rgba(255,255,255,0.15)")
      .style("border-radius", "8px")
      .style("font-size", "0.78rem")
      .style("color", "#f1f1f7")
      .style("opacity", 0)
      .style("transition", "opacity 0.2s ease")
      .style("white-space", "nowrap")
      .style("z-index", 10);

    svg
      .selectAll(".radar-dot")
      .data(skills)
      .enter()
      .append("circle")
      .attr("class", "radar-dot")
      .attr("cx", (d, i) => rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2))
      .attr("cy", (d, i) => rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2))
      .attr("r", 0)
      .attr("fill", color)
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .style("cursor", "pointer")
      .on("mouseenter", function (event, d) {
        d3.select(this).transition().duration(200).attr("r", dotRadius + 3);
        tooltip
          .html(`<strong>${d.axis}</strong>: ${Math.round(d.value * 100)}%`)
          .style("opacity", 1);
      })
      .on("mousemove", function (event) {
        const bounds = svgRef.current.parentNode.getBoundingClientRect();
        tooltip
          .style("left", `${event.clientX - bounds.left + 14}px`)
          .style("top", `${event.clientY - bounds.top - 10}px`);
      })
      .on("mouseleave", function () {
        d3.select(this).transition().duration(200).attr("r", dotRadius);
        tooltip.style("opacity", 0);
      })
      .transition()
      .delay((_, i) => i * 80)
      .duration(500)
      .attr("r", dotRadius);
  }, [skills, cfg]);

  return (
    <div className="radar-chart" style={{ position: "relative" }}>
      <svg ref={svgRef} aria-label="Skills radar chart" role="img" />
    </div>
  );
}
