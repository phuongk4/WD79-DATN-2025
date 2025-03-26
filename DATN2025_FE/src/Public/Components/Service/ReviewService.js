import {BASE_URL_SERVER} from "../config/server";
import axios from "axios";

const API_ENDPOINT = {
    LIST_REVIEW_BY_PRODUCT: "/api/reviews/list",
    CHECK_REVIEW_BY_PRODUCT: "/api/reviews/check",
    POST_REVIEW: "/api/reviews/create",
    // ADMIN
    LIST_REVIEW: "/api/admin/reviews/list",
    DETAIL_REVIEW: "/api/admin/reviews/detail/",
    UPDATE_REVIEW: "/api/admin/reviews/update/",
    DELETE_REVIEW: "/api/admin/reviews/delete/",
}

class ReviewService {
    // USER
    getReviewByProduct = (id) => {
        const config = {
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem("accessToken")}`
            }
        };

        return axios.get(BASE_URL_SERVER + API_ENDPOINT.LIST_REVIEW_BY_PRODUCT + '?product_id=' + id, config);
    }

    checkReviewByProduct = (id, or) => {
        const config = {
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem("accessToken")}`
            }
        };

        return axios.get(BASE_URL_SERVER + API_ENDPOINT.CHECK_REVIEW_BY_PRODUCT + '?product_id=' + id + '&order_id=' + or, config);
    }

    sendReview = (data) => {
        const config = {
            headers: {
                'content-type': 'multipart/form-data',
                'Authorization': `Bearer ${sessionStorage.getItem("accessToken")}`
            }
        };

        return axios.post(BASE_URL_SERVER + API_ENDPOINT.POST_REVIEW, data, config);
    }

    // ADMIN
    listReview = () => {
        const config = {
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem("accessToken")}`
            }
        };
        return axios.get(BASE_URL_SERVER + API_ENDPOINT.LIST_REVIEW, config);
    }

    updateReview = (id, data) => {
        const config = {
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem("accessToken")}`
            }
        };
        return axios.put(BASE_URL_SERVER + API_ENDPOINT.UPDATE_REVIEW + id, data, config);
    }

    detailReview = (id) => {
        const config = {
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem("accessToken")}`
            }
        };
        return axios.get(BASE_URL_SERVER + API_ENDPOINT.DETAIL_REVIEW + id, config)
    }

    deleteReview = (id) => {
        const config = {
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem("accessToken")}`
            }
        };
        return axios.delete(BASE_URL_SERVER + API_ENDPOINT.DELETE_REVIEW + id, config);
    }
}

const reviewService = new ReviewService();
export default reviewService;