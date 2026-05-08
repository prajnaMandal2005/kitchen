import { useCart } from "../context/CartContext";
import api from "../api";

function Cart() {
  const { cart, removeFromCart, totalAmount } = useCart();

  const placeOrder = async () => {
    const userId = "USER_ID_HERE";

    await api.post("/api/order/place-order", {
      userId,
      customerName: "User",
      items: cart,
      totalAmount,
    });

    alert("Order placed!");
  };

  return (
    <div>
      <h2>Cart</h2>

      {cart.map((item) => (
        <div key={item._id}>
          <p>{item.name}</p>
          <p>Qty: {item.quantity}</p>
          <button onClick={() => removeFromCart(item._id)}>
            Remove
          </button>
        </div>
      ))}

      <h3>Total: ₹{totalAmount}</h3>
      <button onClick={placeOrder}>Place Order</button>
    </div>
  );
}

export default Cart;