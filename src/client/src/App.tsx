import { Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar/Sidebar";
import Topbar from "./components/Topbar/Topbar";
import Home from "./pages/Home/Home";
import Users from "./pages/Users/Users";
import Logs from "./pages/Log/Logs";
import BackupRestore from "./pages/BackupRestore/BackupRestore";
import Systems from "./pages/System/System";
function App() {
  return (
    <>
      <div>
        <Sidebar />
        <div>
          <div style={{ position: "sticky", top: 0 }}>
            <Topbar />
          </div>
          <div>
            <Routes>
              <Route path="*" element={<Home />} />
              <Route path="/users" element={<Users />} />
              <Route path="/logs" element={<Logs />} />
              <Route path="/backup" element={<BackupRestore />} />
              <Route path="/system" element={<Systems />} />
            </Routes>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
