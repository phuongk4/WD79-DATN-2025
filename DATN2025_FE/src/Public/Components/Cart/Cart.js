import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { message, Spin, Empty } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMinus, FiPlus, FiTrash2, FiShoppingBag } from 'react-icons/fi';
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
    const [isInitialized, setIsInitialized] = useState(false);

    /**
     * Retrieves the list of products in the cart from the server and updates the
     * component state accordingly.
     *
     * @returns {Promise<void>}
     */
    const getListProductCart = async () => {
        try {
            const res = await cartService.listCart();
            if (res.status === 200) {
                console.log('Cart API Response:', res.data.data);
                const cartData = res.data.data.map(item => {
                    const price = item.product.sale_price || item.product.price;
                    
                    // Xử lý thuộc tính sản phẩm
                    let attributes = [];
                    
                    // Kiểm tra nếu có thuộc tính trong cart item
                    if (item.attribute && Array.isArray(item.attribute)) {
                        attributes = item.attribute.map(attr => ({
                            attribute_name: attr.attribute.name,
                            property_name: attr.property.name
                        }));
                    }
                    
                    console.log('Item attributes:', attributes);

                    return {
                        ...item,
                        price: price,
                        total: price * item.quantity,
                        attributes: attributes
                    };
                });
                
                console.log('Final cart data:', cartData);
                setCarts(cartData);
            }
        } catch (err) {
            console.error('Error fetching cart:', err);
            message.error('Có lỗi xảy ra khi tải giỏ hàng');
        } finally {
            setLoading(false);
            setIsInitialized(true);
        }
    };

    /**
     * Updates the quantity of a product in the cart.
     *
     * @param {number} id - product id
     * @param {number} qty - new quantity
     *
     * @returns {Promise<void>}
     */
    const handleQuantityChange = async (id, qty) => {
        try {
            // Kiểm tra số lượng tối thiểu
            if (qty < 1) {
                message.warning('Số lượng tối thiểu là 1');
                return;
            }

            // Tìm sản phẩm trong cart để kiểm tra số lượng tồn
            const currentCart = carts.find(item => item.id === id);
            if (!currentCart) return;

            // Kiểm tra số lượng tồn
            if (qty > currentCart.product.quantity) {
                message.warning(`Chỉ còn ${currentCart.product.quantity} sản phẩm trong kho`);
                return;
            }

            setLoading(true);
            const data = { quantity: qty };
            const res = await cartService.updateCart(id, data);
            
            if (res.status === 200) {
                const updatedCart = res.data.data;
                // Cập nhật state local thay vì gọi lại API
                setCarts(prevCarts => 
                    prevCarts.map(cart => 
                        cart.id === id 
                            ? {
                                ...cart,
                                quantity: updatedCart.quantity,
                                total: (cart.product.sale_price || cart.product.price) * updatedCart.quantity
                            }
                            : cart
                    )
                );

                // Cập nhật hiển thị
                const price = currentCart.product.sale_price || currentCart.product.price;
                const total = price * updatedCart.quantity;
                $(`#totalCartItem${id}`).text(ConvertNumber(total));
                calcTotal();
            }
        } catch (err) {
            console.error('Lỗi khi cập nhật số lượng:', err);
            message.error('Có lỗi xảy ra khi cập nhật số lượng');
        } finally {
            setLoading(false);
        }
    };

    // Thêm debounce để tránh gọi API quá nhiều lần
    const debouncedHandleQuantityChange = (id, qty) => {
        if (window.quantityUpdateTimeout) {
            clearTimeout(window.quantityUpdateTimeout);
        }
        window.quantityUpdateTimeout = setTimeout(() => {
            handleQuantityChange(id, qty);
        }, 500);
    };

    /**
     * Removes a product from cart.
     * @param {number} id - product id
     * @return {Promise<void>}
     */
    const removeFromCart = async (id) => {
        if (window.confirm('Bạn chắc chắn muốn xoá sản phẩm khỏi giỏ hàng?')) {
            try {
                setLoading(true);
                const res = await cartService.deleteCart(id);
                if (res.status === 200) {
                    message.success('Xóa sản phẩm khỏi giỏ hàng thành công!');
                    await getListProductCart();
                }
            } catch (err) {
                console.error('Lỗi khi xóa sản phẩm:', err);
                message.error('Có lỗi xảy ra khi xóa sản phẩm');
            } finally {
                setLoading(false);
            }
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
            try {
                setLoading(true);
                const res = await cartService.clearCart();
                if (res.status === 200) {
                    message.success('Xóa toàn bộ sản phẩm khỏi giỏ hàng thành công!');
                    await getListProductCart();
                }
            } catch (err) {
                console.error('Lỗi khi xóa giỏ hàng:', err);
                message.error('Có lỗi xảy ra khi xóa giỏ hàng');
            } finally {
                setLoading(false);
            }
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
        // Chỉ cho phép số
        if (!$.isNumeric(val)) {
            val = val.replace(/\D/g, '');
            $(el).val(val);
        }

        // Đảm bảo số lượng tối thiểu là 1
        val = parseInt(val) || 1;
        $(el).val(val);

        const cart_id = $(el).data('id');
        debouncedHandleQuantityChange(cart_id, val);
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
        // Tìm input gần nhất
        const input = $(el).closest('.quantity-control').find('.quantity-input');
        let qty = parseInt(input.val());
        if (qty > 1) {
            qty = qty - 1;
            input.val(qty);
            const cart_id = input.data('id');
            debouncedHandleQuantityChange(cart_id, qty);
        } else {
            message.warning('Số lượng tối thiểu là 1');
        }
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
        // Tìm input gần nhất
        const input = $(el).closest('.quantity-control').find('.quantity-input');
        let qty = parseInt(input.val()) || 0;
        qty = qty + 1;
        
        const cart_id = input.data('id');
        // Kiểm tra số lượng tồn trước khi tăng
        const currentCart = carts.find(item => item.id === cart_id);
        if (currentCart && qty > currentCart.product.quantity) {
            message.warning(`Chỉ còn ${currentCart.product.quantity} sản phẩm trong kho`);
            return;
        }

        input.val(qty);
        debouncedHandleQuantityChange(cart_id, qty);
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
        $('.totalCartItem').each(function() {
            let itemTotal = $(this).text().replaceAll('.', '').replaceAll('đ', '');
            total += parseInt(itemTotal) || 0;
        });
        
        const formattedTotal = ConvertNumber(total);
        $('#totalCart').text(formattedTotal);
        $('#subTotalCart').text(formattedTotal);
    };

    useEffect(() => {
        // Chỉ gọi API khi component mount lần đầu
        if (!isInitialized) {
            getListProductCart();
        }
    }, [isInitialized]);

    // Tính tổng giỏ hàng khi carts thay đổi
    useEffect(() => {
        if (isInitialized) {
            calcTotal();
        }
    }, [carts, isInitialized]);

    return (
        <div className="site-wrap">
            <Header />
            <div className="bg-light py-4">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <nav className="custom-breadcrumb" aria-label="breadcrumb">
                                <ol className="breadcrumb bg-transparent p-0 m-0">
                                    <li className="breadcrumb-item">
                                        <a href="/" className="text-primary">
                                            <i className="fas fa-home mr-1"></i>
                                            Trang chủ
                                        </a>
                                    </li>
                                    <li className="breadcrumb-item active">
                                        Giỏ hàng
                                    </li>
                                </ol>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>

            <div className="site-section py-5">
                <div className="container">
                    <AnimatePresence>
                        {loading ? (
                            <div className="loading-container">
                                <Spin size="large" />
                            </div>
                        ) : (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="row">
                                    <div className="col-lg-8 mb-4 mb-lg-0">
                                        <div className="cart-items-container">
                                            {carts.length === 0 ? (
                                                <div className="empty-cart">
                                                    <Empty
                                                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                                                        description={
                                                            <div className="empty-cart-text">
                                                                <h5>Giỏ hàng trống</h5>
                                                                <p className="text-muted">
                                                                    Hãy thêm sản phẩm vào giỏ hàng của bạn
                                                                </p>
                                                            </div>
                                                        }
                                                    >
                                                        <a href="/products" className="btn btn-primary btn-lg">
                                                            <FiShoppingBag className="mr-2" />
                                                            Tiếp tục mua sắm
                                                        </a>
                                                    </Empty>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="cart-header mb-4">
                                                        <h4 className="mb-0">Giỏ hàng của bạn ({carts.length} sản phẩm)</h4>
                                                    </div>
                                                    <div className="cart-items-scroll">
                                                        {carts.map((cart, index) => (
                                                            <motion.div
                                                                key={index}
                                                                className="cart-item"
                                                                initial={{ opacity: 0, y: 20 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                exit={{ opacity: 0, y: -20 }}
                                                                transition={{ delay: index * 0.1 }}
                                                            >
                                                                <div className="cart-item-image">
                                                                    <img
                                                                        src={`http://127.0.0.1:8000${cart.product.thumbnail}`}
                                                                        alt={cart.product.name}
                                                                        className="img-fluid rounded"
                                                                    />
                                                                </div>
                                                                <div className="cart-item-content">
                                                                    <div className="cart-item-details">
                                                                        <h5 className="cart-item-title">{cart.product.name}</h5>
                                                                        <div className="cart-item-options">
                                                                            {cart.attribute && Array.isArray(cart.attribute) && cart.attribute.map((attr, index) => (
                                                                                <div key={index} className="cart-item-option">
                                                                                    <span className="option-label">
                                                                                        {attr.attribute.name}:
                                                                                    </span>
                                                                                    <span className="option-value ms-1">
                                                                                        {attr.property.name}
                                                                                    </span>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                        <div className="cart-item-price">
                                                                            {ConvertNumber(cart.product.sale_price || cart.product.price)}
                                                                        </div>
                                                                    </div>
                                                                    <div className="cart-item-actions">
                                                                        <div className="quantity-control">
                                                                            <button
                                                                                className="btn btn-quantity"
                                                                                onClick={(e) => minusQuantity(e.currentTarget)}
                                                                            >
                                                                                <FiMinus size={16} />
                                                                            </button>
                                                                            <input
                                                                                type="text"
                                                                                className="form-control quantity-input"
                                                                                value={cart.quantity}
                                                                                onChange={(e) => checkInput(e.target)}
                                                                                data-id={cart.id}
                                                                                data-price={cart.product.sale_price || cart.product.price}
                                                                            />
                                                                            <button
                                                                                className="btn btn-quantity"
                                                                                onClick={(e) => plusQuantity(e.currentTarget)}
                                                                            >
                                                                                <FiPlus size={16} />
                                                                            </button>
                                                                        </div>
                                                                        <div className="cart-item-total">
                                                                            <span className="totalCartItem" id={`totalCartItem${cart.id}`}>
                                                                                {ConvertNumber((cart.product.sale_price || cart.product.price) * cart.quantity)}
                                                                            </span>
                                                                        </div>
                                                                        <button
                                                                            className="btn btn-remove"
                                                                            onClick={() => removeFromCart(cart.id)}
                                                                        >
                                                                            <FiTrash2 size={18} />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </motion.div>
                                                        ))}
                                                    </div>
                                                    <div className="cart-actions mt-4">
                                                        <button 
                                                            className="btn btn-outline-danger"
                                                            onClick={clearCart}
                                                        >
                                                            <FiTrash2 className="mr-2" />
                                                            Làm trống giỏ hàng
                                                        </button>
                                                        <a 
                                                            href='/products' 
                                                            className="btn btn-outline-primary"
                                                        >
                                                            <FiShoppingBag className="mr-2" />
                                                            Tiếp tục mua sắm
                                                        </a>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    {carts.length > 0 && (
                                        <div className="col-lg-4">
                                            <div className="cart-summary">
                                                <h5 className="cart-summary-title">
                                                    Tổng đơn hàng
                                                </h5>
                                                <div className="cart-summary-item">
                                                    <span>Tạm tính</span>
                                                    <span className="font-weight-bold" id="subTotalCart">0đ</span>
                                                </div>
                                                <div className="cart-summary-item">
                                                    <span>Phí vận chuyển</span>
                                                    <span className="text-success">Miễn phí</span>
                                                </div>
                                                <div className="cart-summary-item">
                                                    <span>Giảm giá</span>
                                                    <span>0đ</span>
                                                </div>
                                                <div className="cart-summary-total">
                                                    <span>Tổng cộng</span>
                                                    <span className="total-amount" id="totalCart">0đ</span>
                                                </div>
                                                <a 
                                                    href='/checkout'
                                                    className="btn btn-primary btn-checkout"
                                                >
                                                    Tiến hành thanh toán
                                                </a>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
            <Footer />

            <style jsx>{`
                .loading-container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 400px;
                }

                .custom-breadcrumb {
                    padding: 0;
                }

                .custom-breadcrumb .breadcrumb {
                    font-size: 0.95rem;
                }

                .cart-items-container {
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 2px 12px rgba(0,0,0,0.08);
                    padding: 2rem;
                }

                .cart-items-scroll {
                    max-height: 400px;
                    overflow-y: auto;
                    margin: 0 -1rem;
                    padding: 0 1rem;
                    scrollbar-width: thin;
                    scrollbar-color: #94a3b8 #e2e8f0;
                }

                .cart-items-scroll::-webkit-scrollbar {
                    width: 4px;
                }

                .cart-items-scroll::-webkit-scrollbar-track {
                    background: #e2e8f0;
                    border-radius: 2px;
                }

                .cart-items-scroll::-webkit-scrollbar-thumb {
                    background-color: #94a3b8;
                    border-radius: 2px;
                }

                .cart-header {
                    color: #2c3e50;
                }

                .empty-cart {
                    text-align: center;
                    padding: 3rem 0;
                }

                .empty-cart-text h5 {
                    margin-bottom: 0.5rem;
                    color: #2c3e50;
                }

                .cart-item {
                    display: flex;
                    padding: 1.5rem 0;
                    border-bottom: 1px solid #eee;
                    transition: all 0.2s;
                }

                .cart-item:hover {
                    background: #f8fafc;
                }

                .cart-item:last-child {
                    border-bottom: none;
                }

                .cart-item-image {
                    width: 120px;
                    margin-right: 1.5rem;
                }

                .cart-item-image img {
                    width: 100%;
                    height: auto;
                    object-fit: cover;
                }

                .cart-item-content {
                    flex: 1;
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                }

                .cart-item-title {
                    font-size: 1.1rem;
                    margin-bottom: 0.5rem;
                    color: #2c3e50;
                }

                .cart-item-options {
                    margin-bottom: 0.5rem;
                }

                .cart-item-option {
                    display: flex;
                    align-items: center;
                    margin-bottom: 0.25rem;
                    font-size: 0.9rem;
                    color: #666;
                }

                .option-label {
                    font-weight: 500;
                    margin-right: 0.5rem;
                }

                .cart-item-price {
                    font-weight: 600;
                    color: #2c3e50;
                    font-size: 1.1rem;
                }

                .cart-item-actions {
                    display: flex;
                    align-items: center;
                    gap: 1.5rem;
                }

                .quantity-control {
                    display: flex;
                    align-items: center;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    overflow: hidden;
                }

                .btn-quantity {
                    background: none;
                    border: none;
                    padding: 0.5rem 0.75rem;
                    color: #666;
                    transition: all 0.2s;
                }

                .btn-quantity:hover {
                    background: #f8f9fa;
                    color: #000;
                }

                .quantity-input {
                    width: 60px;
                    text-align: center;
                    border: none;
                    border-left: 1px solid #ddd;
                    border-right: 1px solid #ddd;
                    border-radius: 0;
                    padding: 0.5rem;
                    font-weight: 600;
                }

                .cart-item-total {
                    font-weight: 600;
                    color: #3498db;
                    font-size: 1.1rem;
                    min-width: 120px;
                    text-align: right;
                }

                .btn-remove {
                    color: #e74c3c;
                    padding: 0.5rem;
                    transition: all 0.2s;
                }

                .btn-remove:hover {
                    color: #c0392b;
                }

                .cart-actions {
                    display: flex;
                    gap: 1rem;
                    padding-top: 1rem;
                    border-top: 1px solid #eee;
                }

                .cart-summary {
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 2px 12px rgba(0,0,0,0.08);
                    padding: 1.5rem;
                    position: sticky;
                    top: 2rem;
                }

                .cart-summary-title {
                    color: #2c3e50;
                    padding-bottom: 1rem;
                    border-bottom: 1px solid #eee;
                    margin-bottom: 1rem;
                }

                .cart-summary-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1rem;
                    color: #666;
                }

                .cart-summary-total {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding-top: 1rem;
                    border-top: 1px solid #eee;
                    margin-top: 1rem;
                    font-weight: 600;
                    color: #2c3e50;
                }

                .total-amount {
                    font-size: 1.5rem;
                    color: #3498db;
                }

                .btn-checkout {
                    width: 100%;
                    padding: 1rem;
                    margin-top: 1.5rem;
                    font-weight: 600;
                    font-size: 1.1rem;
                }

                @media (max-width: 991px) {
                    .cart-items-scroll {
                        max-height: 300px;
                    }
                }

                @media (max-width: 576px) {
                    .cart-items-scroll {
                        max-height: 250px;
                        margin: 0 -0.5rem;
                        padding: 0 0.5rem;
                    }
                }
            `}</style>
        </div>
    );
}

export default Cart