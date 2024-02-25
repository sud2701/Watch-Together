import './input.css';
import Home from './Home';
import Room from './Room';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import VideoCall from './VideoCall';
function App() {

  return (

    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" Component={Home}></Route>
          <Route path="/room" Component={Room}></Route>
          <Route path="/call/:id" Component={VideoCall}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;