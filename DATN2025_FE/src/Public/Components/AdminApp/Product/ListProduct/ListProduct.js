import React, {useEffect, useState} from 'react'
import Header from '../../../Shared/Admin/Header/Header'
import Sidebar from '../../../Shared/Admin/Sidebar/Sidebar'
import {Button, Form, message, Table} from 'antd';
import productService from '../../../Service/ProductService';
import {Link} from 'react-router-dom';
import $ from "jquery";

/**
 * Renders a page that displays a list of products.
 * The page provides a search bar that allows the user to search for products by name.
 * The page also provides a table that displays the list of products.
 * The table has columns for the ID, name, status, and actions of each product.
 * The actions column contains two buttons: a primary button to view the detail of the product,
 * and a danger button to delete the product.
 * The page uses the `productService` to fetch the list of products from the server.
 * The page also uses the `useEffect` hook to fetch the list of products when the component mounts.
 * The page uses the `useState` hook to store the list of products, the loading state,
 * and the table parameters in the component state.
 * The page uses the `useCallback` hook to memoize the function that fetches the list of products.
 * The page uses the `useCallback` hook to memoize the function that handles the change event of the table.
 * @returns {ReactElement} A React element that represents the page.
 * @function
 */
function ListProduct() {
    /**
     * Function to handle the deletion of a product.
     * This function is called when the user clicks the delete button of a product in the table.
     * It prompts the user to confirm the deletion, and if the user confirms,
     * it calls the API to delete the product.
     * If the API call is successful, it alerts a success message and re-fetches the list of products.
     * If the API call fails, it logs the error to the console.
     * @param {string} id - The ID of the product to be deleted.
     * @async
     * @function
     */
    const handleDelete = async (id) => {
        setLoading(true)
        if (window.confirm('Bạn có chắc chắn muốn xóa?')) {
            await productService.adminDeleteProduct(id)
                .then((res) => {
                    setLoading(false);
                    alert(`Xóa thành công`)
                    getListProduct();
                })
                .catch((err) => {
                    setLoading(false);
                    console.log(err)
                })
        }
    }

    const columns = [
        {
            title: 'STT',
            dataIndex: 'id',
            width: '5%',
            /**
             * Function to render a column of table.
             * @param {string} text - The text to be rendered.
             * @param {object} record - The record of the row.
             * @param {number} index - The index of the row.
             * @returns {number} The index of the row + 1.
             */
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Hình ảnh',
            dataIndex: 'thumbnail',
            width: '10%',
            /**
             * Function to render a column of table.
             * This function is called with the text of the cell, and renders an image with the given text as the src.
             * @param {string} text - The text to be rendered.
             * @returns {ReactElement} The rendered React element.
             */
            render: (text) => <img src={`http://127.0.0.1:8000${text}`} alt="image" style={{ width: '150px' }} />,// sửa ảnhảnh
        },
        {
            title: 'Tên sản phẩm',
            dataIndex: 'name',
            width: '35%',
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            width: '8%',
        },
        {
            title: 'Giá cũ',
            dataIndex: 'price',
            width: '8%',
        },
        {
            title: 'Giá mới',
            dataIndex: 'sale_price',
            width: '8%',
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
            /**
             * Function to render the "Hành động" column of the table.
             * This function takes in the ID of the current row, and returns a JSX element
             * containing two buttons: a primary button to view the detail of the product,
             * and a danger button to delete the product.
             * @param {string} id - The ID of the product to be rendered.
             * @returns {ReactElement} The JSX element to be rendered.
             */
            render: (id) =>
                <div className="d-flex gap-2">
                    <Link className="btn btn-primary" to={`/admin/products/detail/${id}`}>
                        Xem chi tiết
                    </Link>
                    <button type="button" id={`btnDelete_${id}`} className="btn btn-danger"
                            onClick={() => handleDelete(id)}>Xóa
                    </button>
                </div>
        },
    ];

    /**
     * Function to load the search function for the list of products.
     * The function is called when the component mounts.
     * It sets up an event handler for the keyup event of the search bar,
     * which filters the table rows based on the search bar value.
     * The function uses the jQuery library to manipulate the DOM.
     * @async
     * @function
     */
    const loadFn = async () => {
        $(document).ready(function () {
            $("#inputSearchProduct").on("keyup", function () {
                var value = $(this).val().toLowerCase();
                $(".ant-table-content table tr").filter(function () {
                    $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
                });
            });
        });
    }

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 10,
        },
    });

    /**
     * Fetches the list of products from the server.
     * This function is called when the component mounts and when the user navigates to a different page.
     * It calls the API to fetch the list of products, and if the call is successful,
     * it updates the component state with the new data and sets the loading state to false.
     * If the call fails, it sets the loading state to false and logs the error to the console.
     * @async
     * @function
     */
    const getListProduct = async () => {
        await productService.adminListProduct()
            .then((res) => {
                if (res.status === 200) {
                    setData(res.data.data)
                    setLoading(false)
                }
            })
            .catch((err) => {
                setLoading(false)
                console.log(err)
            })
    }


    useEffect(() => {
        getListProduct();
        loadFn();
    }, [loading]);

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
        <div>
            <Header/>
            <Sidebar/>

            <main id="main" className="main">
                <div className="pagetitle">
                    <h1>Danh sách sản phẩm</h1>
                    <nav>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/admin/dashboard">Trang quản trị</Link></li>
                            <li className="breadcrumb-item">Quản lí sản phẩm</li>
                            <li className="breadcrumb-item active">Danh sách sản phẩm</li>
                        </ol>
                    </nav>
                </div>
                {/* End Page Title */}
                <div className="row">
                    <div className="mb-3 col-md-3">
                        <h5>Tìm kiếm sản phẩm</h5>
                        <input className="form-control" id="inputSearchProduct" type="text"
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
                    />
                </div>

            </main>
        </div>
    )
}

export default ListProduct