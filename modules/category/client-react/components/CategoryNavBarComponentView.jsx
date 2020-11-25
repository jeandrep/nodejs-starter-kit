import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ScrollParallax from 'rc-scroll-anim/lib/ScrollParallax';

import { Row, Col, DropDown, Card, Skeleton } from '@gqlapp/look-client-react';
import { useImageLoaded } from '@gqlapp/listing-client-react/components/functions';

import ROUTES from '@gqlapp/listing-client-react/routes';

const CategoryNavBarComponentView = props => {
  const [ref, loaded, onLoad] = useImageLoaded();
  const [visible, setVisible] = useState(false);
  const [activeCategory, setActiveCategory] = useState([]);
  const { loading, categories } = props;

  const setDropDownMenu = category => {
    if (category.subCategories && category.subCategories.length > 0) {
      setVisible(true);
      setActiveCategory(category.subCategories);
    }
  };

  // console.log(visible);
  return (
    <ScrollParallax
      location="page-layout"
      animation={{
        translateY: '-24px'
      }}
      align="center"
      className="navbar-category-strip"
    >
      {!loading ? (
        <Row
          type="flex"
          justify="center"
          style={{ height: '40px', lineHeight: '40px' }}
          onMouseLeave={() => setVisible(false)}
        >
          {categories.edges &&
            categories.totalCount > 0 &&
            categories.edges.map((c, i) => (
              <Col key={i} span={24 / categories.totalCount}>
                <a href="#" onMouseEnter={() => setDropDownMenu(c.node)}>
                  <h1>{c.node.title}</h1>
                </a>
              </Col>
            ))}
          <Col span={24} style={{ visibility: 'collapse' }}>
            <DropDown visible={visible} content={'navbar-category-dropdown'} className="navbar-category-dropdown">
              <Row type="flex" justify="center" gutter={[24, 24]}>
                {activeCategory.map(sC => (
                  <Col span={3} align="center">
                    <a href={`${ROUTES.categoryCatalogueLink}${sC.id}`}>
                      <Card
                        bordered={false}
                        // style={{ border: '0px', borderRadius: '0px !important' }}
                        bodyStyle={{ margin: '0px', padding: '0px', textAlign: 'center' }}
                        hoverable
                        cover={
                          <>
                            {!loaded && (
                              <div
                                style={{
                                  overflow: 'hidden',
                                  height: '126px',
                                  borderRadius: '8px 8px 0px 0px',
                                  background: 'linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 37%, #f2f2f2 63%)',
                                  animation: 'ant-skeleton-loading 1.4s ease infinite'
                                }}
                                align="center"
                              ></div>
                            )}
                            <img
                              ref={ref}
                              onLoad={onLoad}
                              alt="example"
                              src={sC.imageUrl}
                              style={{ display: !loaded && 'none' }}
                            />
                          </>
                        }
                      >
                        {sC.title}
                      </Card>
                    </a>
                  </Col>
                ))}
              </Row>
            </DropDown>
          </Col>
        </Row>
      ) : (
        <Row type="flex" justify="center" style={{ lineHeight: '40px' }}>
          {[...Array(6).keys()].map(() => {
            <Col span={24 / 6}>
              <Skeleton active title={{ width: '50%' }} />
            </Col>;
          })}
        </Row>
      )}
    </ScrollParallax>
  );
};

CategoryNavBarComponentView.propTypes = {
  t: PropTypes.func,
  loading: PropTypes.bool,
  categories: PropTypes.object
};

export default CategoryNavBarComponentView;
