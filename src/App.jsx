import React, { useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const App = () => {
  const [logo, setLogo] = useState(null);
  const [previewPDF, setPreviewPDF] = useState(null);

  // State for the table rows, starting with one default row
  const [items, setItems] = useState([
    {
      itemDescription: "Service/Product 1",
      quantity: 1,
      rate: 100.00,
      sgst: 6.00,
      cgst: 6.00,
      cess: 0.00,
      amount: 112.00,
    },
  ]);

  const [invoiceData, setInvoiceData] = useState({
    companyName: "Your Company",
    yourName: "Your Name",
    gstin: "Company's GSTIN",
    address: "Company’s Address",
    cityState: "City, State, India",
    clientCompany: "Your Client’s Company",
    clientGstin: "Client's GSTIN",
    clientAddress: "Client’s Address",
    clientCityState: "City, State, India",
    invoiceNumber: "INV-12",
    invoiceDate: "Sep 20, 2024",
    dueDate: "Sep 20, 2024",
    placeOfSupply: "State",
    subtotal: 200.00,
    sgstTotal: 12.00,
    cgstTotal: 12.00,
    total: 224.00,
    notes: "Please make the payment by the due date. Late payments may incur additional fees.",
    terms: "Goods once sold will not be taken back. Payment is due within 15 days of the invoice date. All disputes are subject to [Your City] jurisdiction.",
  });

  const handleInputChange = (e) => {
    setInvoiceData({ ...invoiceData, [e.target.name]: e.target.value });
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    newItems[index].amount =
      (parseFloat(newItems[index].quantity) || 0) *
      (parseFloat(newItems[index].rate) || 0) +
      (parseFloat(newItems[index].sgst) || 0) +
      (parseFloat(newItems[index].cgst) || 0) +
      (parseFloat(newItems[index].cess) || 0);
    setItems(newItems);
  };

  // Handle image upload and preview
  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteLogo = () => {
    setLogo(null);
  };

  const handleGeneratePDFPreview = () => {
    const invoice = document.getElementById("invoice-form");
    html2canvas(invoice).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      setPreviewPDF(imgData);
    });
  };
  

  // const handleDownloadPDF = () => {
  //   if (previewPDF) {
  //     const pdf = new jsPDF({
  //       orientation: 'portrait', // Set orientation based on invoice layout
  //       unit: 'pt', // Use points for better precision
  //       format: 'a4' // A4 size, change if needed
  //     });
  
  //     const img = new Image();
  //     img.src = previewPDF;
  
  //     img.onload = () => {
  //       // Get PDF page dimensions
  //       const pageWidth = pdf.internal.pageSize.getWidth();
  //       const pageHeight = pdf.internal.pageSize.getHeight();
  
  //       // Calculate aspect ratio
  //       const imgWidth = img.width;
  //       const imgHeight = img.height;
  //       const imgAspectRatio = imgWidth / imgHeight;
  
  //       let finalWidth, finalHeight;
  
  //       // Check whether width or height is the limiting factor and scale accordingly
  //       if (imgAspectRatio > pageWidth / pageHeight) {
  //         // Width is the limiting factor
  //         finalWidth = pageWidth;
  //         finalHeight = pageWidth / imgAspectRatio;
  //       } else {
  //         // Height is the limiting factor
  //         finalHeight = pageHeight;
  //         finalWidth = pageHeight * imgAspectRatio;
  //       }
  
  //       // Center the image on the PDF page
  //       const xOffset = (pageWidth - finalWidth) / 2;
  //       const yOffset = (pageHeight - finalHeight) / 2;
  
  //       // Add the image to the PDF
  //       pdf.addImage(img, "PNG", xOffset, yOffset, finalWidth, finalHeight);
  
  //       // Save the PDF
  //       pdf.save("invoice.pdf");
  //     };
  //   }
  // };
  

  // Add a new row in the table
  const addNewRow = () => {
    setItems([
      ...items,
      {
        itemDescription: "Service/Product",
        quantity: 1,
        rate: 100.00,
        sgst: 6.00,
        cgst: 6.00,
        cess: 0.00,
        amount: 112.00,
      },
    ]);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="container mx-auto bg-white p-6 shadow-lg rounded-lg flex flex-col md:flex-row gap-6">
        {/* Left Side - Invoice Form */}
        <div className="w-full md:w-3/5" id="invoice-form">
          {/* Image Upload for Logo */}
          <div className="mb-4">
            <label className="block mb-2 font-bold">Upload Company Logo</label>
            {logo ? (
              <div className="relative w-48 h-48">
                <img src={logo} alt="Logo Preview" className="w-full h-full object-contain" />
                <div className="absolute top-0 left-0 w-full h-full opacity-0 hover:opacity-100 bg-black bg-opacity-50 flex justify-center items-center text-white">
                  <button
                    className="bg-red-500 px-4 py-2 rounded"
                    onClick={handleDeleteLogo}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ) : (
              <input type="file" onChange={handleLogoUpload} />
            )}
          </div>

          {/* Company and Client Information */}
          <div className="grid grid-cols-2 gap-8 mb-8">
            {/* Left - Your Company */}
            <div>
              <input
                type="text"
                name="companyName"
                value={invoiceData.companyName}
                onChange={handleInputChange}
                className="block w-full font-bold mb-2"
              />
              <input
                type="text"
                name="yourName"
                value={invoiceData.yourName}
                onChange={handleInputChange}
                className="block w-full"
              />
              <input
                type="text"
                name="gstin"
                value={invoiceData.gstin}
                onChange={handleInputChange}
                className="block w-full"
              />
              <input
                type="text"
                name="address"
                value={invoiceData.address}
                onChange={handleInputChange}
                className="block w-full"
              />
              <input
                type="text"
                name="cityState"
                value={invoiceData.cityState}
                onChange={handleInputChange}
                className="block w-full"
              />
            </div>

            {/* Right - Client Information */}
            <div>
              <h2 className="text-2xl font-bold">Bill To:</h2>
              <input
                type="text"
                name="clientCompany"
                value={invoiceData.clientCompany}
                onChange={handleInputChange}
                className="block w-full"
              />
              <input
                type="text"
                name="clientGstin"
                value={invoiceData.clientGstin}
                onChange={handleInputChange}
                className="block w-full"
              />
              <input
                type="text"
                name="clientAddress"
                value={invoiceData.clientAddress}
                onChange={handleInputChange}
                className="block w-full"
              />
              <input
                type="text"
                name="clientCityState"
                value={invoiceData.clientCityState}
                onChange={handleInputChange}
                className="block w-full"
              />
            </div>
          </div>

          {/* Invoice Information */}
          <div className="grid grid-cols-3 gap-8 mb-6">
            <div>
              <label className="font-semibold">Invoice#</label>
              <input
                type="text"
                name="invoiceNumber"
                value={invoiceData.invoiceNumber}
                onChange={handleInputChange}
                className="block w-full"
              />
            </div>
            <div>
              <label className="font-semibold">Invoice Date</label>
              <input
                type="text"
                name="invoiceDate"
                value={invoiceData.invoiceDate}
                onChange={handleInputChange}
                className="block w-full"
              />
            </div>
            <div>
              <label className="font-semibold">Due Date</label>
              <input
                type="text"
                name="dueDate"
                value={invoiceData.dueDate}
                onChange={handleInputChange}
                className="block w-full"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="font-semibold">Place Of Supply:</label>
            <input
              type="text"
              name="placeOfSupply"
              value={invoiceData.placeOfSupply}
              onChange={handleInputChange}
              className="block w-full"
            />
          </div>

          {/* Table - Editable Items */}
          <div className="overflow-x-auto">
          <table className="min-w-full bg-white mb-6">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-4 text-left">Item Description</th>
                <th className="py-3 px-4 text-left">Qty</th>
                <th className="py-3 px-4 text-left">Rate</th>
                <th className="py-3 px-4 text-left">SGST</th>
                <th className="py-3 px-4 text-left">CGST</th>
                <th className="py-3 px-4 text-left">Cess</th>
                <th className="py-3 px-4 text-left">Amount</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="text"
                      value={item.itemDescription}
                      onChange={(e) =>
                        handleItemChange(index, "itemDescription", e.target.value)
                      }
                      className="block w-full"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        handleItemChange(index, "quantity", e.target.value)
                      }
                      className="block w-full"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={item.rate}
                      onChange={(e) =>
                        handleItemChange(index, "rate", e.target.value)
                      }
                      className="block w-full"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={item.sgst}
                      onChange={(e) =>
                        handleItemChange(index, "sgst", e.target.value)
                      }
                      className="block w-full"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={item.cgst}
                      onChange={(e) =>
                        handleItemChange(index, "cgst", e.target.value)
                      }
                      className="block w-full"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={item.cess}
                      onChange={(e) =>
                        handleItemChange(index, "cess", e.target.value)
                      }
                      className="block w-full"
                    />
                  </td>
                  <td>{item.amount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
       

          {/* Add New Row Button */}
          <button
            onClick={addNewRow}
            className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
            id="add_btn"
          >
            Add New Row
          </button>

          {/* Totals */}
          <div className="text-right mb-6">
            <p>Subtotal: {invoiceData.subtotal.toFixed(2)}</p>
            <p>SGST (6%): {invoiceData.sgstTotal.toFixed(2)}</p>
            <p>CGST (6%): {invoiceData.cgstTotal.toFixed(2)}</p>
            <p className="font-bold">Total: Rs. {invoiceData.total.toFixed(2)}</p>
          </div>

          {/* Notes and Terms */}
          <div className="mt-6">
            <label className="font-semibold">Notes:</label>
            <textarea
              name="notes"
              value={invoiceData.notes}
              onChange={handleInputChange}
              className="block w-full mb-4"
            />
            <label className="font-semibold">Terms & Conditions:</label>
            <textarea
            name="terms"
   className="block w-full mb-4"
  value={invoiceData.terms}
  onChange={handleInputChange}
>
  {invoiceData.terms}
</textarea>

           
          </div>
        </div>

       
        <div className="w-full flex justify-center items-center md:w-2/5">
         
         
            <button
              onClick={()=>window.print()}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Download PDF
            </button>
        </div>
      </div>
    </div>
  );
};

export default App;
