import { Outlet } from "react-router-dom";
import LoadingBar from "./LoadingBar.tsx";
import ErrorBoundary from "../common/ErrorBoundary.tsx";

export default function RootLayout() {
    return (
        <>
            <LoadingBar />
            <ErrorBoundary>
                <Outlet />
            </ErrorBoundary>
        </>
    );
}
