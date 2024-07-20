import express from "express";
import bodyParser from "body-parser";
// import cookieParser from "cookie-parser";
// import compress from "compression";
// import cors from "cors";
import helmet from "helmet";

// import memberRoutes from "./routes/tsalonuser.route.js";
// import draftRoutes from "./routes/tbook.route.js";
// import voteRoutes from "./routes/tbookvote.route.js";

const app = express();

app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);
// app.use(cookieParser());
// app.use(compress());
app.use(helmet());
// app.use(cors());

// app.use(cors({ origin: "http://localhost:3000", credentials: true }));

// app.use("/", memberRoutes);
// app.use("/", draftRoutes);
// app.use("/", voteRoutes);

// app.use((err, req, res, next) => {
//   console.log(err);
//   if (err.name === "UnauthorizedError") {
//     res.status(401).json({ error: err.name + ": " + err.message });
//   } else if (err) {
//     res.status(400).json({ error: err.name + ": " + err.message });
//     console.log(err);
//   }
// });

export default app;
