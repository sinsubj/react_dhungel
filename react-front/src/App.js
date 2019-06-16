import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import MainRouter from './MainRouter';

// class App extends Component {
//   render() {
//     return (
//       <div className='container'>
//         <h1>React Frontend</h1>
//       </div>
//     )
//   }
// }

const App = () => (
  <BrowserRouter>
    <MainRouter />
  </BrowserRouter>
)

export default App;
