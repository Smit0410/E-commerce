import { useCallback, useEffect, useState } from "react";
import _ from "lodash";
import "./dummy.css";
import type { Product } from "../product/Product";
import { Link } from "react-router-dom";

interface CartProduct {
  discountPercentage: number;
  discountedTotal: number;
  id: number;
  price: number;
  quantity: number;
  thumbnail: string;
  title: string;
  total: number;
}

const handleQuatity = (p: CartProduct, q: number) => {
  return {
    ...p,
    quantity: q,
    total: p.price * q,
    discountedTotal: discountedPrice(p) * q,
  };
};

const discountedPrice = (ele: {
  price: number;
  discountPercentage: number;
}) => {
  return ele.price - (ele.price * ele.discountPercentage) / 100;
};

const Cart = () => {
  const [cartDetails, setCartDetails] = useState<Array<CartProduct>>([]);

  const removeProduct = async (removeProductElement: CartProduct) => {
    const upadatedCart = cartDetails.filter((ele) => {
      return ele.id !== removeProductElement.id;
    });
    localStorage.setItem("saveItem", JSON.stringify(upadatedCart));
    setCartDetails(upadatedCart);
  };

  const setProduct = useCallback(async () => {
    // const response = await getCart();

    const allItems = localStorage.getItem("saveItem");

    if (allItems) {
      ``;
      const parshItem: Product[] = JSON.parse(allItems);

      const uniqueIdCount = parshItem.reduce(
        (acc: Record<string, number>, product) => {
          console.log(product, acc);

          if (acc[product.id]) {
            acc[product.id] += 1;
          } else {
            acc[product.id] = product.quantity || 1;
          }

          return acc;
        },
        {},
      );

      const cartProducts: CartProduct[] = Object.entries(uniqueIdCount)
        .map((ele) => {
          const [id, quantities] = ele;
          const found = parshItem.find((e) => e.id === +id);
          if (found) {
            return {
              id: found.id,
              discountPercentage: found.discountPercentage,
              thumbnail: found.thumbnail,
              price: found.price,
              title: found.title,
              quantity: quantities,
              total: found.price * quantities,
              discountedTotal: discountedPrice({
                ...found,
                price: found.price * quantities,
              }),
            };
          }
          return null;
        })
        .filter((u) => u !== null);

      setCartDetails(cartProducts);
    }
  }, []);

  const handlAddQuantity = (productId: number) => {
    const modProduct = cartDetails.map((p) => {
      const found = p.id === productId;

      if (found) return handleQuatity(p, p.quantity + 1);
      return p;
    });

    localStorage.setItem("saveItem", JSON.stringify(modProduct));
    setCartDetails(modProduct);
  };

  const handlRemoveQuantity = (productId: number) => {
    const modProduct = cartDetails.map((p) => {
      const found = p.id === productId;

      if (found)
        return handleQuatity(p, p.quantity > 1 ? p.quantity - 1 : p.quantity);
      return p;
    });
    localStorage.setItem("saveItem", JSON.stringify(modProduct));
    setCartDetails(modProduct);
  };

  useEffect(() => {
    setProduct();
  }, []);

  const updatedQuantity = cartDetails.reduce((a, b) => a + b.quantity, 0);
  const updatedTotalPrice = cartDetails.reduce((a, b) => a + b.total, 0) || 0;
  const updatedDiscountedTotalPrice =
    cartDetails.reduce((a, b) => a + b.discountedTotal, 0) || 0;

  return (
    <div className="max-w-7xl mx-auto">
      {/* ............................header............................ */}
      <header
        className="flex justify-between items-center mb-8"
        data-purpose="cart-header"
      >
        <div>
          <h1 className="text-3xl font-bold">Shopping Cart</h1>
          <p className="text-gray-500 mt-1">
            {_.size(cartDetails)} items • {updatedQuantity} quantities
          </p>
        </div>
        <Link
          to={`/product`}
          className="flex items-center gap-2 text-brand-purple border border-gray-200 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15 19l-7-7 7-7"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            ></path>
          </svg>
          Continue Shopping
        </Link>
      </header>

      {/* ............................section-aside............................ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* ............................section............................ */}
        <section
          className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
          data-purpose="product-list"
        >
          <div className="grid grid-cols-12 border-b border-gray-100 p-6 text-xs font-bold text-gray-400 uppercase tracking-wider">
            <div className="col-span-6">Cart</div>
            <div className="col-span-2 text-center">Price</div>
            <div className="col-span-2 text-center">Quantity</div>
            <div className="col-span-2 text-right">Total</div>
          </div>

          {/* ............................cart products............................ */}
          {_.map(cartDetails, (ele) => (
            <div
              key={ele.id}
              className="grid grid-cols-12 p-6 border-b border-gray-50 items-center"
            >
              <div className="col-span-6 flex gap-4">
                <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                  <img
                    alt={ele.title}
                    className="object-cover"
                    src={ele.thumbnail}
                  />
                </div>

                <div className="flex flex-col gap-1 items-start">
                  <h3 className="font-bold text-lg">{ele.title}</h3>
                  <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded">
                    {ele.discountPercentage}% OFF
                  </span>
                  <button
                    onClick={() => removeProduct(ele)}
                    className="cursor-pointer active:scale-95 text-red-500 text-sm flex items-center gap-1 hover:underline"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      ></path>
                    </svg>
                    Remove
                  </button>
                </div>
              </div>
              <div className="col-span-2 text-center">
                <p className="font-bold text-lg">
                  ${discountedPrice(ele).toFixed(2)}
                </p>
                <p className="text-gray-400 text-sm line-through">
                  ${ele.price}
                </p>
              </div>
              <div className="col-span-2 flex justify-center">
                <div className="flex items-center border border-gray-200 rounded-lg ">
                  <button
                    onClick={() => handlRemoveQuantity(ele.id)}
                    className="px-3 w-8 py-1 bg-gray-50 hover:bg-gray-100 border-r border-gray-200"
                  >
                    −
                  </button>
                  <div className="text-center w-10  py-1 font-medium">
                    {ele.quantity}
                  </div>
                  <button
                    onClick={() => handlAddQuantity(ele.id)}
                    className="px-3 w-8 py-1 bg-gray-50 hover:bg-gray-100 border-l border-gray-200"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="col-span-2 text-right">
                <p className="font-bold text-lg">
                  ${ele.discountedTotal.toFixed(2)}
                </p>
                <p className="text-gray-400 text-sm line-through">
                  ${ele.total.toFixed(2)}
                </p>
              </div>
            </div>
          ))}

          <div className="p-6 bg-gray-50 flex items-center justify-between border-t border-gray-100">
            <button
              onClick={() => {
                localStorage.setItem("saveItem", JSON.stringify([]));
                setCartDetails([]);
              }}
              className="px-6 py-2 border border-red-200 text-red-500 rounded-lg flex items-center gap-2 font-medium hover:bg-red-50 transition-colors"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                ></path>
              </svg>
              Clear Cart
            </button>
            <div className="flex-1 max-w-lg mx-8 bg-discount-green-light border border-emerald-100 text-emerald-700 py-3 rounded-lg flex items-center justify-center gap-2 text-sm font-medium">
              <svg
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  clipRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  fillRule="evenodd"
                ></path>
              </svg>
              You saved{" "}
              {!!cartDetails &&
                (updatedTotalPrice - updatedDiscountedTotalPrice).toFixed(
                  2,
                )}{" "}
              on this order
            </div>
          </div>
        </section>

        {/* ............................aside............................ */}
        <aside
          className="lg:col-span-1 space-y-6 lg:sticky lg:top-8"
          data-purpose="order-summary-sidebar"
        >
          {/* ............................Order Summary............................ */}

          <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>
            <div className="space-y-4 text-sm font-medium">
              <div className="flex justify-between">
                <span className="text-gray-500">Total Products</span>
                <span>{_.size(cartDetails)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Total Quantity</span>
                <span>{updatedQuantity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Total Price</span>
                <span className="font-bold">
                  ${updatedTotalPrice?.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center text-discount-green">
                <span>Discount</span>
                <span className="font-bold">
                  - $
                  {!!cartDetails &&
                    (updatedTotalPrice - updatedDiscountedTotalPrice).toFixed(
                      2,
                    )}
                </span>
              </div>
              <hr className="border-gray-100 my-4" />
              <div className="flex justify-between items-center py-2">
                <span className="text-lg font-bold">Discounted Total</span>
                <span className="text-2xl font-black text-brand-purple">
                  ${updatedDiscountedTotalPrice?.toFixed(2)}
                </span>
              </div>
            </div>
            <div className="mt-8 space-y-3">
              <button className="w-full bg-brand-purple text-white font-bold py-4 rounded-lg hover-bg-brand-purple transition-all shadow-md">
                Proceed to Checkout
              </button>
              <button className="w-full border border-brand-purple text-brand-purple font-bold py-4 rounded-lg hover:bg-indigo-50 transition-all">
                Buy Now
              </button>
            </div>
          </section>
          <section className="bg-gray-50 p-6 rounded-xl border border-gray-100">
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-white rounded-lg border border-gray-200 flex items-center justify-center text-brand-purple shrink-0">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    ></path>
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-sm">Secure Checkout</h4>
                  <p className="text-xs text-gray-500 mt-1">
                    Your payment information is safe with us.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-white rounded-lg border border-gray-200 flex items-center justify-center text-brand-purple shrink-0">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    ></path>
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-sm">Fast Delivery</h4>
                  <p className="text-xs text-gray-500 mt-1">
                    Get your products delivered quickly.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-white rounded-lg border border-gray-200 flex items-center justify-center text-brand-purple shrink-0">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    ></path>
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-sm">Easy Returns</h4>
                  <p className="text-xs text-gray-500 mt-1">
                    30-day return policy for unused items.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </aside>
      </div>

      {/* ............................footer............................ */}
      <footer
        className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-8 bg-white rounded-xl shadow-sm border border-gray-100"
        data-purpose="trust-badges"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-50 text-brand-purple rounded-xl">
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              ></path>
            </svg>
          </div>
          <div>
            <h5 className="font-bold text-sm">100% Secure Payment</h5>
            <p className="text-xs text-gray-400">We ensure secure payment</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-50 text-brand-purple rounded-xl">
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              ></path>
            </svg>
          </div>
          <div>
            <h5 className="font-bold text-sm">Money Back Guarantee</h5>
            <p className="text-xs text-gray-400">30 days money back</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-50 text-brand-purple rounded-xl">
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              ></path>
            </svg>
          </div>
          <div>
            <h5 className="font-bold text-sm">24/7 Customer Support</h5>
            <p className="text-xs text-gray-400">Dedicated support</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-50 text-brand-purple rounded-xl">
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              ></path>
            </svg>
          </div>
          <div>
            <h5 className="font-bold text-sm">Free Shipping</h5>
            <p className="text-xs text-gray-400">On all orders over $50</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Cart;
