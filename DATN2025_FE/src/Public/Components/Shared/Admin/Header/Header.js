import React, {useEffect, useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import accountService from "../../../Service/AccountService";
import Css from '../Lib/StyleSheet';
import Script from '../Lib/Script';
import $ from 'jquery';
import {BASE_URL_SERVER} from '../../../config/server'

function IsAdmin() {
    return (
        <>
            <li>
                <Link className="dropdown-item d-flex align-items-center" to="/admin/dashboard">
                    <i className="bi bi-gear"/>
                    <span>Trang quản trị</span>
                </Link>
            </li>
            <li>
                <hr className="dropdown-divider"/>
            </li>
        </>
    )
}

function Header() {
    const email = sessionStorage.getItem("email");
    const tokenUser = sessionStorage.getItem("accessToken");
    const idUser = sessionStorage.getItem("id");
    const role = sessionStorage.getItem("role");
    const navigate = useNavigate();

    const login = async () => {
        if (email == null || tokenUser == null || idUser == null) {
            navigate("/not-found")
        }
    };

    let isAdmin = true;

    const handleLogout = () => {
        localStorage.clear();
        sessionStorage.clear();
        alert('Đăng xuất thành công!')
        window.location.href = `/login`;
    }

    const [data, setData] = useState([]);

    const getUser = async () => {
        await accountService.getInfo()
            .then((res) => {
                setData(res.data);
                let user = JSON.parse(JSON.stringify(res.data.data));
                setData(user);
            })
            .catch((err) => {
                console.log(err)
                let stt = err.response.status;
                if (stt === 444) {
                    alert('Phiên đăng nhập đã hết hạn, đăng nhập lại...');
                    sessionStorage.clear();
                    navigate('/login');
                } else {
                    // navigate('/not-found');
                }
            });
    };


    if (role !== "ADMIN") {
        isAdmin = false;
    }


    function hiddenOrShow() {
        $('body').toggleClass('toggle-sidebar');
    }

    useEffect(() => {
        getUser();
        login();
    }, []);

    return (
        <>
            <Css/>
            <header id="header" className="header fixed-top d-flex align-items-center">

                <div className="d-flex align-items-center justify-content-between">
                    <a href="/" className="logo d-flex align-items-center">
                        <img src="/assets/admin/img/logo.png" alt=""/>
                        <span className="d-none d-lg-block">SoleVibe</span>
                    </a>
                    <i className="bi bi-list toggle-sidebar-btn" onClick={hiddenOrShow}></i>
                </div>

                <nav className="header-nav ms-auto">
                    <ul className="d-flex align-items-center">

                        <li className="nav-item dropdown pe-3">
                            <a className="nav-link nav-profile d-flex align-items-center pe-0" href="#"
                               data-bs-toggle="dropdown">
                                <img src={data.avt} alt="Profile" className="rounded-circle"/>
                                <span className="d-none d-md-block dropdown-toggle ps-2">{data.full_name}</span>
                            </a>

                            <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile">
                                <li className="dropdown-header">
                                    <h6>{data.full_name}</h6>
                                </li>
                                <li>
                                    <hr className="dropdown-divider"/>
                                </li>

                                <li>
                                    <a className="dropdown-item d-flex align-items-center" href="/profile">
                                        <i className="bi bi-person"></i>
                                        <span>Trang cá nhân</span>
                                    </a>
                                </li>
                                <li>
                                    <hr className="dropdown-divider"/>
                                </li>

                                {isAdmin ? <IsAdmin/> : null}

                                <li>
                                    <a className="dropdown-item d-flex align-items-center"
                                       onClick={handleLogout}>
                                        <i className="bi bi-box-arrow-right"></i>
                                        <span>Đăng xuất</span>
                                    </a>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </nav>
            </header>
            <Script/>
        </>
    )
}

export default Header
