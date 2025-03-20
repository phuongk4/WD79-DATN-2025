import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Form, message} from 'antd';
import orderService from '../Service/OrderService';
import Header from "../Shared/Client/Header/Header";
import Footer from "../Shared/Client/Footer/Footer";
import cartService from "../Service/CartService";
import couponService from "../Service/CouponService";
import $ from "jquery";
import ConvertNumber from "../Shared/Utils/ConvertNumber";
import accountService from "../Service/AccountService";
import LoadingPage from "../Shared/Utils/LoadingPage";

function Checkout() {
    const [loading, setLoading] = useState(true);
    const [carts, setCarts] = useState([]);
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    const getUser = async () => {
        await accountService.getInfo()
            .then((res) => {
                let user = JSON.parse(JSON.stringify(res.data.data));
                setUsers(user);
            })
            .catch((err) => {
                console.log(err)
                let stt = err.response.status;
                if (stt === 444) {
                    alert('Phiên đăng nhập đã hết hạn, đăng nhập lại...');
                    sessionStorage.clear();
                    navigate('/login');
                } else {
                    navigate('/login');
                }
            });
    };

    const getListProductCart = async () => {
        await cartService.listCart()
            .then((res) => {
                if (res.status === 200) {
                    console.log("carts", res.data.data)
                    setCarts(res.data.data)
                    setLoading(false)
                }
            })
            .catch((err) => {
                setLoading(false)
                console.log(err)
            })
    }

    const getCoupon = async () => {
        LoadingPage();
        let code = $('#coupon_code').val().trim();
        await couponService.searchMyCoupon(code)
            .then((res) => {
                if (res.status === 200) {
                    console.log("coupon", res.data.data)
                    changeDiscountPrice(res.data.data)
                    LoadingPage();
                } else {
                    alert('Không tìm thấy mã giảm giá hợp lệ')
                    LoadingPage();
                }
            })
            .catch((err) => {
                alert('Không tìm thấy mã giảm giá hợp lệ')
                LoadingPage();
                console.log(err);
            })
    }

    const CheckoutCart = async () => {
        $('#btnCreate').prop('disabled', true).text('Đang đặt hàng...');
        let data = {};
        let order_method_ = $('.order_method');
        let order_method = '';
        order_method_.each(function () {
            if ($(this).is(':checked')) {
                order_method = $(this).val();
            }
        })

        let inputs = $('#formCheckout input, #formCheckout select, #formCheckout textarea');
        for (let i = 0; i < inputs.length; i++) {
            if (!$(inputs[i]).val() && $(inputs[i]).attr('type') !== 'hidden' && $(inputs[i]).attr('id') !== 'coupon_code') {
                let text = $(inputs[i]).prev().text();
                alert(text + ' không được bỏ trống!');
                $('#btnCreate').prop('disabled', false).text('Đặt hàng');
                return
            }
            data[$(inputs[i]).attr('id')] = $(inputs[i]).val();
        }

        data['c_total_product'] = $('#c_total_product').val();
        data['c_discount_price'] = $('#c_discount_price').val();
        data['coupon_id'] = $('#coupon_id').val();
        data['c_total'] = $('#c_total').val();

        if (order_method === 'cod') {
            data['order_method'] = 'Thanh toán khi nhận hàng';
            await orderService.createOrder(data)
                .then((res) => {
                    if (res.status === 200) {
                        setLoading(false)
                        console.log(res.data)
                        window.location.href = '/thanks-you';
                    }
                })
                .catch((err) => {
                    setLoading(false)
                    $('#btnCreate').prop('disabled', false).text('Đặt hàng');
                    console.log(err)
                })
        } else {
            data['order_method'] = 'Ví điện tử';
            await orderService.createOrderVnpay(data)
                .then((res) => {
                    if (res.status === 200) {
                        setLoading(false)
                        console.log(res.data)
                        localStorage.setItem('order_info', JSON.stringify(data))
                        // Chuyển qua trang thanh toán của VNPAY
                        window.location.href = res.data.data;
                    }
                })
                .catch((err) => {
                    setLoading(false)
                    $('#btnCreate').prop('disabled', false).text('Đặt hàng');
                    console.log(err)
                })
        }
    }

    const changeDiscountPrice = (coupon) => {
        coupon = coupon[0];
        let priceMain = $('#c_total').val();

        let min_total = coupon.min_total;

        console.log(priceMain, min_total)

        if (Number(priceMain) < Number(min_total)) {
            alert('Đơn hàng chưa đạt giá trị tối thiểu để sử dụng mã giảm giá: ' + ConvertNumber(min_total));
            return;
        }

        handleCoupon(coupon, priceMain);
    }

    function handleCoupon(coupon, priceMain) {
        let priceDiscount = $('#textDiscount');

        let discount = coupon.max_discount;

        let percent = coupon.discount_percent;

        priceMain = Number(priceMain);

        let pr = percent * priceMain / 100;

        let price = 0;
        if (pr > discount) {
            price = Number(discount);
        } else {
            price = pr;
        }

        let priceConvert = ConvertNumber(price);
        priceDiscount.text(priceConvert);

        $('#coupon_id').val(coupon.id);
        $('#c_discount_price').val(price);

        calcTotal();
    }

    const calcTotal = () => {
        let total = 0;
        let totalCartItems = $('.totalCartItem');
        totalCartItems.each(function () {
            let totalCartItem = $(this).text();
            totalCartItem = totalCartItem.replaceAll('.', '').replaceAll('đ', '');
            total = parseInt(totalCartItem) + total;
        })

        let priceDiscount = $('#c_discount_price').val() ?? 0;

        $('#c_total_product').val(total);
        let totalConvert = ConvertNumber(total);
        $('#CartSubtotal').text(totalConvert);


        total = Number(total) - priceDiscount;
        if (total < 0) {
            total = 0;
        }

        $('#c_total').val(total);
        total = ConvertNumber(total);
        $('#OrderTotal').text(total);
    }

    useEffect(() => {
        getListProductCart();
        calcTotal();
        getUser();
    }, [loading]);

    return (<div className="site-wrap">
        <Header/>
        <div className="bg-light py-3">
            <div className="container">
                <div className="row">
                    <div className="col-md-12 mb-0"><a href="/">Trang chủ</a> <span
                        className="mx-2 mb-0">/</span> <a href="/cart">Giỏi hàng</a> <span
                        className="mx-2 mb-0">/</span> <strong className="text-black">Thanh toán</strong></div>
                </div>
            </div>
        </div>

        <div className="site-section">
            <div className="container">
                {carts.length === 0 ? (<div>
                    <div className="text-center">
                        <p>Giỏ hàng của bạn hiện đang trống.</p>
                    </div>
                </div>) : (<Form onFinish={CheckoutCart} className="row" id="formCheckout">
                    <div className="col-md-6 mb-5 mb-md-0">
                        <h2 className="h3 mb-3 text-black">Chi tiết thanh toán</h2>
                        <div className="p-3 p-lg-5 border">
                            <div className="form-group row">
                                <div className="col-md-12">
                                    <label htmlFor="full_name" className="text-black">Tên của bạn<span
                                        className="text-danger">*</span></label>
                                    <input type="text" required className="form-control" id="full_name"
                                           name="full_name" defaultValue={users.full_name}/>
                                </div>
                            </div>

                            <div className="form-group row">
                                <div className="col-md-12">
                                    <label htmlFor="c_address" className="text-black">Địa chỉ <span
                                        className="text-danger">*</span></label>
                                    <input type="text" required className="form-control" id="c_address"
                                           name="c_address" defaultValue={users.address}
                                           placeholder="Địa chỉ đường phố"/>
                                </div>
                            </div>

                            <div className="form-group">
                                <input type="text" required name="d_address" id="d_address"
                                       className="form-control"
                                       placeholder="Căn hộ, phòng suite, đơn vị, v.v. (tùy chọn)"/>
                            </div>

                            <div className="form-group row mb-5">
                                <div className="col-md-6">
                                    <label htmlFor="c_email_address" className="text-black">Email <span
                                        className="text-danger">*</span></label>
                                    <input type="text" required className="form-control" id="c_email_address"
                                           name="c_email_address" defaultValue={users.email}/>
                                </div>
                                <div className="col-md-6">
                                    <label htmlFor="c_phone" className="text-black">Số điện thoại <span
                                        className="text-danger">*</span></label>
                                    <input type="text" required className="form-control" id="c_phone"
                                           name="c_phone"
                                           placeholder="Số điện thoại" defaultValue={users.phone}/>
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="c_order_notes" className="text-black">Ghi chú</label>
                                <textarea name="c_order_notes" id="c_order_notes" cols="30" rows="5"
                                          className="form-control"
                                          placeholder="Viết ghi chú của bạn ở đây..."></textarea>
                            </div>
                            <div className="d-none">
                                <input type="hidden" id="c_total_product" name="c_total_product"/>
                                <input type="hidden" id="c_total" name="c_total"/>
                                <input type="hidden" id="c_discount_price" name="c_discount_price"/>
                                <input type="hidden" id="coupon_id" name="coupon_id"/>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="row mb-5">
                            <div className="col-md-12">
                                <h2 className="h3 mb-3 text-black">Mã giảm giá</h2>
                                <div className="p-3 p-lg-5 border">

                                    <label htmlFor="c_code" className="text-black mb-3">Nhập mã giảm giá của
                                        bạn...</label>
                                    <div className="input-group w-75">
                                        <input type="text" className="form-control" id="coupon_code"
                                               placeholder="Nhập mã giảm giá" aria-label="Coupon Code"
                                               aria-describedby="button-addon2"/>
                                        <div className="input-group-append">
                                            <button className="btn btn-primary btn-sm" type="button"
                                                    onClick={getCoupon}
                                                    id="button-addon2">Xác nhận
                                            </button>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                        <div className="row mb-5">
                            <div className="col-md-12">
                                <h2 className="h3 mb-3 text-black">Đơn hàng của bạn</h2>
                                <div className="p-3 p-lg-5 border">
                                    <table className="table site-block-order-table mb-5">
                                        <thead>
                                        <tr>
                                            <th>Sản phẩm</th>
                                            <th>Tổng tiền</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {carts.map((cart, index) => {
                                            return (<tr>
                                                <td className="product-name">
                                                    <strong>{cart.product.name}</strong>
                                                </td>
                                                <td className="product-total">
                                                    <strong className="totalCartItem"
                                                            data-total={cart.product_option.sale_price * cart.quantity}>
                                                        {ConvertNumber(cart.product_option.sale_price * cart.quantity)}
                                                    </strong>
                                                </td>
                                            </tr>)
                                        })}
                                        <tr>
                                            <td className="text-black font-weight-bold"><strong>Tổng cộng giỏ
                                                hàng</strong></td>
                                            <td className="text-black" id="CartSubtotal">0đ</td>
                                        </tr>
                                        <tr>
                                            <td className="text-black font-weight-bold"><strong>Phí vận
                                                chuyển</strong></td>
                                            <td className="text-black">0đ</td>
                                        </tr>
                                        <tr>
                                            <td className="text-black font-weight-bold"><strong>Giảm
                                                giá</strong>
                                            </td>
                                            <td className="text-black" id="textDiscount">0đ</td>
                                        </tr>
                                        <tr>
                                            <td className="text-black font-weight-bold"><strong>Tổng đơn
                                                hàng</strong>
                                            </td>
                                            <td className="text-black font-weight-bold"><strong
                                                id="OrderTotal">0đ</strong>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>

                                    <h4 className="mt-3 mb-2 font-weight-bold">Phương thức thanh toán</h4>
                                    <div className="border p-3 mb-3">
                                        <input type="radio" id="cod" value="cod" checked
                                               className="order_method"
                                               name="order_method"/>

                                        <label htmlFor="cod" className="text-black ml-2">
                                            Thanh toán khi nhận hàng
                                        </label>
                                    </div>

                                    <div className="border p-3 mb-5">
                                        <input type="radio" id="ewallet" className="order_method"
                                               name="order_method" value="ewallet"/>
                                        <label htmlFor="ewallet" className="text-black ml-2">
                                            Thanh toán online
                                        </label>
                                    </div>

                                    <div className="form-group">
                                        <button type="submit" id="btnCreate"
                                                className="btn btn-primary btn-lg py-3 btn-block">Đặt hàng
                                        </button>
                                    </div>

                                </div>
                            </div>
                        </div>

                    </div>
                </Form>)}
            </div>
        </div>
        <Footer/>
    </div>)
}

export default Checkout