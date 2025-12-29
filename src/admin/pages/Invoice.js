import React from "react";
import logo from "./img/logo3.png"; // Ensure the path is correct
import { HiScissors } from "react-icons/hi";
// import './css/Invoice.css'
const Invoice = ({ order, productDetails }) => {
  const products = productDetails || []; // Use productDetails passed as prop

  console.log("product", products);


  // Calculate total quantity
  const totalQuantity = products.reduce(
    (acc, product) => acc + (product.quantity || 0),
    0
  );

  const formatDate = (dateObj) => {
    if (!dateObj) return "N/A";
    const date = new Date(dateObj); // already a Date object
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  // const uniqueInvoiceNumber = `INV${order.unique_id}-${Date.now()}`;

  return (
    <div style={{ padding: '10px' }}>
      <style type="text/css" media="print">
        {`
          /* Force display of the logo image during printing */
          .invoice-logo {
            display: block !important;
            max-width: 100%; /* Ensure it fits within the page */
            height: auto; /* Maintain aspect ratio */
          }
          /* Additional styles to ensure visibility */
          body {
            -webkit-print-color-adjust: exact; /* Ensure colors are printed */
            print-color-adjust: exact;
          }
        `}
      </style>
      {/* Main Container */}
      <div
        style={{
          paddingTop: "10px",
          fontFamily: "Calibri",
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
            <img
              className="invoice-logo"
              src={logo}
              alt="Company Logo"
              style={{ width: "150px" }}
            // onLoad={() => console.log("Logo image loaded successfully")}
            // onError={() => console.error("Failed to load logo image:", logo)}
            />
          </div>

          {/* Center: Contact Info */}
          {/* <div style={{ flex: "2", textAlign: "center" }}>
            <p>Contact Us: 9092206677</p>
            <p>Email: enquiryoneclick@gmail.com</p>
          </div> */}

          {/* Right: Company Info */}
          <div
            style={{
              padding: "8px 12px",
              textAlign: "center",
              border: "1px dashed #333",
              borderRadius: "4px",
              display: "flex",
              flexDirection: "column", // Stack items vertically
              alignItems: "center",
              fontSize: "14px",
              lineHeight: "1.4",
            }}

          >
            <p style={{ margin: "0 0 5px 0" }}>
              <strong>Invoice No:</strong> #{order.invoice}
            </p>
            <p style={{ margin: "0 11px 5px 0" }}>
              <strong>Date:</strong> {formatDate(new Date())}
            </p>
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
            fontSize: '14px'
          }}
        >

          <div style={{ textAlign: "left", lineHeight: "1.6" }}>
            <p style={{ margin: "0 0 5px 0", fontWeight: "bold" }}>Billing Address:</p>
            <p style={{ margin: "0" }}>Market Road, Marthandam,</p>
            <p style={{ margin: "0" }}>Kanyakumari, TamilNadu</p>
            <p style={{ margin: "0" }}>India, 629165</p>
            <p style={{ margin: "0" }}><strong>Email:</strong> enquiryoneclick@gmail.com</p>
            <p style={{ margin: "0" }}><strong>Phone:</strong> +91-9092206677</p>
          </div>


          <div style={{ textAlign: "left", lineHeight: "1.6" }}>
            <p style={{ margin: "0 0 5px 0", fontWeight: "bold" }}>Delivery Address:</p>
            {order.shipping_address ? (() => {
              const parts = order.shipping_address.split(",").map((part) => part.trim());

              const rows = [];

              // First part as first line
              if (parts.length > 0) {
                rows.push(
                  <p key="first" style={{ margin: "0" }}>{parts[0]}</p>
                );
              }

              // Middle parts: combine 2 parts per line (excluding first and last)
              for (let i = 1; i < parts.length - 1; i += 2) {
                const line = [parts[i], parts[i + 1]].filter(Boolean).join(", ");
                rows.push(
                  <p key={i} style={{ margin: "0" }}>{line}</p>
                );
              }

              // Last part as phone
              const phoneLine = parts[parts.length - 1];

              return (
                <>
                  {rows}
                  <p style={{ margin: "0" }}>
                    <strong>Phone:</strong> {phoneLine}
                  </p>
                </>
              );
            })() : (
              <p style={{ margin: "0" }}>N/A</p>
            )}

          </div>

        </div>


        {/* <div
          style={{
            paddingLeft: "10px",
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "10px",
          }}
        >
          <div>
            <p>Order By: {order.payment_method}</p>
            <p>Order ID: #{order.unique_id}</p>
            <p>Order Date: {new Date(order.order_date).toLocaleDateString()}</p>
            <p>Invoice Date: {new Date().toLocaleDateString()}</p>
            <p>Printed Date: {new Date().toLocaleDateString()}</p>
          </div>
          <div style={{marginRight:'120px'}}>

            <p>
              <strong>Total Products: </strong> {totalQuantity}
            </p>
            <p>
              <strong>Grand Total: </strong> ₹{order.total_amount}
            </p>
          </div>
        </div>

        <hr />
        <p style={{ fontSize: "12px", fontFamily: "dancing, cursive" }}>
          This is a computer generated invoice, no signature required.
        </p> */}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between", // Keeps left & right blocks apart
            alignItems: "flex-start",
            padding: "10px",
            fontSize: "14px",
            marginBottom: "10px",
          }}
        >
          {/* Left Block */}
          <div style={{ flex: "1", textAlign: "left" }}>
            <p style={{ margin: "0 0 5px 0" }}>
              <strong style={{ marginRight: '5px' }}>Order By:</strong> <span>{order.payment_method}</span>
            </p>
            <p style={{ margin: "0 0 5px 0" }}>
              <strong style={{ marginRight: '5px' }}>Order ID:</strong> <span>#{order.unique_id}</span>
            </p>
            <p style={{ margin: "0 0 5px 0" }}>
              <strong style={{ marginRight: '5px' }}>Order Date:</strong> <span>{formatDate(order.order_date)}</span>
            </p>
            <p style={{ margin: "0 0 5px 0" }}>
              <span style={{ marginRight: '5px' }}><strong>Total Products:</strong> <span>{totalQuantity}</span> </span>
            </p>
          </div>

          {/* Right Block */}
          <div
            style={{
              textAlign: "left",
              display: "flex",
              flexDirection: "column",
              gap: "5px",
              fontSize: "15px",
              marginTop: "10px",
            }}
          >
            {/* Total Products */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
            </div>

            {/* {products.reduce(
              (acc, product) => acc + (parseInt(product.deliverycharge, 10) || 0),
              0
            ) > 0 && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span style={{ marginRight: '5px' }}><strong>Delivery Charge:</strong></span>
                  <span>
                    ₹
                    {products.reduce(
                      (acc, product) => acc + (parseInt(product.deliverycharge, 10) || 0),
                      0
                    )}
                  </span>
                </div>
              )} */}



            <div
              style={{
                textAlign: "left",
                display: "flex",
                flexDirection: "column",
                gap: "5px",
                fontSize: "15px",
                marginTop: "10px",
              }}
            >
              {(() => {
                const accessoriesCategories = [
                  "ComputerAccessories",
                  "MobileAccessories",
                  "PrinterAccessories",
                  "CCTVAccessories",
                ];

                // Calculate subtotal (products only, without delivery)
                const subtotal = products.reduce((acc, product) => {
                  const quantity = product.quantity || 1;
                  const isAccessory = accessoriesCategories.includes(product.category);

                  let price;
                  if (isAccessory) {
                    price = product.effectiveprice > 0 ? product.effectiveprice : product.prod_price;
                  } else {
                    price = product.prod_price;
                  }

                  return acc + price * quantity;
                }, 0);

                // GST is included in subtotal
                const cgst = subtotal * 0.09;
                const sgst = subtotal * 0.09;

                // Delivery Charge
                const deliveryTotal = products.reduce(
                  (acc, product) => acc + (parseInt(product.deliverycharge, 10) || 0),
                  0
                );

                // Grand Total = subtotal + delivery (GST already included in subtotal)
                const grandTotal = subtotal + deliveryTotal;

                return (
                  <>
                    {/* GST Split (within subtotal) */}
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span><strong>CGST (9%):</strong></span>
                      <span>₹{Math.round(cgst).toLocaleString("en-IN")}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span><strong>SGST (9%):</strong></span>
                      <span>₹{Math.round(sgst).toLocaleString("en-IN")}</span>
                    </div>

                    {/* Delivery Charge */}
                    {deliveryTotal > 0 && (
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span><strong>Delivery Charge:</strong></span>
                        <span>₹{deliveryTotal.toLocaleString("en-IN")}</span>
                      </div>
                    )}

                    {/* Grand Total */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontWeight: "bold",
                        borderTop: "1px solid #333",
                        paddingTop: "5px",
                        marginTop: "5px",
                      }}
                    >
                      <span><strong>Grand Total:</strong></span>
                      <span>₹{Math.round(grandTotal).toLocaleString("en-IN")}</span>
                    </div>
                  </>
                );
              })()}
            </div>


          </div>

        </div>





        {/* Total Quantity and Grand Total */}
        {/* <div
          style={{
            padding: "10px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
      

          <div style={{ textAlign: "right" }}>
            {products.reduce(
              (acc, product) => acc + (parseInt(product.deliverycharge, 10) || 0),
              0
            ) > 0 && (
                <p style={{ fontSize: '15px' }}>
                  <strong>Delivery Charge: </strong> ₹
                  {products.reduce(
                    (acc, product) => acc + (parseInt(product.deliverycharge, 10) || 0),
                    0
                  )}
                </p>
              )}

            
          </div>

        </div> */}
        <hr />
        <p style={{ fontSize: "12px", fontFamily: "dancing, cursive", padding: '5px', textAlign: 'left' }}>
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
          }}
        />
        <HiScissors style={{ fontSize: "20px", color: "#333" }} />
        <hr
          style={{
            flex: "1",
            borderTop: "1px dotted #333",
          }}
        />
      </div>

      {/* Products Table Container */}
      <div
        style={{
          paddingTop: "20px",
          fontFamily: "Calibri",
          border: "1px solid black",
          marginBottom: "30px",

        }}
      >

        <div
          style={{
            display: "flex",
            justifyContent: "space-between", // Keeps left & right blocks apart
            alignItems: "flex-start",
            padding: "10px",
            fontSize: "14px",
            marginBottom: "10px",
          }}
        >
          {/* Left Block */}
          <div style={{ flex: "1", textAlign: "left" }}>
            <p style={{ margin: "0 0 5px 0" }}>
              <strong>Order By:</strong> {order.payment_method}
            </p>
            <p style={{ margin: "0 0 5px 0" }}>
              <strong>Order ID:</strong> #{order.unique_id}
            </p>
            {/* <p style={{ margin: "0 0 5px 0" }}>
              <strong>Order Date:</strong> {formatDate(order.order_date)}
            </p> */}
          </div>

          {/* Right Block */}
          <div
            style={{
              textAlign: "left",
              display: "flex",
              flexDirection: "column",
              gap: "5px",
              fontSize: "15px",
              marginTop: "10px",
            }}
          >
            {/* Total Products */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span ><strong>Order Date:</strong></span>
              <span>{formatDate(order.order_date)}</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span style={{ marginRight: '5px' }}><strong>Invoice Date:</strong></span>
              <span>{formatDate(new Date())}</span>
            </div>

            {/* Delivery Charge */}


            {/* Grand Total */}

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
              <th style={{ border: "1px solid #000", padding: "5px", fontSize: '13px' }}>Product</th>
              <th style={{ border: "1px solid #000", padding: "5px", fontSize: '13px' }}>Qty</th>
              <th style={{ border: "1px solid #000", padding: "5px", fontSize: '13px' }}>Price</th>
              <th style={{ border: "1px solid #000", padding: "5px", fontSize: '13px' }}>Tax</th>
              <th style={{ border: "1px solid #000", padding: "5px", fontSize: '13px' }}>Total Price</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => {
              const isAccessory = [
                "ComputerAccessories",
                "MobileAccessories",
                "PrinterAccessories",
                "CCTVAccessories"
              ].includes(product.category);

              let basePrice;

              if (isAccessory) {
                if (product.effectiveprice === 0) {
                  basePrice = 0; // Free
                } else if (product.effectiveprice > 0) {
                  basePrice = product.effectiveprice;
                } else {
                  basePrice = product.prod_price;
                }
              } else {
                basePrice = product.prod_price;
              }

              const quantity = product.quantity || 1;

              return (
                <tr key={product.prod_id}>
                  <td style={{ border: "1px solid #000", padding: "5px", fontSize: '13px' }}>
                    {product.prod_name || "-"}
                  </td>
                  <td style={{ border: "1px solid #000", padding: "5px", fontSize: '13px' }}>
                    {quantity}
                  </td>
                  <td style={{ border: "1px solid #000", padding: "5px", fontSize: '13px' }}>
                    {basePrice === 0 ? "Free" : `₹${basePrice}`}
                  </td>
                  <td style={{ border: "1px solid #000", padding: "5px", fontSize: '13px' }}>
                    {product.tax || "-"}
                  </td>
                  <td style={{ border: "1px solid #000", padding: "5px", fontSize: '13px' }}>
                    ₹{basePrice * quantity}
                  </td>
                </tr>
              );
            })}
          </tbody>


        </table>

        <div
          style={{
            padding: "10px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <div style={{ textAlign: "left" }}>
            <p style={{ fontSize: '15px' }}>
              <strong>Total Products: </strong> {totalQuantity}
            </p>


          </div>

          <div
            style={{
              textAlign: "left",
              display: "flex",
              flexDirection: "column",
              gap: "5px",
              fontSize: "15px",
              marginTop: "10px",
            }}
          >


            {/* Delivery Charge */}
            {/* {products.reduce(
              (acc, product) => acc + (parseInt(product.deliverycharge, 10) || 0),
              0
            ) > 0 && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span><strong>Delivery Charge:</strong></span>
                  <span>
                    ₹
                    {products.reduce(
                      (acc, product) => acc + (parseInt(product.deliverycharge, 10) || 0),
                      0
                    )}
                  </span>
                </div>
              )} */}

            {/* Grand Total */}
            <div
              style={{
                textAlign: "left",
                display: "flex",
                flexDirection: "column",
                gap: "5px",
                fontSize: "15px",
                marginTop: "10px",
              }}
            >
              {(() => {
                const accessoriesCategories = [
                  "ComputerAccessories",
                  "MobileAccessories",
                  "PrinterAccessories",
                  "CCTVAccessories",
                ];

                // Calculate subtotal (products only, without delivery)
                const subtotal = products.reduce((acc, product) => {
                  const quantity = product.quantity || 1;
                  const isAccessory = accessoriesCategories.includes(product.category);

                  let price;
                  if (isAccessory) {
                    price = product.effectiveprice > 0 ? product.effectiveprice : product.prod_price;
                  } else {
                    price = product.prod_price;
                  }

                  return acc + price * quantity;
                }, 0);

                // GST is included in subtotal
                const cgst = subtotal * 0.09;
                const sgst = subtotal * 0.09;

                // Delivery Charge
                const deliveryTotal = products.reduce(
                  (acc, product) => acc + (parseInt(product.deliverycharge, 10) || 0),
                  0
                );

                // Grand Total = subtotal + delivery (GST already included in subtotal)
                const grandTotal = subtotal + deliveryTotal;

                return (
                  <>
                    {/* GST Split (within subtotal) */}
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span><strong>CGST (9%):</strong></span>
                      <span>₹{Math.round(cgst).toLocaleString("en-IN")}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span><strong>SGST (9%):</strong></span>
                      <span>₹{Math.round(sgst).toLocaleString("en-IN")}</span>
                    </div>

                    {/* Delivery Charge */}
                    {deliveryTotal > 0 && (
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span><strong>Delivery Charge:</strong></span>
                        <span>₹{deliveryTotal.toLocaleString("en-IN")}</span>
                      </div>
                    )}

                    {/* Grand Total */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontWeight: "bold",
                        borderTop: "1px solid #333",
                        paddingTop: "5px",
                        marginTop: "5px",
                      }}
                    >
                      <span><strong>Grand Total:</strong></span>
                      <span>₹{Math.round(grandTotal).toLocaleString("en-IN")}</span>
                    </div>
                  </>
                );
              })()}
            </div>

          </div>

        </div>


        <hr />
        <p style={{ fontSize: "12px", fontFamily: "dancing, cursive", padding: '5px', textAlign: 'left' }}>
          This is a computer generated invoice, no signature required.
        </p>
      </div>
    </div >
  );
};




export default Invoice;
