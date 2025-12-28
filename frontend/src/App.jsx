import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Ingesting from './pages/Ingesting'
import Chat from './pages/Chat'

export default function App() {
  return (
    <div className="min-h-screen bg-bg text-white">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ingesting/:repoId" element={<Ingesting />} />
        <Route path="/chat/:repoId" element={<Chat />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}
