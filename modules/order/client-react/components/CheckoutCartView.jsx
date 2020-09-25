import React from 'react';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Row, Col, Button, Card, Icon, Checkbox, Empty } from 'antd';

import { PageLayout } from '@gqlapp/look-client-react';
// import { TranslateFunction } from "@gqlapp/i18n-client-react";

import settings from '../../../../settings';
import CheckoutStepsComponent from './CheckoutStepsComponent';
import CartItemComponent from './CartItemComponent';

const CheckoutDiv = styled.div`
  padding: 20px 8%;
`;

const font14 = styled.div`
  font-size: 14px;
`;

const Margin20Button = styled(Button)`
  margin: 20px 0;
`;

const MarginV15 = styled(Col)`
  margin: 15px 0 !important;
`;

const Font11h = styled.span`
  font-size: 11.5px;
`;

const MarginB20btn = styled(Button)`
  margin-bottom: 20px;
`;

const CartSumh2 = styled.h2`
  text-shadow: 0.5px 0 0;
  font-size: 19px;
`;

const Font12 = styled.div`
  font-size: 12px;
`;

const Rightfloat = styled.div`
  float: right;
`;

const ColorFloat = styled.strong`
  float: right;
  color: #3f0869;
`;

export function TotalPrice(cartArray) {
  var totalCartPrice = 0;
  console.log('cart array', cartArray);
  cartArray &&
    cartArray.map((item, key) => {
      totalCartPrice += item.cost * (item.orderOptions && item.orderOptions.quantity);
    });
  return totalCartPrice;
}

const renderMetaData = () => (
  <Helmet
    title={`${settings.app.name} - Cart`}
    meta={[{ name: 'description', content: `${settings.app.name} - ${'meta'}` }]}
  />
);

const CheckoutCartView = props => {
  const [checkout, setCheckout] = React.useState(true);
  function onChange(e) {
    setCheckout(e);
  }

  const { history, navigation, cartLoading, onSubmit, getCart } = props;

  const cartLength = getCart && getCart.length;

  return (
    <PageLayout>
      {renderMetaData()}
      {console.log('props', props)}
      {// !props.loading &&
      !cartLoading && getCart && getCart.orderDetails.length > 0 ? (
        <CheckoutDiv>
          <Row>
            <Col lg={{ span: 24, offset: 0 }} xs={{ span: 24, offset: 0 }} align="center">
              <CheckoutStepsComponent step={0} />
            </Col>
            <MarginV15 lg={{ span: 23, offset: 1 }} xs={{ span: 24, offset: 0 }}>
              <Col span={24}>
                <font14>
                  <strong>My cart - </strong>
                  {cartLength} items
                </font14>
                <h4>orderId - {getCart.id}</h4>
                <div>
                  Total price: <strong>&#8377; {TotalPrice(getCart && getCart.orderDetails)} </strong>
                </div>
              </Col>
              <br />
              <br />
              <Row gutter={24}>
                <Col lg={{ span: 16, offset: 0 }} xs={{ span: 24, offset: 0 }}>
                  {getCart &&
                    getCart.orderDetails.map(cartItem => (
                      <CartItemComponent
                        item={cartItem}
                        edit={true}
                        onSubmit={onSubmit}
                        // deleteProduct={props.deleteProduct}
                      />
                    ))}
                </Col>
                <Col lg={{ span: 8, offset: 0 }} sm={{ span: 24, offset: 0 }} xs={{ span: 24, offset: 0 }}>
                  <Card>
                    <MarginV15 span={24}>
                      <Checkbox onChange={e => onChange(e)}>
                        <Font11h>
                          <b>I HAVE READ AND AGREE TO ALL THE PRIVACY POLICY.</b>
                          {/* <b>{AGREEMENT}</b> */}
                        </Font11h>
                      </Checkbox>
                    </MarginV15>
                    {checkout ? (
                      <Margin20Button onClick={() => history.push('/checkout-bill/')} type="primary" block>
                        Next
                      </Margin20Button>
                    ) : (
                      <Margin20Button type="primary" disabled block>
                        Checkout
                      </Margin20Button>
                    )}
                    <Link className="listing-link" to={`/listing_catalogue`} target="_blank">
                      <MarginB20btn type="primary" ghost block>
                        Add more products
                      </MarginB20btn>
                    </Link>
                    <CartSumh2>Cart Summary</CartSumh2>
                    <Font12>
                      {getCart &&
                        getCart.orderDetails.map((item, key) => (
                          <div key={key}>
                            <strong>Item {key + 1}:</strong>
                            <p>
                              Price{' '}
                              <Rightfloat>
                                &#8377;{' '}
                                {item.cost && item.cost !== '0'
                                  ? `${item.cost} X ${item.quantity} = ${item.cost * item.quantity}`
                                  : 'Free'}
                              </Rightfloat>
                              <br />
                            </p>
                          </div>
                        ))}

                      <h3>
                        Total rent amount
                        <ColorFloat>
                          &#8377;
                          {TotalPrice(getCart && getCart.orderDetails)}
                        </ColorFloat>
                      </h3>
                    </Font12>
                  </Card>
                </Col>
              </Row>
            </MarginV15>
          </Row>
        </CheckoutDiv>
      ) : (
        <div className="width100 centerAlign marginT30">
          <Empty description="You have no items in your Cart">
            <Link to="/listing_catalogue">
              <Button style={{ width: 'fit-content' }} type="primary">
                Add some products
              </Button>
            </Link>
          </Empty>
        </div>
      )}
    </PageLayout>
  );
};

export default CheckoutCartView;
