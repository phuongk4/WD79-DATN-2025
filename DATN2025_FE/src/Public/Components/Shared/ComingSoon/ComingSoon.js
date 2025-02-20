import React from 'react'
import {Link} from 'react-router-dom'
import Css from "../Admin/Lib/StyleSheet";
import Script from "../Admin/Lib/Script";

function ComingSoon() {
    return (
        <>
            <Css/>
            <Script/>
            <div>
                <main>
                    <div className="container">
                        <section
                            className="section error-404 min-vh-100 d-flex flex-column align-items-center justify-content-center">
                            <h2>Sắp ra mắt</h2>
                            <h3>Trang bạn đang tìm kiếm sắp ra mắt</h3>
                            <Link className="btn" to="/">Quay lại trang chủ</Link>
                            <img src="/assets/admin/img/not-found.svg" className="img-fluid py-5"
                                 alt="Page coming soon"/>
                        </section>
                    </div>
                </main>
            </div>
        </>
    )
}

export default ComingSoon
