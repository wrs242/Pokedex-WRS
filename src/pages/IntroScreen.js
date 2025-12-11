import { motion } from "framer-motion";

function IntroScreen({ onOpen }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#2c2c2c",
        color: "#fff",
      }}
    >
      <motion.h1
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          fontSize: "40px",
          marginBottom: "20px",
          width: "100%",
          textAlign: "center",
        }}
      >
        Welcome to the Pokedex
      </motion.h1>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={onOpen}
        style={{
          padding: "12px 24px",
          borderRadius: "10px",
          fontSize: "20px",
          border: "none",
          cursor: "pointer",
          background: "#6BD3A9",
          color: "#fff",
        }}
      >
        Open Pokedex
      </motion.button>
    </motion.div>
  );
}

export default IntroScreen;
