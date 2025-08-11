import {cart, calculateCartQuantity} from "../../data/cart.js";
import { getProduct } from "../../data/products.js";
import {getDeliveryOption } from "../../data/deliveryOptions.js";
import formatCurrency from "../utils/money.js";
import { addOrder } from "../../data/orders.js";

export function renderPaymentSummary() {
  let productPriceCents = 0;
  let ShippingPriceCents = 0;

  cart.forEach(CartItem => {
    const product = getProduct(CartItem.productId);

    productPriceCents += product.priceCents * CartItem.quantity;

    const deliveryOption = getDeliveryOption(CartItem.deliveryOptionId);
    ShippingPriceCents += deliveryOption.priceCents;
  });

  const TotalBeforeTaxCents = productPriceCents + ShippingPriceCents;

  const TaxCents = TotalBeforeTaxCents * 0.1;
  const TotalCents = TotalBeforeTaxCents + TaxCents; 

  const paymentSummaryHTML = `
    <div class="payment-summary-title">
      Order Summary
    </div>

    <div class="payment-summary-row">
      <div class= "js-payment-summary-items"></div>
      <div class="payment-summary-money">$${formatCurrency(productPriceCents)}</div>
    </div>

    <div class="payment-summary-row">
      <div>Shipping &amp; handling:</div>
      <div class="payment-summary-money js-payment-summary-shipping">$${formatCurrency(ShippingPriceCents)}</div>
    </div>

    <div class="payment-summary-row subtotal-row">
      <div>Total before tax:</div>
      <div class="payment-summary-money">$${formatCurrency(TotalBeforeTaxCents)}</div>
    </div>

    <div class="payment-summary-row">
      <div>Estimated tax (10%):</div>
      <div class="payment-summary-money">$${formatCurrency(TaxCents)}</div>
    </div>

    <div class="payment-summary-row total-row">
      <div>Order total:</div>
      <div class="payment-summary-money js-payment-summary-total">$${formatCurrency(TotalCents)}</div>
    </div>

    <button class="place-order-button button-primary
      js-place-order">
      Place your order
    </button>
  `;

  document.querySelector('.js-payment-summary').innerHTML = paymentSummaryHTML;

  calculateCartQuantity('.js-payment-summary-items');

  document.querySelector('.js-place-order')
    .addEventListener('click', async () => {
      try {
        const response = await fetch('https://supersimplebackend.dev/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          cart: cart
        })
      })

      const order = await response.json();
      addOrder(order);

      } catch (error) {
        console.log('Unexpected error. Please try again later.');
      }

      window.location.href = 'orders.html';
    });
}