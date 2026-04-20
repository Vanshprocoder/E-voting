import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import Sidebar from "./components/Sidebar"
import Dashboard from "./pages/Dashboard"
import VotingPage from "./pages/VotingPage"
import CandidateDashboard from "./pages/CandidateDashboard"
import AdminDashboard from "./pages/AdminDashboard"
import NotFound from "./pages/NotFound"
import LoginPage from "./pages/LoginPage"
import ProtectedRoute from "./components/ProtectedRoute"
import AddStudentsPage from "./pages/AddStudentsPage"
import AddUserPage from "./pages/AddUserPage"

const App = () => {
  return (
    <BrowserRouter>
      <div className="flex min-h-[100dvh] min-h-screen w-full max-w-full flex-col bg-gray-100 md:flex-row">
        <Sidebar />
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <Navbar />
          <main className="box-border w-full max-w-full flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6">
          <Routes>
         
              <Route path="/login" element={<LoginPage />} />

             
              <Route
                path="/"
                element={
                  <ProtectedRoute role="teacher">
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/voting"
                element={
                  <ProtectedRoute role="teacher">
                    <VotingPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/candidates"
                element={
                  <ProtectedRoute role="admin">
                    <CandidateDashboard />
                  </ProtectedRoute>
                }
              />

            <Route
                path="/dashboard"
                element={
                  <ProtectedRoute role="admin">
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin"
                element={
                  <ProtectedRoute role="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/students/add"
                element={
                  <ProtectedRoute roles={["admin", "teacher"]}>
                    <AddStudentsPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/users/add"
                element={
                  <ProtectedRoute role="admin">
                    <AddUserPage />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<NotFound />} />
            </Routes>
            {/* <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/vote" element={<VotingPage />} />
              <Route path="/candidates" element={<CandidateDashboard />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes> */}
          </main>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
