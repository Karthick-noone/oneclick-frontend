import React from "react";
import ReactDOM from "react-dom";
import html2pdf from "html2pdf.js";

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
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>
        {/* Wrap content in div for PDF export */}
        <div id="invoice-pdf-content" className="modal-body">
          {children}
        </div>
        <button className="print-btn" onClick={handleDownloadPDF}>
          Download PDF
        </button>
      </div>
    </div>,
    document.body
  );
};

export default PrintModal;
