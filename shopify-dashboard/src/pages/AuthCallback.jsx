import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { loginSuccess } from "../redux/slices/authSlice";

const AuthCallback = () => {
    const [params] = useSearchParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const code = params.get("code");
    const shop = params.get("shop");

    useEffect(() => {
        if (code) {
            axios
                .post("http://localhost:3000/api/auth", { shop, code })
                .then((res) => {
                    dispatch(loginSuccess(res.data.token));
                    localStorage.setItem("shopify_token", res.data.token);
                    navigate("/dashboard");
                });
        }
    }, [code, shop, navigate, dispatch]);

    return <div>Authenticating...</div>;
};

export default AuthCallback;
