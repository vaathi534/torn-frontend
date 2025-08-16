import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaCapsules } from "react-icons/fa";

function App() {
  const [cooldowns, setCooldowns] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper: format seconds -> HH:MM:SS
  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return [hrs, mins, secs]
      .map((v) => v.toString().padStart(2, "0"))
      .join(":");
  };

  // Fetch cooldown data from backend
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://torn-cooldown.onrender.com/cooldowns");// backend URL
      const data = await res.json();
      setCooldowns(data);
    } catch (err) {
      console.error("Error fetching cooldowns:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // auto refresh every 30 sec
    return () => clearInterval(interval);
  }, []);

  // Local ticking countdown
  useEffect(() => {
    const tick = setInterval(() => {
      setCooldowns((prev) =>
        prev.map((emp) =>
          emp.error || emp.drug <= 0 ? emp : { ...emp, drug: emp.drug - 1 }
        )
      );
    }, 1000);

    return () => clearInterval(tick);
  }, []);

  // Find max cooldown among all players
  const maxCooldown = cooldowns.length
    ? Math.max(...cooldowns.map((emp) => (emp.error ? 0 : emp.drug)))
    : 0;

  return (
    <div
      style={{
        textAlign: "center",
        padding: "20px",
        background: "linear-gradient(135deg, #0f172a, #1e293b)",
        minHeight: "100vh",
        color: "#fff",
        overflowY: "auto",
      }}
    >
      {/* Pill animation */}
      <motion.div
        initial={{ rotate: 0, y: 0 }}
        animate={{ rotate: [0, -25, 25, 0], y: [0, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{ display: "inline-block" }}
      >
        <FaCapsules size={60} color="#38bdf8" />
      </motion.div>

      <motion.h1
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        style={{
          marginTop: "8px",
          fontSize: "1.8rem",
          fontWeight: "bold",
          textShadow: "0px 0px 12px rgba(168,85,247,0.9)",
        }}
      >
        🚀 Drug Cooldown Tracker
      </motion.h1>

      {/* Highlight Max Cooldown */}
      {!loading && cooldowns.length > 0 && (
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [1, 0.9, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{
            marginTop: "15px",
            padding: "8px 16px",
            borderRadius: "12px",
            background: "linear-gradient(135deg, #3b82f6, #a855f7, #ec4899)",
            display: "inline-block",
            fontSize: "1rem",
            fontWeight: "bold",
            boxShadow: "0px 4px 12px rgba(0,0,0,0.5)",
          }}
        >
          🏆 Max Cooldown: {formatTime(maxCooldown)}
        </motion.div>
      )}

      {loading ? (
        <motion.p
          animate={{ opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          style={{ marginTop: "20px", fontSize: "1rem" }}
        >
          Loading cooldowns...
        </motion.p>
      ) : (
        <div
          style={{
            marginTop: "20px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: "16px",
            padding: "10px",
          }}
        >
          {cooldowns.map((emp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              style={{
                background:
                  "linear-gradient(135deg, #3b82f6, #a855f7, #ec4899)",
                color: "#fff",
                padding: "12px",
                borderRadius: "12px",
                minHeight: "90px",
                textAlign: "center",
                boxShadow: "0px 4px 12px rgba(0,0,0,0.6)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <h2
                style={{
                  fontSize: "1rem",
                  marginBottom: "6px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {emp.name}
              </h2>
              {emp.error ? (
                <p style={{ color: "red", fontSize: "0.8rem" }}>⚠️ Error</p>
              ) : (
                <motion.p
                  animate={{
                    color: ["#ffffff", "#facc15", "#f87171", "#38bdf8"],
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                  style={{
                    fontSize: "1rem",
                    fontWeight: "700",
                    textShadow: "0px 0px 8px rgba(255,255,255,0.9)",
                  }}
                >
                  ⏱ {formatTime(emp.drug)}
                </motion.p>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
