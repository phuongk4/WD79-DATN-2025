import {BASE_URL_SERVER} from "../config/server";
import axios from "axios";

const API_ENDPOINT = {
    LIST_PRODUCT: "/api/products/list",
    DETAIL_PRODUCT: "/api/products/detail/",
    SEARCH_PRODUCT: "/api/products/search",
    GET_PRODUCT_OPTION: "/api/products/get-info",
    // ADMIN
    ADMIN_LIST_PRODUCT: "/api/admin/products/list",
    ADMIN_DETAIL_PRODUCT: "/api/admin/products/detail/",
    ADMIN_POST_PRODUCT: "/api/admin/products/create",
    ADMIN_UPDATE_PRODUCT: "/api/admin/products/update/",
    ADMIN_DELETE_PRODUCT: "/api/admin/products/delete/",
}

class ProductService {
    // USER
    listProduct = (size, sort) => {
        let params = `?size=${size}&sort=${sort}`;
        return axios.get(BASE_URL_SERVER + API_ENDPOINT.LIST_PRODUCT + params);
    }

    detailProduct = (id) => {
        return axios.get(BASE_URL_SERVER + API_ENDPOINT.DETAIL_PRODUCT + id);
    }

    searchProduct = (category, keyword, size, sort, minPrice, maxPrice, option) => {
        let url = API_ENDPOINT.SEARCH_PRODUCT + `?category=${category}&keyword=${keyword}&size=${size}&sort=${sort}&minPrice=${minPrice}&maxPrice=${maxPrice}&option=${option}`;
        return axios.get(BASE_URL_SERVER + url);
    }

    optionProduct = (option, id) => {
        return axios.get(BASE_URL_SERVER + API_ENDPOINT.GET_PRODUCT_OPTION + `?op=${option}&id=${id}`);
    }

    // ADMIN
    adminListProduct = () => {
        const config = {
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem("accessToken")}`
            }
        };
        return axios.get(BASE_URL_SERVER + API_ENDPOINT.ADMIN_LIST_PRODUCT, config);
    }

    adminDetailProduct = (id) => {
        const config = {
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem("accessToken")}`
            }
        };
        return axios.get(BASE_URL_SERVER + API_ENDPOINT.ADMIN_DETAIL_PRODUCT + id, config);
    }

    adminCreateProduct = (data) => {
        const config = {
            headers: {
                'content-type': 'multipart/form-data',
                'Authorization': `Bearer ${sessionStorage.getItem("accessToken")}`
            }
        };
        return axios.post(BASE_URL_SERVER + API_ENDPOINT.ADMIN_POST_PRODUCT, data, config);
    };

    adminUpdateProduct = (id, data) => {
        const config = {
            headers: {
                'content-type': 'multipart/form-data',
                'Authorization': `Bearer ${sessionStorage.getItem("accessToken")}`
            }
        };
        return axios.post(BASE_URL_SERVER + API_ENDPOINT.ADMIN_UPDATE_PRODUCT + id, data, config)
    };

    adminDeleteProduct = (id) => {
        const config = {
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem("accessToken")}`
            }
        };
        return axios.delete(BASE_URL_SERVER + API_ENDPOINT.ADMIN_DELETE_PRODUCT + id, config);
    }
}

const productService = new ProductService();
export default productService;