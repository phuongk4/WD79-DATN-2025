import React from 'react';
import Header from "../Shared/Client/Header/Header";
import Footer from "../Shared/Client/Footer/Footer";

function ThanksYou() {
    return (
        <div className="site-wrap">
            <Header/>
            <div className="bg-light py-3">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12 mb-0"><a href="/">Trang chủ</a> <span
                            className="mx-2 mb-0">/</span> <strong className="text-black">Chúc mừng</strong></div>
                    </div>
                </div>
            </div>

            <div className="site-section">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12 text-center">
                            <span className="icon-check_circle display-3 text-success"></span>
                            <h2 className="display-3 text-black">Cảm ơn!</h2>
                            <p className="lead mb-5">Đơn hàng của bạn đã tạo thành công.</p>
                            <p><a href="/products" className="btn btn-sm btn-primary">Quay lại cửa hàng</a></p>
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    )
}

export default ThanksYou