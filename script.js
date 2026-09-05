// The Arabic interface intentionally uses its own DOM and explicit RTL attributes.
// Firebase configuration and the shared counter remain in index.html and are unchanged.
let currentLanguage = "en";

const translations = {
    en: {
        formTitle: "Invoice Generator", orderNo: "Order Number", issueDate: "Issue Date",
        customerName: "Customer Name", delivery: "Delivery Location", payment: "Payment Method",
        notes: "Additional Notes", item: "Item", size: "Size", qty: "Quantity", total: "Total",
        action: "Action", addItem: "Add Item", finalTotal: "Final Total",
        paidAmount: "Paid Amount (Including Delivery)", preview: "Preview Invoice", back: "Back",
        pdf: "Export PDF", invoice: "Invoice", dinar: "Dinar", fils: "Fils"
    }
};

const englishTextIds = {
    formTitle: "formTitle", orderNo: "labelOrderNo", issueDate: "labelIssueDate",
    customerName: "labelCustomerName", delivery: "labelDelivery", payment: "labelPayment",
    notes: "labelNotes", item: "thItem", size: "thSize", qty: "thQty", total: "thTotal",
    action: "thAction", finalTotal: "labelFinalTotal", paidAmount: "labelPaidAmount",
    preview: "previewBtn", back: "backBtn", pdf: "pdfBtn", invoice: "invoiceLabel",
    previewItem: "previewItemHeader", previewSize: "previewSizeHeader", previewQty: "previewQtyHeader",
    previewTotal: "previewTotalHeader", summaryTotal: "summaryTotalLabel",
    summaryPaid: "summaryPaidLabel", previewNotes: "notesLabelPreview"
};

function isArabic() {
    return currentLanguage === "ar";
}

function viewId(englishId, arabicId) {
    return document.getElementById(isArabic() ? arabicId : englishId);
}

function fields() {
    return isArabic() ? {
        orderNo: "arOrderNo", issueDate: "arIssueDate", customer: "arCustomerName",
        delivery: "arDeliveryLocation", payment: "arPaymentMethod", notes: "arNotes",
        tableBody: "arTableBody", finalTotal: "arFinalTotal", paidAmount: "arPaidAmount",
        previewBody: "arPreviewTableBody", previewOrder: "arPreviewOrderNo", previewDate: "arPreviewIssueDate",
        previewCustomer: "arPreviewCustomer", previewDelivery: "arPreviewDelivery", previewPayment: "arPreviewPayment",
        previewNotes: "arPreviewNotes", summaryTotal: "arSummaryTotal", summaryPaid: "arSummaryPaid",
        invoice: "arabicInvoicePreview"
    } : {
        orderNo: "orderNo", issueDate: "issueDate", customer: "customerName",
        delivery: "deliveryLocation", payment: "paymentMethod", notes: "notes",
        tableBody: "tableBody", finalTotal: "finalTotal", paidAmount: "paidAmount",
        previewBody: "previewTableBody", previewOrder: "previewOrderNo", previewDate: "previewIssueDate",
        previewCustomer: "previewCustomer", previewDelivery: "previewDelivery", previewPayment: "previewPayment",
        previewNotes: "previewNotes", summaryTotal: "summaryTotal", summaryPaid: "summaryPaid",
        invoice: "invoicePreview"
    };
}

function setLanguage(lang) {
    currentLanguage = lang;
    document.documentElement.lang = lang;
    document.getElementById("languageScreen").style.display = "none";
    document.getElementById("app").classList.remove("hidden");
    document.body.classList.toggle("rtl", lang === "ar");
    document.body.dir = lang === "ar" ? "rtl" : "ltr";

    document.querySelectorAll(".screen").forEach(screen => screen.classList.remove("active"));
    document.getElementById(lang === "ar" ? "arabicFormScreen" : "formScreen").classList.add("active");

    if (lang === "en") applyTranslations();
    const f = fields();
    if (document.querySelectorAll(`#${f.tableBody} tr`).length === 0) addRow();
    getCurrentInvoiceNumber();
}

