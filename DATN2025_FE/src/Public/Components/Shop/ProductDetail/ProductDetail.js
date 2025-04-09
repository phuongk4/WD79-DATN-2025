import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Form, message, Rate, Badge, Tooltip } from 'antd';
import cartService from '../../Service/CartService';
import Header from "../../Shared/Client/Header/Header";
import Footer from "../../Shared/Client/Footer/Footer";
import productService from "../../Service/ProductService";
import reviewService from "../../Service/ReviewService";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Zoom, Navigation, Thumbs } from "swiper/modules";
import LoadingPage from "../../Shared/Utils/LoadingPage";
import ConvertNumber from "../../Shared/Utils/ConvertNumber";
import { FaShoppingCart, FaRegHeart, FaHeart, FaStar, FaRegStar, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { motion } from 'framer-motion';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/zoom';
import 'swiper/css/thumbs';

/**
 * This component renders a page with details of a single product.
 * @function ProductDetail
 * @returns {JSX.Element} The component to be rendered.
 */
function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [optionsProduct, setOptionsProduct] = useState([]);
    const [product_others, setProductOthers] = useState([]);
    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    const [isWishlist, setIsWishlist] = useState(false);
    const [activeTab, setActiveTab] = useState('description');
    const [quantity, setQuantity] = useState(1);
    const [selectedOptions, setSelectedOptions] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const getProduct = async () => {
        setIsLoading(true);
        await productService.detailProduct(id)
            .then((res) => {
                if (res.status === 200) {
                    setProduct(res.data.data.product);
                    setProductOthers(res.data.data.other_products);
                    setOptionsProduct(res.data.data.product.options);
                }
            })
            .catch((err) => {
                console.log(err);
                message.error('Không thể tải thông tin sản phẩm');
            })
            .finally(() => {
                setIsLoading(false);
            });
    }

    const getReviewProduct = async () => {
        await reviewService.getReviewByProduct(id)
            .then((res) => {
                if (res.status === 200) {
                    setReviews(res.data.data);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    const checkReviewProduct = async () => {
        await reviewService.checkReviewByProduct(id, '')
            .then((res) => {
                if (res.status === 200) {
                    let check = res.data.data;
                    if (check.valid === true) {
                        // We're not using these values but keeping the API call
                        // for potential future use
                    }
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    const selectOption = async (attributeId, propertyId, propertyName) => {
        setIsLoading(true);
        
        // Update selected options state
        setSelectedOptions(prev => ({
            ...prev,
            [attributeId]: { id: propertyId, name: propertyName }
        }));

        // Get all selected option values
        const selectedOptionValues = Object.values(selectedOptions).map(opt => opt.id);
        selectedOptionValues.push(propertyId);
        
        const list_option = selectedOptionValues.join(',');
        
        await productService.optionProduct(list_option, id)
            .then((res) => {
                if (res.status === 200) {
                    let pro_op = res.data.data;
                    setProduct(prev => ({
                        ...prev,
                        sale_price: pro_op.sale_price,
                        price: pro_op.price,
                        quantity: pro_op.quantity
                    }));
                }
            })
            .catch((err) => {
                console.log(err);
                message.error('Không tìm thấy thuộc tính hợp lệ!');
            })
            .finally(() => {
                setIsLoading(false);
            });
    }

    const addToCart = async () => {
        setIsLoading(true);
        
        // Check if all required options are selected
        const requiredOptions = optionsProduct.filter(opt => opt.required);
        const missingOptions = requiredOptions.filter(opt => !selectedOptions[opt.attribute.id]);
        
        if (missingOptions.length > 0) {
            message.warning('Vui lòng chọn đầy đủ thuộc tính sản phẩm');
            setIsLoading(false);
            return;
        }

        let data = {
            product_id: id,
            values: Object.values(selectedOptions).map(opt => opt.id).join(','),
            quantity: quantity
        };

        await cartService.createCart(data)
            .then((res) => {
                if (res.status === 200) {
                    message.success('Thêm sản phẩm vào giỏ hàng thành công!');
                } else {
                    message.error(res.data.message || 'Có lỗi xảy ra');
                }
            })
            .catch((err) => {
                let messageText = err.response?.data?.message || err.response?.data?.status || 'Có lỗi xảy ra';
                message.error(messageText);
                
                if (err.response?.status === 444 || err.response?.status === 401) {
                    window.location.href = '/login';
                }
            })
            .finally(() => {
                setIsLoading(false);
            });
    }

    const toggleWishlist = () => {
        setIsWishlist(!isWishlist);
        message.success(isWishlist ? 'Đã xóa khỏi danh sách yêu thích' : 'Đã thêm vào danh sách yêu thích');
    }

    const handleQuantityChange = (value) => {
        if (value < 1) return;
        if (value > product.quantity) {
            message.warning(`Chỉ còn ${product.quantity} sản phẩm`);
            return;
        }
        setQuantity(value);
    }

    useEffect(() => {
        getProduct();
        checkReviewProduct();
        getReviewProduct();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Show loading page only when initially loading and no product data
    if (isLoading && (!product || !product.length)) {
        return <LoadingPage />;
    }

    return (
        <div className="site-wrap">
            <Header />
            
            {/* Breadcrumb */}
            <div className="bg-light py-3">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12 mb-0">
                            <a href="/" className="text-decoration-none">Trang chủ</a> 
                            <span className="mx-2 mb-0">/</span> 
                            <strong className="text-black">{product.name}</strong>
                        </div>
                    </div>
                </div>
            </div>

            {/* Product Detail Section */}
            <div className="site-section py-5">
                <div className="container">
                    <Form className="row" id="formCreate" onFinish={addToCart}>
                        <div className="col-lg-6 mb-4 mb-lg-0">
                            {/* Main Image Gallery */}
                            <div className="product-gallery">
                                <Swiper
                                    modules={[Zoom, Navigation, Thumbs]}
                                    spaceBetween={10}
                                    navigation={true}
                                    zoom={true}
                                    thumbs={{ swiper: thumbsSwiper }}
                                    className="main-swiper"
                                >
                                    {product.gallery ? product.gallery.split(',').map((image, index) => (
                                        <SwiperSlide key={index}>
                                            <div className="swiper-zoom-container">
                                                <img
                                                    src={`http://127.0.0.1:8000${image}`}
                                                    alt={`${product.name} - ${index + 1}`}
                                                    className="img-fluid product-main-image"
                                                />
                                            </div>
                                        </SwiperSlide>
                                    )) : (
                                        <SwiperSlide>
                                            <div className="swiper-zoom-container">
                                                <img
                                                    src={`http://127.0.0.1:8000${product.thumbnail}`}
                                                    alt={product.name}
                                                    className="img-fluid product-main-image"
                                                />
                                            </div>
                                        </SwiperSlide>
                                    )}
                                </Swiper>
                                
                                {/* Thumbnail Gallery */}
                                {product.gallery && (
                                    <Swiper
                                        onSwiper={setThumbsSwiper}
                                        spaceBetween={10}
                                        slidesPerView={4}
                                        watchSlidesProgress={true}
                                        modules={[Thumbs]}
                                        className="thumbs-swiper mt-3"
                                    >
                                        {product.gallery.split(',').map((image, index) => (
                                            <SwiperSlide key={index}>
                                                <div className="thumbnail-container">
                                                    <img
                                                        src={`http://127.0.0.1:8000${image}`}
                                                        alt={`${product.name} - ${index + 1}`}
                                                        className="img-fluid thumbnail-image"
                                                    />
                                                </div>
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                )}
                            </div>
                        </div>
                        
                        <div className="col-lg-6">
                            <div className="product-info">
                                <div className="product-header mb-4">
                                    <motion.h1 
                                        className="product-title h2 mb-2"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        {product.name}
                                    </motion.h1>
                                    
                                    <div className="product-meta d-flex align-items-center flex-wrap">
                                        <div className="me-4">
                                            <Rate disabled defaultValue={4.5} allowHalf className="fs-6" />
                                            <span className="ms-2 text-muted small">({reviews.length} đánh giá)</span>
                                        </div>
                                        <div className="product-sku small text-muted">
                                            Mã SP: <span className="fw-medium">{product.sku || 'N/A'}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="product-price-wrapper mb-4">
                                    <div className="d-flex align-items-baseline">
                                        <h3 className="current-price text-danger mb-0 me-3">
                                            {ConvertNumber(product.sale_price)}
                                        </h3>
                                        {product.price > product.sale_price && (
                                            <>
                                                <span className="original-price text-muted text-decoration-line-through fs-5">
                                                    {ConvertNumber(product.price)}
                                                </span>
                                                <Badge 
                                                    count={`-${Math.round((1 - product.sale_price / product.price) * 100)}%`} 
                                                    style={{ 
                                                        backgroundColor: '#ff4d4f',
                                                        marginLeft: '12px',
                                                        fontSize: '12px',
                                                        fontWeight: '500'
                                                    }} 
                                                />
                                            </>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="product-description mb-4">
                                    <div className="short-desc" dangerouslySetInnerHTML={{ __html: product.short_description }}></div>
                                </div>

                                <div className="product-stock mb-4">
                                    <div className="d-flex align-items-center">
                                        <span className="stock-status me-2 small fw-medium">Tình trạng:</span>
                                        <span className={`stock-value small ${product.quantity > 0 ? 'text-success' : 'text-danger'}`}>
                                            {product.quantity > 0 ? 'Còn hàng' : 'Hết hàng'}
                                        </span>
                                        {product.quantity > 0 && (
                                            <span className="stock-count ms-2 small text-muted">
                                                ({product.quantity} sản phẩm)
                                            </span>
                                        )}
                                    </div>
                                </div>
                                
                                {/* Product Options */}
                                {optionsProduct.length > 0 && (
                                    <div className="product-options mb-4">
                                        {optionsProduct.map((option, optionIndex) => (
                                            <div className="option-group mb-3" key={optionIndex}>
                                                <h6 className="option-name small fw-medium mb-2">{option.attribute.name}</h6>
                                                <div className="option-values d-flex flex-wrap gap-2">
                                                    {option.properties && option.properties.length > 0 ? (
                                                        option.properties.map((property, propertyIndex) => {
                                                            const isSelected = selectedOptions[option.attribute.id]?.id === property.id;
                                                            return (
                                                                <Tooltip title={property.name} key={propertyIndex}>
                                                                    <div 
                                                                        className={`option-value ${isSelected ? 'selected' : ''}`}
                                                                        onClick={() => selectOption(option.attribute.id, property.id, property.name)}
                                                                    >
                                                                        {property.name}
                                                                    </div>
                                                                </Tooltip>
                                                            );
                                                        })
                                                    ) : (
                                                        <p className="mb-0 small text-muted">Không có thuộc tính</p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                
                                {/* Quantity Selector */}
                                <div className="quantity-selector mb-4">
                                    <span className="quantity-label small fw-medium me-3">Số lượng:</span>
                                    <div className="quantity-controls d-inline-flex align-items-center">
                                        <button 
                                            type="button"
                                            className="quantity-btn" 
                                            onClick={() => handleQuantityChange(quantity - 1)}
                                            disabled={quantity <= 1}
                                        >
                                            <FaChevronLeft />
                                        </button>
                                        <input 
                                            type="number" 
                                            className="quantity-input" 
                                            value={quantity} 
                                            onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                                            min="1"
                                            max={product.quantity}
                                        />
                                        <button 
                                            type="button"
                                            className="quantity-btn" 
                                            onClick={() => handleQuantityChange(quantity + 1)}
                                            disabled={quantity >= product.quantity}
                                        >
                                            <FaChevronRight />
                                        </button>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="product-actions d-flex flex-wrap gap-2">
                                    <button 
                                        type="submit" 
                                        className="btn btn-primary px-4 py-2"
                                        disabled={product.quantity <= 0 || isLoading}
                                    >
                                        <FaShoppingCart className="me-2" />
                                        <span>Thêm vào giỏ hàng</span>
                                    </button>
                                    <button 
                                        type="button" 
                                        className={`btn btn-outline-danger px-3 py-2 ${isWishlist ? 'active' : ''}`}
                                        onClick={toggleWishlist}
                                    >
                                        {isWishlist ? <FaHeart /> : <FaRegHeart />}
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        {/* Product Tabs */}
                        <div className="col-12 mt-5">
                            <div className="product-tabs">
                                <div className="tabs-header d-flex border-bottom mb-4">
                                    <div 
                                        className={`tab-item ${activeTab === 'description' ? 'active' : ''}`}
                                        onClick={() => setActiveTab('description')}
                                    >
                                        Mô tả sản phẩm
                                    </div>
                                    <div 
                                        className={`tab-item ${activeTab === 'reviews' ? 'active' : ''}`}
                                        onClick={() => setActiveTab('reviews')}
                                    >
                                        Đánh giá ({reviews.length})
                                    </div>
                                    <div 
                                        className={`tab-item ${activeTab === 'shipping' ? 'active' : ''}`}
                                        onClick={() => setActiveTab('shipping')}
                                    >
                                        Vận chuyển & Hoàn trả
                                    </div>
                                </div>
                                
                                <div className="tabs-content">
                                    {activeTab === 'description' && (
                                        <div className="tab-pane active">
                                            <div className="product-description-content">
                                                <div dangerouslySetInnerHTML={{ __html: product.description }}></div>
                                            </div>
                                        </div>
                                    )}
                                    
                                    {activeTab === 'reviews' && (
                                        <div className="tab-pane active">
                                            <div className="reviews-section">
                                                {reviews.length > 0 ? (
                                                    <div className="reviews-list">
                                                        {reviews.map((review, index) => (
                                                            <div className="review-item mb-4" key={index}>
                                                                <div className="review-header d-flex align-items-center mb-2">
                                                                    <div className="reviewer-avatar mr-3">
                                                                        <img 
                                                                            src={review.user.avt || "https://via.placeholder.com/50"} 
                                                                            alt={review.user.email} 
                                                                            className="rounded-circle"
                                                                        />
                                                                    </div>
                                                                    <div className="reviewer-info">
                                                                        <h6 className="reviewer-name mb-0">{review.user.email}</h6>
                                                                        <div className="review-rating">
                                                                            {Array.from({ length: 5 }).map((_, i) => (
                                                                                <span key={i} className={i < review.stars ? 'star-filled' : 'star-empty'}>
                                                                                    {i < review.stars ? <FaStar /> : <FaRegStar />}
                                                                                </span>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <h5 className="review-title">{review.title}</h5>
                                                                <p className="review-content">{review.content}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="no-reviews text-center py-4">
                                                        <p>Chưa có đánh giá nào cho sản phẩm này.</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                    
                                    {activeTab === 'shipping' && (
                                        <div className="tab-pane active">
                                            <div className="shipping-info">
                                                <h5>Chính sách vận chuyển</h5>
                                                <p>Chúng tôi giao hàng toàn quốc với phí vận chuyển tùy thuộc vào địa điểm và phương thức vận chuyển.</p>
                                                
                                                <h5 className="mt-4">Chính sách hoàn trả</h5>
                                                <p>Chúng tôi chấp nhận hoàn trả sản phẩm trong vòng 30 ngày kể từ ngày nhận hàng nếu sản phẩm có lỗi hoặc không đúng như mô tả.</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Form>
                </div>
            </div>

            {/* Related Products */}
            <div className="site-section block-3 site-blocks-2 bg-light py-5">
                <div className="container">
                    <div className="row justify-content-center mb-4">
                        <div className="col-md-7 site-section-heading text-center">
                            <h2 className="text-black">Sản phẩm liên quan</h2>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <Swiper
                                slidesPerView={1}
                                spaceBetween={20}
                                pagination={{ clickable: true }}
                                modules={[Pagination, Navigation]}
                                navigation={true}
                                breakpoints={{
                                    640: {
                                        slidesPerView: 2,
                                    },
                                    768: {
                                        slidesPerView: 3,
                                    },
                                    1024: {
                                        slidesPerView: 4,
                                    },
                                }}
                                className="related-products-swiper"
                            >
                                {product_others?.length > 0 ? (
                                    product_others.map((product, index) => (
                                        <SwiperSlide key={index}>
                                            <div className="product-card">
                                                <div className="product-card-image">
                                                    <img
                                                        src={`http://127.0.0.1:8000${product.thumbnail || "/assets/clients/images/cloth_1.jpg"}`}
                                                        alt={product.name || "Product Name"}
                                                        className="img-fluid"
                                                    />
                                                    <div className="product-card-actions">
                                                        <button className="action-btn">
                                                            <FaShoppingCart />
                                                        </button>
                                                        <button className="action-btn">
                                                            <FaRegHeart />
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="product-card-content p-3">
                                                    <h3 className="product-card-title">
                                                        <a href={'/products/' + product.id}>
                                                            {product.name || "Product Name"}
                                                        </a>
                                                    </h3>
                                                    <div className="product-card-price">
                                                        <span className="sale-price">
                                                            {ConvertNumber(product.sale_price || 0)}
                                                        </span>
                                                        {product.price > product.sale_price && (
                                                            <span className="original-price">
                                                                {ConvertNumber(product.price || 0)}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </SwiperSlide>
                                    ))
                                ) : (
                                    <SwiperSlide>
                                        <div className="text-center py-4">
                                            <p>Không có sản phẩm liên quan</p>
                                        </div>
                                    </SwiperSlide>
                                )}
                            </Swiper>
                        </div>
                    </div>
                </div>
            </div>
            
            <Footer />
            
            <style>{`
                .product-info {
                    font-size: 14px;
                    padding: 1.5rem;
                    background: #fff;
                    border-radius: 8px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                }

                .product-title {
                    font-size: 1.5rem;
                    font-weight: 600;
                    color: #1a202c;
                    line-height: 1.3;
                    margin-bottom: 1rem;
                }

                .product-meta {
                    display: flex;
                    align-items: center;
                    gap: 1.5rem;
                    margin-bottom: 1.5rem;
                    font-size: 0.875rem;
                }

                .product-price-wrapper {
                    background: #f7fafc;
                    padding: 1rem;
                    border-radius: 6px;
                    margin-bottom: 1.5rem;
                }

                .current-price {
                    font-size: 1.75rem;
                    font-weight: 600;
                    color: #e53e3e;
                }

                .original-price {
                    font-size: 1rem;
                    color: #718096;
                    text-decoration: line-through;
                    margin-left: 0.5rem;
                }

                .product-specifications {
                    background: #f8fafc;
                    border-radius: 8px;
                    padding: 1rem;
                    margin-bottom: 1.5rem;
                }

                .specs-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 1rem;
                }

                .spec-item {
                    display: flex;
                    flex-direction: column;
                    gap: 0.25rem;
                    padding: 0.75rem;
                    background: white;
                    border-radius: 6px;
                    border: 1px solid #e2e8f0;
                }

                .spec-label {
                    font-size: 0.875rem;
                    color: #64748b;
                    font-weight: 500;
                }

                .spec-value {
                    font-size: 0.9375rem;
                    color: #1e293b;
                    font-weight: 400;
                }

                .product-stock {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.875rem;
                    margin-bottom: 1.5rem;
                }

                .stock-status {
                    color: #4a5568;
                    font-weight: 500;
                }

                .stock-value.text-success {
                    color: #48bb78;
                }

                .stock-value.text-danger {
                    color: #e53e3e;
                }

                .product-options {
                    margin-bottom: 1.5rem;
                }

                .option-group {
                    margin-bottom: 1rem;
                }

                .option-name {
                    font-size: 0.875rem;
                    font-weight: 500;
                    color: #4a5568;
                    margin-bottom: 0.5rem;
                }

                .option-values {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.5rem;
                }

                .option-value {
                    padding: 0.5rem 1rem;
                    font-size: 0.875rem;
                    border: 1px solid #e2e8f0;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .option-value:hover {
                    border-color: #4299e1;
                    color: #4299e1;
                }

                .option-value.selected {
                    background-color: #4299e1;
                    color: white;
                    border-color: #4299e1;
                }

                .quantity-selector {
                    margin-bottom: 1.5rem;
                }

                .quantity-controls {
                    display: inline-flex;
                    align-items: center;
                    border: 1px solid #e2e8f0;
                    border-radius: 4px;
                }

                .quantity-btn {
                    padding: 0.5rem;
                    background: #f7fafc;
                    border: none;
                    cursor: pointer;
                    transition: background 0.2s;
                }

                .quantity-btn:hover:not(:disabled) {
                    background: #edf2f7;
                }

                .quantity-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .quantity-input {
                    width: 3rem;
                    text-align: center;
                    border: none;
                    padding: 0.5rem;
                    font-size: 0.875rem;
                    -moz-appearance: textfield;
                }

                .quantity-input::-webkit-outer-spin-button,
                .quantity-input::-webkit-inner-spin-button {
                    -webkit-appearance: none;
                    margin: 0;
                }

                .product-actions {
                    display: flex;
                    gap: 1rem;
                }

                .btn {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    font-size: 0.875rem;
                    font-weight: 500;
                    padding: 0.75rem 1.5rem;
                    border-radius: 6px;
                    transition: all 0.2s;
                }

                .btn-primary {
                    background-color: #4299e1;
                    color: white;
                    border: none;
                }

                .btn-primary:hover:not(:disabled) {
                    background-color: #3182ce;
                }

                .btn-outline-danger {
                    border: 1px solid #e53e3e;
                    color: #e53e3e;
                    background: transparent;
                }

                .btn-outline-danger:hover {
                    background-color: #e53e3e;
                    color: white;
                }

                .btn-outline-danger.active {
                    background-color: #e53e3e;
                    color: white;
                }

                @media (max-width: 768px) {
                    .product-info {
                        padding: 1rem;
                    }

                    .product-title {
                        font-size: 1.25rem;
                    }

                    .product-meta {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 0.5rem;
                    }

                    .current-price {
                        font-size: 1.5rem;
                    }

                    .specs-grid {
                        grid-template-columns: 1fr;
                    }

                    .product-actions {
                        flex-direction: column;
                    }

                    .btn {
                        width: 100%;
                    }
                }
            `}</style>
        </div>
    );
}

export default ProductDetail;