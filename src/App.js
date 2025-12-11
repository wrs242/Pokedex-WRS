import './App.css';
import {useState} from "react";
import {AnimatePresence, motion} from "framer-motion";
import IntroScreen from "./pages/IntroScreen";
import Pokemon from "./cards/Pokemon";
import PokedexGrid from "./cards/PokedexGrid";

function App() {
    const [open,
        setOpen] = useState(false);
    const [selected,
        setSelected] = useState(null);

    return (
        <div
            style={{
            minHeight: "100vh",
            overflow: "hidden",
            background: "#2c2c2c"
        }}>
            <AnimatePresence mode="wait">
                {!open && (
                    <motion.div
                        key="intro"
                        exit={{
                        opacity: 0
                    }}
                        transition={{
                        duration: 0.6
                    }}>
                        <IntroScreen onOpen={() => setOpen(true)}/>
                    </motion.div>
                )}

                {open && !selected && (
                    <motion.div
                        key="grid"
                        initial={{
                        opacity: 0
                    }}
                        animate={{
                        opacity: 1
                    }}
                        exit={{
                        opacity: 0
                    }}
                        transition={{
                        duration: 0.5
                    }}
                        style={{
                        background: "#f5f5f5",
                        minHeight: "100vh",
                        display: "flex",
                        justifyContent: "center"
                    }}>
                        <PokedexGrid onSelect={name => setSelected(name)}/>
                    </motion.div>
                )}

                {open && selected && (
                    <motion.div
                        key="pokemon"
                        initial={{
                        opacity: 0,
                        scale: 0.9
                    }}
                        animate={{
                        opacity: 1,
                        scale: 1
                    }}
                        exit={{
                        opacity: 0
                    }}
                        transition={{
                        duration: 0.5
                    }}
                        style={{
                        minHeight: "100vh",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "#f5f5f5",
                        flexDirection: "column"
                    }}>

                        <Pokemon id={selected} onBack={() => setSelected(null)}/>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default App;
