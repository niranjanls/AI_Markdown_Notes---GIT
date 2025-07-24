import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import MarkdownEditor from './components/MarkdownEditor'

function App() {
  return (
    // <div className="h-screen flex items-center justify-center bg-gray-100 text-xl">
    //   Hello World from AI Markdown Notes! 🚀
    // </div>
    <MarkdownEditor />
  );
}

export default App;