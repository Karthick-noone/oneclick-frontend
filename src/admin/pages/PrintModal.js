import React from "react";
import ReactDOM from "react-dom";
import html2pdf from "html2pdf.js";
import { DownloadCloudIcon } from "lucide-react";
// import { DownloadIcon } from "lucide-react";

const PrintModal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  const handleDownloadPDF = () => {
    const element = document.getElementById("invoice-pdf-content"); // Target Invoice
    const opt = {
      margin: 0.2,
      filename: "Invoice.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 3 }, // High resolution
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };
    html2pdf().set(opt).from(element).save();
  };

  return ReactDOM.createPortal(
    <div className="modal-overlay">
      <div className="modal-content">
        {/* Header row with download & close */}
     <div
  style={{
    display: "flex",
    justifyContent: "flex-end", // Align both buttons to the right
    alignItems: "center",
    gap: "10px", // Space between buttons
    marginBottom: "10px",
  }}
>
  {/* Download PDF Button */}
  <button
    onClick={handleDownloadPDF}
    style={{
      display: "flex",
      alignItems: "center",
      gap: "6px", // Space between text and icon
      backgroundColor: "#4caf50",
      border: "none",
      cursor: "pointer",
      color: "white", // Icon + text color
      fontSize: ".8rem",
      padding:'8px',
      borderRadius:'5px'
    }}
    title="Download PDF"
  >
    Download PDF
     {/* <DownloadIcon size={20} /> */}
     <DownloadCloudIcon size={20} />
  </button>

  {/* Close Button */}
  <button
    onClick={onClose}
    style={{
      background: "transparent",
      border: "none",
      fontSize: "1.6rem",
      cursor: "pointer",
      color: "black", // Close icon color
      lineHeight: "1", // Align properly
    }}
    title="Close"
  >
    &times;
  </button>
</div>


        {/* Wrap content in div for PDF export */}
        <div id="invoice-pdf-content" className="modal-body">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default PrintModal;
