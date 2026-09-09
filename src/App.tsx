import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Layout from '@/components/Layout';
import Loader from '@/components/Loader';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';

const Home = lazy(() => import('@/pages/Home'));
const LiveDashboard = lazy(() => import('@/pages/LiveDashboard'));
const Analytics = lazy(() => import('@/pages/Analytics'));
const Reports = lazy(() => import('@/pages/Reports'));
const AITechnology = lazy(() => import('@/pages/AITechnology'));
const Team = lazy(() => import('@/pages/Team'));
const Contact = lazy(() => import('@/pages/Contact'));
const Login = lazy(() => import('@/pages/Login'));
const Register = lazy(() => import('@/pages/Register'));
const AdminDashboard = lazy(() => import('@/pages/AdminDashboard'));

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={<Loader label="Loading Edge-AI" />}>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={<LiveDashboard />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/technology" element={<AITechnology />} />
                <Route path="/team" element={<Team />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="*" element={<Home />} />
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
