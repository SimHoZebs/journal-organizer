import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import NotePage from "./pages/NotePage.tsx";
import ProfilePage from "./pages/ProfilePage.tsx";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Navigate to="/notes" replace />} />
				<Route path="/profiles" element={<ProfilePage />} />
				<Route path="/notes" element={<NotePage />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
