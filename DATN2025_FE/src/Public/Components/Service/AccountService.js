import {BASE_URL_SERVER} from "../config/server";
import axios from "axios";

const API_ENDPOINT = {
    //
    GET_USER_INFO: "/api/users/get-info",
    //
    LIST_ACCOUNT: "/api/users/list",
    DETAIL_ACCOUNT: "/api/users/detail/",
    UPDATE_ACCOUNT: "/api/users/update-info",
    CHANGE_PASSWORD_ACCOUNT: "/api/users/change-password",
    //
    ADMIN_LIST_ACCOUNT: "/admin/api/user/list",
    ADMIN_LIST_STATUS_ACCOUNT: "/admin/api/user/list/",
    ADMIN_DETAIL_ACCOUNT: "/admin/api/user/detail/",
    ADMIN_CREATE_ACCOUNT: "/admin/api/user",
    ADMIN_UPDATE_ACCOUNT: "/admin/api/user/update/",
    ADMIN_DELETE_ACCOUNT: "/admin/api/user/",
}

class AccountService {
    getInfo = () => {
        const config = {
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem("accessToken")}`
            }
        };

        return axios.get(BASE_URL_SERVER + API_ENDPOINT.GET_USER_INFO, config);
    }

    listAccount = () => {
        const config = {
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem("accessToken")}`
            }
        };
        return axios.get(BASE_URL_SERVER + API_ENDPOINT.LIST_ACCOUNT, config);
    }

    updateAccount = (data) => {
        const config = {
            headers: {
                'content-type': 'multipart/form-data',
                'Authorization': `Bearer ${sessionStorage.getItem("accessToken")}`
            }
        };
        return axios.post(BASE_URL_SERVER + API_ENDPOINT.UPDATE_ACCOUNT, data, config);
    }

    changePassAccount = (data) => {
        const config = {
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem("accessToken")}`
            }
        };
        return axios.post(BASE_URL_SERVER + API_ENDPOINT.CHANGE_PASSWORD_ACCOUNT, data, config);
    }

    detailAccount = (id) => {
        const config = {
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem("accessToken")}`
            }
        };
        return axios.get(BASE_URL_SERVER + API_ENDPOINT.DETAIL_ACCOUNT + id, config)
    }
    // ADMIN
    adminListAccount = () => {
        const config = {
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem("accessToken")}`
            }
        };
        return axios.get(BASE_URL_SERVER + API_ENDPOINT.ADMIN_LIST_ACCOUNT, config);
    }

    adminDetailAccount = (id) => {
        const config = {
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem("accessToken")}`
            }
        };
        return axios.get(BASE_URL_SERVER + API_ENDPOINT.ADMIN_DETAIL_ACCOUNT + id, config)
    }

    adminCreateAccount = (data) => {
        const config = {
            headers: {
                'content-type': 'multipart/form-data',
                'Authorization': `Bearer ${sessionStorage.getItem("accessToken")}`
            }
        };
        return axios.post(BASE_URL_SERVER + API_ENDPOINT.ADMIN_CREATE_ACCOUNT, data, config);
    }

    adminUpdateAccount = (id, data) => {
        const config = {
            headers: {
                'content-type': 'multipart/form-data',
                'Authorization': `Bearer ${sessionStorage.getItem("accessToken")}`
            }
        };
        return axios.put(BASE_URL_SERVER + API_ENDPOINT.ADMIN_UPDATE_ACCOUNT + id, data, config);
    }

    adminDeleteAccount = (id) => {
        const config = {
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem("accessToken")}`
            }
        };
        return axios.delete(BASE_URL_SERVER + API_ENDPOINT.ADMIN_DELETE_ACCOUNT + id, config)
    }

}

const accountService = new AccountService();
export default accountService;