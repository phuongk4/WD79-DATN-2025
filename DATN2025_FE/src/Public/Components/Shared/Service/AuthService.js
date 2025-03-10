import {BASE_URL_SERVER} from "../config/server";
import axios from "axios";

const API_ENDPOINT = {
    LOGIN_ACCOUNT: "/auth/login",
    REGISTER_ACCOUNT: "/auth/register",
    FORGOT_PASSWORD: "/api/auth/forgot-password",
    CHANGE_PASSWORD: "/api/auth/verify-forgot-password"
}

class AuthService {

    loginAccount = (data) => {
        return axios.post(BASE_URL_SERVER + API_ENDPOINT.LOGIN_ACCOUNT, data);
    }

    registerAccount = (data) => {
        return axios.post(BASE_URL_SERVER + API_ENDPOINT.REGISTER_ACCOUNT, data);
    }

    forgotPassword = (data) => {
        return axios.post(BASE_URL_SERVER + API_ENDPOINT.FORGOT_PASSWORD, data);
    }

    changePasswordForgot = (data) => {
        return axios.post(BASE_URL_SERVER + API_ENDPOINT.CHANGE_PASSWORD, data);
    }
}

const authService = new AuthService();
export default authService;