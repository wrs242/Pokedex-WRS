import {useEffect, useState} from "react";
import {motion} from "framer-motion";

function StatRow({label, value, color}) {
    const percent = Math.min(value, 100);
    const [fill,
        setFill] = useState(0);

    useEffect(() => {
        const t = setTimeout(() => setFill(percent), 100);
        return () => clearTimeout(t);
    }, [percent]);

    return (
        <div style={{
            marginBottom: "16px"
        }}>
            <div
                style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "6px"
            }}>
                <div
                    style={{
                    textTransform: "capitalize"
                }}>{label}</div>
                <div>{value}</div>
            </div>

            <div
                style={{
                width: "100%",
                height: "8px",
                background: "#eee",
                borderRadius: "6px"
            }}>
                <div
                    style={{
                    width: fill + "%",
                    height: "100%",
                    background: color,
                    borderRadius: "6px",
                    transition: "width 0.8s ease"
                }}></div>
            </div>
        </div>
    );
}

function parseEvolutionChain(chain) {
    const result = [];

    function walk(node, stage = 1) {
        result.push({
            name: node.species.name,
            stage: stage,
            evolves_to: node.evolves_to
                ?.map(e => ({name: e.species.name, details: e.evolution_details})) || []
        });

        node.evolves_to
            ?.forEach(e => walk(e, stage + 1));
    }

    walk(chain);
    return result;
}

