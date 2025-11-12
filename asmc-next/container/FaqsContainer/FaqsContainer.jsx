import React, { Fragment, useState, useMemo } from "react";
import ScrollProgressBar from "@/components/common/ScrollProgressBar";
import { Header } from "@/components/includes/Header";
import { Footer } from "@/components/includes/Footer";
import { Banner } from "@/components/common/Banner";
import { useFetchBannerQuery, useFetchFaqsQuery, useFetchFaqsCategoriesQuery } from "@/redux/masters/mastersApis";
import { Loader } from "@/components/common/Loader";

const FaqsContainer = (props) => {
    const { data: bannerData, isLoading: bannerLoading } = useFetchBannerQuery({ sortBy: 1, sortField: "createdAt", type: "faqs" });
    const { data: faqsData, isLoading: faqsLoading } = useFetchFaqsQuery({ sortBy: 1, sortField: "createdAt", limit: 1000 });
    const { data: categories = [], isLoading: categoriesLoading } = useFetchFaqsCategoriesQuery();
    const [activeAccordion, setActiveAccordion] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState("all");

    // Group FAQs by category
    const groupedFaqs = useMemo(() => {
        if (!faqsData?.result) return {};
        
        const grouped = {};
        faqsData.result.forEach((faq) => {
            const category = faq.category || "Uncategorized";
            if (!grouped[category]) {
                grouped[category] = [];
            }
            grouped[category].push(faq);
        });
        return grouped;
    }, [faqsData]);

    // Filter FAQs based on selected category
    const filteredFaqs = useMemo(() => {
        if (selectedCategory === "all") {
            return faqsData?.result || [];
        }
        return groupedFaqs[selectedCategory] || [];
    }, [selectedCategory, faqsData, groupedFaqs]);

    if (bannerLoading || faqsLoading || categoriesLoading) {
        return <Loader />;
    }

    const handleAccordionClick = (index) => {
        // Toggle active accordion
        setActiveAccordion(activeAccordion === index ? null : index);
    };

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        setActiveAccordion(null); // Reset accordion state when changing category
    };

    return (
        <Fragment>
            <ScrollProgressBar />
            <Header isAuth={props.isAuth} />

            <Banner
                title={"Faqs"}
                breadcrumbs={[{ title: "Home", link: "/" }, { title: "FAQs" }]}
                image={bannerData?.url}
            />

            <section className="faq section">
                <div className="container">
                    <div className="row justify-content-center section__row">
                        <div className="col-lg-12 col-xl-12 section__col">
                            {/* Enhanced Category Filter */}
                            {categories.length > 0 && (
                                <div className="category-filter-container">
                                    <div className="category-filter-header">
                                        <h3 className="category-title">Browse FAQs by Category</h3>
                                        <p className="category-subtitle">Find answers to your questions quickly</p>
                                    </div>
                                    <div className="category-tags-container">
                                        <div 
                                            className={`category-tag ${selectedCategory === "all" ? "active" : ""}`}
                                            onClick={() => handleCategoryChange("all")}
                                        >
                                            <span className="tag-icon">📋</span>
                                            <span className="tag-text">All Categories</span>
                                            <span className="tag-count">({faqsData?.result?.length || 0})</span>
                                        </div>
                                        {categories.map((category) => (
                                            <div 
                                                key={category} 
                                                className={`category-tag ${selectedCategory === category ? "active" : ""}`}
                                                onClick={() => handleCategoryChange(category)}
                                            >
                                                <span className="tag-icon">❓</span>
                                                <span className="tag-text">{category}</span>
                                                <span className="tag-count">({groupedFaqs[category]?.length || 0})</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Category-wise FAQ Display */}
                            {selectedCategory === "all" ? (
                                // Show all FAQs grouped by category
                                <div className="faq-categories-container">
                                    {Object.keys(groupedFaqs).map((category, categoryIndex) => (
                                        <div key={category} className="faq-category-section">
                                            <div className="category-header">
                                                <h3 className="category-name">
                                                    <span className="category-icon">📁</span>
                                                    {category}
                                                </h3>
                                                <span className="category-count">{groupedFaqs[category].length} questions</span>
                                            </div>
                                            <div className="accordion custom-accordion" id={`accordion${categoryIndex}`}>
                                                {groupedFaqs[category].map((item, index) => {
                                                    const globalIndex = `${categoryIndex}-${index}`;
                                                    return (
                                                        <div className="accordion-item custom-accordion-item" key={globalIndex}>
                                                            <h5 className="accordion-header" id={`heading${globalIndex}`}>
                                                                <button
                                                                    className={`accordion-button custom-accordion-button ${activeAccordion === globalIndex ? "" : "collapsed"}`}
                                                                    type="button"
                                                                    onClick={() => handleAccordionClick(globalIndex)}
                                                                >
                                                                    <span className="question-icon">❓</span>
                                                                    <span className="question-text">{item.question}</span>
                                                                </button>
                                                            </h5>
                                                            <div
                                                                id={`collapse${globalIndex}`}
                                                                className={`accordion-collapse collapse ${activeAccordion === globalIndex ? "show" : ""}`}
                                                            >
                                                                <div className="accordion-body custom-accordion-body">
                                                                    <div className="answer-content">
                                                                        <span className="answer-icon">💡</span>
                                                                        <p>{item.answer}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                // Show filtered FAQs for selected category
                                <div className="faq-filtered-container">
                                    <div className="selected-category-header">
                                        <h3 className="selected-category-title">
                                            <span className="category-icon">📁</span>
                                            {selectedCategory}
                                        </h3>
                                        <span className="selected-category-count">{filteredFaqs.length} questions</span>
                                    </div>
                                    <div className="accordion custom-accordion" id="accordionClub">
                                        {filteredFaqs.length > 0 ? (
                                            filteredFaqs.map((item, index) => {
                                                return (
                                                    <div className="accordion-item custom-accordion-item" key={index}>
                                                        <h5 className="accordion-header" id={`headingClub${index}`}>
                                                            <button
                                                                className={`accordion-button custom-accordion-button ${activeAccordion === index ? "" : "collapsed"}`}
                                                                type="button"
                                                                onClick={() => handleAccordionClick(index)}
                                                            >
                                                                <span className="question-icon">❓</span>
                                                                <span className="question-text">{item.question}</span>
                                                            </button>
                                                        </h5>
                                                        <div
                                                            id={`collapseClub${index}`}
                                                            className={`accordion-collapse collapse ${activeAccordion === index ? "show" : ""}`}
                                                        >
                                                            <div className="accordion-body custom-accordion-body">
                                                                <div className="answer-content">
                                                                    <span className="answer-icon">💡</span>
                                                                    <p>{item.answer}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <div className="no-faqs-message">
                                                <div className="no-faqs-icon">🤔</div>
                                                <h4>No FAQs found for this category</h4>
                                                <p>Try selecting a different category or check back later for updates.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <style jsx>{`
                .category-filter-container {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-radius: 20px;
                    padding: 2rem;
                    margin-bottom: 3rem;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
                }

                .category-filter-header {
                    text-align: center;
                    margin-bottom: 2rem;
                }

                .category-title {
                    color: white;
                    font-size: 2rem;
                    font-weight: 700;
                    margin-bottom: 0.5rem;
                }

                .category-subtitle {
                    color: rgba(255, 255, 255, 0.9);
                    font-size: 1.1rem;
                    margin: 0;
                }

                .category-tags-container {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 1rem;
                    justify-content: center;
                }

                .category-tag {
                    background: rgba(255, 255, 255, 0.9);
                    border: 2px solid transparent;
                    border-radius: 50px;
                    padding: 1rem 1.5rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-weight: 600;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
                    min-width: 180px;
                    justify-content: center;
                }

                .category-tag:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
                    background: white;
                }

                .category-tag.active {
                    background: #ff6b6b;
                    color: white;
                    border-color: #ff6b6b;
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(255, 107, 107, 0.3);
                }

                .tag-icon {
                    font-size: 1.2rem;
                }

                .tag-text {
                    font-size: 0.95rem;
                }

                .tag-count {
                    background: rgba(0, 0, 0, 0.1);
                    border-radius: 20px;
                    padding: 0.2rem 0.6rem;
                    font-size: 0.8rem;
                    font-weight: 500;
                }

                .category-tag.active .tag-count {
                    background: rgba(255, 255, 255, 0.2);
                }

                .faq-categories-container {
                    display: flex;
                    flex-direction: column;
                    gap: 2rem;
                }

                .faq-category-section {
                    background: white;
                    border-radius: 15px;
                    padding: 2rem;
                    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
                    border: 1px solid #f0f0f0;
                }

                .category-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1.5rem;
                    padding-bottom: 1rem;
                    border-bottom: 2px solid #f8f9fa;
                }

                .category-name {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: #2c3e50;
                    font-size: 1.5rem;
                    font-weight: 700;
                    margin: 0;
                }

                .category-icon {
                    font-size: 1.3rem;
                }

                .category-count {
                    background: #e3f2fd;
                    color: #1976d2;
                    padding: 0.5rem 1rem;
                    border-radius: 25px;
                    font-weight: 600;
                    font-size: 0.9rem;
                }

                .custom-accordion {
                    border: none;
                }

                .custom-accordion-item {
                    border: 1px solid #e9ecef;
                    border-radius: 10px;
                    margin-bottom: 1rem;
                    overflow: hidden;
                    transition: all 0.3s ease;
                }

                .custom-accordion-item:hover {
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
                    transform: translateY(-2px);
                }

                .custom-accordion-button {
                    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
                    border: none;
                    padding: 1.5rem;
                    font-weight: 600;
                    color: #495057;
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    transition: all 0.3s ease;
                }

                .custom-accordion-button:hover {
                    background: linear-gradient(135deg, #e9ecef 0%, #dee2e6 100%);
                    color: #212529;
                }

                .custom-accordion-button:not(.collapsed) {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    box-shadow: none;
                }

                .question-icon {
                    font-size: 1.2rem;
                }

                .question-text {
                    flex: 1;
                    text-align: left;
                }

                .custom-accordion-body {
                    background: #fafbfc;
                    padding: 1.5rem;
                    border-top: 1px solid #e9ecef;
                }

                .answer-content {
                    display: flex;
                    gap: 1rem;
                    align-items: flex-start;
                }

                .answer-icon {
                    font-size: 1.2rem;
                    margin-top: 0.2rem;
                }

                .answer-content p {
                    margin: 0;
                    line-height: 1.6;
                    color: #495057;
                }

                .faq-filtered-container {
                    background: white;
                    border-radius: 15px;
                    padding: 2rem;
                    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
                }

                .selected-category-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2rem;
                    padding-bottom: 1rem;
                    border-bottom: 2px solid #f8f9fa;
                }

                .selected-category-title {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: #2c3e50;
                    font-size: 1.8rem;
                    font-weight: 700;
                    margin: 0;
                }

                .selected-category-count {
                    background: #e3f2fd;
                    color: #1976d2;
                    padding: 0.5rem 1rem;
                    border-radius: 25px;
                    font-weight: 600;
                    font-size: 0.9rem;
                }

                .no-faqs-message {
                    text-align: center;
                    padding: 3rem 2rem;
                    color: #6c757d;
                }

                .no-faqs-icon {
                    font-size: 4rem;
                    margin-bottom: 1rem;
                }

                .no-faqs-message h4 {
                    color: #495057;
                    margin-bottom: 1rem;
                }

                .no-faqs-message p {
                    margin: 0;
                    font-size: 1.1rem;
                }

                @media (max-width: 768px) {
                    .category-filter-container {
                        padding: 1.5rem;
                        margin-bottom: 2rem;
                    }

                    .category-title {
                        font-size: 1.5rem;
                    }

                    .category-tags-container {
                        gap: 0.8rem;
                    }

                    .category-tag {
                        min-width: 150px;
                        padding: 0.8rem 1.2rem;
                        font-size: 0.9rem;
                    }

                    .faq-category-section,
                    .faq-filtered-container {
                        padding: 1.5rem;
                    }

                    .category-header,
                    .selected-category-header {
                        flex-direction: column;
                        gap: 1rem;
                        align-items: flex-start;
                    }

                    .category-name,
                    .selected-category-title {
                        font-size: 1.3rem;
                    }
                }
            `}</style>

            <Footer />
        </Fragment>
    );
};

export default FaqsContainer;
