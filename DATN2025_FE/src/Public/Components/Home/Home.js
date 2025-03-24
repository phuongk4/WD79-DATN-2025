import React, {useEffect, useState} from 'react'
import {Link} from 'react-router-dom';
import Header from '../Shared/Client/Header/Header';
import Footer from '../Shared/Client/Footer/Footer';
import $ from 'jquery';
import productService from "../Service/ProductService";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Swiper, SwiperSlide} from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import {Autoplay, Pagination, Navigation} from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import ConvertNumber from "../Shared/Utils/ConvertNumber";
import categoryService from "../Service/CategoryService";

window.jQuery = $;
window.$ = $;


/**
 * The Home component renders the main page of the application.
 * It contains a hero section, a section with 3 boxes, a section with 3 images,
 * a section with a carousel of products, a section with a big banner and a
 * section with a footer.
 * @return {JSX.Element}
 */
function Home() {
    const [loading, setLoading] = useState(true);
    const [newProducts, setNewProducts] = useState([]);
    const [categories, setCategories] = useState([]);

    const getListProduct = async () => {
        await productService.listProduct('', '')
            .then((res) => {
                if (res.status === 200) {
                    setNewProducts(res.data.data)
                    setLoading(false)
                }
            })
            .catch((err) => {
                setLoading(false)
                console.log(err)
            })
    }

    const getListCategory = async () => {
        await categoryService.listCategory()
            .then((res) => {
                if (res.status === 200) {
                    setCategories(res.data.data);
                } else {
                    alert('Thất bại')
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }

    useEffect(() => {
        getListProduct();
        getListCategory();
    }, [loading]);

    return (
        <div className="site-wrap">
            <Header/>
            <Swiper
                slidesPerView={1}
                autoplay={{
                    delay: 2500,
                    disableOnInteraction: false,
                }}
                pagination={{
                    clickable: true,
                }}
                navigation={true}
                modules={[Autoplay, Pagination, Navigation]}
                className="mySwiper2"
            >
                <SwiperSlide >
                    <div className="site-blocks-cover"
                         style={{backgroundImage: `url('/assets/clients/images/anhbanner2.avif')`}}>
                        <div className="container">
                            <div className="row align-items-start align-items-md-center justify-content-end">
                                <div className="col-md-5 text-center text-md-left pt-5 pt-md-0">
                                    <h1 className="mb-2">Phong cách lịch lãm, khẳng định bản lĩnh phái mạnh</h1>
                                    <div className="intro-text text-center text-md-left">
                                        <p className="mb-4">Trang web thời trang nam hàng đầu, mang đến cho phái
                                            mạnh những xu
                                            hướng mới nhất và phong cách ấn tượng. </p>
                                        <p>
                                            <a href="/products" className="btn btn-sm btn-primary">Mua sắm ngay</a>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="site-blocks-cover"
                         style={{backgroundImage: `url('/assets/clients/images/anhbanner1.jpg')`}}>
                        <div className="container">
                            <div className="row align-items-start align-items-md-center justify-content-start">
                                <div className="col-md-5 text-center text-md-left pt-5 pt-md-0">
                                    <h1 className="mb-2">Phong cách lịch lãm, khẳng định bản lĩnh phái mạnh</h1>
                                    <div className="intro-text text-center text-md-left">
                                        <p className="mb-4">Trang web thời trang nam hàng đầu, mang đến cho phái
                                            mạnh những xu
                                            hướng mới nhất và phong cách ấn tượng. </p>
                                        <p>
                                            <a href="/products" className="btn btn-sm btn-primary">Mua sắm ngay</a>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </SwiperSlide>
                <SwiperSlide >
                    <div className="site-blocks-cover"
                         style={{backgroundImage: `url('/assets/clients/images/banner3.avif')`}}>
                        <div className="container">
                            <div className="row align-items-start align-items-md-center justify-content-end">
                                <div className="col-md-5 text-center text-md-left pt-5 pt-md-0">
                                    <h1 className="mb-2">Phong cách lịch lãm, khẳng định bản lĩnh phái mạnh</h1>
                                    <div className="intro-text text-center text-md-left">
                                        <p className="mb-4">Trang web thời trang nam hàng đầu, mang đến cho phái
                                            mạnh những xu
                                            hướng mới nhất và phong cách ấn tượng. </p>
                                        <p>
                                            <a href="/products" className="btn btn-sm btn-primary">Mua sắm ngay</a>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </SwiperSlide>
            </Swiper>

            <div className="site-section site-section-sm site-blocks-1">
                <div className="container">
                    <div className="row">
                        <div className="col-md-6 col-lg-4 d-lg-flex mb-4 mb-lg-0 pl-4">
                            <div className="icon mr-4 align-self-start">
                                <span className="icon-truck"></span>
                            </div>
                            <div className="text">
                                <h2 className="text-uppercase">Miễn phí giao hàng</h2>
                                <p>Với MenFashion, mua sắm chưa bao giờ dễ dàng đến thế! Dù bạn ở bất cứ đâu, chỉ cần
                                    chọn sản phẩm, chúng tôi sẽ giao tận tay bạn mà không tốn thêm bất kỳ chi phí
                                    nào.</p>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-4 d-lg-flex mb-4 mb-lg-0 pl-4">
                            <div className="icon mr-4 align-self-start">
                                <span className="icon-refresh2"></span>
                            </div>
                            <div className="text">
                                <h2 className="text-uppercase">Miễn phí đổi trả</h2>
                                <p>Sự hài lòng của bạn là ưu tiên hàng đầu của chúng tôi. Nếu sản phẩm không vừa ý, bạn
                                    có thể đổi trả hoàn toàn miễn phí trong vòng 30 ngày, giúp bạn tự tin hơn khi chọn
                                    lựa.</p>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-4 d-lg-flex mb-4 mb-lg-0 pl-4">
                            <div className="icon mr-4 align-self-start">
                                <span className="icon-help"></span>
                            </div>
                            <div className="text">
                                <h2 className="text-uppercase">Hỗ trợ khách hàng</h2>
                                <p>Đội ngũ chăm sóc khách hàng của MenFashion luôn sẵn sàng lắng nghe và hỗ trợ mọi thắc
                                    mắc của bạn 24/7. Chúng tôi đảm bảo bạn được mua
                                    sắm thoải mái và hoàn toàn hài lòng.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="site-section block-3 site-blocks-2 bg-light">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-7 site-section-heading text-center pt-4">
                            <h2>Sản phẩm mới nhất</h2>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="row">
                                <Swiper
                                    slidesPerView={3}
                                    spaceBetween={30}
                                    pagination={{
                                        clickable: true,
                                    }}
                                    modules={[Pagination]}
                                    className="mySwiper"
                                >
                                    {newProducts.map((product, index) => (
                                        <SwiperSlide key={index}>
                                            <div className="item">
                                                <div className="block-4 text-center">
                                                    <figure className="block-4-image">
                                                        <img
                                                            src={product.thumbnail || "/assets/clients/images/cloth_1.jpg"}
                                                            alt={product.name || "Image placeholder"}
                                                            className="img-fluid"
                                                            style={{width: '100%', height: '300px',}}
                                                        />
                                                    </figure>
                                                    <div className="block-4-text p-4" style={{height: '180px'}}>
                                                        <h3><a className="text_truncate_"
                                                               href={'/products/' + product.id}>{product.name || "Product Name"}</a>
                                                        </h3>
                                                        <p className="mb-0 text_truncate_2_" style={{height: '55px'}}
                                                           dangerouslySetInnerHTML={{__html: product.short_description}}></p>
                                                        <p className="text-danger font-weight-bold">
                                                            {ConvertNumber(product.sale_price || 50)}
                                                            <strike className="ml-2 small text-black">
                                                                {ConvertNumber(product.price || 50)}
                                                            </strike>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {
                categories.map((category, index) => (
                    category.count > 0 &&
                    <div className={'site-section block-3 mt-3 site-blocks-2 ' + (index % 2 === 0 ? 'bg-light' : '')}
                         key={index}>
                        <div className="container">
                            <div className="row justify-content-center">
                                <div className="col-md-7 site-section-heading text-start pt-4">
                                    <h2>{category.name}</h2>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="row">
                                        <Swiper
                                            slidesPerView={3}
                                            spaceBetween={30}
                                            pagination={{
                                                clickable: true,
                                            }}
                                            modules={[Pagination]}
                                            className="mySwiper"
                                        >
                                            {category.products.map((product, index1) => (
                                                <SwiperSlide key={index1}>
                                                    <div className="item">
                                                        <div className="block-4 text-center">
                                                            <figure className="block-4-image">
                                                                <img
                                                                    src={product.thumbnail || "/assets/clients/images/cloth_1.jpg"}
                                                                    alt={product.name || "Image placeholder"}
                                                                    className="img-fluid"
                                                                    style={{width: '100%', height: '300px',}}
                                                                />
                                                            </figure>
                                                            <div className="block-4-text p-4" style={{height: '180px'}}>
                                                                <h3><a className="text_truncate_"
                                                                       href={'/products/' + product.id}>{product.name || "Product Name"}</a>
                                                                </h3>
                                                                <p className="mb-0 text_truncate_2_"
                                                                   style={{height: '55px'}}
                                                                   dangerouslySetInnerHTML={{__html: product.short_description}}></p>
                                                                <p className="text-danger font-weight-bold">
                                                                    {ConvertNumber(product.sale_price || 50)}
                                                                    <strike className="ml-2 small text-black">
                                                                        {ConvertNumber(product.price || 50)}
                                                                    </strike>
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </SwiperSlide>
                                            ))}
                                        </Swiper>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            }

            <Footer/>
        </div>
    )
}

export default Home;