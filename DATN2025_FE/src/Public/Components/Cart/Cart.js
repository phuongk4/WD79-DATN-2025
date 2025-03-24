import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { message } from 'antd';
import Header from "../Shared/Client/Header/Header";
import Footer from "../Shared/Client/Footer/Footer";
import $ from "jquery";
import cartService from "../Service/CartService";
import ConvertNumber from "../Shared/Utils/ConvertNumber";
import LoadingPage from "../Shared/Utils/LoadingPage";

/**
 * The cart page component.
 *
 * This component displays the cart page, showing all the products in the cart
 * and the total price. It also allows the user to update the cart, apply a coupon
 * and proceed to checkout.
 *
 * @returns {JSX.Element} The cart page component.
 */
function Cart() {
    const [loading, setLoading] = useState(true);
    const [carts, setCarts] = useState([]);

    /**
     * Retrieves the list of products in the cart from the server and updates the
     * component state accordingly.
     *
     * @returns {Promise<void>}
     */
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
                let message = err.response.data.message;
                if (!message) {
                    message = err.response.data.status;
                    alert(message);
                    window.location.href = '/login';
                } else {
                    alert(message)
                    if (err.response.status === 444 || err.response.status === 401) {
                        window.location.href = '/login'
                    }
                }
            })
    }

    /**
     * Updates the quantity of a product in the cart.
     *
     * @param {number} id - product id
     * @param {number} qty - new quantity
     *
     * @returns {Promise<void>}
     */
    const handleQuantityChange = async (id, qty) => {
        let data = {
            quantity: qty
        };

        await cartService.updateCart(id, data)
            .then((res) => {
                if (res.status === 200) {
                    console.log("update cart", res.data.data)

                    let cart = res.data.data;

                    let newQty = cart.quantity;
                    let price = $('#inputQuantity' + id).data('price');

                    let total = ConvertNumber(newQty * price);
                    $('#totalCartItem' + id).text(total);

                    calcTotal();
                }
            })
            .catch((err) => {
                console.log(err.response.data.message)
                alert(err.response.data.message)
                if (err.response.status === 444 || err.response.status === 401) {
                    window.location.href = '/login'
                }
            })
    }

    /**
     * Removes a product from cart.
     * @param {number} id - product id
     * @return {Promise<void>}
     */
    const removeFromCart = async (id) => {
        if (window.confirm('Bạn chắc chắn muốn xoá sản phẩm khỏi giỏ hàng?')) {
            LoadingPage();
            await cartService.deleteCart(id)
                .then((res) => {
                    LoadingPage();
                    if (res.status === 200) {
                        console.log("remove cart success")
                        // getListProductCart();
                        // calcTotal();
                        alert('Xóa sản phẩm khỏi giỏ hàng thành công!');
                        window.location.reload();
                    }
                })
                .catch((err) => {
                    LoadingPage();
                    console.log(err)
                })
        }
    }

    /**
     * Removes all products from the cart.
     *
     * This function clears the cart by making a call to the server and then
     * reloads the page.
     *
     * @returns {Promise<void>}
     */
    const clearCart = async () => {
        if (window.confirm('Bạn chắc chắn muốn làm trống giỏ hàng?')) {
            LoadingPage();
            await cartService.clearCart()
                .then((res) => {
                    LoadingPage();
                    if (res.status === 200) {
                        console.log("clear cart success")
                        alert('Xóa toàn bộ sản phẩm khỏi giỏ hàng thành công!');
                        window.location.reload();
                    }
                    // getListProductCart();
                    // calcTotal();
                })
                .catch((err) => {
                    console.log(err)
                    LoadingPage();
                })
        }
    }

    /**
     * Handles changes to a product's quantity in the cart.
     *
     * This function is called whenever the user changes the quantity of a
     * product in the cart. It first checks if the input is numeric and if not,
     * it removes all non-numeric characters from the input. It then makes a call
     * to the server to update the quantity of the product in the cart.
     *
     * @param {object} el - The input element that triggered this function.
     * @returns {Promise<void>}
     */
    const checkInput = async (el) => {
        let val = $(el).val();
        if (!$.isNumeric(val)) {
            val = val.replace(/\D/g, '');
            $(el).val(val);
        }

        let cart_id = $(el).data('id')
        await handleQuantityChange(cart_id, val);
    };

    /**
     * Decreases the quantity of a product in the cart by one.
     *
     * If the quantity of the product is greater than one, this function
     * decreases the quantity by one and makes a call to the server to
     * update the quantity in the cart.
     *
     * @param {object} el - The minus button element that triggered this function.
     * @returns {Promise<void>}
     */
    const minusQuantity = async (el) => {
        let qty = $(el).parent().next().val();
        qty = parseInt(qty);
        if (qty > 1) {
            qty = qty - 1;
            $(el).parent().next().val(qty);
        }

        let cart_id = $(el).parent().next().data('id')
        await handleQuantityChange(cart_id, qty);
    }

    /**
     * Increases the quantity of a product in the cart by one.
     *
     * If the quantity of the product is greater than zero, this function
     * increases the quantity by one and makes a call to the server to
     * update the quantity in the cart.
     *
     * @param {object} el - The plus button element that triggered this function.
     * @returns {Promise<void>}
     */
    const plusQuantity = async (el) => {
        let qty = $(el).parent().prev().val();
        qty = parseInt(qty);
        qty = qty + 1;
        $(el).parent().prev().val(qty);

        let cart_id = $(el).parent().prev().data('id')
        await handleQuantityChange(cart_id, qty);
    }

    /**
     * Calculates the total price of all items in the cart.
     *
     * This function loops through all elements with the class `totalCartItem`
     * and adds up their values. It then sets the total cart price to the
     * calculated total.
     */
    const calcTotal = () => {
        let total = 0;
        let totalCartItems = $('.totalCartItem');
        totalCartItems.each(function () {
            let totalCartItem = $(this).text();
            totalCartItem = totalCartItem.replaceAll('.', '').replaceAll('đ', '');
            total = parseInt(totalCartItem) + total;
        })

        total = ConvertNumber(total);

        $('#totalCart').text(total);
        $('#subTotalCart').text(total);
    }

    useEffect(() => {
        getListProductCart();
        calcTotal();
    }, [loading]);

    return (<div className="site-wrap">
        <Header />
        <div className="bg-light py-3">
            <div className="container">
                <div className="row">
                    <div className="col-md-12 mb-0"><a href="/">Trang chủ</a> <span
                        className="mx-2 mb-0">/</span> <strong className="text-black">Giỏ hàng</strong></div>
                </div>
            </div>
        </div>

        <div className="site-section">
            <div className="container">
                <div className="row mb-5">
                    <div className="col-md-12">
                        <div className="site-blocks-table">
                            {carts.length === 0 ? (
                                <div>
                                    <div className="text-center">
                                        <p>Giỏ hàng của bạn hiện đang trống.</p>
                                    </div>
                                </div>
                            ) : (
                                <table className="table table-bordered">
                                    <colgroup>
                                        <col width="15%" />
                                        <col width="x" />
                                        <col width="10%" />
                                        <col width="15%" />
                                        <col width="10%" />
                                        <col width="5%" />
                                    </colgroup>
                                    <thead>
                                        <tr>
                                            <th className="product-thumbnail">Hình ảnh</th>
                                            <th className="product-name">Sản phẩm</th>
                                            <th className="product-price">Giá</th>
                                            <th className="product-quantity">Số lượng</th>
                                            <th className="product-total">Thành tiền</th>
                                            <th className="product-remove">Xoá</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {carts.map((cart, index) => {
                                            return (<tr key={index}>
                                                <td className="product-thumbnail">
                                                    <img
                                                        src={`http://127.0.0.1:8000${cart.product.thumbnail}`}
                                                        alt="Top Up T-Shirt"
                                                        className="img-fluid"
                                                    />
                                                </td>

                                                <td className="product-name">
                                                    <h2 className="h5 text-black">{cart.product.name}</h2>
                                                    <div className="list-option mt-2 ">
                                                        {
                                                            cart.attribute.map((item1, index1) => {
                                                                return (
                                                                    <div key={index1}
                                                                        className="d-flex align-items-center justify-content-start">
                                                                        <p>{item1.attribute.name}: </p>
                                                                        <p>{item1.property.name}</p>
                                                                    </div>
                                                                );
                                                            })
                                                        }
                                                    </div>
                                                </td>
                                                <td>{ConvertNumber(cart.product_option.sale_price)}</td>
                                                <td>
                                                    <div className="input-group mb-3">
                                                        <div className="input-group-prepend">
                                                            <button className="btn btn-outline-primary js-btn-minus"
                                                                onClick={(e) => minusQuantity(e.target)}
                                                                type="button">-
                                                            </button>
                                                        </div>
                                                        <input type="text" className="form-control text-center"
                                                            style={{ width: '30px' }}
                                                            defaultValue={cart.quantity} id={'inputQuantity' + cart.id}
                                                            onInput={(e) => checkInput(e.target)}
                                                            min="1" data-id={cart.id}
                                                            data-price={cart.product_option.sale_price}
                                                            aria-label="Quantity" />
                                                        <div className="input-group-append">
                                                            <button className="btn btn-outline-primary js-btn-plus"
                                                                onClick={(e) => plusQuantity(e.target)}
                                                                type="button">+
                                                            </button>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <p className="totalCartItem" id={'totalCartItem' + cart.id}>
                                                        {ConvertNumber(cart.product_option.sale_price * cart.quantity)}
                                                    </p>
                                                </td>
                                                <td>
                                                    <button className="btn btn-danger btn-sm"
                                                        onClick={() => removeFromCart(cart.id)}>X
                                                    </button>
                                                </td>
                                            </tr>);
                                        })}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6">
                        {carts.length === 0 ? (
                            <div>

                            </div>
                        ) : (
                            <div className="row mb-5">
                                <div className="col-md-6 mb-3 mb-md-0">
                                    <button className="btn btn-danger btn-sm btn-block" onClick={clearCart}>
                                        Làm trống giỏ hàng
                                    </button>
                                </div>
                                <div className="col-md-6">
                                    <a href='/products' className="btn btn-outline-primary btn-sm btn-block">
                                        Tiếp tục mua sắm
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="col-md-6 pl-5">
                        <div className="row justify-content-end">
                            <div className="col-md-7">
                                <div className="row">
                                    <div className="col-md-12 text-right border-bottom mb-5">
                                        <h3 className="text-black h4 text-uppercase">Tổng số giỏ hàng</h3>
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <span className="text-black">Tổng cộng</span>
                                    </div>
                                    <div className="col-md-6 text-right">
                                        <strong className="text-black" id="subTotalCart">0đ</strong>
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <span className="text-black">Vận chuyển</span>
                                    </div>
                                    <div className="col-md-6 text-right">
                                        <strong className="text-black">- 0đ</strong>
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <span className="text-black">Giảm giá</span>
                                    </div>
                                    <div className="col-md-6 text-right">
                                        <strong className="text-black">+ 0đ</strong>
                                    </div>
                                </div>
                                <div className="row mb-5">
                                    <div className="col-md-6">
                                        <span className="text-black">Thành tiền</span>
                                    </div>
                                    <div className="col-md-6 text-right">
                                        <strong className="text-black" id="totalCart">0đ</strong>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-12">
                                        {carts.length === 0 ? (
                                            <a href='/products' className="btn btn-primary btn-lg py-3 btn-block">
                                                Quay lại
                                            </a>
                                        ) : (
                                            <a href='/checkout' className="btn btn-primary btn-lg py-3 btn-block">
                                                Tiến hành thanh toán
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <Footer />
    </div>)
}

export default Cart