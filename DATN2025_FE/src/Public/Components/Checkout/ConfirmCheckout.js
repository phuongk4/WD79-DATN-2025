import React, {useEffect} from 'react';
import Header from "../Shared/Client/Header/Header";
import Footer from "../Shared/Client/Footer/Footer";
import {useLocation} from 'react-router-dom';
import $ from 'jquery';
import orderService from "../Service/OrderService";
import {message} from "antd";

function ConfirmCheckout() {
    const {search} = useLocation();
    const queryParams = new URLSearchParams(search);

    // Convert query parameters to an object
    const queryParamsObj = {};
    queryParams.forEach((value, key) => {
        queryParamsObj[key] = value;
    });

    const vnp_ResponseCode = queryParamsObj['vnp_ResponseCode'];

    const loadingPage = async () => {
        let html = ``;
        let title = ``;
        switch (vnp_ResponseCode) {
            case '00':
                html = ` <div class="col-md-12 text-center">
                            <span class="icon-check_circle display-3 text-success"></span>
                            <h2 class="display-3 text-black">Cảm ơn!</h2>
                            <p class="lead mb-5">Đơn hàng của bạn đã được hoàn tất thành công.</p>
                            <p><a href="/products" class="btn btn-sm btn-primary">Quay lại cửa hàng</a></p>
                        </div>`;
                title = `Cảm ơn`;
                let order_info = localStorage.getItem('order_info')
                if (order_info) {
                    await createOrder();
                }
                break;
            default:
                html = ` <div class="col-md-12 text-center">
                            <span class="icon-cancel display-3 text-danger"></span>
                            <h2 class="display-3 text-black">Lỗi bất định!</h2>
                            <p class="lead mb-5">Đã có lỗi xảy ra với đơn hàng của bạn.</p>
                              <p><a href="/products" class="btn btn-sm btn-primary">Quay lại cửa hàng</a></p>
                        </div>`;
                title = `Error page`;
                break;

        }

        $('#title').text(title)
        $('#content').empty().append(html);
    };


    const createOrder = async () => {
        let order_info = localStorage.getItem('order_info')
        let data = JSON.parse(order_info)
        await orderService.createOrder(data)
            .then((res) => {
                console.log("order", res.data)
                localStorage.removeItem('order_info');
            })
            .catch((err) => {
                console.log(err)
                alert("Error, Vui lòng thử lại sau!")
                $('#btnCheckout').prop('disabled', false).text('Place Order');
            })
    }

    useEffect(() => {
        loadingPage();
    }, [])

    return (
        <div className="site-wrap">
            <Header/>
            <div className="bg-light py-3">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12 mb-0"><a href="/">Trang chủ</a> <span
                            className="mx-2 mb-0">/</span> <strong className="text-black" id="title"></strong>
                        </div>
                    </div>
                </div>
            </div>

            <div className="site-section">
                <div className="container">
                    <div className="row" id="content">

                    </div>
                </div>
            </div>

            <Footer/>
        </div>
    )
}


export default ConfirmCheckout