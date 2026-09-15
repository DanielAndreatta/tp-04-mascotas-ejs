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
    app.use(express.static(path.join(__dirname, "..", "public")));
    app.use(express.urlencoded({ extended: false }));

    // GET /
    app.get("/", (req, res) => {
        res.render("inicio", { titulo: "Adopción de Mascotas" });
    });

    // GET /mascotas
    app.get("/mascotas", (req, res) => {
        res.render("mascotas/lista", {
            titulo: "Mascotas disponibles",
            mascotas
        });
    });

    // GET /mascotas/nueva (debe estar antes de /:id)
    app.get("/mascotas/nueva", (req, res) => {
        res.render("mascotas/nueva", {
            titulo: "Agregar una mascota",
            error: null,
            valores: {}
        });
    });

    // GET /mascotas/:id
    app.get("/mascotas/:id", (req, res) => {
        const id = Number(req.params.id);
        const mascota = mascotas.find((m) => m.id === id);

        if (!mascota) {
            return res.status(404).render("no-encontrado", {
                titulo: "Mascota no encontrada",
                mensaje: "No existe una mascota con ese identificador."
            });
        }

        res.render("mascotas/detalle", {
            titulo: mascota.nombre,
            mascota
        });
    });

    // POST /mascotas
    app.post("/mascotas", (req, res) => {
        const { nombre, especie, edad, descripcion, estado } = req.body;

        const nombreLimpio = String(nombre ?? "").trim();
        const especieLimpia = String(especie ?? "").trim();
        const descripcionLimpia = String(descripcion ?? "").trim();
        const estadoLimpio = String(estado ?? "").trim();
        const edadNumerica = Number(edad);

        if (!nombreLimpio || !especieLimpia || !descripcionLimpia || !estadoLimpio || !Number.isFinite(edadNumerica) || edadNumerica < 0) {
            return res.status(400).render("mascotas/nueva", {
                titulo: "Agregar una mascota",
                error: "Completá todos los campos y asegurate de que la edad sea 0 o mayor.",
                valores: req.body
            });
        }

        const ultimoId = mascotas.reduce((mayorId, m) => Math.max(mayorId, m.id), 0);

        mascotas.push({
            id: ultimoId + 1,
            nombre: nombreLimpio,
            especie: especieLimpia,
            edad: edadNumerica,
            descripcion: descripcionLimpia,
            estado: estadoLimpio,
            imagen: "/img/mascota.svg"
        });

        res.redirect("/mascotas");
    });

    app.listen(PORT, () => {
        console.log(`Aplicación disponible en http://localhost:${PORT}`);
    });
}

main().catch((error) => {
    console.error("No se pudo iniciar la aplicación:", error);
    process.exitCode = 1;
});
