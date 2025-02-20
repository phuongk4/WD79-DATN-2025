import React from 'react'
import {Link} from 'react-router-dom'
import Css from "../Admin/Lib/StyleSheet";
import Script from "../Admin/Lib/Script";

function NotFound() {
    return (
        <>
            <Css/>
            <Script/>
            <div>
                <main>
                    <div className="container">
                        <section
                            className="section error-404 min-vh-100 d-flex flex-column align-items-center justify-content-center">
                            <h1>404</h1>
                            <h2>Trang bạn đang tìm kiếm không tồn tại.</h2>
                            <Link className="btn" to="/">Quay lại trang chủ</Link>
                            <img src="/assets/admin/img/not-found.svg" className="img-fluid py-5" alt="Page Not Found"/>
                        </section>
                    </div>
                </main>
            </div>
        </>
    )
}

export default NotFound
