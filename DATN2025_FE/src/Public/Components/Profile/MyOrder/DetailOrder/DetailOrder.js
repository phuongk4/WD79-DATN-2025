import { Button, Form, Input, message, Table, Spin, Timeline } from 'antd';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import orderService from '../../../Service/OrderService';
import Header from '../../Header/Header'
import Sidebar from '../../Sidebar/Sidebar'
import ConvertNumber from "../../../Shared/Utils/ConvertNumber";
import { motion } from 'framer-motion';
import { FaBox, FaCheck, FaClock, FaShippingFast, FaTruck, FaBoxOpen } from 'react-icons/fa';

function DetailOrder() {
    const { id } = useParams();
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [order, setData] = useState([]);
    const [orderItems, setOrderItems] = useState([]);
    const [orderHistories, setOrderHistories] = useState([]);
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 10,
        },
    });

    const handleCancel = async (id) => {
        let reason_cancel = document.getElementById('reason_cancel').value;
        if (!reason_cancel.trim()) {
            message.warning('Vui lòng nhập lý do hủy đơn hàng');
            return;
        }

        let data = { reason_cancel };
        try {
            if (window.confirm('Bạn có chắc chắn muốn hủy đơn hàng?')) {
                const res = await orderService.cancelOrder(id, data);
                message.success('Hủy đơn hàng thành công!');
                detailOrder();
            }
        } catch (err) {
            console.error(err);
            const mess = err.response?.data?.message || 'Có lỗi xảy ra';
            message.error('Thất bại: ' + mess);
        }
    }

    const detailOrder = async () => {
        try {
            const res = await orderService.detailOrder(id);
            const orderData = res.data.data;
            
            const items = orderData.order_items.map(item => ({
                ...item,
                price: item.product.sale_price || item.product.price,
                total: (item.product.sale_price || item.product.price) * item.quantity
            }));
            
            setData({
                ...orderData,
                order_items: items
            });
            setOrderItems(items);
            setLoading(false);
        } catch (err) {
            console.error(err);
            message.error('Không thể tải thông tin đơn hàng');
            setLoading(false);
        }
    };

    const listOrderHistories = async () => {
        try {
            const res = await orderService.listOrderHistories(id);
            setOrderHistories(res.data.data);
        } catch (err) {
            console.error(err);
            message.error('Không thể tải lịch sử đơn hàng');
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'CHỜ XÁC NHẬN': return <FaClock className="text-warning" />;
            case 'ĐANG XỬ LÝ': return <FaBox className="text-info" />;
            case 'ĐÃ XÁC NHẬN': return <FaCheck className="text-success" />;
            case 'ĐANG VẬN CHUYỂN': return <FaTruck className="text-primary" />;
            case 'ĐÃ GIAO HÀNG': return <FaShippingFast className="text-success" />;
            case 'ĐÃ HOÀN THÀNH': return <FaBoxOpen className="text-success" />;
            default: return <FaClock />;
        }
    };

    const columns = [
        {
            title: 'STT',
            dataIndex: 'key',
            width: '5%',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Người thay đổi',
            dataIndex: 'user_name',
            width: '20%',
        },
        {
            title: 'Ghi chú',
            dataIndex: 'notes',
            width: '35%',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            width: '20%',
            render: (status) => (
                <span className="d-flex align-items-center gap-2">
                    {getStatusIcon(status)}
                    {status}
                </span>
            ),
        },
        {
            title: 'Thời gian',
            dataIndex: 'created_at',
            width: '20%',
            render: (text) => {
                const date = new Date(text);
                return date.toLocaleString('vi-VN');
            },
        },
    ];

    useEffect(() => {
        detailOrder();
        listOrderHistories();
    }, [id]);

    if (loading) {
        return (
            <div className="loading-container">
                <Spin size="large" />
            </div>
        );
    }

    return (
        <>
            <Header />
            <Sidebar />
            <main id="main" className="main">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="container py-4"
                >
                    <div className="order-header mb-4">
                        <h1 className="h3 mb-2">Chi tiết đơn hàng #{id}</h1>
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item">
                                    <Link to="/profile">Người dùng</Link>
                                </li>
                                <li className="breadcrumb-item">
                                    <Link to="/profile/orders">Đơn hàng</Link>
                                </li>
                                <li className="breadcrumb-item active">Chi tiết đơn hàng</li>
                            </ol>
                        </nav>
                    </div>

                    <div className="row g-4">
                        <div className="col-lg-4">
                            <motion.div 
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="card shadow-sm h-100"
                            >
                                <div className="card-body">
                                    <h5 className="card-title border-bottom pb-3">Thông tin đơn hàng</h5>
                                    <div className="customer-info">
                                        <div className="info-item mb-3">
                                            <label className="text-muted mb-1">Tên khách hàng</label>
                                            <p className="mb-0 fw-medium">{order.full_name}</p>
                                        </div>
                                        <div className="info-item mb-3">
                                            <label className="text-muted mb-1">Email</label>
                                            <p className="mb-0">{order.email}</p>
                                        </div>
                                        <div className="info-item mb-3">
                                            <label className="text-muted mb-1">Số điện thoại</label>
                                            <p className="mb-0">{order.phone}</p>
                                        </div>
                                        <div className="info-item mb-3">
                                            <label className="text-muted mb-1">Địa chỉ</label>
                                            <p className="mb-0">{order.address}</p>
                                        </div>
                                        <div className="info-item mb-3">
                                            <label className="text-muted mb-1">Phương thức thanh toán</label>
                                            <p className="mb-0">{order.order_method}</p>
                                        </div>
                                    </div>

                                    <div className="order-summary mt-4">
                                        <h6 className="text-muted mb-3">Tổng quan đơn hàng</h6>
                                        <div className="d-flex justify-content-between mb-2">
                                            <span>Tổng tiền sản phẩm</span>
                                            <span className="fw-medium">{ConvertNumber(order.products_price)}</span>
                                        </div>
                                        <div className="d-flex justify-content-between mb-2">
                                            <span>Phí vận chuyển</span>
                                            <span>{ConvertNumber(order.shipping_price || 0)}</span>
                                        </div>
                                        <div className="d-flex justify-content-between mb-2">
                                            <span>Giảm giá</span>
                                            <span className="text-success">-{ConvertNumber(order.discount_price || 0)}</span>
                                        </div>
                                        <div className="d-flex justify-content-between mt-3 pt-3 border-top">
                                            <span className="fw-medium">Tổng thanh toán</span>
                                            <span className="fw-bold fs-5 text-primary">{ConvertNumber(order.total_price)}</span>
                                        </div>
                                    </div>

                                    {order.notes && (
                                        <div className="order-notes mt-4">
                                            <h6 className="text-muted mb-2">Ghi chú</h6>
                                            <p className="mb-0 fst-italic">{order.notes}</p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </div>

                        <div className="col-lg-8">
                            <motion.div 
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                                className="card shadow-sm mb-4"
                            >
                                <div className="card-body">
                                    <h5 className="card-title border-bottom pb-3">Sản phẩm đã đặt</h5>
                                    <div className="table-responsive">
                                        <table className="table align-middle">
                                            <thead className="bg-light">
                                                <tr>
                                                    <th scope="col">Sản phẩm</th>
                                                    <th scope="col" className="text-center">Số lượng</th>
                                                    <th scope="col" className="text-end">Đơn giá</th>
                                                    <th scope="col" className="text-end">Thành tiền</th>
                                                    <th scope="col"></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {orderItems.map((item, index) => (
                                                    <tr key={index}>
                                                        <td>
                                                            <div className="d-flex align-items-center gap-3">
                                                                <img
                                                                    src={`http://127.0.0.1:8000${item.product.thumbnail}`}
                                                                    alt=""
                                                                    width="60"
                                                                    className="rounded"
                                                                />
                                                                <div>
                                                                    <h6 className="mb-1">{item.product.name}</h6>
                                                                    {item.attribute.map((attr, idx) => (
                                                                        <small key={idx} className="text-muted d-block">
                                                                            {attr.attribute.name}: {attr.property.name}
                                                                        </small>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="text-center">{item.quantity}</td>
                                                        <td className="text-end">{ConvertNumber(item.price)}</td>
                                                        <td className="text-end">{ConvertNumber(item.total)}</td>
                                                        <td className="text-end">
                                                            {order.status === 'ĐÃ HOÀN THÀNH' && (
                                                                <Link 
                                                                    to={`/reviews/products?pro=${item.product_id}&order=${id}`}
                                                                    className="btn btn-sm btn-outline-primary"
                                                                >
                                                                    Đánh giá
                                                                </Link>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.6 }}
                                className="card shadow-sm"
                            >
                                <div className="card-body">
                                    <h5 className="card-title border-bottom pb-3">Trạng thái đơn hàng</h5>
                                    
                                    <div className="order-timeline mb-4">
                                        <Timeline mode="left">
                                            {['CHỜ XÁC NHẬN', 'ĐANG XỬ LÝ', 'ĐÃ XÁC NHẬN', 'ĐANG VẬN CHUYỂN', 'ĐÃ GIAO HÀNG', 'ĐÃ HOÀN THÀNH'].map((status, index) => (
                                                <Timeline.Item 
                                                    key={index}
                                                    dot={getStatusIcon(status)}
                                                    color={order.status === status ? 'blue' : 'gray'}
                                                >
                                                    <p className={`mb-0 ${order.status === status ? 'fw-medium' : ''}`}>
                                                        {status}
                                                    </p>
                                                </Timeline.Item>
                                            ))}
                                        </Timeline>
                                    </div>

                                    <div className="order-history mt-4">
                                        <h6 className="mb-3">Lịch sử đơn hàng</h6>
                                        <Table
                                            columns={columns}
                                            dataSource={orderHistories}
                                            pagination={tableParams.pagination}
                                            onChange={(pagination, filters, sorter) => {
                                                setTableParams({ pagination, filters, ...sorter });
                                            }}
                                            className="order-history-table"
                                        />
                                    </div>

                                    {(order.status === 'CHỜ XÁC NHẬN' || order.status === 'ĐANG XỬ LÝ') && (
                                        <div className="mt-4">
                                            <button 
                                                type="button" 
                                                className="btn btn-danger"
                                                data-bs-toggle="modal"
                                                data-bs-target="#cancelOrderModal"
                                            >
                                                Hủy đơn hàng
                                            </button>
                                        </div>
                                    )}

                                    {order.reason_cancel && (
                                        <div className="mt-4 p-3 bg-light rounded">
                                            <h6 className="text-danger mb-2">Lý do hủy đơn hàng:</h6>
                                            <p className="mb-0">{order.reason_cancel}</p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </main>

            {/* Cancel Order Modal */}
            <div className="modal fade" id="cancelOrderModal" tabIndex="-1">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Hủy đơn hàng</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label htmlFor="reason_cancel" className="form-label">Lý do hủy đơn hàng</label>
                                <textarea 
                                    id="reason_cancel" 
                                    className="form-control" 
                                    rows="4"
                                    placeholder="Vui lòng nhập lý do hủy đơn hàng của bạn..."
                                ></textarea>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                            <button 
                                type="button" 
                                className="btn btn-danger" 
                                onClick={() => handleCancel(order.id)}
                            >
                                Xác nhận hủy
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .main {
                    background-color: #f8f9fa;
                    min-height: 100vh;
                    padding-top: 2rem;
                }

                .loading-container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                }

                .card {
                    border: none;
                    transition: transform 0.2s, box-shadow 0.2s;
                }

                .card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 .5rem 1rem rgba(0,0,0,.1)!important;
                }

                .order-header h1 {
                    color: #2c3e50;
                    font-weight: 600;
                }

                .breadcrumb-item a {
                    color: #6c757d;
                    text-decoration: none;
                }

                .breadcrumb-item.active {
                    color: #2c3e50;
                }

                .customer-info label {
                    font-size: 0.875rem;
                }

                .info-item p {
                    color: #2c3e50;
                }

                .order-summary {
                    background-color: #f8f9fa;
                    padding: 1.5rem;
                    border-radius: 0.5rem;
                }

                .table th {
                    font-weight: 600;
                    color: #2c3e50;
                }

                .table td {
                    vertical-align: middle;
                }

                .btn-outline-primary {
                    border-color: #3498db;
                    color: #3498db;
                }

                .btn-outline-primary:hover {
                    background-color: #3498db;
                    color: white;
                }

                .order-timeline {
                    padding: 1.5rem;
                    background-color: #f8f9fa;
                    border-radius: 0.5rem;
                }

                .ant-timeline-item-head {
                    background-color: white !important;
                }

                .order-history-table {
                    margin-top: 1rem;
                }

                .order-history-table .ant-table {
                    background: white;
                    border-radius: 0.5rem;
                }

                .modal-content {
                    border: none;
                    border-radius: 0.5rem;
                }

                .modal-header {
                    border-bottom: 1px solid #dee2e6;
                    background-color: #f8f9fa;
                }

                .modal-footer {
                    border-top: 1px solid #dee2e6;
                    background-color: #f8f9fa;
                }

                @media (max-width: 768px) {
                    .order-summary {
                        margin-top: 1rem;
                    }

                    .table-responsive {
                        margin: 0 -1rem;
                    }
                }
            `}</style>
        </>
    );
}

export default DetailOrder;
