import { BrowserRouter, Route, Routes } from "react-router";
import App from "../App";

const CustomRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
      </Routes>
    </BrowserRouter>
  );
};

export default CustomRouter
