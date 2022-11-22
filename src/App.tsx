import React from 'react';
import './App.scss';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import DefaultLayout from './layouts';
import About from './pages/About';

function App() {
  const wrapPageWithLayout = (page: JSX.Element) => {
    return <DefaultLayout>{page}</DefaultLayout>;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={wrapPageWithLayout(<Home />)} />
        <Route path='about'>
          <Route index element={wrapPageWithLayout(<About />)} />
          <Route path=':number' element={wrapPageWithLayout(<About />)} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
