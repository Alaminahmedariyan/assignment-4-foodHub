import express, { Application, Request, Response } from "express";
import { globalRoutes } from "./app/routes";

const app: Application = express();

// Enable URL-encoded form data parsing
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON bodies
app.use(express.json());

/**
 * Application Routes
 */
app.use("/api/v1", globalRoutes);
// Basic route
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript + Express!');
});

export default app;