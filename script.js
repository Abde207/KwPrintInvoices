// script.js

let currentLanguage = "en";

const translations = {

    en: {
        formTitle: "Invoice Generator",
        orderNo: "Order Number",
        issueDate: "Issue Date",
        customerName: "Customer Name",
        delivery: "Delivery Location",
        payment: "Payment Method",
        notes: "Additional Notes",
        item: "Item",
        size: "Size",
        qty: "Quantity",
        total: "Total",
        action: "Action",
        addItem: "Add Item",
        finalTotal: "Final Total",
        paidAmount: "Paid Amount (Including Delivery)",
        preview: "Preview Invoice",
        back: "Back",
        pdf: "Export PDF",
        invoice: "Invoice",
        dinar: "Dinar",
        fils: "Fils"
    },

    ar: {
        formTitle: "إنشاء فاتورة",
        orderNo: "رقم الطلب",
        issueDate: "تاريخ الإصدار",
        customerName: "اسم العميل",
        delivery: "موقع التوصيل",
        payment: "طريقة الدفع",
        notes: "ملاحظات إضافية",
        item: "الصنف",
        size: "المقاس",
        qty: "الكمية",
        total: "الإجمالي",
        action: "إجراء",
        addItem: "إضافة عنصر",
        finalTotal: "الإجمالي النهائي",
        paidAmount: "المبلغ المدفوع شامل التوصيل",
        preview: "معاينة الفاتورة",
        back: "رجوع",
        pdf: "تصدير PDF",
        invoice: "فاتورة",
        dinar: "دينار",
        fils: "فلس"
    }
};

function setLanguage(lang) {

    currentLanguage = lang;

    document.getElementById("languageScreen").style.display = "none";
    document.getElementById("app").classList.remove("hidden");

    document.body.classList.toggle("rtl", lang === "ar");
    document.body.dir = lang === "ar" ? "rtl" : "ltr";

    applyTranslations();

    document.getElementById("formScreen").classList.add("active");

    if (document.querySelectorAll("#tableBody tr").length === 0) {
        addRow();
    }

    generateInvoiceNumber();
}

function applyTranslations() {

    const t = translations[currentLanguage];

    document.getElementById("formTitle").innerText = t.formTitle;
    document.getElementById("labelOrderNo").innerText = t.orderNo;
    document.getElementById("labelIssueDate").innerText = t.issueDate;
    document.getElementById("labelCustomerName").innerText = t.customerName;
    document.getElementById("labelDelivery").innerText = t.delivery;
    document.getElementById("labelPayment").innerText = t.payment;
    document.getElementById("labelNotes").innerText = t.notes;

    document.getElementById("thItem").innerText = t.item;
    document.getElementById("thSize").innerText = t.size;
    document.getElementById("thQty").innerText = t.qty;
    document.getElementById("thTotal").innerText = t.total;
    document.getElementById("thAction").innerText = t.action;

    document.getElementById("currencySplit").innerText =
        `${t.dinar} / ${t.fils}`;

    document.getElementById("addRowBtn").innerText =
        `+ ${t.addItem}`;

    document.getElementById("labelFinalTotal").innerText =
        t.finalTotal;

    document.getElementById("labelPaidAmount").innerText =
        t.paidAmount;

    document.getElementById("previewBtn").innerText =
        t.preview;

    document.getElementById("backBtn").innerText =
        t.back;

    document.getElementById("pdfBtn").innerText =
        t.pdf;

    document.getElementById("invoiceLabel").innerText =
        t.invoice;

    document.getElementById("previewOrderLabel").innerText =
        `${t.orderNo}:`;

    document.getElementById("previewDateLabel").innerText =
        `${t.issueDate}:`;

    document.getElementById("previewCustomerLabel").innerText =
        t.customerName;

    document.getElementById("previewDeliveryLabel").innerText =
        t.delivery;

    document.getElementById("previewPaymentLabel").innerText =
        t.payment;

    document.getElementById("previewItemHeader").innerText =
        t.item;

    document.getElementById("previewSizeHeader").innerText =
        t.size;

    document.getElementById("previewQtyHeader").innerText =
        t.qty;

    document.getElementById("previewTotalHeader").innerText =
        t.total;

    document.getElementById("dinarLabel").innerText =
        t.dinar;

    document.getElementById("filsLabel").innerText =
        t.fils;

    document.getElementById("summaryTotalLabel").innerText =
        t.finalTotal;

    document.getElementById("summaryPaidLabel").innerText =
        t.paidAmount;

    document.getElementById("notesLabelPreview").innerText =
        t.notes;
}