export default function Pokemon({id, onBack}) {
    const [data,
        setData] = useState(null);
    const [tab,
        setTab] = useState("about");
    const [evolution,
        setEvolution] = useState(null);
    const [evoImages,
        setEvoImages] = useState({});

    const tabStyle = active => ({
        cursor: "pointer",
        fontWeight: active
            ? "bold"
            : "normal",
        color: active
            ? bg
            : "#888"
    });

    const rowStyle = {
        display: "flex",
        justifyContent: "space-between",
        padding: "8px 0",
        borderBottom: "1px solid #eee",
        fontSize: "14px"
    };

    // fetch main Pokemon data
    useEffect(() => {
        async function load() {
            const r = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
            const json = await r.json();
            setData(json);
        }
        load();
    }, [id]);

    // fetch evolution data
    useEffect(() => {
        if (!data)
            return; // conditional logic INSIDE the hook
        async function loadEvolution() {
            try {
                const speciesRes = await fetch(data.species.url);
                const species = await speciesRes.json();

                const evoRes = await fetch(species.evolution_chain.url);
                const evoData = await evoRes.json();

                const parsed = parseEvolutionChain(evoData.chain);

                const images = {};
                for (let evo of parsed) {
                    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${evo.name}`);
                    const info = await res.json();
                    images[evo.name] = info.sprites.other["official-artwork"].front_default;
                }
                setEvoImages(images);
                setEvolution(parsed);
            } catch (err) {
                console.error("Evolution error", err);
            }
        }
        loadEvolution();
    }, [data]);

    const mainType = data
        ?.types[0]
            ?.type.name; // safe access
    const bg = mainType
        ? getColor(mainType)
        : "#fff";

    if (!data) {
        return <div
            style={{
            color: "#333",
            fontSize: "20px"
        }}>Loading...</div>;
    }

    return (
        <motion.div
            initial={{
            opacity: 0,
            y: 20
        }}
            animate={{
            opacity: 1,
            y: 0
        }}
            transition={{
            duration: 0.6
        }}
            style={{
            width: "95%",
            maxWidth: "480px",
            margin: "0 auto",
            borderRadius: "20px",
            overflow: "hidden",
            background: "#f5f5f5"
        }}>
            {/* Top header */}
            <div
                style={{
                background: bg,
                color: "white",
                padding: "20px",
                position: "relative",
                minHeight: "230px",
                borderTopLeftRadius: "20px",
                borderTopRightRadius: "20px",
                zIndex: 1
            }}>
                {/* Row: Name left, Back button right */}
                <div
                    style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "10px"
                }}>
                    <div
                        style={{
                        fontSize: "32px",
                        fontWeight: "bold"
                    }}>
                        {capitalize(data.name)}
                    </div>

                    <button
                        onClick={onBack}
                        style={{
                        background: "rgba(255,255,255,0.25)",
                        border: "none",
                        padding: "8px 14px",
                        borderRadius: "12px",
                        color: "white",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px"
                    }}>
                        <span
                            style={{
                            fontSize: "18px"
                        }}>←</span>
                        Back
                    </button>
                </div>

                <div
                    style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "20px"
                }}>
                    <div>
                        {data
                            .types
                            .map(t => (
                                <span
                                    key={t.type.name}
                                    style={{
                                    background: "rgba(255,255,255,0.35)",
                                    padding: "6px 12px",
                                    borderRadius: "14px",
                                    marginRight: "8px",
                                    fontSize: "13px",
                                    textTransform: "capitalize"
                                }}>
                                    {t.type.name}
                                </span>
                            ))}
                    </div>

                    <div
                        style={{
                        opacity: 0.85,
                        fontSize: "20px",
                        fontWeight: "500"
                    }}>
                        #{String(data.id).padStart(3, "0")}
                    </div>
                </div>

                {/* pokemon image */}
                <img
                    src={data.sprites.other["official-artwork"].front_default}
                    alt={data.name}
                    style={{
                    width: "200px",
                    position: "absolute",
                    left: "50%",
                    transform: "translateX(-50%)",
                    bottom: "-60px",
                    filter: "drop-shadow(0px 4px 8px rgba(0,0,0,0.25))"
                }}/>
            </div>

            {/* White panel, touching the green box */}
            <div
                style={{
                background: "white",
                borderTopLeftRadius: "24px",
                borderTopRightRadius: "24px",
                borderBottomLeftRadius: "24px",
                borderBottomRightRadius: "24px",
                marginTop: "-40px",
                paddingTop: "120px",
                paddingLeft: "20px",
                paddingRight: "20px",
                paddingBottom: "20px"
            }}>
                {/* Tabs */}
                <div
                    style={{
                    display: "flex",
                    gap: "20px",
                    borderBottom: "1px solid #ddd",
                    paddingBottom: "10px",
                    marginBottom: "20px"
                }}>

                    <div onClick={() => setTab("about")} style={tabStyle(tab === "about")}>
                        About
                    </div>

                    <div onClick={() => setTab("stats")} style={tabStyle(tab === "stats")}>
                        Base Stats
                    </div>

                    <div onClick={() => setTab("evolution")} style={tabStyle(tab === "evolution")}>
                        Evolution
                    </div>

                    <div onClick={() => setTab("moves")} style={tabStyle(tab === "moves")}>
                        Moves
                    </div>
                </div>

                {tab === "about" && (
                    <div>
                        <TableRow label="Species" value={capitalize(data.species.name)}/>
                        <TableRow label="Height" value={`${ (data.height / 10).toFixed(1)} m`}/>
                        <TableRow label="Weight" value={`${ (data.weight / 10).toFixed(1)} kg`}/>
                        <TableRow
                            label="Abilities"
                            value={data
                            .abilities
                            .map(a => capitalize(a.ability.name))
                            .join(", ")}/>
                    </div>
                )}

                {tab === "stats" && (
                    <div>
                        {data
                            .stats
                            .map(s => (<StatRow key={s.stat.name} label={s.stat.name} value={s.base_stat} color={bg}/>))}
                    </div>

                )}

                {tab === "evolution" && (
                    <div style={{
                        marginTop: "20px"
                    }}>

                        {(!evolution || !evoImages) && <div>Loading evolution...</div>}

                        {evolution
                            ?.map((evo, index) => (
                                <div
                                    key={index}
                                    style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "16px",
                                    marginBottom: "30px",
                                    padding: "16px",
                                    border: "1px solid #eee",
                                    borderRadius: "14px"
                                }}>
                                    {/* Image */}
                                    <img
                                        src={evoImages[evo.name]}
                                        alt={evo.name}
                                        style={{
                                        width: "90px",
                                        height: "90px"
                                    }}/> {/* Info */}
                                    <div
                                        style={{
                                        flex: 1
                                    }}>
                                        <div
                                            style={{
                                            fontSize: "20px",
                                            fontWeight: "bold",
                                            textTransform: "capitalize"
                                        }}>
                                            {evo.name}
                                        </div>

                                        {/* Requirements (if any) */}
                                        {evo.evolves_to.length > 0 && (
                                            <div
                                                style={{
                                                marginTop: "8px",
                                                fontSize: "14px"
                                            }}>
                                                {evo
                                                    .evolves_to
                                                    .map((next, i) => (
                                                        <div key={i}>
                                                            evolves to
                                                            <span
                                                                style={{
                                                                fontWeight: "bold",
                                                                marginLeft: "6px",
                                                                textTransform: "capitalize"
                                                            }}>
                                                                {next.name}
                                                            </span>

                                                            {next.details
                                                                ?.map((d, j) => (
                                                                    <div
                                                                        key={j}
                                                                        style={{
                                                                        opacity: 0.9
                                                                    }}>
                                                                        {d.min_level && (
                                                                            <div>Level {d.min_level}</div>
                                                                        )}
                                                                        {d.item && (
                                                                            <div>Use item: {d.item.name}</div>
                                                                        )}
                                                                        {d.trigger
                                                                            ?.name && !d.min_level && !d.item && (
                                                                                <div>Trigger: {d.trigger.name}</div>
                                                                            )}
                                                                    </div>
                                                                ))}
                                                        </div>
                                                    ))}
                                            </div>
                                        )}

                                    </div>
                                </div>
                            ))}
                    </div>
                )}

                {tab === "moves" && (
                    <div>
                        {data
                            .moves
                            .slice(0, 20)
                            .map(m => (
                                <div key={m.move.name} style={rowStyle}>
                                    <div
                                        style={{
                                        textTransform: "capitalize"
                                    }}>{m.move.name}</div>
                                    <div>Lv {m.version_group_details[0]
                                            ?.level_learned_at || "-"}</div>
                                </div>
                            ))}
                    </div>
                )}

            </div>
        </motion.div>
    );
}
function TableRow({label, value}) {
    return (
        <div
            style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "10px",
            fontSize: "14px"
        }}>
            <div style={{
                opacity: 0.6
            }}>{label}</div>
            <div style={{
                fontWeight: "bold"
            }}>{value}</div>
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
