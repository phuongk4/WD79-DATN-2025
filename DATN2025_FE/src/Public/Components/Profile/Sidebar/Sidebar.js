import React from 'react'
import {Link} from 'react-router-dom'

function Sidebar() {
    return (
        <>
            <aside id="sidebar" className="sidebar">

                <ul className="sidebar-nav" id="sidebar-nav">
                    <li className="nav-heading">Trang người dùng</li>

                    <li className="nav-item">
                        <a className="nav-link collapsed" href="/profile">
                            <i className="bi bi-person"></i>
                            <span>Trang cá nhân</span>
                        </a>
                    </li>

                    <li className="nav-item">
                        <a className="nav-link collapsed" href="/my-order">
                            <i className="bi bi-menu-button-wide"></i>
                            <span>Đơn hàng của tôi</span>
                        </a>
                    </li>

                    <li className="nav-item">
                        <a className="nav-link collapsed" href="/my-coupon">
                            <i className="bi bi-magnet"></i>
                            <span>Mã giảm giá của tôi</span>
                        </a>
                    </li>

                    {/*<li className="nav-item">*/}
                    {/*    <a className="nav-link collapsed" href="/product-favourites">*/}
                    {/*        <i className="bi bi-heart"></i>*/}
                    {/*        <span>Sản phẩm yêu thích</span>*/}
                    {/*    </a>*/}
                    {/*</li>*/}
                </ul>
            </aside>
        </>

    )
}

export default Sidebar