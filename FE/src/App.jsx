import { Outlet } from 'react-router-dom';
import Header from './components/header/Header';
import Footer from './components/header/Footer';

function App() {
  return (
    <div className="max-w-screen-2xl mx-auto">
      <Header />
      <div className="min-h-[calc(100vh-136px)] p-4 mx-auto max-w-8xl">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export default App;