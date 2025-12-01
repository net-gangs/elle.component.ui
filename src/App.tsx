import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "./components/layout/main-layout";
import Dashboard from "./pages/dashboard";
import Login from "./pages/login";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected Dashboard Route */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
