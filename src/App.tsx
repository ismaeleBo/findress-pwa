import React from 'react';
import './App.scss';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import DefaultLayout from './layouts';
import About from './pages/About';
import { Provider } from 'react-redux';
import store from './store';

function App() {
  const wrapPageWithLayout = (page: JSX.Element) => {
    return <DefaultLayout>{page}</DefaultLayout>;
  };

  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={wrapPageWithLayout(<Home />)} />
          <Route path='about'>
            <Route index element={wrapPageWithLayout(<About />)} />
            <Route path=':number' element={wrapPageWithLayout(<About />)} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
