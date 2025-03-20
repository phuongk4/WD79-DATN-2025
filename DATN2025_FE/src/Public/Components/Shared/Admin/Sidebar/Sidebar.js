import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function Sidebar() {

    return (
        <>
            <aside id="sidebar" className="sidebar">

                <ul className="sidebar-nav" id="sidebar-nav">

                    <li className="nav-item">
                        <a className="nav-link collapsed" href="/admin/dashboard">
                            <i className="bi bi-grid"></i>
                            <span>Thống kê</span>
                        </a>
                    </li>

                    <li className="nav-item">
                        <a className="nav-link collapsed" data-bs-target="#components-nav" data-bs-toggle="collapse"
                           href="#">
                            <i className="bi bi-menu-button-wide"></i><span>Danh mục</span><i
                            className="bi bi-chevron-down ms-auto"></i>
                        </a>
                        <ul id="components-nav" className="nav-content collapse " data-bs-parent="#sidebar-nav">
                            <li>
                                <a href="/admin/categories/list">
                                    <i className="bi bi-circle"></i><span>Danh sách danh mục</span>
                                </a>
                            </li>
                            <li>
                                <a href="/admin/categories/create">
                                    <i className="bi bi-circle"></i><span>Thêm mới danh mục</span>
                                </a>
                            </li>
                        </ul>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link collapsed" data-bs-target="#attributes-nav" data-bs-toggle="collapse"
                           href="#">
                            <i className="bi bi-menu-down"></i><span>Thuộc tính</span><i
                            className="bi bi-chevron-down ms-auto"></i>
                        </a>
                        <ul id="attributes-nav" className="nav-content collapse " data-bs-parent="#sidebar-nav">
                            <li>
                                <a href="/admin/attributes/list">
                                    <i className="bi bi-circle"></i><span>Danh sách thuộc tính</span>
                                </a>
                            </li>
                            <li>
                                <a href="/admin/attributes/create">
                                    <i className="bi bi-circle"></i><span>Thêm mới thuộc tính</span>
                                </a>
                            </li>
                        </ul>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link collapsed" data-bs-target="#properties-nav" data-bs-toggle="collapse"
                           href="#">
                            <i className="bi bi-view-list"></i><span>Giá trị thuộc tính</span><i
                            className="bi bi-chevron-down ms-auto"></i>
                        </a>
                        <ul id="properties-nav" className="nav-content collapse " data-bs-parent="#sidebar-nav">
                            <li>
                                <a href="/admin/properties/list">
                                    <i className="bi bi-circle"></i><span>Danh sách giá trị thuộc tính</span>
                                </a>
                            </li>
                            <li>
                                <a href="/admin/properties/create">
                                    <i className="bi bi-circle"></i><span>Thêm mới giá trị thuộc tính</span>
                                </a>
                            </li>
                        </ul>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link collapsed" data-bs-target="#forms-nav" data-bs-toggle="collapse"
                           href="#">
                            <i className="bi bi-journal-text"></i><span>Quản lí sản phẩm</span><i
                            className="bi bi-chevron-down ms-auto"></i>
                        </a>
                        <ul id="forms-nav" className="nav-content collapse " data-bs-parent="#sidebar-nav">
                            <li>
                                <a href="/admin/products/list">
                                    <i className="bi bi-circle"></i><span>Danh sách sản phẩm</span>
                                </a>
                            </li>
                            <li>
                                <a href="/admin/products/create">
                                    <i className="bi bi-circle"></i><span>Thêm mới sản phẩm</span>
                                </a>
                            </li>
                        </ul>
                    </li>
                    
                    <li className="nav-item">
                        <a className="nav-link collapsed" data-bs-target="#order-nav" data-bs-toggle="collapse"
                           href="#">
                            <i className="bi bi-newspaper"></i><span>Quản lí đơn hàng</span><i
                            className="bi bi-chevron-down ms-auto"></i>
                        </a>
                        <ul id="order-nav" className="nav-content collapse " data-bs-parent="#sidebar-nav">
                            <li>
                                <a href="/admin/orders/list">
                                    <i className="bi bi-circle"></i><span>Danh sách đơn hàng</span>
                                </a>
                            </li>
                        </ul>
                    </li>

                    <li className="nav-item">
                        <a className="nav-link collapsed" data-bs-target="#coupons-nav" data-bs-toggle="collapse"
                           href="#">
                            <i className="bi bi-code"></i><span>Quản lí giảm giá</span><i
                            className="bi bi-chevron-down ms-auto"></i>
                        </a>
                        <ul id="coupons-nav" className="nav-content collapse " data-bs-parent="#sidebar-nav">
                            <li>
                                <a href="/admin/coupons/list">
                                    <i className="bi bi-circle"></i><span>Danh sách mã giảm giá</span>
                                </a>
                            </li>
                            <li>
                                <a href="/admin/coupons/create">
                                    <i className="bi bi-circle"></i><span>Thêm mới mã giảm giá</span>
                                </a>
                            </li>
                        </ul>
                    </li>


                    <li className="nav-heading">Trang</li>

                    <li className="nav-item">
                        <a className="nav-link collapsed" href="/profile">
                            <i className="bi bi-person"></i>
                            <span>Trang cá nhân</span>
                        </a>
                    </li>
                    
                </ul>
            </aside>
        </>

    )
}

export default Sidebar