function applyTranslations() {
    const t = translations.en;
    Object.entries(englishTextIds).forEach(([key, id]) => {
        const element = document.getElementById(id);
        if (element && t[key]) element.innerText = t[key];
    });
    document.getElementById("addRowBtn").innerText = `+ ${t.addItem}`;
    document.getElementById("currencySplit").innerText = `${t.dinar} / ${t.fils}`;
    document.getElementById("previewOrderLabel").innerText = `${t.orderNo}:`;
    document.getElementById("previewDateLabel").innerText = `${t.issueDate}:`;
    document.getElementById("previewCustomerLabel").innerText = t.customerName;
    document.getElementById("previewDeliveryLabel").innerText = t.delivery;
    document.getElementById("previewPaymentLabel").innerText = t.payment;
    document.getElementById("dinarLabel").innerText = t.dinar;
    document.getElementById("filsLabel").innerText = t.fils;
}

function addRow() {
    const f = fields();
    const row = document.createElement("tr");
    row.innerHTML = `
        <td><input type="text" dir="auto" aria-label="${isArabic() ? "الصنف" : "Item"}"></td>
        <td><input type="text" dir="auto" aria-label="${isArabic() ? "المقاس" : "Size"}"></td>
        <td><input type="number" min="1" value="1" dir="ltr" aria-label="${isArabic() ? "الكمية" : "Quantity"}"></td>
        <td><input type="text" class="decimal-only amount-input" inputmode="decimal" placeholder="0.000" dir="ltr" aria-label="${isArabic() ? "الإجمالي" : "Total"}"></td>
        <td><button class="delete-btn" type="button" onclick="deleteRow(this)" aria-label="${isArabic() ? "حذف العنصر" : "Delete item"}">×</button></td>`;
    document.getElementById(f.tableBody).appendChild(row);
    const amount = row.querySelector(".amount-input");
    amount.addEventListener("input", validateDecimal);
}

function deleteRow(button) {
    button.closest("tr").remove();
    calculateTotals();
}

function validateDecimal(event) {
    const input = event.currentTarget;
    input.value = input.value.replace(/[^0-9.]/g, "");
    const [whole, ...decimals] = input.value.split(".");
    input.value = decimals.length ? `${whole}.${decimals.join("")}` : whole;
    calculateTotals();
}

function calculateTotals() {
    const f = fields();
    let total = 0;
    document.querySelectorAll(`#${f.tableBody} .amount-input`).forEach(input => {
        const value = Number.parseFloat(input.value);
        if (Number.isFinite(value)) total += value;
    });
    document.getElementById(f.finalTotal).value = total.toFixed(3);
}

function splitCurrency(value) {
    const [dinar, fils] = Number(value || 0).toFixed(3).split(".");
    return { dinar, fils };
}

function setText(id, value) {
    document.getElementById(id).textContent = value;
}

function generatePreview() {
    const f = fields();
    document.getElementById(isArabic() ? "arabicFormScreen" : "formScreen").classList.remove("active");
    document.getElementById(isArabic() ? "arabicPreviewScreen" : "previewScreen").classList.add("active");
    setText(f.previewOrder, document.getElementById(f.orderNo).value);
    setText(f.previewDate, document.getElementById(f.issueDate).value);
    setText(f.previewCustomer, document.getElementById(f.customer).value);
    setText(f.previewDelivery, document.getElementById(f.delivery).value);
    setText(f.previewPayment, document.getElementById(f.payment).value);
    setText(f.previewNotes, document.getElementById(f.notes).value);

    const previewBody = document.getElementById(f.previewBody);
    previewBody.replaceChildren();
    document.querySelectorAll(`#${f.tableBody} tr`).forEach(row => {
        const inputs = row.querySelectorAll("input");
        const split = splitCurrency(inputs[3].value);
        const cells = isArabic()
            ? [inputs[0].value, inputs[1].value, inputs[2].value, split.fils, split.dinar]
            : [inputs[0].value, inputs[1].value, inputs[2].value, split.dinar, split.fils];
        const previewRow = document.createElement("tr");
        cells.forEach((value, index) => {
            const cell = document.createElement("td");
            // Keep Arabic product text and Latin/numeric values in their natural directions.
            cell.dir = isArabic() && index < 2 ? "auto" : "ltr";
            cell.textContent = value;
            previewRow.appendChild(cell);
        });
        previewBody.appendChild(previewRow);
    });
    setText(f.summaryTotal, document.getElementById(f.finalTotal).value);
    setText(f.summaryPaid, document.getElementById(f.paidAmount).value);
}

