import {Button, Form, Input, message, Table} from 'antd';
import React, {useEffect, useState} from 'react'
import {Link, useNavigate, useParams} from 'react-router-dom'
import orderService from '../../../Service/OrderService';
import Header from '../../Header/Header'
import Sidebar from '../../Sidebar/Sidebar'
import $ from 'jquery';
import ConvertNumber from "../../../Shared/Utils/ConvertNumber";

function DetailOrder() {
    const {id} = useParams();
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
        let reason_cancel = $('#reason_cancel').val();
        let data = {
            reason_cancel: reason_cancel,
        };
        if (window.confirm('Bạn có chắc chắn muốn hủy đơn hàng?')) {
            await orderService.cancelOrder(id, data)
                .then((res) => {
                    console.log("cancel", res.data.data)
                    alert(`Hủy đơn hàng thành công!`)
                    detailOrder();
                })
                .catch((err) => {
                    console.log(err)
                    let res = err.response;
                    let mess = res.data.message;
                    alert('Thất bại ' + mess);
                })
        }
    }

    const detailOrder = async () => {
        await orderService.detailOrder(id)
            .then((res) => {
                setLoading(false)
                console.log('order: ' + res.data);
                setData(res.data.data);
                setOrderItems(res.data.data.order_items);
            })
            .catch((err) => {
                setLoading(false)
                console.log(err)
            })
    };

    const listOrderHistories = async () => {
        await orderService.listOrderHistories(id)
            .then((res) => {
                setLoading(false)
                console.log('order histories: ' + res.data);
                setOrderHistories(res.data.data);
            })
            .catch((err) => {
                console.log(err)
                setLoading(false)
            })
    };

    const columns = [
        {
            title: 'STT',
            dataIndex: 'key',
            width: '10%',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Người thay đổi',
            dataIndex: 'user_name',
            width: 'x',
        },
        {
            title: 'Ghi chú',
            dataIndex: 'notes',
            width: '20%',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            width: '20%',
        },
        {
            title: 'Thời gian',
            dataIndex: 'created_at',
            width: '10%',
            render: (text) => {
                const date = new Date(text);
                return date.toLocaleString('vi-VN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                });
            },
        },
    ];

    const handleTableChange = (pagination, filters, sorter) => {
        setTableParams({
            pagination,
            filters,
            ...sorter,
        });
    };


    useEffect(() => {
        detailOrder();
        listOrderHistories();
    }, [form, id])

    return (
        <>
            <Header/>
            <Sidebar/>
            <main id="main" className="main" style={{backgroundColor: "#f6f9ff"}}>
                <div className="pagetitle">
                    <h1>Chi tiết đơn hàng</h1>
                    <nav>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/profile">Người dùng</Link></li>
                            <li className="breadcrumb-item">Đơn hàng</li>
                            <li className="breadcrumb-item active">Chi tiết đơn hàng</li>
                        </ol>
                    </nav>
                </div>
                {/* End Page Title */}
                <section className="section">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">Chi tiết đơn hàng</h5>
                                    <div className="row mb-5">
                                        <div className="col-md-4">
                                            <div className="p-3 border">
                                                <table className="table site-block-order-table mb-5">
                                                    <colgroup>
                                                        <col width="40%"/>
                                                        <col width="60%"/>
                                                    </colgroup>
                                                    <thead>
                                                    <tr>
                                                        <td className="text-black ">
                                                            Tên đầy đủ
                                                        </td>
                                                        <td className="text-black FullName">
                                                            {order.full_name}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="text-black ">
                                                            Email
                                                        </td>
                                                        <td className="text-black Email">
                                                            {order.email}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="text-black ">
                                                            Số điện thoại
                                                        </td>
                                                        <td className="text-black Phone">
                                                            {order.phone}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="text-black ">
                                                            Địa chỉ
                                                        </td>
                                                        <td className="text-black Address">
                                                            {order.address}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="text-black ">
                                                            Phương thức thanh toán
                                                        </td>
                                                        <td className="text-black Address">
                                                            {order.order_method}
                                                        </td>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    <tr>
                                                        <td className="text-black ">
                                                            <p>Tổng tiền của sản phẩm</p></td>
                                                        <td className="text-black">
                                                            <span
                                                                id="allProductPrice">{ConvertNumber(order.products_price)}</span>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="text-black ">
                                                            <p>Phí vận chuyển</p>
                                                        </td>
                                                        <td className="text-black">
                                                            <span
                                                                id="shipping_fee">{ConvertNumber(order.shipping_price)}</span>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="text-black ">
                                                            <p>Miễn giảm giá</p>
                                                        </td>
                                                        <td className="text-black">
                                                            <span
                                                                id="discount_fee">{ConvertNumber(order.discount_price)}</span>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="text-black ">
                                                            <p>Tổng tiền
                                                            </p>
                                                        </td>
                                                        <td className="text-black ">
                                                            <p>
                                                                <span
                                                                    id="order_total">{ConvertNumber(order.total_price)}</span>
                                                            </p>
                                                        </td>
                                                    </tr>
                                                    </tbody>
                                                </table>
                                                <h5>Ghi chú:</h5>
                                                <div className="notes">
                                                    {order.notes}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-8">
                                            <div className="p-3 p-lg-5 border">
                                                <table className="table mb-3">
                                                    <colgroup>
                                                        <col width="10%"/>
                                                        <col width="32%"/>
                                                        <col width="5%"/>
                                                        <col width="10%"/>
                                                        <col width="15%"/>
                                                        <col width="x"/>
                                                    </colgroup>
                                                    <thead>
                                                    <tr>
                                                        <th scope="col">Hình ảnh</th>
                                                        <th scope="col">Tên sản phẩm</th>
                                                        <th scope="col">Số lượng</th>
                                                        <th scope="col">Đơn giá</th>
                                                        <th scope="col">Thành tiền</th>
                                                        <th scope="col">Hành động</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody id="tableOrderItem">
                                                    {
                                                        orderItems.map((orderItem, index) => {
                                                            return (
                                                                <tr key={index}>
                                                                    <td>
                                                                        <img src={orderItem.product.thumbnail} alt=""
                                                                             width="100px"/>
                                                                    </td>
                                                                    <td>{orderItem.product.name}</td>
                                                                    <td>{orderItem.quantity}</td>
                                                                    <td>{ConvertNumber(orderItem.price)}</td>
                                                                    <td>{ConvertNumber(orderItem.price * orderItem.quantity)}</td>
                                                                    <td>
                                                                        {order.status === 'ĐÃ HOÀN THÀNH' && (
                                                                            <a className="btn btn-primary"
                                                                               href={"/reviews/products?pro=" + orderItem.product_id + "&order=" + id}>Đánh
                                                                                giá</a>
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            )
                                                        })
                                                    }
                                                    </tbody>
                                                </table>

                                                <div className="">
                                                    Lịch sử đơn hàng
                                                </div>
                                                <Table
                                                    style={{margin: "auto"}}
                                                    columns={columns}
                                                    dataSource={orderHistories}
                                                    pagination={tableParams.pagination}
                                                    loading={loading}
                                                    onChange={handleTableChange}
                                                />
                                            </div>

                                            <div className="row mt-3 mb-4">
                                                <div id="bar-progress" className="mt-5 mt-lg-0">
                                                    <div
                                                        className={"step " + (order.status === 'CHỜ XÁC NHẬN' ? 'step-active' : '')}>
                                                    <span className="number-container">
                                                        <span className="number">1</span>
                                                    </span>
                                                        <h5>CHỜ XÁC NHẬN</h5>
                                                    </div>
                                                    <div className="seperator"></div>
                                                    <div
                                                        className={"step " + (order.status === 'ĐANG XỬ LÝ' ? 'step-active' : '')}>
                                                    <span className="number-container">
                                                        <span className="number">2</span>
                                                    </span>
                                                        <h5>ĐANG XỬ LÝ</h5>
                                                    </div>
                                                    <div className="seperator"></div>
                                                    <div
                                                        className={"step " + (order.status === 'ĐÃ XÁC NHẬN' ? 'step-active' : '')}>
                                                    <span className="number-container">
                                                        <span className="number">3</span>
                                                    </span>
                                                        <h5>ĐÃ XÁC NHẬN</h5>
                                                    </div>
                                                    <div className="seperator"></div>
                                                    <div
                                                        className={"step " + (order.status === 'ĐANG VẬN CHUYỂN' ? 'step-active' : '')}>
                                                    <span className="number-container">
                                                        <span className="number">4</span>
                                                    </span>
                                                        <h5>ĐANG VẬN CHUYỂN</h5>
                                                    </div>
                                                    <div className="seperator"></div>
                                                    <div
                                                        className={"step " + (order.status === 'ĐÃ GIAO HÀNG' ? 'step-active' : '')}>
                                                    <span className="number-container">
                                                        <span className="number">5</span>
                                                    </span>
                                                        <h5>ĐÃ GIAO HÀNG</h5>
                                                    </div>
                                                    <div className="seperator"></div>
                                                    <div
                                                        className={"step " + (order.status === 'ĐÃ HOÀN THÀNH' ? 'step-active' : '')}>
                                                    <span className="number-container">
                                                        <span className="number">6</span>
                                                    </span>
                                                        <h5>ĐÃ HOÀN THÀNH</h5>
                                                    </div>
                                                </div>
                                            </div>

                                            {(order.status === 'CHỜ XÁC NHẬN' || order.status === 'ĐANG XỬ LÝ') && (
                                                <button type="button" data-bs-toggle="modal"
                                                        data-bs-target="#exampleModal"
                                                        className="btn btn-danger mt-3">
                                                    Hủy đơn hàng
                                                </button>
                                            )}

                                            {order.reason_cancel && (
                                                <>
                                                    <h5 className="mt-2 ">Lý do huỷ đơn hàng:</h5>
                                                    <div className="text-danger">
                                                        {order.reason_cancel}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel"
                 aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Huỷ đơn hàng</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"
                                    aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label htmlFor="reason_cancel" className="text-black">Lý do huỷ đơn hàng</label>
                                <textarea name="reason_cancel" id="reason_cancel" cols="30" rows="5"
                                          className="form-control"
                                          placeholder="Vui lòng nhập lý do huỷ đơn hàng của bạn ở đây..."></textarea>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                            <button type="button" className="btn btn-danger" onClick={() => handleCancel(order.id)}>
                                Xác nhận huỷ đơn hàng
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default DetailOrder
