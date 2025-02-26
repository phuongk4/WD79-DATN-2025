import React, {useEffect, useState} from 'react'
import Header from '../../../Shared/Admin/Header/Header'
import Sidebar from '../../../Shared/Admin/Sidebar/Sidebar'
import {Button, Form, Table} from 'antd';
import propertyService from '../../../Service/PropertyService';
import {Link} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import $ from 'jquery';

/**
 * Renders a page that displays a list of properties.
 * The page provides a search bar that allows the user to search for properties by name.
 * The page also provides a table that displays the list of properties.
 * The table has columns for the ID, name, attribute name, and status of each property.
 * The actions column contains two buttons: a primary button to view the detail of the property,
 * and a danger button to delete the property.
 * The page uses the `propertyService` to fetch the list of properties from the server.
 * The page also uses the `useEffect` hook to fetch the list of properties when the component mounts.
 * The page uses the `useState` hook to store the list of properties, the loading state,
 * and the table parameters in the component state.
 * The page uses the `useCallback` hook to memoize the function that fetches the list of properties.
 * The page uses the `useCallback` hook to memoize the function that handles the change event of the table.
 * @returns {ReactElement} A React element that represents the page.
 */
function ListProperty() {
    const handleDelete = async (id) => {
        setLoading(true)
        if (window.confirm('Bạn có chắc chắn muốn xóa?')) {
            await propertyService.adminDeleteProperty(id)
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
            title: 'Tên giá trị thuộc tính',
            dataIndex: 'name',
            width: 'x',
        },
        {
            title: 'Thuộc tính',
            dataIndex: 'attribute_name',
            width: '25%',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            width: '15%',
        },
        {
            title: 'Hành động',
            dataIndex: 'id',
            key: 'x',
            width: '15%',
            render: (id) =>
                <div className="d-flex gap-2 align-items-center justify-content-center">
                    <Link to={`/admin/properties/detail/${id}`} className="btn btn-primary">
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
        await propertyService.adminListProperty()
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
                    <h1>Danh sách giá trị thuộc tính</h1>
                    <nav>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/admin/dashboard">Trang quản trị</Link></li>
                            <li className="breadcrumb-item">Giá trị thuộc tính</li>
                            <li className="breadcrumb-item active">Danh sách giá trị thuộc tính</li>
                        </ol>
                    </nav>
                </div>
                {/* End Page Title */}
                <div className="row">
                    <div className="mb-3 col-md-3">
                        <h5>Tìm kiếm giá trị thuộc tính</h5>
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

export default ListProperty