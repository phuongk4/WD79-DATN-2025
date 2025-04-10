import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaShoppingBag, FaClipboardList } from 'react-icons/fa';
import Header from "../Shared/Client/Header/Header";
import Footer from "../Shared/Client/Footer/Footer";

function ThanksYou() {
    return (
        <div className="site-wrap">
            <Header />
            
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="thanks-container"
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
                                        <li className="breadcrumb-item active">
                                            Đặt hàng thành công
                                        </li>
                                    </ol>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="thanks-section">
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-md-8">
                                <div className="thanks-content text-center">
                                    <motion.div 
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ 
                                            type: "spring",
                                            stiffness: 260,
                                            damping: 20,
                                            delay: 0.2 
                                        }}
                                        className="thanks-icon"
                                    >
                                        <FaCheckCircle className="icon" />
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, y: 50 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: 0.4 }}
                                    >
                                        <h1 className="thanks-title">Cảm ơn bạn!</h1>
                                        <p className="thanks-message">
                                            Đơn hàng của bạn đã được tạo thành công.<br />
                                            Chúng tôi sẽ xử lý đơn hàng của bạn trong thời gian sớm nhất.
                                        </p>
                                    </motion.div>

                                    <motion.div 
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: 0.6 }}
                                        className="thanks-actions"
                                    >
                                        <Link to="/products" className="btn btn-primary me-3">
                                            <FaShoppingBag className="me-2" />
                                            Tiếp tục mua sắm
                                        </Link>
                                        <Link to="http://localhost:3000/my-order" className="btn btn-outline-primary">
                                            <FaClipboardList className="me-2" />
                                            Xem đơn hàng
                                        </Link>
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            <Footer />

            <style>{`
                .thanks-container {
                    min-height: 70vh;
                    background-color: #f8f9fa;
                    padding: 0 0 4rem 0;
                }

                .breadcrumb-section {
                    background-color: white;
                    padding: 1rem 0;
                    margin-bottom: 3rem;
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

                .thanks-section {
                    padding: 2rem 0;
                }

                .thanks-content {
                    background: white;
                    padding: 3rem;
                    border-radius: 1rem;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.05);
                }

                .thanks-icon {
                    margin-bottom: 2rem;
                }

                .thanks-icon .icon {
                    font-size: 5rem;
                    color: #198754;
                    filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));
                }

                .thanks-title {
                    color: #2c3e50;
                    font-size: 2.5rem;
                    font-weight: 600;
                    margin-bottom: 1.5rem;
                }

                .thanks-message {
                    color: #6c757d;
                    font-size: 1.1rem;
                    line-height: 1.6;
                    margin-bottom: 2rem;
                }

                .thanks-actions {
                    margin-top: 2rem;
                }

                .btn {
                    padding: 0.75rem 1.5rem;
                    font-weight: 500;
                    border-radius: 0.5rem;
                    display: inline-flex;
                    align-items: center;
                    transition: all 0.3s ease;
                }

                .btn:hover {
                    transform: translateY(-2px);
                }

                .btn-primary {
                    background-color: #0d6efd;
                    border-color: #0d6efd;
                }

                .btn-primary:hover {
                    background-color: #0b5ed7;
                    border-color: #0a58ca;
                    box-shadow: 0 4px 12px rgba(13, 110, 253, 0.15);
                }

                .btn-outline-primary {
                    color: #0d6efd;
                    border-color: #0d6efd;
                }

                .btn-outline-primary:hover {
                    background-color: #0d6efd;
                    color: white;
                    box-shadow: 0 4px 12px rgba(13, 110, 253, 0.15);
                }

                @media (max-width: 768px) {
                    .thanks-container {
                        padding: 0 0 2rem 0;
                    }

                    .thanks-content {
                        padding: 2rem 1.5rem;
                        margin: 0 1rem;
                    }

                    .thanks-icon .icon {
                        font-size: 4rem;
                    }

                    .thanks-title {
                        font-size: 2rem;
                    }

                    .thanks-message {
                        font-size: 1rem;
                    }

                    .thanks-actions {
                        display: flex;
                        flex-direction: column;
                        gap: 1rem;
                    }

                    .btn {
                        width: 100%;
                        justify-content: center;
                    }

                    .btn-primary {
                        margin-right: 0 !important;
                    }
                }

                @media (min-width: 769px) {
                    .thanks-content {
                        transform: translateY(2rem);
                    }
                }
            `}</style>
        </div>
    );
}

export default ThanksYou;