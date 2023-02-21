import { Route, Routes } from "react-router-dom";
import {
  AntdGanttComponent,
} from "./pages";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<AntdGanttComponent />}></Route>
      </Routes>
    </div>
  );
}

export default App;
