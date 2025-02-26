import {BASE_URL_SERVER} from "../config/server";
import axios from "axios";

const API_ENDPOINT = {
    //
    LIST_PROPERTY: "/api/properties/list",
    LIST_PROPERTY_BY_ATTRIBUTE: "/api/properties/list?attribute_id=",
    DETAIL_PROPERTY: "/api/properties/detail/",
    //
    ADMIN_LIST_PROPERTY: "/api/admin/properties/list",
    ADMIN_DETAIL_PROPERTY: "/api/admin/properties/detail/",
    ADMIN_CREATE_PROPERTY: "/api/admin/properties/create",
    ADMIN_UPDATE_PROPERTY: "/api/admin/properties/update/",
    ADMIN_DELETE_PROPERTY: "/api/admin/properties/delete/",
}

class PropertyService {
    //
    listProperty = () => {
        return axios.get(BASE_URL_SERVER + API_ENDPOINT.LIST_PROPERTY);
    }

    detailProperty = (id) => {
        return axios.get(BASE_URL_SERVER + API_ENDPOINT.DETAIL_PROPERTY + id);
    }

    listPropertyByAttribute = (attribute_id) => {
        return axios.get(BASE_URL_SERVER + API_ENDPOINT.LIST_PROPERTY_BY_ATTRIBUTE + attribute_id);
    }

    //
    adminListProperty = () => {
        const config = {
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem("accessToken")}`
            }
        };
        return axios.get(BASE_URL_SERVER + API_ENDPOINT.ADMIN_LIST_PROPERTY, config);
    }

    adminDetailProperty = (id) => {
        const config = {
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem("accessToken")}`
            }
        };
        return axios.get(BASE_URL_SERVER + API_ENDPOINT.ADMIN_DETAIL_PROPERTY + id, config);
    }

    adminCreateProperty = (data) => {
        const config = {
            headers: {
                'content-type': 'multipart/form-data',
                'Authorization': `Bearer ${sessionStorage.getItem("accessToken")}`
            }
        };
        return axios.post(BASE_URL_SERVER + API_ENDPOINT.ADMIN_CREATE_PROPERTY, data, config);
    }

    adminUpdateProperty = (id, data) => {
        const config = {
            headers: {
                'content-type': 'multipart/form-data',
                'Authorization': `Bearer ${sessionStorage.getItem("accessToken")}`
            }
        };
        return axios.post(BASE_URL_SERVER + API_ENDPOINT.ADMIN_UPDATE_PROPERTY + id, data, config);
    }

    adminDeleteProperty = (id) => {
        const config = {
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem("accessToken")}`
            }
        };
        return axios.delete(BASE_URL_SERVER + API_ENDPOINT.ADMIN_DELETE_PROPERTY + id, config);
    }
}

const propertyService = new PropertyService();
export default propertyService;