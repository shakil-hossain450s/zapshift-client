import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router'
import router from './routes/Routes.jsx'
import AOS from 'aos'
import 'aos/dist/aos.css'
import AuthProvider from './providers/AuthProvider.jsx'
import { Toaster } from 'react-hot-toast'
import 'leaflet/dist/leaflet.css';

import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

const queryClient = new QueryClient()

AOS.init({
  once: false,
  mirror: false,
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
      <RouterProvider router={router}></RouterProvider>
    </AuthProvider>
    </QueryClientProvider>
    <Toaster />
  </StrictMode>,
)
