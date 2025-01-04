import express from "express";
import { logger } from "./logger";
import { guestRoute } from "./routes/guest-route";
import { authenticatedRoute } from "./routes/authenticated-route";

const app = express();
app.use(express.json());
app.use(express.static("public"));
app.use(guestRoute);
app.use(authenticatedRoute);

app.get("/", (_, res) => {
    res.status(200).send({
        status: 200,
        message: "OK",
    });
});

app.listen(3000, () => {
    logger.info("Listening on port: 3000")
})

export default app;