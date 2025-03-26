import {BASE_URL_SERVER} from "../config/server";
import axios from "axios";

const API_ENDPOINT = {
    ADMIN_LIST_REVENUE: "/api/admin/revenues/list",
    ADMIN_CHART_REVENUE: "/api/admin/revenues/charts",
}

class RevenueService {
    // ADMIN
    adminListRevenue = (date, month, year) => {
        const config = {
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem("accessToken")}`
            }
        };
        return axios.get(BASE_URL_SERVER + API_ENDPOINT.ADMIN_LIST_REVENUE + '?date=' + date + '&month=' + month + '&year=' + year, config);
    }
    adminDataChartRevenue = (type) => {
        const config = {
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem("accessToken")}`
            }
        };
        return axios.get(BASE_URL_SERVER + API_ENDPOINT.ADMIN_CHART_REVENUE + '?type=' + type, config);
    }
}

const revenueService = new RevenueService();
export default revenueService;