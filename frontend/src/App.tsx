import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { ThemeProvider } from "./context/ThemeContext.tsx"
import { routes } from "./routes";

const router = createBrowserRouter(routes);

export default function App() {
    return (
        <ThemeProvider>
            <RouterProvider router={router} />
        </ThemeProvider>
    );
}
