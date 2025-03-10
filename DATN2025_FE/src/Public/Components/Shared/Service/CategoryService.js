import {BASE_URL_SERVER} from "../config/server";
import axios from "axios";

const API_ENDPOINT = {
    //
    LIST_CATEGORY: "/api/categories/list",
    LIST_PRODUCT_CATEGORY: "/api/categories/list-products",
    DETAIL_CATEGORY: "/api/categories/detail/",
    //
    ADMIN_LIST_CATEGORY: "/api/admin/categories/list",
    ADMIN_DETAIL_CATEGORY: "/api/admin/categories/detail/",
    ADMIN_CREATE_CATEGORY: "/api/admin/categories/create",
    ADMIN_UPDATE_CATEGORY: "/api/admin/categories/update/",
    ADMIN_DELETE_CATEGORY: "/api/admin/categories/delete/",
}

class CategoryService {
    //
    listCategory = () => {
        return axios.get(BASE_URL_SERVER + API_ENDPOINT.LIST_CATEGORY);
    }

    detailCategory = (id) => {
        return axios.get(BASE_URL_SERVER + API_ENDPOINT.DETAIL_CATEGORY + id);
    }

    //
    adminListCategory = () => {
        const config = {
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem("accessToken")}`
            }
        };
        return axios.get(BASE_URL_SERVER + API_ENDPOINT.ADMIN_LIST_CATEGORY, config);
    }

    adminDetailCategory = (id) => {
        const config = {
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem("accessToken")}`
            }
        };
        return axios.get(BASE_URL_SERVER + API_ENDPOINT.ADMIN_DETAIL_CATEGORY + id, config);
    }

    adminCreateCategory = (data) => {
        const config = {
            headers: {
                'content-type': 'multipart/form-data',
                'Authorization': `Bearer ${sessionStorage.getItem("accessToken")}`
            }
        };
        return axios.post(BASE_URL_SERVER + API_ENDPOINT.ADMIN_CREATE_CATEGORY, data, config);
    }

    adminUpdateCategory = (id, data) => {
        const config = {
            headers: {
                'content-type': 'multipart/form-data',
                'Authorization': `Bearer ${sessionStorage.getItem("accessToken")}`
            }
        };
        return axios.post(BASE_URL_SERVER + API_ENDPOINT.ADMIN_UPDATE_CATEGORY + id, data, config);
    }

    adminDeleteCategory = (id) => {
        const config = {
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem("accessToken")}`
            }
        };
        return axios.delete(BASE_URL_SERVER + API_ENDPOINT.ADMIN_DELETE_CATEGORY + id, config);
    }
}

const categoryService = new CategoryService();
export default categoryService;