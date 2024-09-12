import ProjectContextProvider from "./Store/ProjectContextProvider";
import ProjectViewWindow from "./components/ProjectViewWindow";
function App() {
  return (
    <>
      <ProjectContextProvider>
        <ProjectViewWindow />
      </ProjectContextProvider>
    </>
  );
}

export default App;
