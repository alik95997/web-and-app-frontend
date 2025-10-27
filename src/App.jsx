import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import UploadReport from "./pages/UploadReport";
import AddVitals from "./pages/AddVitals";
import ViewReport from "./pages/ViewReport";

export default function App() {
  return (
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/upload" element={<UploadReport />} />
        <Route path="/vitals" element={<AddVitals />} />
        <Route path="/report/:id" element={<ViewReport />} />
        <Route path="/view/:fileId" element={<ViewReport />} />
      </Routes>

  );
}
