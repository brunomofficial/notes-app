import app from "./app.js";

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

if (Number.isNaN(PORT)) {
    console.log("PORT must be a valid number");
}

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`)
});