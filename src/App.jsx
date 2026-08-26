import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login'; // adjust the path if needed

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;