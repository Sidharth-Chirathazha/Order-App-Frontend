import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import OrderForm from "./OrderForm";
import ConfirmOrder from "./ConfirmOrder";

const App = () => {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/" element={<OrderForm />} />
        <Route path="/confirm-order/:orderId" element={<ConfirmOrder />} />
      </Routes>
    </Router>
  );
};

export default App;