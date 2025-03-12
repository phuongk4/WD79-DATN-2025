import React, {useEffect, useState} from 'react'
import Header from '../../../Shared/Admin/Header/Header'
import Sidebar from '../../../Shared/Admin/Sidebar/Sidebar'
import {Button, Form, Table} from 'antd';
import couponService from '../../../Service/CouponService';
import {Link} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import $ from 'jquery';

function ListCoupon() {
    const handleDelete = async (id) => {
        setLoading(true)
        if (window.confirm('Bạn có chắc chắn muốn xóa?')) {
            await couponService.adminDeleteCoupon(id)
                .then((res) => {
                    alert(`Xóa thành công!`)
                    getListProperty();
                    setLoading(false)
                })
                .catch((err) => {
                    console.log(err)
                })
        }
    }

    const loadFn = async () => {
        $(document).ready(function () {
            $("#inputSearchProperty").on("input", function () {
                var value = $(this).val().toLowerCase();
                $(".ant-table-content table tr").filter(function () {
                    $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
                });
            });
        });
    }

    const columns = [
        {
            title: 'STT',
            dataIndex: 'key',
            width: '10%',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Tên mã giảm giá',
            dataIndex: 'name',
            width: 'x',
        },
        {
            title: 'Mã số',
            dataIndex: 'code',
            width: '15%',
        },
        {
            title: 'Loại mã giảm giá',
            dataIndex: 'type',
            width: '15%',
        },
        {
            title: 'Phần trăm giảm giá',
            dataIndex: 'max_discount',
            width: '15%',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            width: '10%',
        },
        {
            title: 'Hành động',
            dataIndex: 'id',
            key: 'x',
            width: '15%',
            render: (id) =>
                <div className="d-flex gap-2 align-items-center justify-content-center">
                    <Link to={`/admin/coupons/detail/${id}`} className="btn btn-primary">
                        Xem chi tiết
                    </Link>

                    <button type="button" id={`btnDelete_${id}`} className="btn btn-danger"
                            onClick={() => handleDelete(id)}>Xóa
                    </button>
                </div>
        },
    ];

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 10,
        },
    });

    const getListProperty = async () => {
        await couponService.adminListCoupon()
            .then((res) => {
                if (res.status === 200) {
                    setData(res.data.data)
                    setLoading(false)
                } else {
                    alert('Error')
                    setLoading(false)
                }
            })
            .catch((err) => {
                setLoading(false)
                console.log(err)
            })
    }


    useEffect(() => {
        getListProperty();
        loadFn();

    }, []);
    const handleTableChange = (pagination, filters, sorter) => {
        setTableParams({
            pagination,
            filters,
            ...sorter,
        });
    };

    return (
        <>
            <Header/>
            <Sidebar/>

            <main id="main" className="main">
                <div className="pagetitle">
                    <h1>Danh sách mã giảm giá</h1>
                    <nav>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/admin/dashboard">Trang quản trị</Link></li>
                            <li className="breadcrumb-item">Giá trị thuộc tính</li>
                            <li className="breadcrumb-item active">Danh sách mã giảm giá</li>
                        </ol>
                    </nav>
                </div>
                {/* End Page Title */}
                <div className="row">
                    <div className="mb-3 col-md-3">
                        <h5>Tìm kiếm mã giảm giá</h5>
                        <input className="form-control" id="inputSearchProperty" type="text"
                               placeholder="Nhập từ khóa..."/>
                        <br/>
                    </div>

                    <Table
                        style={{margin: "auto"}}
                        columns={columns}
                        dataSource={data}
                        pagination={tableParams.pagination}
                        loading={loading}
                        onChange={handleTableChange}
                        locale={{emptyText: "No data available"}}
                    />

                </div>
            </main>
        </>
    )
}

export default ListCoupon