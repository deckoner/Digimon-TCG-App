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

app.get("/api/cards", async (req, res) => {
	const page = req.query.page || 1;

	try {
		const response = await axios.get(`${API_URL}/cards/`, {
			params: {
				page,
				per_page: 50,
				include_alternative: true,
			},
			headers: {
				Authorization: `Bearer ${API_TOKEN}`,
			},
		});

		res.json(response.data);
	} catch (error) {
		console.error("Error al obtener cartas:", error.message);
		res.status(500).json({ error: "Error interno al consultar las cartas." });
	}
});

app.listen(PORT, () => {
	console.log(`Servidor backend escuchando en http://localhost:${PORT}`);
});
