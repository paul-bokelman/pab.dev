import { Routes, Route } from "react-router-dom";
import { Landing, ProjectCluster } from "./pages";

export const App: React.FC = () => {
  return (
    <Routes>
      <Route index element={<Landing />} />
      <Route path="/projects" element={<ProjectCluster />} />
      {/* <Route path="about" element={<About />} />
  <Route path="dashboard" element={<Dashboard />} />
  <Route path="*" element={<NoMatch />} /> */}
    </Routes>
  );
};
