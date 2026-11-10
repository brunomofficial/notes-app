import app from "./app.js";
import { fileURLToPath } from "node:url";

export default app;

const isDirectExecution = process.argv[1] === fileURLToPath(import.meta.url);

if (isDirectExecution) {
    const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

    if (Number.isNaN(PORT)) {
        throw new Error("PORT must be a valid number");
    }

    app.listen(PORT, () => {
        console.log(`Server started on http://localhost:${PORT}`);
    });
}
