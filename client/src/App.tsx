import { Toaster } from "react-hot-toast";
import { Routes, Route } from "react-router-dom";
import { AppProvider, useApp } from "./context/AppContext";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home/Home";
import AuthPage from "./pages/AuthPage/AuthPage";
import Profile from "./pages/Profile/Profile";
import NoteEditor from "./pages/NoteEditor/NoteEditor";
import NotFound from "./pages/NotFound/NotFound";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import PublicRoute from "./components/PublicRoute/PublicRoute";

const Layout = () => {
  const { user } = useApp();

  return (
    <>
      {user && <Navbar />}

      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<AuthPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />

          <Route path="/profile" element={<Profile />} />

          <Route path="/notes/:noteId" element={<NoteEditor />} />
        </Route>

        <Route path="*" element={<NotFound />} />
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
