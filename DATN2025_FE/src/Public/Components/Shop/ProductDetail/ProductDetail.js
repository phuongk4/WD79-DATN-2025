import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {Form, message} from 'antd';
import cartService from '../../Service/CartService';
import Header from "../../Shared/Client/Header/Header";
import Footer from "../../Shared/Client/Footer/Footer";
import productService from "../../Service/ProductService";
import reviewService from "../../Service/ReviewService";
import $ from "jquery";
import {Swiper, SwiperSlide} from "swiper/react";
import {Pagination} from "swiper/modules";
import LoadingPage from "../../Shared/Utils/LoadingPage";
import ConvertNumber from "../../Shared/Utils/ConvertNumber";

/**
 * This component renders a page with details of a single product.
 * @function ProductDetail
 * @returns {JSX.Element} The component to be rendered.
 */
function ProductDetail() {
    const {id} = useParams();
    const [product, setProduct] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [isReview, setIsReview] = useState(false);
    const [order, setOrder] = useState('');
    const [optionsProduct, setOptionsProduct] = useState([]);
    const [product_others, setProductOthers] = useState([]);

    const getProduct = async () => {
        await productService.detailProduct(id)
            .then((res) => {
                if (res.status === 200) {
                    setProduct(res.data.data.product)
                    setProductOthers(res.data.data.other_products)
                    setOptionsProduct(res.data.data.product.options)
                    renderImage(res.data.data.product.gallery, res.data.data.product.name)
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }


    const getReviewProduct = async () => {
        await reviewService.getReviewByProduct(id)
            .then((res) => {
                if (res.status === 200) {
                    console.log(res.data.data)
                    setReviews(res.data.data)
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }

    const checkReviewProduct = async () => {
        await reviewService.checkReviewByProduct(id, '')
            .then((res) => {
                if (res.status === 200) {
                    let check = res.data.data;
                    console.log(check);
                    if (check.valid == true) {
                        setIsReview(true);
                        setOrder(check.order)
                    }
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }

    const selectOption = async (el) => {
        LoadingPage();

        console.log($(el).val())

        let input_option_ = $('.input_option_');

        let parent = $(el).closest('.option_item');
        let list_ = parent.find('.input_option_');

        list_.each(function () {
            if (this === el && this.checked) {
                list_.not(this).prop('checked', false);
            }
        });

        let list_option;
        let arr_option = [];
        input_option_.each(function () {
            if ($(this).is(':checked')) {
                arr_option.push($(this).val());
            }
        })

        list_option = arr_option.join(',');
        await productService.optionProduct(list_option, id)
            .then((res) => {
                setTimeout(function () {
                    LoadingPage();
                }, 300);
                if (res.status === 200) {
                    let pro_op = res.data.data;

                    let product_sale_price = ConvertNumber(pro_op.sale_price);
                    let product_price = ConvertNumber(pro_op.price);
                    let product_quantity = pro_op.quantity;
                    let product_option = pro_op.id;

                    $('#product_sale_price').html(product_sale_price);
                    $('#product_price').html(product_price);
                    $('#product_quantity').html(product_quantity);
                    $('#product_option').val(product_option);
                }
            })
            .catch((err) => {
                console.log(err)
                // alert('Không tìm thấy thuộc tính hợp lệ!')
            })
    }

    const addToCart = async () => {
        LoadingPage();

        let data = [];

        let product_id = id;
        let product_option = $('#product_option').val();
        let quantity = $('#inputQuantity').val();
        data = {
            product_id: product_id,
            values: product_option,
            quantity: quantity
        }

        await cartService.createCart(data)
            .then((res) => {
                LoadingPage();
                if (res.status === 200) {
                    // if (window.confirm('Thêm sản phẩm vào giỏ hàng thành công! Thanh toán ngay?')) {
                    //     window.location.href = '/cart';
                    // }
                    alert("Thêm sản phẩm vào giỏ hàng thành công!")
                } else {
                    alert(res.data.message)
                }
            })
            .catch((err) => {
                LoadingPage();
                let message = err.response.data.message;
                if (!message) {
                    message = err.response.data.status;
                    alert(message);
                    window.location.href = '/login';
                } else {
                    alert(message)
                    if (err.response.status === 444 || err.response.status === 401) {
                        window.location.href = '/login'
                    }
                }
            })
    }

    const handleShowDescription = () => {
        let product_description_ = $('#product_description_area_ .product_description_');
        if (product_description_.hasClass('show_')) {
            product_description_.removeClass('show_')
            $('#btnReadmore').text('Xem thêm')
        } else {
            product_description_.addClass('show_')
            $('#btnReadmore').text('Ẩn bớt')
        }
    }

    const minusQuantity = () => {
        let qty = $('#inputQuantity').val();
        qty = parseInt(qty);
        if (qty > 1) {
            qty = qty - 1;
            $('#inputQuantity').val(qty);
        }
    }

    const plusQuantity = () => {
        let qty = $('#inputQuantity').val();
        qty = parseInt(qty);
        qty = qty + 1;
        $('#inputQuantity').val(qty);
    }

    const checkInput = () => {
        let val = $('#inputQuantity').val();

        if (!$.isNumeric(val)) {
            val = val.replace(/\D/g, '');

            $('#inputQuantity').val(val);
        }
    }

    function renderImage(images, alt) {
        let arr = images.split(',');
        let html = '';
        for (let i = 0; i < arr.length; i++) {
            html += `<div class="item">
          <img style="cursor: pointer" width="100px" onclick="changeSrcImage('${arr[i]}')" src="${arr[i]}" alt="${alt}">
        </div>`;
        }

        $('#list_images').empty().append(html);
    }

    window.changeSrcImage = (src) => {
        $('#productImage').attr('src', src);
    }

    useEffect(() => {
        getProduct();
        checkReviewProduct();
        getReviewProduct();
    }, []);

    return (
        <div className="site-wrap">
            <Header/>
            <div className="bg-light py-3">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12 mb-0"><a href="">Trang chủ</a> <span
                            className="mx-2 mb-0">/</span> <strong className="text-black">{product.name}</strong>
                        </div>
                    </div>
                </div>
            </div>

            <div className="site-section">
                <div className="container">
                    <Form className="row" id="formCreate" onFinish={addToCart}>
                        <input type="text" className="d-none" id="product_option"/>
                        <div className="col-md-6">
                            <img src={product.thumbnail} alt="Image" className="img-fluid" id="productImage"
                                 style={{width: '100%', height: '500px',}}/>

                            <div id="list_images"
                                 className="d-flex align-items-center justify-content-start flex-wrap gap-2 mt-3">

                            </div>
                        </div>
                        <div className="col-md-6">
                            <h2 className="text-black">{product.name}</h2>
                            <p dangerouslySetInnerHTML={{__html: product.short_description}}></p>
                            <p><strong className="text-danger h4"
                                       id="product_sale_price">{ConvertNumber(product.sale_price)}</strong> <strike
                                className="text-secondary h6" id="product_price">{ConvertNumber(product.price)}</strike>
                            </p>
                            <p>Đang sẵn: <span id="product_quantity" className="h5">{product.quantity}</span> sản phẩm
                            </p>
                            <div className="list_option_">
                                {optionsProduct.map((option, optionIndex) => (
                                    <div className="option_item" key={optionIndex}>
                                        <h6 className="option_name">{option.attribute.name}</h6>
                                        <div className="mb-1 d-flex">
                                            {option.properties && option.properties.length > 0 ? (option.properties.map((property, propertyIndex) => {
                                                const inputId = `option-${optionIndex}-property-${propertyIndex}`;
                                                return (<label htmlFor={inputId} className="d-flex mr-3 mb-3"
                                                               key={propertyIndex}>
                                                                    <span className="d-inline-block mr-2"
                                                                          style={{top: '0px', position: 'relative'}}>
                                                                        <input type="checkbox"
                                                                               onChange={(e) => selectOption(e.target)}
                                                                               className="input_option_"
                                                                               data-value={option.attribute.id + '-' + property.id}
                                                                               value={property.id} id={inputId}
                                                                               name={`option-${optionIndex}`}/>
                                                                    </span>
                                                    <span
                                                        className="d-inline-block text-black">{property.name}</span>
                                                </label>);
                                            })) : (<p>No properties available</p>)}
                                        </div>
                                    </div>))}

                            </div>
                            <div className="mb-5">
                                <div className="input-group mb-3" style={{maxWidth: '150px'}}>
                                    <div className="input-group-prepend">
                                        <button className="btn btn-outline-primary js-btn-minus" onClick={minusQuantity}
                                                type="button">-
                                        </button>
                                    </div>

                                    <input type="text" className="form-control text-center" defaultValue="1"
                                           placeholder="" min='0' max={product.quantity} onInput={checkInput}
                                           aria-label="Example text with button addon" id="inputQuantity"
                                           aria-describedby="button-addon1"/>

                                    <div className="input-group-append">
                                        <button className="btn btn-outline-primary js-btn-plus" onClick={plusQuantity}
                                                type="button">+
                                        </button>
                                    </div>
                                </div>

                            </div>
                            <p>
                                <button type="submit" className="buy-now btn btn-sm btn-primary">Thêm vào giỏ hàng
                                </button>
                            </p>

                        </div>
                        <div className="col-md-12" id="product_description_area_">
                            <p className="product_description_"
                               dangerouslySetInnerHTML={{__html: product.description}}></p>
                            <button id="btnReadmore" onClick={handleShowDescription} type="button"
                                    className="btn btn-outline-info">Xem thêm
                            </button>
                        </div>
                    </Form>

                    <div className="w-100 border-top mt-5 mb-3" id="product_review_area_">
                        <h5 className="text-start text-danger mt-3">Đánh giá gần đây</h5>

                        <div className="list_review_content_ mt-2">
                            {reviews.map((review, index) => (
                                <div className="verified_customer_section mb-2" key={index}>
                                    <div className="image_review">
                                        <div className="customer_image">
                                            <img src={review.user.avt}
                                                 alt="customer image"/>
                                        </div>

                                        <div className="customer_name_review_status">
                                            <div className="customer_name">{review.user.email}</div>
                                            <div className="customer_review">
                                                {Array.from({length: 5}).map((_, i) => (
                                                    <i
                                                        key={i}
                                                        className={`fa-solid fa-star ${i < review.stars ? 'filled' : ''}`}
                                                    ></i>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <h5>{review.title}</h5>

                                    <div className="customer_comment text_truncate_3_">
                                        {review.content}
                                    </div>

                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="site-section block-3 site-blocks-2 bg-light">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-7 site-section-heading text-center pt-4">
                            <h2>Sản phẩm liên quan</h2>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="row">
                                <Swiper
                                    slidesPerView={3}
                                    spaceBetween={30}
                                    pagination={{clickable: true}}
                                    modules={[Pagination]}
                                    className="mySwiper"
                                >
                                    {product_others?.length > 0 ? (product_others.map((product, index) => (
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
                                        </SwiperSlide>))) : (<p>No products available</p>)}
                                </Swiper>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>)
}

export default ProductDetail