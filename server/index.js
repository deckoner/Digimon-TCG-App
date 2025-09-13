import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const API_URL = process.env.API_URL;
const API_TOKEN = process.env.API_TOKEN;

app.use(cors());

const axiosConfig = {
	headers: {
		Authorization: `Bearer ${API_TOKEN}`,
	},
};

// Endpoint principal de cartas
app.get("/api/cards/ids", async (req, res) => {
	const page = req.query.page || 1;

	try {
		const response = await axios.get(`${API_URL}/cards/ids/`, {
			params: {
				page,
				per_page: 50,
				include_alternative: true,
			},
			...axiosConfig,
		});

		res.json(response.data);
	} catch (error) {
		console.error("Error al obtener cartas:", error.message);
		res.status(500).json({ error: "Error interno al consultar las cartas." });
	}
});

// Endpoints auxiliares
const AUX_ENDPOINTS = [
	"bts",
	"colors",
	"card-types",
	"rarities",
	"stages",
	"attributes",
	"types",
];

AUX_ENDPOINTS.forEach((endpoint) => {
	app.get(`/api/aux/${endpoint}`, async (_req, res) => {
		try {
			const response = await axios.get(
				`${API_URL}/aux/${endpoint}`,
				axiosConfig,
			);
			res.json(response.data);
		} catch (error) {
			console.error(`Error al obtener /aux/${endpoint}:`, error.message);
			res
				.status(500)
				.json({ error: `Error al consultar datos auxiliares: ${endpoint}` });
		}
	});
});

app.listen(PORT, () => {
	console.log(`Servidor backend escuchando en http://localhost:${PORT}`);
});
