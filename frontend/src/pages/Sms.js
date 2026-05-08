import { useLocation } from "react-router-dom";

function Sms() {
  const location = useLocation();
  const selectedItems = location.state?.items || [];

  const sendSMS = () => {
    const text = `Your order is accepted. Items: ${selectedItems.join(", ")}`;
    window.location.href = `sms:?body=${encodeURIComponent(text)}`;
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Order Summary</h2>

      <p>You selected:</p>
      <ul>
        {selectedItems.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>

      <h3>Click below to confirm via SMS</h3>

      <button onClick={sendSMS}>Send SMS</button>
    </div>
  );
}

export default Sms;