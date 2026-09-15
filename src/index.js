const express = require("express");
const path = require("node:path");
const { leerJson } = require("./archivos");
const expressLayouts = require("express-ejs-layouts");

const PORT = 3000;
const rutaDatos = path.join(__dirname, "..", "datos", "mascotas.json");

async function main() {
    const mascotas = await leerJson(rutaDatos);
    const app = express();

    app.set("view engine", "ejs");
    app.set("views", path.join(__dirname, "..", "views"));

    app.use(expressLayouts);
    app.set("layout", "layouts/main");

    app.get("/", (req, res) => {
        res.render("inicio", { titulo: "Refugio de Animales" });
    });

    app.get("/api/mascotas", (req, res) => {
        res.json(mascotas);
    });
    app.listen(PORT, () => {
        console.log(`Aplicación disponible en http://localhost:${PORT}`);
    });
}

main().catch((error) => {
    console.error("No se pudo iniciar la aplicación:", error);
    process.exitCode = 1;
});