function backToForm() {
    document.getElementById(isArabic() ? "arabicPreviewScreen" : "previewScreen").classList.remove("active");
    document.getElementById(isArabic() ? "arabicFormScreen" : "formScreen").classList.add("active");
}

async function exportPDF() {
    const f = fields();
    const orderNumber = document.getElementById(f.orderNo).value.replace("#", "");
    const invoice = document.getElementById(f.invoice);
    const pdfOptions = {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false
    };

    // html2canvas's normal text painter does not consistently preserve Arabic
    // shaping and word order. foreignObjectRendering delegates the Arabic
    // invoice to the browser's native layout engine before it becomes an image.
    if (isArabic()) {
        pdfOptions.foreignObjectRendering = true;
    }

    try {
        await document.fonts.ready;
        invoice.classList.add("pdf-exporting");
        const canvas = await html2canvas(invoice, pdfOptions);
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });

        addCanvasSliceToPdf(pdf, canvas, 200, 287, 5, `Kw${orderNumber}.pdf`);
        await incrementInvoiceNumber();
        await getCurrentInvoiceNumber();
    } catch (error) {
        console.error("PDF export failed", error);
        alert(isArabic()
            ? "تعذر إنشاء ملف PDF. يرجى المحاولة مرة أخرى."
            : "The PDF could not be created. Please try again.");
    } finally {
        invoice.classList.remove("pdf-exporting");
    }
}

// SERIAL NUMBER SYSTEM — unchanged Firestore collection, document and fields.
async function getCurrentInvoiceNumber() {
    const { doc, getDoc, setDoc } = window.firebaseTools;
    const counterRef = doc(window.db, "system", "invoiceCounter");
    const counterSnap = await getDoc(counterRef);
    let currentNumber = 1;
    if (!counterSnap.exists()) await setDoc(counterRef, { current: 1 });
    else currentNumber = counterSnap.data().current;
    document.getElementById(fields().orderNo).value = `#${String(currentNumber).padStart(4, "0")}`;
}

async function incrementInvoiceNumber() {
    const { doc, getDoc, updateDoc } = window.firebaseTools;
    const counterRef = doc(window.db, "system", "invoiceCounter");
    const counterSnap = await getDoc(counterRef);
    if (counterSnap.exists()) {
        await updateDoc(counterRef, { current: counterSnap.data().current + 1 });
    }
}

function addCanvasSliceToPdf(pdf, canvas, pageWidth, pageHeight, margin, filename) {
    const sliceHeight = Math.floor((pageHeight * canvas.width) / pageWidth);
    const pageCanvas = document.createElement("canvas");
    pageCanvas.width = canvas.width;

    let renderedHeight = 0;
    let pageIndex = 0;

    while (renderedHeight < canvas.height) {
        const currentSliceHeight = Math.min(sliceHeight, canvas.height - renderedHeight);
        pageCanvas.height = currentSliceHeight;

        const ctx = pageCanvas.getContext("2d");
        ctx.clearRect(0, 0, pageCanvas.width, pageCanvas.height);
        ctx.drawImage(
            canvas,
            0, renderedHeight, canvas.width, currentSliceHeight,
            0, 0, pageCanvas.width, pageCanvas.height
        );

        const imageData = pageCanvas.toDataURL("image/png");
        if (pageIndex > 0) pdf.addPage();
        const imageHeight = (currentSliceHeight * pageWidth) / canvas.width;
        pdf.addImage(imageData, "PNG", margin, margin, pageWidth, imageHeight);

        renderedHeight += currentSliceHeight;
        pageIndex += 1;
    }

    pdf.save(filename);
}
