import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllProducts } from '../actions/productAction';
import Product from '../components/Product';
import Loading from '../components/Loading';
import Error from '../components/Error';
import { Row, Col, Container, Button, InputGroup, FormControl } from 'react-bootstrap';
import { FaThList, FaThLarge } from 'react-icons/fa';
import '../screens/ProductsPage.css';

export default function ProductsPage() {
    const dispatch = useDispatch();
    const [viewMode, setViewMode] = useState('grid');
    const [sortBy, setSortBy] = useState('newest');
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    const getAllProductsState = useSelector(state => state.getAllProductsReducer);
    const { loading, products, error } = getAllProductsState;

    useEffect(() => {
        dispatch(getAllProducts());
    }, [dispatch]);

    const categories = [
        'electronics', 'fashion', 'mobiles', 'games', 'client'
    ];

    const handleCategoryToggle = (category) => {
        setSelectedCategories(prev => 
            prev.includes(category)
                ? prev.filter(c => c !== category)
                : [...prev, category]
        );
    };

    const handlePriceRangeChange = (type, value) => {
        setPriceRange(prev => ({
            ...prev,
            [type]: value
        }));
    };

    const filterProducts = (products) => {
        if (!products) return [];
        
        let filtered = [...products];

        // Search filter
        if (searchQuery) {
            filtered = filtered.filter(product => 
                product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Category filter
        if (selectedCategories.length > 0) {
            filtered = filtered.filter(product => 
                selectedCategories.includes(product.category)
            );
        }

        // Price range filter
        if (priceRange.min) {
            filtered = filtered.filter(product => 
                product.price >= Number(priceRange.min)
            );
        }
        if (priceRange.max) {
            filtered = filtered.filter(product => 
                product.price <= Number(priceRange.max)
            );
        }

        // Sorting
        switch (sortBy) {
            case 'price-asc':
                filtered.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                filtered.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                filtered.sort((a, b) => b.rating - a.rating);
                break;
            case 'newest':
                filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
            default:
                break;
        }

        return filtered;
    };

    const filteredProducts = filterProducts(products);

    return (
        <Container className="products-page">
            <Row className="mb-4">
                <Col md={8}>
                    <InputGroup>
                        <FormControl
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </InputGroup>
                </Col>
                <Col md={4} className="text-right">
                    <Button 
                        variant={viewMode === 'grid' ? 'primary' : 'outline-primary'} 
                        className="mr-2"
                        onClick={() => setViewMode('grid')}
                    >
                        <FaThLarge />
                    </Button>
                    <Button 
                        variant={viewMode === 'list' ? 'primary' : 'outline-primary'}
                        onClick={() => setViewMode('list')}
                    >
                        <FaThList />
                    </Button>
                </Col>
            </Row>

            <Row>
                {/* Filters Sidebar */}
                <Col md={3} className="filters-sidebar">
                    <div className="filter-section">
                        <h4>Categories</h4>
                        {categories.map(category => (
                            <div key={category} className="category-item">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={selectedCategories.includes(category)}
                                        onChange={() => handleCategoryToggle(category)}
                                    />
                                    {category.charAt(0).toUpperCase() + category.slice(1)}
                                </label>
                            </div>
                        ))}
                    </div>

                    <div className="filter-section">
                        <h4>Price Range</h4>
                        <InputGroup className="mb-2">
                            <FormControl
                                placeholder="Min"
                                type="number"
                                value={priceRange.min}
                                onChange={(e) => handlePriceRangeChange('min', e.target.value)}
                            />
                        </InputGroup>
                        <InputGroup>
                            <FormControl
                                placeholder="Max"
                                type="number"
                                value={priceRange.max}
                                onChange={(e) => handlePriceRangeChange('max', e.target.value)}
                            />
                        </InputGroup>
                    </div>

                    <div className="filter-section">
                        <h4>Sort By</h4>
                        <select 
                            className="form-control"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="newest">Newest First</option>
                            <option value="price-asc">Price: Low to High</option>
                            <option value="price-desc">Price: High to Low</option>
                            <option value="rating">Average Rating</option>
                        </select>
                    </div>
                </Col>

                {/* Products Grid/List */}
                <Col md={9}>
                    {loading ? (
                        <Loading />
                    ) : error ? (
                        <Error error={error} />
                    ) : (
                        <Row>
                            {filteredProducts.map(product => (
                                <Col key={product._id} 
                                    xs={12} 
                                    md={viewMode === 'grid' ? 4 : 12}
                                    className={`mb-4 ${viewMode === 'list' ? 'list-view' : ''}`}
                                >
                                    <Product product={product} />
                                </Col>
                            ))}
                            {filteredProducts.length === 0 && (
                                <Col xs={12}>
                                    <div className="text-center py-5">
                                        <h3>No products found</h3>
                                        <p>Try adjusting your filters or search query</p>
                                    </div>
                                </Col>
                            )}
                        </Row>
                    )}
                </Col>
            </Row>
        </Container>
    );
}