function addRow() {

    const tbody = document.getElementById("tableBody");

    const row = document.createElement("tr");

    row.innerHTML = `
    <td><input type="text"></td>

    <td><input type="text"></td>

    <td>
      <input type="number" min="1" value="1">
    </td>

    <td>
      <input
        type="text"
        class="decimal-only amount-input"
        placeholder="0.000"
      >
    </td>

    <td>
      <button class="delete-btn" onclick="deleteRow(this)">
        X
      </button>
    </td>
  `;

    tbody.appendChild(row);

    attachDecimalValidation();

    row.querySelector(".amount-input")
        .addEventListener("input", calculateTotals);
}

function deleteRow(button) {

    button.closest("tr").remove();

    calculateTotals();
}

function attachDecimalValidation() {

    const inputs = document.querySelectorAll(".decimal-only");

    inputs.forEach(input => {

        input.addEventListener("input", function () {

            this.value = this.value.replace(/[^0-9.]/g, '');

            const parts = this.value.split('.');

            if (parts.length > 2) {
                this.value =
                    parts[0] + '.' + parts.slice(1).join('');
            }

            calculateTotals();
        });
    });
}

function calculateTotals() {

    const amountInputs =
        document.querySelectorAll(".amount-input");

    let total = 0;

    amountInputs.forEach(input => {

        const value = parseFloat(input.value);

        if (!isNaN(value)) {
            total += value;
        }
    });

    document.getElementById("finalTotal").value =
        total.toFixed(3);
}

function splitCurrency(value) {

    const fixed = Number(value || 0).toFixed(3);

    const [dinar, fils] = fixed.split('.');

    return { dinar, fils };
}

function generatePreview() {

    document.getElementById("formScreen")
        .classList.remove("active");

    document.getElementById("previewScreen")
        .classList.add("active");

    // BASIC INFO
    document.getElementById("previewOrderNo").innerText =
        document.getElementById("orderNo").value;

    document.getElementById("previewIssueDate").innerText =
        document.getElementById("issueDate").value;

    document.getElementById("previewCustomer").innerText =
        document.getElementById("customerName").value;

    document.getElementById("previewDelivery").innerText =
        document.getElementById("deliveryLocation").value;

    document.getElementById("previewPayment").innerText =
        document.getElementById("paymentMethod").value;

    document.getElementById("previewNotes").innerText =
        document.getElementById("notes").value;

    // TABLE
    const previewBody =
        document.getElementById("previewTableBody");

    previewBody.innerHTML = "";

    const rows =
        document.querySelectorAll("#tableBody tr");

    rows.forEach(row => {

        const inputs = row.querySelectorAll("input");

        const item = inputs[0].value;
        const size = inputs[1].value;
        const qty = inputs[2].value;
        const total = inputs[3].value;

        const split = splitCurrency(total);

        const tr = document.createElement("tr");

        tr.innerHTML = `
      <td>${item}</td>
      <td>${size}</td>
      <td>${qty}</td>
      <td>${split.dinar}</td>
      <td>${split.fils}</td>
    `;

        previewBody.appendChild(tr);
    });

    document.getElementById("summaryTotal").innerText =
        document.getElementById("finalTotal").value;

    document.getElementById("summaryPaid").innerText =
        document.getElementById("paidAmount").value;
}

function backToForm() {

    document.getElementById("previewScreen")
        .classList.remove("active");

    document.getElementById("formScreen")
        .classList.add("active");
}

function exportPDF() {

    const invoice =
        document.getElementById("invoicePreview");

    const options = {

        margin: 0,
        filename: 'invoice.pdf',

        image: {
            type: 'jpeg',
            quality: 1
        },

        html2canvas: {
            scale: 2,
            useCORS: true
        },

        jsPDF: {
            unit: 'mm',
            format: 'a5',
            orientation: 'portrait'
        }
    };

    html2pdf().set(options).from(invoice).save();
}

// SERIAL NUMBER SYSTEM

function generateInvoiceNumber() {

    let currentNumber =
        localStorage.getItem("invoiceCounter");

    if (!currentNumber) {
        currentNumber = 1;
    } else {
        currentNumber = parseInt(currentNumber) + 1;
    }

    localStorage.setItem(
        "invoiceCounter",
        currentNumber
    );

    const formatted =
        "#" +
        String(currentNumber).padStart(4, "0");

    document.getElementById("orderNo").value =
        formatted;
}