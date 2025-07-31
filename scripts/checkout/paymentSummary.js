import { cart } from "../../data/cart";
import { getProduct } from "../../data/products";
import { deliveryOptions, getDeliveryOption } from "../../data/deliveryOptions";
import formatCurrancy from "../utils/money.js";

export function renderPaymentSummary() {
  let productPriceCents = 0;
  let ShippingPriceCents = 0;

  cart.array.forEach(CartItem => {
    const product = getProduct(CartItem.productId);
    productPriceCents += product.priceCents * CartItem.quantity;

    const deliveryOption = getDeliveryOption(CartItem.getDeliveryOptionId);
    ShippingPriceCents += deliveryOption.priceCents;
  });

  const TotalBeforeTaxCents = productPriceCents + ShippingPriceCents;

  const TaxCents = TotalBeforeTax * 0.1;
  const TotalCents = TotalBeforeTax + TaxCents;

  const paymentSummaryHTML = `
    <div class="payment-summary-title">
      Order Summary
    </div>

    <div class="payment-summary-row">
      <div>Items (3):</div>
      <div class="payment-summary-money">$${formatCurrancy(productPriceCents)}</div>
    </div>

    <div class="payment-summary-row">
      <div>Shipping &amp; handling:</div>
      <div class="payment-summary-money">$${formatCurrancy(ShippingPriceCents)}</div>
    </div>

    <div class="payment-summary-row subtotal-row">
      <div>Total before tax:</div>
      <div class="payment-summary-money">${formatCurrancy(TotalBeforeTaxCents)}</div>
    </div>

    <div class="payment-summary-row">
      <div>Estimated tax (10%):</div>
      <div class="payment-summary-money">$${formatCurrancy(TaxCents)}</div>
    </div>

    <div class="payment-summary-row total-row">
      <div>Order total:</div>
      <div class="payment-summary-money">$${formatCurrancy(TotalCents)}</div>
    </div>

    <button class="place-order-button button-primary">
      Place your order
    </button>
  `;

  document.querySelector('.js-payment-summary').innerHTML = paymentSummaryHTML;
}