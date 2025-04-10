import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { message } from "antd";
import { motion } from 'framer-motion';
import { FaCheckCircle, FaTimesCircle, FaShoppingBag } from 'react-icons/fa';
import Header from "../Shared/Client/Header/Header";
import Footer from "../Shared/Client/Footer/Footer";
import orderService from "../Service/OrderService";

function ConfirmCheckout() {
    const { search } = useLocation();
    const [isLoading, setIsLoading] = useState(true);
    const [orderStatus, setOrderStatus] = useState({
        success: false,
        message: '',
        title: ''
    });

    const createOrder = async () => {
        try {
            const orderInfo = localStorage.getItem('order_info');
            if (!orderInfo) return;

            const data = JSON.parse(orderInfo);
            const response = await orderService.createOrder(data);
            console.log("order created:", response.data);
            localStorage.removeItem('order_info');
        } catch (error) {
            console.error("Order creation error:", error);
            message.error("Đã xảy ra lỗi, vui lòng thử lại sau!");
        }
    };

    const loadingPage = async () => {
        const queryParams = new URLSearchParams(search);
        const vnp_ResponseCode = queryParams.get('vnp_ResponseCode');

        try {
            if (vnp_ResponseCode === '00') {
                const orderInfo = localStorage.getItem('order_info');
                if (orderInfo) {
                    await createOrder();
                }
                setOrderStatus({
                    success: true,
                    title: 'Đặt hàng thành công',
                    message: 'Đơn hàng của bạn đã được xác nhận'
                });
            } else {
                setOrderStatus({
                    success: false,
                    title: 'Đặt hàng thất bại',
                    message: 'Đã xảy ra lỗi trong quá trình xử lý đơn hàng'
                });
            }
        } catch (error) {
            console.error("Error processing order:", error);
            setOrderStatus({
                success: false,
                title: 'Lỗi hệ thống',
                message: 'Vui lòng thử lại sau'
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadingPage();
    }, [search]);

    return (
        <div className="site-wrap">
            <Header />
            
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="confirmation-container"
            >
                <div className="breadcrumb-section">
                    <div className="container">
                        <div className="row">
                            <div className="col-12">
                                <nav aria-label="breadcrumb">
                                    <ol className="breadcrumb mb-0">
                                        <li className="breadcrumb-item">
                                            <Link to="/">Trang chủ</Link>
                                        </li>
                                        <li className="breadcrumb-item active" aria-current="page">
                                            {orderStatus.title}
                                        </li>
                                    </ol>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="confirmation-section">
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-md-8 text-center">
                                <motion.div 
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                    className="confirmation-icon"
                                >
                                    {orderStatus.success ? (
                                        <FaCheckCircle className="icon success" />
                                    ) : (
                                        <FaTimesCircle className="icon error" />
                                    )}
                                </motion.div>

                                <motion.h2 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.4 }}
                                    className="confirmation-title"
                                >
                                    {orderStatus.success ? 'Cảm ơn bạn!' : 'Rất tiếc!'}
                                </motion.h2>

                                <motion.p 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.6 }}
                                    className="confirmation-message"
                                >
                                    {orderStatus.message}
                                </motion.p>

                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.8 }}
                                    className="confirmation-actions"
                                >
                                    <Link to="/products" className="btn btn-primary">
                                        <FaShoppingBag className="me-2" />
                                        Tiếp tục mua sắm
                                    </Link>
                                    {orderStatus.success && (
                                        <Link to="http://localhost:3000/my-order" className="btn btn-outline-primary ms-3">
                                            Xem đơn hàng
                                        </Link>
                                    )}
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            <Footer />

            <style>{`
                .confirmation-container {
                    min-height: 60vh;
                    background-color: #f8f9fa;
                    padding: 3rem 0;
                }

                .breadcrumb-section {
                    background-color: white;
                    padding: 1rem 0;
                    margin-bottom: 2rem;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                }

                .breadcrumb {
                    margin: 0;
                    padding: 0;
                }

                .breadcrumb-item a {
                    color: #6c757d;
                    text-decoration: none;
                    transition: color 0.3s;
                }

                .breadcrumb-item a:hover {
                    color: #0d6efd;
                }

                .confirmation-section {
                    padding: 2rem 0;
                }

                .confirmation-icon {
                    margin-bottom: 2rem;
                }

                .confirmation-icon .icon {
                    font-size: 5rem;
                }

                .confirmation-icon .success {
                    color: #198754;
                }

                .confirmation-icon .error {
                    color: #dc3545;
                }

                .confirmation-title {
                    color: #2c3e50;
                    font-weight: 600;
                    margin-bottom: 1.5rem;
                }

                .confirmation-message {
                    color: #6c757d;
                    font-size: 1.1rem;
                    margin-bottom: 2rem;
                }

                .confirmation-actions {
                    margin-top: 2rem;
                }

                .btn {
                    padding: 0.75rem 1.5rem;
                    font-weight: 500;
                    border-radius: 0.5rem;
                    display: inline-flex;
                    align-items: center;
                    transition: all 0.3s;
                }

                .btn-primary {
                    background-color: #0d6efd;
                    border-color: #0d6efd;
                }

                .btn-primary:hover {
                    background-color: #0b5ed7;
                    border-color: #0a58ca;
                    transform: translateY(-2px);
                }

                .btn-outline-primary {
                    color: #0d6efd;
                    border-color: #0d6efd;
                }

                .btn-outline-primary:hover {
                    background-color: #0d6efd;
                    color: white;
                    transform: translateY(-2px);
                }

                @media (max-width: 768px) {
                    .confirmation-container {
                        padding: 2rem 0;
                    }

                    .confirmation-icon .icon {
                        font-size: 4rem;
                    }

                    .confirmation-title {
                        font-size: 1.75rem;
                    }

                    .confirmation-message {
                        font-size: 1rem;
                    }

                    .confirmation-actions {
                        display: flex;
                        flex-direction: column;
                        gap: 1rem;
                    }

                    .btn {
                        width: 100%;
                        justify-content: center;
                    }
                }
            `}</style>
        </div>
    );
}

export default ConfirmCheckout;