import React from "react";
import { useDispatch } from "react-redux";
import { login } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = () => {
    dispatch(login());
    navigate("/dashboard");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <button
        onClick={handleLogin}
        className="px-6 py-3 text-white bg-blue-500 rounded-lg shadow-md hover:bg-blue-700"
      >
        Login with Shopify
      </button>
    </div>
  );
};

export default Login;