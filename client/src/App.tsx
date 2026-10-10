import { Toaster } from "react-hot-toast";
import { Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, useApp } from "./context/AppContext";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home/Home";
import AuthPage from "./pages/AuthPage/AuthPage";
import Profile from "./pages/Profile/Profile";
import NoteEditor from "./pages/NoteEditor/NoteEditor";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import PublicRoute from "./components/PublicRoute/PublicRoute";

const Layout = () => {
  const { user } = useApp();

  return (
    <>
      {user && <Navbar />}
      <Routes>
        <Route 
          path="/login"
          element={
            <PublicRoute>         
              <AuthPage />
            </PublicRoute>
          }
        />

        <Route 
          path="/"
          element={
            <ProtectedRoute>         
              <Home />
            </ProtectedRoute>
          }
        />

        <Route 
          path="/profile"
          element={
            <ProtectedRoute>         
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route 
          path="/notes/:noteId"
          element={
            <ProtectedRoute>         
              <NoteEditor />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to = "/" replace />}/>
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <main className="app">
        <Toaster position="bottom-center" />
        <Layout />   
      </main>
    </AppProvider>
  )
}
