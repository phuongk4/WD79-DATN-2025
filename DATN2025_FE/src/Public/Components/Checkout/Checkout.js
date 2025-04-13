import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Form, message, Spin} from 'antd';
import {motion, AnimatePresence} from 'framer-motion';
import {FiShoppingBag, FiCreditCard, FiTruck, FiTag, FiDollarSign} from 'react-icons/fi';
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
        try {
            const res = await cartService.listCart();
            if (res.status === 200 && Array.isArray(res.data.data)) {
                console.log("Cart response:", res.data.data);
                // Lọc bỏ các item không hợp lệ và map dữ liệu
                const validCarts = res.data.data.filter(item => 
                    item && item.product && typeof item.quantity === 'number'
                );
                
                if (validCarts.length === 0) {
                    message.warning('Giỏ hàng trống hoặc có lỗi dữ liệu');
                    setCarts([]);
                    return;
                }

                setCarts(validCarts);
            } else {
                console.error("Invalid cart data format:", res.data);
                message.error('Không thể tải dữ liệu giỏ hàng');
                setCarts([]);
            }
        } catch (err) {
            console.error('Error fetching cart:', err);
            message.error('Có lỗi xảy ra khi tải giỏ hàng');
            setCarts([]);
        } finally {
            setLoading(false);
        }
    };

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
        try {
            $('#btnCreate').prop('disabled', true).text('Đang đặt hàng...');
            
            // Validate required fields
            const requiredFields = {
                full_name: 'Họ và tên',
                c_email_address: 'Email',
                c_phone: 'Số điện thoại',
                c_address: 'Địa chỉ'
            };

            const orderData = {};
            let hasError = false;

            // Validate và thu thập dữ liệu
            Object.entries(requiredFields).forEach(([field, label]) => {
                const value = $(`#${field}`).val()?.trim();
                if (!value) {
                    message.error(`${label} không được bỏ trống!`);
                    hasError = true;
                }
                orderData[field] = value;
            });

            if (hasError) {
                $('#btnCreate').prop('disabled', false).text('Đặt hàng');
                return;
            }

            // Thu thập thông tin bổ sung
            orderData.d_address = $('#d_address').val()?.trim() || '';
            orderData.c_order_notes = $('#c_order_notes').val()?.trim() || '';
            
            // Thu thập thông tin đơn hàng
            orderData.c_total_product = parseFloat($('#c_total_product').val()) || 0;
            orderData.c_discount_price = parseFloat($('#c_discount_price').val()) || 0;
            orderData.c_total = parseFloat($('#c_total').val()) || 0;
            orderData.coupon_id = $('#coupon_id').val() || null;

            // Kiểm tra phương thức thanh toán
            const order_method = $('input[name="order_method"]:checked').val();
            if (!order_method) {
                message.error('Vui lòng chọn phương thức thanh toán!');
                $('#btnCreate').prop('disabled', false).text('Đặt hàng');
                return;
            }

            // Thêm thông tin giỏ hàng
            const cartItems = carts.map(cart => ({
                product_id: cart.product.id,
                quantity: cart.quantity,
                price: cart.product.sale_price || cart.product.price,
                attributes: cart.attribute || []
            }));

            orderData.cart_items = cartItems;
            orderData.order_method = order_method === 'cod' ? 'Thanh toán khi nhận hàng' : 'Ví điện tử';

            console.log('Sending order data:', orderData);

            // Xử lý đặt hàng dựa trên phương thức thanh toán
            if (order_method === 'cod') {
                const response = await orderService.createOrder(orderData);
                if (response.status === 200) {
                    message.success('Đặt hàng thành công!');
                    // Xóa dữ liệu giỏ hàng cũ
                    localStorage.removeItem('cart_data');
                    window.location.href = '/thanks-you';
                }
            } else {
                const response = await orderService.createOrderVnpay(orderData);
                if (response.status === 200) {
                    // Lưu thông tin đơn hàng tạm thời
                    localStorage.setItem('order_info', JSON.stringify(orderData));
                    window.location.href = response.data.data;
                }
            }
        } catch (error) {
            console.error('Checkout error:', error);
            message.error(error.response?.data?.message || 'Có lỗi xảy ra khi đặt hàng');
            $('#btnCreate').prop('disabled', false).text('Đặt hàng');
        }
    };

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
        try {
            let total = 0;
            
            // Kiểm tra và tính tổng từ danh sách sản phẩm hợp lệ
            carts.forEach(cart => {
                if (cart && cart.product && typeof cart.quantity === 'number') {
                    const itemPrice = cart.product.sale_price || cart.product.price || 0;
                    const itemTotal = itemPrice * cart.quantity;
                    total += itemTotal;
                }
            });

            // Cập nhật tổng tiền sản phẩm
            $('#c_total_product').val(total);
            $('#CartSubtotal').text(ConvertNumber(total));

            // Tính giảm giá an toàn
            const priceDiscount = parseInt($('#c_discount_price').val() || 0);
            
            // Tính tổng cuối cùng
            let finalTotal = Math.max(0, total - priceDiscount);

            // Cập nhật tổng đơn hàng
            $('#c_total').val(finalTotal);
            $('#OrderTotal').text(ConvertNumber(finalTotal));
            $('#OrderTotalButton').text(ConvertNumber(finalTotal));
        } catch (error) {
            console.error('Error calculating total:', error);
            message.error('Có lỗi xảy ra khi tính tổng đơn hàng');
        }
    };

    useEffect(() => {
        getListProductCart();
    }, []);

    useEffect(() => {
        if (carts.length > 0) {
            calcTotal();
        }
    }, [carts]);

    useEffect(() => {
        getUser();
    }, [loading]);

    return (
        <div className="site-wrap">
            <Header />
            
            <div className="checkout-header">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <nav className="custom-breadcrumb" aria-label="breadcrumb">
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item">
                                        <a href="/">
                                            <FiShoppingBag />
                                            <span>Trang chủ</span>
                                        </a>
                                    </li>
                                    <li className="breadcrumb-item">
                                        <a href="/cart">
                                            <span>Giỏ hàng</span>
                                        </a>
                                    </li>
                                    <li className="breadcrumb-item active">
                                        <span>Thanh toán</span>
                                    </li>
                                </ol>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>

            <div className="checkout-main">
                <div className="container">
                    <AnimatePresence>
                        {loading ? (
                            <div className="loading-container">
                                <Spin size="large" />
                                <p>Đang tải thông tin...</p>
                            </div>
                        ) : carts.length === 0 ? (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="empty-cart-container"
                            >
                                <div className="empty-cart-content">
                                    <div className="empty-cart-icon">
                                        <FiShoppingBag />
                                    </div>
                                    <h2>Giỏ hàng trống</h2>
                                    <p>Hãy thêm sản phẩm vào giỏ hàng để tiến hành thanh toán</p>
                                    <a href="/products" className="btn-shop-now">
                                        Tiếp tục mua sắm
                                    </a>
                                </div>
                            </motion.div>
                        ) : (
                            <Form onFinish={CheckoutCart} className="checkout-form" id="formCheckout">
                                <div className="checkout-grid">
                                    <motion.div 
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="checkout-details"
                                    >
                                        <div className="section-header">
                                            <h2>Thông tin thanh toán</h2>
                                            <p>Vui lòng điền đầy đủ thông tin bên dưới</p>
                                        </div>

                                        <div className="form-container">
                                            <div className="form-group">
                                                <label htmlFor="full_name">
                                                    Họ và tên <span>*</span>
                                                </label>
                                                <input 
                                                    type="text" 
                                                    id="full_name"
                                                    defaultValue={users.full_name}
                                                    required 
                                                />
                                            </div>

                                            <div className="form-row">
                                                <div className="form-group">
                                                    <label htmlFor="c_email_address">
                                                        Email <span>*</span>
                                                    </label>
                                                    <input 
                                                        type="email" 
                                                        id="c_email_address"
                                                        defaultValue={users.email}
                                                        required 
                                                    />
                                                </div>

                                                <div className="form-group">
                                                    <label htmlFor="c_phone">
                                                        Số điện thoại <span>*</span>
                                                    </label>
                                                    <input 
                                                        type="tel" 
                                                        id="c_phone"
                                                        defaultValue={users.phone}
                                                        required 
                                                    />
                                                </div>
                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="c_address">
                                                    Địa chỉ <span>*</span>
                                                </label>
                                                <input 
                                                    type="text" 
                                                    id="c_address"
                                                    defaultValue={users.address}
                                                    placeholder="Số nhà, tên đường..."
                                                    required 
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="d_address">
                                                    Địa chỉ bổ sung
                                                </label>
                                                <input 
                                                    type="text" 
                                                    id="d_address"
                                                    placeholder="Căn hộ, suite, đơn vị, v.v. (tùy chọn)"
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="c_order_notes">
                                                    Ghi chú đơn hàng
                                                </label>
                                                <textarea 
                                                    id="c_order_notes"
                                                    rows="4"
                                                    placeholder="Ghi chú về đơn hàng của bạn, ví dụ: thời gian hay địa điểm giao hàng cụ thể."
                                                ></textarea>
                                            </div>
                                        </div>
                                    </motion.div>

                                    <motion.div 
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="checkout-summary"
                                    >
                                        <div className="order-summary">
                                            <div className="section-header">
                                                <h2>Đơn hàng của bạn</h2>
                                                <p>{carts.length} sản phẩm trong giỏ hàng</p>
                                            </div>

                                            <div className="order-items-container">
                                                <div className="order-items">
                                                    {carts.map((cart, index) => {
                                                        // Kiểm tra tính hợp lệ của dữ liệu
                                                        if (!cart || !cart.product) return null;

                                                        const itemPrice = cart.product.sale_price || cart.product.price || 0;
                                                        const itemTotal = itemPrice * (cart.quantity || 0);
                                                        
                                                        return (
                                                            <motion.div 
                                                                key={index}
                                                                className="order-item"
                                                                initial={{ opacity: 0, y: 10 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                transition={{ delay: index * 0.1 }}
                                                            >
                                                                <div className="product-info">
                                                                    <div className="product-image">
                                                                        <img 
                                                                            src={cart.product.thumbnail ? 
                                                                                `http://127.0.0.1:8000${cart.product.thumbnail}` : 
                                                                                'path_to_default_image'}
                                                                            alt={cart.product.name || 'Sản phẩm'}
                                                                            onError={(e) => {
                                                                                e.target.onerror = null;
                                                                                e.target.src = 'path_to_default_image';
                                                                            }}
                                                                        />
                                                                        <span className="quantity-badge">
                                                                            {cart.quantity || 0}
                                                                        </span>
                                                                    </div>
                                                                    <div className="product-details">
                                                                        <h3 className="product-name">
                                                                            {cart.product.name || 'Sản phẩm không xác định'}
                                                                        </h3>
                                                                        <div className="product-meta">
                                                                            {cart.attribute && Array.isArray(cart.attribute) && 
                                                                                cart.attribute.map((attr, idx) => (
                                                                                    <span key={idx} className="variant-tag">
                                                                                        {attr?.property?.name || ''}
                                                                                    </span>
                                                                                ))
                                                                            }
                                                                            <span className="price-tag">
                                                                                {ConvertNumber(itemPrice)} x {cart.quantity || 0}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="item-total">
                                                                    {ConvertNumber(itemTotal)}
                                                                </div>
                                                            </motion.div>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            <div className="coupon-section">
                                                <div className="section-header">
                                                    <h3>
                                                        <FiTag />
                                                        Mã giảm giá
                                                    </h3>
                                                </div>
                                                <div className="coupon-form">
                                                    <input 
                                                        type="text" 
                                                        id="coupon_code"
                                                        placeholder="Nhập mã giảm giá" 
                                                    />
                                                    <button 
                                                        type="button" 
                                                        onClick={getCoupon}
                                                        className="btn-apply-coupon"
                                                    >
                                                        Áp dụng
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="order-total">
                                                <div className="total-row">
                                                    <span>Tạm tính</span>
                                                    <span id="CartSubtotal">0đ</span>
                                                </div>
                                                <div className="total-row">
                                                    <span>Phí vận chuyển</span>
                                                    <span className="free-shipping">Miễn phí</span>
                                                </div>
                                                <div className="total-row">
                                                    <span>Giảm giá</span>
                                                    <span id="textDiscount" className="discount">0đ</span>
                                                </div>
                                                <div className="total-row grand-total">
                                                    <span>Tổng cộng</span>
                                                    <span id="OrderTotal">0đ</span>
                                                </div>
                                            </div>

                                            <div className="payment-methods">
                                                <div className="section-header">
                                                    <h3>
                                                        <FiCreditCard />
                                                        Phương thức thanh toán
                                                    </h3>
                                                </div>
                                                
                                                <div className="payment-options">
                                                    <label className="payment-option">
                                                        <input 
                                                            type="radio" 
                                                            id="cod" 
                                                            name="order_method"
                                                            value="cod" 
                                                            className="order_method"
                                                            defaultChecked 
                                                        />
                                                        <div className="option-content">
                                                            <FiDollarSign />
                                                            <div className="option-text">
                                                                <span>Thanh toán khi nhận hàng</span>
                                                                <small>Thanh toán bằng tiền mặt khi nhận hàng</small>
                                                            </div>
                                                        </div>
                                                    </label>
                                                    
                                                    <label className="payment-option">
                                                        <input 
                                                            type="radio" 
                                                            id="ewallet" 
                                                            name="order_method"
                                                            value="ewallet" 
                                                            className="order_method"
                                                        />
                                                        <div className="option-content">
                                                            <FiCreditCard />
                                                            <div className="option-text">
                                                                <span>Thanh toán online</span>
                                                                <small>Thanh toán qua ví điện tử hoặc thẻ ngân hàng</small>
                                                            </div>
                                                        </div>
                                                    </label>
                                                </div>
                                            </div>

                                            <button 
                                                type="submit" 
                                                id="btnCreate"
                                                className="btn-place-order"
                                            >
                                                <span>Đặt hàng</span>
                                                <small>Tổng cộng: <span id="OrderTotalButton">0đ</span></small>
                                            </button>
                                        </div>

                                        <div className="d-none">
                                            <input type="hidden" id="c_total_product" name="c_total_product" />
                                            <input type="hidden" id="c_total" name="c_total" />
                                            <input type="hidden" id="c_discount_price" name="c_discount_price" />
                                            <input type="hidden" id="coupon_id" name="coupon_id" />
                                        </div>
                                    </motion.div>
                                </div>
                            </Form>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <Footer />

            <style jsx>{`
                .checkout-header {
                    background: #f8fafc;
                    padding: 1.5rem 0;
                    border-bottom: 1px solid #e2e8f0;
                }

                .breadcrumb {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    margin: 0;
                    padding: 0;
                    background: transparent;
                }

                .breadcrumb-item {
                    display: flex;
                    align-items: center;
                    color: #64748b;
                }

                .breadcrumb-item a {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: #3b82f6;
                    text-decoration: none;
                    transition: color 0.2s;
                }

                .breadcrumb-item a:hover {
                    color: #2563eb;
                }

                .breadcrumb-item.active {
                    color: #0f172a;
                }

                .checkout-main {
                    padding: 3rem 0;
                    background: #f1f5f9;
                    min-height: calc(100vh - 200px);
                }

                .loading-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    min-height: 400px;
                    gap: 1rem;
                }

                .loading-container p {
                    color: #64748b;
                    margin: 0;
                }

                .empty-cart-container {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    min-height: 400px;
                }

                .empty-cart-content {
                    text-align: center;
                    max-width: 400px;
                }

                .empty-cart-icon {
                    font-size: 4rem;
                    color: #94a3b8;
                    margin-bottom: 1.5rem;
                }

                .empty-cart-content h2 {
                    color: #1e293b;
                    margin-bottom: 0.75rem;
                }

                .empty-cart-content p {
                    color: #64748b;
                    margin-bottom: 2rem;
                }

                .btn-shop-now {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    background: #3b82f6;
                    color: white;
                    padding: 0.75rem 2rem;
                    border-radius: 0.75rem;
                    text-decoration: none;
                    font-weight: 500;
                    transition: all 0.2s;
                }

                .btn-shop-now:hover {
                    background: #2563eb;
                    transform: translateY(-1px);
                }

                .checkout-grid {
                    display: grid;
                    grid-template-columns: 1fr 450px;
                    gap: 2rem;
                }

                .section-header {
                    margin-bottom: 2rem;
                }

                .section-header h2 {
                    color: #0f172a;
                    font-size: 1.5rem;
                    font-weight: 600;
                    margin: 0 0 0.5rem;
                }

                .section-header h3 {
                    color: #0f172a;
                    font-size: 1.25rem;
                    font-weight: 600;
                    margin: 0 0 0.5rem;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .section-header p {
                    color: #64748b;
                    margin: 0;
                }

                .form-container {
                    background: white;
                    border-radius: 1rem;
                    padding: 2rem;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                }

                .form-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1rem;
                }

                .form-group {
                    margin-bottom: 1.5rem;
                }

                .form-group:last-child {
                    margin-bottom: 0;
                }

                .form-group label {
                    display: block;
                    color: #0f172a;
                    font-weight: 500;
                    margin-bottom: 0.5rem;
                }

                .form-group label span {
                    color: #ef4444;
                }

                .form-group input,
                .form-group textarea {
                    width: 100%;
                    padding: 0.75rem 1rem;
                    border: 1px solid #e2e8f0;
                    border-radius: 0.75rem;
                    background: #f8fafc;
                    color: #0f172a;
                    transition: all 0.2s;
                }

                .form-group input:focus,
                .form-group textarea:focus {
                    outline: none;
                    border-color: #3b82f6;
                    background: white;
                    box-shadow: 0 0 0 4px rgba(59,130,246,0.1);
                }

                .form-group input::placeholder,
                .form-group textarea::placeholder {
                    color: #94a3b8;
                }

                .order-summary {
                    background: white;
                    border-radius: 1rem;
                    padding: 2rem;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                }

                .order-items-container {
                    position: relative;
                    margin: 1.5rem -2rem;
                    background: linear-gradient(#fff 30%, rgba(255, 255, 255, 0)),
                                linear-gradient(rgba(255, 255, 255, 0), #fff 70%) 0 100%,
                                radial-gradient(farthest-side at 50% 0, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0)),
                                radial-gradient(farthest-side at 50% 100%, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0)) 0 100%;
                    background-repeat: no-repeat;
                    background-size: 100% 40px, 100% 40px, 100% 14px, 100% 14px;
                    background-attachment: local, local, scroll, scroll;
                }

                .order-items {
                    max-height: 400px;
                    overflow-y: auto;
                    padding: 0 2rem;
                    scrollbar-width: thin;
                    scrollbar-color: #94a3b8 #e2e8f0;
                }

                .order-items::-webkit-scrollbar {
                    width: 6px;
                }

                .order-items::-webkit-scrollbar-track {
                    background: #e2e8f0;
                    border-radius: 3px;
                }

                .order-items::-webkit-scrollbar-thumb {
                    background-color: #94a3b8;
                    border-radius: 3px;
                }

                .order-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    padding: 0.75rem;
                    background: white;
                    border-radius: 0.5rem;
                    margin-bottom: 0.5rem;
                    border: 1px solid #e2e8f0;
                    transition: all 0.2s ease;
                }

                .order-item:hover {
                    border-color: #3b82f6;
                    transform: translateX(2px);
                }

                .order-item:last-child {
                    margin-bottom: 0;
                }

                .product-info {
                    display: flex;
                    gap: 0.75rem;
                    flex: 1;
                    min-width: 0;
                }

                .product-image {
                    position: relative;
                    width: 60px;
                    height: 60px;
                    border-radius: 0.375rem;
                    overflow: hidden;
                    flex-shrink: 0;
                }

                .product-image img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .quantity-badge {
                    position: absolute;
                    top: -0.25rem;
                    right: -0.25rem;
                    background: #3b82f6;
                    color: white;
                    width: 1.25rem;
                    height: 1.25rem;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.75rem;
                    font-weight: 500;
                }

                .product-details {
                    flex: 1;
                    min-width: 0;
                }

                .product-name {
                    color: #1e293b;
                    font-size: 0.875rem;
                    font-weight: 500;
                    margin: 0 0 0.25rem;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .product-meta {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.375rem;
                    font-size: 0.75rem;
                }

                .variant-tag {
                    background: #f1f5f9;
                    color: #64748b;
                    padding: 0.125rem 0.5rem;
                    border-radius: 1rem;
                    white-space: nowrap;
                }

                .price-tag {
                    color: #64748b;
                }

                .item-total {
                    font-weight: 600;
                    color: #0f172a;
                    font-size: 0.875rem;
                    padding-left: 0.75rem;
                    flex-shrink: 0;
                }

                .coupon-section {
                    padding: 1.5rem;
                    background: #f8fafc;
                    border-radius: 0.75rem;
                    margin: 2rem 0;
                }

                .coupon-form {
                    display: flex;
                    gap: 0.75rem;
                }

                .coupon-form input {
                    flex: 1;
                    padding: 0.75rem 1rem;
                    border: 1px solid #e2e8f0;
                    border-radius: 0.75rem;
                    background: white;
                }

                .btn-apply-coupon {
                    padding: 0.75rem 1.5rem;
                    background: #3b82f6;
                    color: white;
                    border: none;
                    border-radius: 0.75rem;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .btn-apply-coupon:hover {
                    background: #2563eb;
                }

                .order-total {
                    margin: 2rem 0;
                }

                .total-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0.75rem 0;
                    color: #64748b;
                }

                .free-shipping {
                    color: #10b981;
                }

                .discount {
                    color: #ef4444;
                }

                .grand-total {
                    border-top: 2px solid #e2e8f0;
                    margin-top: 0.5rem;
                    padding-top: 1rem;
                    font-weight: 600;
                    color: #0f172a;
                    font-size: 1.125rem;
                }

                .payment-methods {
                    margin: 2rem 0;
                }

                .payment-options {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .payment-option {
                    position: relative;
                    display: block;
                    margin: 0;
                    cursor: pointer;
                }

                .payment-option input {
                    position: absolute;
                    opacity: 0;
                    cursor: pointer;
                    height: 0;
                    width: 0;
                }

                .option-content {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 1rem;
                    background: #f8fafc;
                    border: 2px solid #e2e8f0;
                    border-radius: 0.75rem;
                    transition: all 0.2s;
                }

                .payment-option input:checked ~ .option-content {
                    border-color: #3b82f6;
                    background: #eff6ff;
                }

                .option-content svg {
                    color: #64748b;
                    font-size: 1.5rem;
                }

                .option-text {
                    display: flex;
                    flex-direction: column;
                }

                .option-text span {
                    color: #0f172a;
                    font-weight: 500;
                }

                .option-text small {
                    color: #64748b;
                }

                .btn-place-order {
                    width: 100%;
                    padding: 1rem;
                    background: #3b82f6;
                    border: none;
                    border-radius: 0.75rem;
                    color: white;
                    cursor: pointer;
                    transition: all 0.2s;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0.25rem;
                }

                .btn-place-order:hover {
                    background: #2563eb;
                    transform: translateY(-1px);
                }

                .btn-place-order span {
                    font-size: 1.125rem;
                    font-weight: 600;
                }

                .btn-place-order small {
                    opacity: 0.9;
                }

                @media (max-width: 1200px) {
                    .checkout-grid {
                        grid-template-columns: 1fr 400px;
                    }
                }

                @media (max-width: 991px) {
                    .checkout-grid {
                        grid-template-columns: 1fr;
                    }

                    .checkout-summary {
                        order: -1;
                    }
                }

                @media (max-width: 768px) {
                    .order-items {
                        max-height: 300px;
                    }
                }

                @media (max-width: 576px) {
                    .checkout-main {
                        padding: 1.5rem 0;
                    }

                    .form-container,
                    .order-summary {
                        padding: 1.5rem;
                    }

                    .form-row {
                        grid-template-columns: 1fr;
                    }

                    .order-item {
                        padding: 0.5rem;
                    }

                    .product-image {
                        width: 48px;
                        height: 48px;
                    }

                    .product-name {
                        font-size: 0.813rem;
                    }

                    .product-meta {
                        font-size: 0.688rem;
                    }

                    .item-total {
                        font-size: 0.813rem;
                    }

                    .coupon-form {
                        flex-direction: column;
                    }

                    .btn-apply-coupon {
                        width: 100%;
                    }

                    .order-items-container {
                        margin: 1rem -1.5rem;
                    }

                    .order-items {
                        padding: 0 1.5rem;
                        max-height: 250px;
                    }
                }
            `}</style>
        </div>
    );
}

export default Checkout