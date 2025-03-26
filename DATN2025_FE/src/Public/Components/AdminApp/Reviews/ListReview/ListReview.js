import React, {useEffect, useState} from 'react'
import Header from '../../../Shared/Admin/Header/Header'
import Sidebar from '../../../Shared/Admin/Sidebar/Sidebar'
import {Button, Form, Table} from 'antd';
import reviewService from '../../../Service/ReviewService';
import {Link} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import $ from 'jquery';

/**
 * Renders a page that displays a list of attributes.
 * The page provides a search bar that allows the user to search for attributes by name.
 * The page also provides a table that displays the list of attributes.
 * The table has columns for the ID, name, status, and actions of each attribute.
 * The actions column contains two buttons: a primary button to view the detail of the attribute,
 * and a danger button to delete the attribute.
 * The page uses the `attributeService` to fetch the list of attributes from the server.
 * The page also uses the `useEffect` hook to fetch the list of attributes when the component mounts.
 * The page uses the `useState` hook to store the list of attributes, the loading state,
 * and the table parameters in the component state.
 * The page uses the `useCallback` hook to memoize the function that fetches the list of attributes.
 * The page uses the `useCallback` hook to memoize the function that handles the change event of the table.
 * @function
 * @returns {ReactElement} A React element that represents the page.
 */
function ListReview() {
    /**
     * Function to handle the deletion of an attribute.
     * This function is called when the user clicks the delete button of an attribute in the table.
     * It prompts the user to confirm the deletion, and if the user confirms,
     * it calls the API to delete the attribute.
     * If the API call is successful, it alerts a success message and re-fetches the list of attributes.
     * If the API call fails, it logs the error to the console.
     * @param {string} id - The ID of the attribute to be deleted.
     * @async
     * @function
     */
    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa?')) {
            await reviewService.deleteReview(id)
                .then((res) => {
                    alert(`Xóa thành công!`)
                    getListAttribute();
                })
                .catch((err) => {
                    console.log(err)
                })
        }
    }

    /**
     * Function to load the list of attributes.
     * This function is called when the component mounts.
     * It sets up an event handler for the keyup event of the search bar,
     * which filters the table rows based on the search bar value.
     * The function uses the jQuery library to manipulate the DOM.
     * The function uses the `$(document).ready()` function to ensure that the DOM is ready before executing the code.
     * @async
     * @function
     */
    const loadFn = async () => {
        $(document).ready(function () {
            $("#inputSearchCategory").on("keyup", function () {
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
            width: '5%',
            /**
             * Render function for rendering the ID column of the table.
             * The function takes in the text, record, and index of the current row,
             * and returns the ID of the current row, which is `index + 1`.
             * @param {string} text The text of the current cell.
             * @param {Object} record The record of the current row.
             * @param {number} index The index of the current row.
             * @returns {number} The ID of the current row.
             */
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Tài khoản',
            dataIndex: 'email',
            width: '15%',
        },
        {
            title: 'Tên sản phẩm',
            dataIndex: 'product_name',
            width: 'x',
        },
        {
            title: 'Tiêu đề',
            dataIndex: 'title',
            width: '25%',
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
            width: '20%',
            /**
             * Render function for rendering the 'Hành động' column of the table.
             * The function takes in the ID of the current row, and returns a JSX element
             * containing two buttons: a primary button to view the detail of the attribute,
             * and a danger button to delete the attribute.
             * @param {string} id The ID of the current row.
             * @returns {ReactElement} The JSX element to be rendered.
             */
            render: (id) =>
                <div className="d-flex gap-2 align-items-center justify-content-center">
                    <Link to={`/admin/reviews/detail/${id}`} className="btn btn-primary">
                        Xem chi tiết
                    </Link>

                    <button type="button" id={`btnDelete_${id}`} className="btn btn-danger"
                            onClick={() => handleDelete(id)}>Xóa
                    </button>
                </div>
        },
    ];

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 10,
        },
    });

    /**
     * Fetches the list of attributes from the server and updates the component state
     * accordingly.
     * @function
     * @async
     * @returns {Promise<void>} A Promise that resolves when the data has been fetched and
     * the component state has been updated.
     */
    const getListAttribute = async () => {
        await reviewService.listReview()
            .then((res) => {
                if (res.status === 200) {
                    setData(res.data.data)
                    setLoading(false)
                } else {
                    setLoading(false)
                }
            })
            .catch((err) => {
                setLoading(false)
                console.log(err)
            })
    }


    useEffect(() => {
        getListAttribute();
        loadFn();
    }, []);

    /**
     * Handles table change events.
     *
     * This function is called when the user changes the page number, filters,
     * or sorts the table. It updates the component state with the new
     * parameters.
     *
     * @param {object} pagination - Pagination parameters.
     * @param {object} filters - Filters parameters.
     * @param {object} sorter - Sorter parameters.
     *
     * @function
     */
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
                    <h1>Danh sách đánh giá</h1>
                    <nav>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/admin/dashboard">Trang quản trị</Link></li>
                            <li className="breadcrumb-item">Đánh giá sản phẩm</li>
                            <li className="breadcrumb-item active">Danh sách đánh giá</li>
                        </ol>
                    </nav>
                </div>
                {/* End Page Title */}
                <div className="row">
                    <div className="mb-3 col-md-3">
                        <h5>Tìm kiếm đánh giá</h5>
                        <input className="form-control" id="inputSearchCategory" type="text"
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

export default ListReview