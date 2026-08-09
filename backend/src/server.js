import express from "express";
import dotenv from "dotenv";
dotenv.config();

import path from "path";
import cors from "cors";

import { clerkMiddleware } from "@clerk/express";
import { serve } from "inngest/express";

import { connectDB } from "./lib/db.js";
import {
  inngest,
  functions,
} from "./lib/inngest.js";

import { ENV } from "./lib/env.js";

import chatRoutes from "./routes/chatRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";
import problemRoutes from "./routes/problemRoutes.js";
import youtubeRoutes from "./routes/youtubeRoutes.js";
import grokRoutes from "../routes/grok.js";
import codefolioRoutes from "./routes/codefolioRoutes.js";
import interviewRoutes from "./routes/interviewRoutes.js";
import executeRoutes from "../routes/executeRoutes.js";

const app = express();

const __dirname = path.resolve();

// =========================================================
// REQUEST LOGGER
// =========================================================

app.use((req, res, next) => {
  console.log(
    `[REQUEST] ${req.method} ${req.originalUrl}`
  );

  next();
});

// =========================================================
// BODY PARSER
// =========================================================

app.use(express.json());

// =========================================================
// CORS
// =========================================================

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

// =========================================================
// CLERK AUTHENTICATION
// IMPORTANT: BEFORE PROTECTED ROUTES
// =========================================================

app.use(
  clerkMiddleware({
    authorizedParties: [
      process.env.FRONTEND_URL,
    ],
  })
);

// =========================================================
// INNGEST
// =========================================================

app.use(
  "/api/inngest",
  serve({
    client: inngest,
    functions,
  })
);

// =========================================================
// ROUTES
// =========================================================

app.use(
  "/api/chat",
  chatRoutes
);

app.use(
  "/api/sessions",
  sessionRoutes
);

app.use(
  "/api/problems",
  problemRoutes
);

app.use(
  "/api/youtube",
  youtubeRoutes
);

app.use(
  "/api/grok",
  grokRoutes
);

app.use(
  "/api/codefolio",
  codefolioRoutes
);

app.use(
  "/api/interview",
  interviewRoutes
);

app.use(
  "/api/execute",
  executeRoutes
);

// =========================================================
// TEST API
// =========================================================

app.get("/msg", (req, res) => {
  res.status(200).json({
    msg: "success from API123",
    msg2: "API",
  });
});

app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "THIS IS EXPRESS BACKEND",
    port: ENV.PORT,
  });
});

// =========================================================
// PRODUCTION FRONTEND
// =========================================================

if (ENV.NODE_ENV === "production") {
  app.use(
    express.static(
      path.join(
        __dirname,
        "../frontend/dist"
      )
    )
  );

  app.get("/{*any}", (req, res) => {
    res.sendFile(
      path.join(
        __dirname,
        "../frontend/dist/index.html"
      )
    );
  });
}

// =========================================================
// START SERVER
// =========================================================

const startServer = async () => {
  try {
    await connectDB();

    app.listen(
      ENV.PORT,
      () => {
        console.log(
          `Server is running on port ${ENV.PORT}`
        );
      }
    );
  } catch (error) {
    console.log(
      "error starting the server",
      error
    );
  }
};

startServer();