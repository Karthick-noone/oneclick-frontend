import React from "react";
import logo from "./img/logo3.png"; // Ensure the path is correct
import { HiScissors } from "react-icons/hi";

const Invoice = ({ order, productDetails }) => {
  // Ensure the products array exists and is not empty
  const products = productDetails || []; // Use productDetails passed as prop

  // Calculate total quantity and total amount
  const totalQuantity = products.reduce(
    (acc, product) => acc + (product.quantity || 0),
    0
  );
  const grandTotal = products.reduce(
    (acc, product) =>
      acc +
      (product.prod_price || 0) +
      (product.delivey_charge || 0) * (product.quantity || 0),
    0
  );

  const uniqueInvoiceNumber = `INV${order.unique_id}-${Date.now()}`;

  return (
    <div>
      {/* Main Container */}
      <div
        style={{
          paddingTop: "10px",
          fontFamily: "Arial, sans-serif",
          border: "1px solid black",
          marginBottom: "10px",
        }}
      >
        {/* Header Section */}
        <div
          style={{
            padding: "10px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "5px",
          }}
        >
          {/* Left: Logo */}
          <div style={{ flex: "1", textAlign: "left" }}>
            <img src={logo} alt="Company Logo" style={{ width: "150px" }} />
          </div>

          {/* Center: Contact Info */}
          <div style={{ flex: "2", textAlign: "center" }}>
            <p>Contact Us: 9092206677</p>
            <p>Email: enquiryoneclick@gmail.com</p>
          </div>

          {/* Right: Company Info */}
          <div
            style={{
              padding: "5px",
              flex: "1",
              textAlign: "center",
              border: "1px dashed #333",
            }}
          >
            Tax Invoice: <p> #{uniqueInvoiceNumber}</p>
          </div>
        </div>

        <hr />

        {/* Order Information Section */}
        <div
          style={{
            padding: "10px",
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "5px",
          }}
        >
          <div>
            <p>Order ID: #{order.unique_id}</p>
            <p>Order Date: {new Date(order.order_date).toLocaleDateString()}</p>
            <p>Invoice Date: {new Date().toLocaleDateString()}</p>
            <p>Printed Date: {new Date().toLocaleDateString()}</p>
          </div>
          <div>
            <p>
              <strong>Billing Address:</strong>
            </p>
            <p>Market Road, Marthandam,</p>
            <p>Kanyakumari, 629165</p>
            <p>Email: enquiryoneclick@gmail.com</p>
            <p>Phone: +91-9092206677</p>
          </div>
          <div>
            <p>
              <strong>Shipping Address:</strong>
            </p>
            <p>
              {order.shipping_address
                ? order.shipping_address.split(",").map((line, index) => (
                    <span key={index}>
                      {line.trim()}
                      <br />
                    </span>
                  ))
                : "N/A"}
            </p>
          </div>
        </div>

        <div
          style={{
            paddingLeft: "10px",
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "10px",
          }}
        >
          <div>
            <p>Order By: {order.payment_method}</p>
            <p>
              <strong>Total Products: </strong> {totalQuantity}
            </p>
            <p>
              <strong>Grand Total: </strong> ₹{order.total_amount}
            </p>
            {/* Removed individual product total calculations here */}
          </div>
        </div>

        <hr />
        <p style={{ fontSize: "12px", fontFamily: "dancing, cursive" }}>
          This is a computer generated invoice, no signature required.
        </p>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "10px",
        }}
      >
        <hr
          style={{
            flex: "1",
            borderTop: "1px dotted #333",
            // margin: "0 10px",
          }}
        />
        <HiScissors style={{ fontSize: "20px", color: "#333" }} />
        <hr
          style={{
            flex: "1",
            borderTop: "1px dotted #333",
            // margin: "0 10px",
          }}
        />
      </div>

      {/* Products Table Container */}
      <div
        style={{
          paddingTop: "20px",
          fontFamily: "Arial, sans-serif",
          border: "1px solid black",
          marginBottom: "30px",
        }}
      >
        <div
          style={{
            paddingLeft: "10px",
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "10px",
          }}
        >
          <div style={{ flex: "1", paddingRight: "10px" }}>
            <p>Order By: {order.payment_method}</p>
            <p>Order ID: #{order.unique_id}</p>
          </div>

          <div style={{ flex: "1" }}>
            <p>Order Date: {new Date(order.order_date).toLocaleDateString()}</p>
            <p>Invoice Date: {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        <table
          style={{
            width: "98%",
            borderCollapse: "collapse",
            marginBottom: "20px",
            marginLeft: "5px",
            marginRight: "5px",
          }}
        >
          <thead>
            <tr>
              <th style={{ border: "1px solid #000", padding: "5px" }}>
                Product
              </th>
              <th style={{ border: "1px solid #000", padding: "5px" }}>Qty</th>
              <th style={{ border: "1px solid #000", padding: "5px" }}>Tax</th>
              <th style={{ border: "1px solid #000", padding: "5px" }}>
                Total Price
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.prod_id}>
                <td style={{ border: "1px solid #000", padding: "5px" }}>
                  {product.prod_name || "-"} <br />
                  (#{product.prod_id})
                </td>
                <td style={{ border: "1px solid #000", padding: "5px" }}>
                  {product.quantity || "-"}
                </td>
                <td style={{ border: "1px solid #000", padding: "5px" }}>
                  {product.tax || "-"}
                </td>
                <td style={{ border: "1px solid #000", padding: "5px" }}>
                  ₹
                  {product.prod_price +
                    product.deliverycharge * (product.quantity || 1) || "0"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Total Quantity and Grand Total */}
        <div
          style={{
            padding: "10px",
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "20px",
          }}
        >
          <p>
            <strong>Total Products: </strong> {totalQuantity}
          </p>
          <p>
            <strong>Grand Total: </strong> ₹{order.total_amount}
          </p>
        </div>
        <hr />
        <p style={{ fontSize: "12px", fontFamily: "dancing, cursive" }}>
          This is a computer generated invoice, no signature required.
        </p>
      </div>
    </div>
  );
};

export default Invoice;
