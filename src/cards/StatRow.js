import { useEffect, useState } from "react";
import { motion } from "framer-motion";

function StatRow({ label, value, color }) {
  const percent = Math.min(value, 100);

  const [fill, setFill] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setFill(percent), 100);
    return () => clearTimeout(t);
  }, [percent]);

  return (
    <div style={{ marginBottom: "16px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "6px",
        }}
      >
        <div style={{ textTransform: "capitalize" }}>{label}</div>
        <div>{value}</div>
      </div>

      <div
        style={{
          width: "100%",
          height: "8px",
          background: "#eee",
          borderRadius: "6px",
        }}
      >
        <div
          style={{
            width: fill + "%",
            height: "100%",
            background: color,
            borderRadius: "6px",
            transition: "width 0.8s ease",
          }}
        ></div>
      </div>
    </div>
  );
}
