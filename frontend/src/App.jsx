import ProjectViewWindow from "./components/Projects/ProjectViewWindow";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
function App() {
  const location = useLocation();

  return (
    <>
      <ProjectViewWindow />
    </>
  );
}

export default App;
