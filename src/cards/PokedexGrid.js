import {useEffect, useState} from "react";
import {motion} from "framer-motion";

export default function PokedexGrid({onSelect}) {
    const [list,
        setList] = useState([]);

    useEffect(() => {
        async function load() {
            const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=15");
            const json = await res.json();

            // fetch each pokemon detail
            const fullData = await Promise.all(json.results.map(async item => {
                const r = await fetch(item.url);
                return await r.json();
            }));

            setList(fullData);
        }

        load();
    }, []);

    return (
        <div
            style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
            gap: "20px",
            padding: "20px",
            margin: "20px",
            width: "95%",
            maxWidth: "600px"
        }}>
            {list.map(p => (
                <motion.div
                    key={p.id}
                    initial={{
                    opacity: 0,
                    y: 20
                }}
                    animate={{
                    opacity: 1,
                    y: 0
                }}
                    whileHover={{
                    scale: 1.05
                }}
                    transition={{
                    duration: 0.4
                }}
                    onClick={() => onSelect(p.name)}
                    style={{
                    background: getColor(p.types[0].type.name),
                    borderRadius: "16px",
                    padding: "15px",
                    cursor: "pointer",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.15)"
                }}>
                    <div
                        style={{
                        color: "#fff",
                        fontWeight: "bold"
                    }}>
                        {capitalize(p.name)}
                    </div>

                    <img
                        src={p.sprites.other["official-artwork"].front_default}
                        alt={p.name}
                        style={{
                        width: "100%",
                        marginTop: "10px",
                        pointerEvents: "none"
                    }}/>

                    <div style={{
                        marginTop: "5px"
                    }}>
                        {p
                            .types
                            .map(t => (
                                <span
                                    key={t.type.name}
                                    style={{
                                    display: "inline-block",
                                    background: "rgba(255,255,255,0.25)",
                                    color: "#fff",
                                    padding: "2px 6px",
                                    marginRight: "5px",
                                    borderRadius: "8px",
                                    fontSize: "12px"
                                }}>
                                    {capitalize(t.type.name)}
                                </span>
                            ))}
                    </div>
                </motion.div>
            ))}
        </div>
    );
}

function getColor(type) {
    const colors = {
        grass: "#48d0b0",
        fire: "#fb6c6c",
        water: "#76befe",
        poison: "#b567ce",
        flying: "#a890f0",
        bug: "#a8b820",
        normal: "#a8a878",
        electric: "#ffd76f"
    };
    return colors[type] || "#8a8a8a";
}

function capitalize(str) {
    return str
        .charAt(0)
        .toUpperCase() + str.slice(1);
}
