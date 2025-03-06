import {message} from 'antd';
import React, {useEffect, useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import accountService from "../../Service/AccountService";
import * as moment from "@mui/material";
import Css from "../../Shared/Admin/Lib/StyleSheet";
import Script from "../../Shared/Admin/Lib/Script";
import $ from "jquery";
import {BASE_URL_SERVER} from "../../config/server";

//import { format } from 'date-fns';

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
    const Token = sessionStorage.getItem("accessToken")
    const navigate = useNavigate();
    const role = sessionStorage.getItem("role");
    let isAdmin = true;

    const checkLogin = async () => {
        if (email == null || Token == null) {
            navigate('/not-found')
        }
    };

    function hiddenOrShow() {
        $('body').toggleClass('toggle-sidebar');
    }

    const handleLogout = () => {
        localStorage.clear();
        sessionStorage.clear();
        message.success("Logout")
        navigate("/login")
    }

    const [data, setData] = useState([]);

    const getUser = async () => {
        await accountService.getInfo()
            .then((res) => {
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
                    navigate('/not-found');
                }
            });
    };

    if (role !== "ADMIN") {
        isAdmin = false;
    }

    useEffect(() => {
        getUser();
        checkLogin();
    }, []);

    return (
        <div>
            <Css/>
            <header id="header" className="header fixed-top d-flex align-items-center">
                <div className="d-flex align-items-center justify-content-between">
                    <Link to="/" className="logo d-flex align-items-center">
                        <img src="/assets/admin/img/logo.png" alt=""/>
                        <span className="d-none d-lg-block">SOLEVIBE</span>
                    </Link>
                    <i className="bi bi-list toggle-sidebar-btn" onClick={hiddenOrShow}></i>
                </div>
                <div className="search-bar">
                    <form className="search-form d-flex align-items-center" action="#">
                        <input type="text" name="query" placeholder="Search" title="Enter search keyword"/>
                        <button type="submit" title="Search"><i className="bi bi-search"/></button>
                    </form>
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
        </div>
    )
}

export default Header