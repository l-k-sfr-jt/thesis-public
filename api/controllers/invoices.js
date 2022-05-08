
const axios = require('axios');
const {EMAIL, APIKEY, SLUG, URL} = require("../utils/fakturoid");
const api = axios.create({
    baseURL: URL,
    headers: {
        'User-Agent': 'MyERP (info@lukas-frajt.cz)',
        'Content-Type': 'application/json'
    },
    auth: {
        username: EMAIL,
        password: APIKEY
    }
});

exports.apiTest = async (req, res, next) => {
    api.get(`/accounts/${SLUG}/account.json`)
        .then((response) => {
            res.status(200).json({response: response.data});
        })
        .catch((err) => {
            console.log(err.response);
            next(err);
        });
};

exports.getInvoices = async (req, res, next) => {
    console.log(SLUG, EMAIL, APIKEY);
    const page = req.query.page ? req.query.page : 1;

    api.get(`/accounts/${SLUG}/invoices.json`, {params: {page}})
        .then((response) => {
            res.status(200).json({response: response.data});
        })
        .catch((err) => {
            console.log(err.response);
            next(err);
        });
    // res.status(200).json({
    //     "invoices": [
    //         {
    //             "id": 22951405,
    //             "custom_id": "1234",
    //             "proforma": false,
    //             "partial_proforma": null,
    //             "number": "20220001",
    //             "number_format_id": 387261,
    //             "variable_symbol": "2020003",
    //             "your_name": "SPQ service consult s.r.o.",
    //             "your_street": "Hálkova 1126/2",
    //             "your_street2": null,
    //             "your_city": "Liberec",
    //             "your_zip": "46001",
    //             "your_country": "CZ",
    //             "your_registration_no": "07664532",
    //             "your_vat_no": "CZ07664532",
    //             "your_local_vat_no": null,
    //             "client_name": "GRUPO ANTOLIN TURNOV s.r.o.",
    //             "client_street": "Průmyslová 3000",
    //             "client_street2": null,
    //             "client_city": "Turnov",
    //             "client_zip": "51101",
    //             "client_country": "CZ",
    //             "client_registration_no": "26702436",
    //             "client_vat_no": "CZ26702436",
    //             "client_local_vat_no": "",
    //             "subject_id": 14164196,
    //             "subject_custom_id": null,
    //             "generator_id": null,
    //             "related_id": null,
    //             "correction": false,
    //             "correction_id": null,
    //             "paypal": false,
    //             "gopay": false,
    //             "token": "AEKvyEt5zA",
    //             "status": "open",
    //             "order_number": null,
    //             "issued_on": "2022-04-09",
    //             "taxable_fulfillment_due": "2022-04-09",
    //             "due": 45,
    //             "due_on": "2022-05-24",
    //             "sent_at": null,
    //             "paid_at": null,
    //             "reminder_sent_at": null,
    //             "accepted_at": null,
    //             "cancelled_at": null,
    //             "webinvoice_seen_at": null,
    //             "note": null,
    //             "footer_note": "Společnost je zapsána v obchodním rejstříku vedeném Krajským soudem v Ústí nad Labem oddíl C, vložka 42716.",
    //             "private_note": null,
    //             "tags": [],
    //             "bank_account": "2019659293/0800",
    //             "iban": "CZ3508000000002019659293",
    //             "swift_bic": "GIBACZPXXXX",
    //             "show_already_paid_note_in_pdf": false,
    //             "payment_method": "bank",
    //             "hide_bank_account": false,
    //             "currency": "EUR",
    //             "exchange_rate": "24.485",
    //             "language": "cz",
    //             "transferred_tax_liability": false,
    //             "eu_electronic_service": false,
    //             "oss": "disabled",
    //             "vat_price_mode": "without_vat",
    //             "supply_code": null,
    //             "subtotal": "40000.0",
    //             "total": "48400.0",
    //             "native_subtotal": "979400.0",
    //             "native_total": "1185074.0",
    //             "remaining_amount": "48400.0",
    //             "remaining_native_amount": "1185074.0",
    //             "paid_amount": "0.0",
    //             "eet": false,
    //             "eet_cash_register": null,
    //             "eet_store": null,
    //             "eet_records": [],
    //             "lines": [
    //                 {
    //                     "id": 51647009,
    //                     "name": "Hard work",
    //                     "quantity": "1.0",
    //                     "unit_name": "h",
    //                     "unit_price": "40000.0",
    //                     "vat_rate": 21,
    //                     "unit_price_without_vat": "40000.0",
    //                     "unit_price_with_vat": "48400.0"
    //                 }
    //             ],
    //             "attachment": null,
    //             "html_url": "https://app.fakturoid.cz/spqserviceconsult/invoices/22951405",
    //             "public_html_url": "https://app.fakturoid.cz/spqserviceconsult/p/AEKvyEt5zA/20220001",
    //             "url": "https://app.fakturoid.cz/api/v2/accounts/spqserviceconsult/invoices/22951405.json",
    //             "pdf_url": "https://app.fakturoid.cz/api/v2/accounts/spqserviceconsult/invoices/22951405/download.pdf",
    //             "subject_url": "https://app.fakturoid.cz/api/v2/accounts/spqserviceconsult/subjects/14164196.json",
    //             "created_at": "2022-04-09T16:59:23.595+02:00",
    //             "updated_at": "2022-04-09T16:59:24.519+02:00"
    //         }
    //     ]
    // });
};

exports.getInvoice = async (req, res, next) => {
    const id = req.params.invoiceId

    api.get(`/accounts/${SLUG}/invoices/${id}.json`)
        .then((response) => {
            res.status(200).json({response: response.data});
        })
        .catch((err) => {
            console.log(err.response);
            next(err);
        });
}

exports.getInvoiceInPDF = async (req, res, next) => {
    const id = req.params.invoiceId;

    api.get(`/accounts/${SLUG}/invoices/${id}/download.pdf`, { responseType: 'arraybuffer'})
        .then((response) => {
            res.setHeader('content-type', 'application/pdf');
            res.send(response.data);
        })
        .catch((err) => {
            next(err);
        });
}

exports.changeStatus = async (req, res, next) => {
    const id = req.params.invoiceId;
    const event = req.query.event

    api.post(`/accounts/${SLUG}/invoices/${id}/fire.json?`, null, {params: {
            event
        }})
        .then((response) => {
            res.status(200).json({response: response.data});
        })
        .catch((err) => {
            console.log(err.response);
            next(err);
        });
}

exports.createInvoice = async (req, res, next) => {
    const invoice =  req.body.invoiceData;
    const jsonInvoice = JSON.stringify(invoice);


    api.post(`/accounts/${SLUG}/invoices.json?`, jsonInvoice)
        .then((response) => {
            res.status(200).json({response: response.data});
        })
        .catch((err) => {
            console.log(err.response);
            next(err);
        });
}

exports.getContacts = async (req, res, next) => {
    const page = req.query.page ? req.query.page : 1;

    api.get(`/accounts/${SLUG}/subjects.json`, {params: {page}})
        .then((response) => {
            res.status(200).json({response: response.data});
        })
        .catch((err) => {
            console.log(err.response);
            next(err);
        });
    // res.status(200).json(
    //     [
    //         {
    //             "id": 14164196,
    //             "custom_id": null,
    //             "type": "customer",
    //             "name": "GRUPO ANTOLIN TURNOV s.r.o.",
    //             "street": "Průmyslová 3000",
    //             "street2": null,
    //             "city": "Turnov",
    //             "zip": "51101",
    //             "country": "CZ",
    //             "registration_no": "26702436",
    //             "vat_no": "CZ26702436",
    //             "local_vat_no": "",
    //             "bank_account": "",
    //             "iban": "",
    //             "variable_symbol": "2020003",
    //             "enabled_reminders": true,
    //             "due": 45,
    //             "full_name": "",
    //             "email": "",
    //             "email_copy": "",
    //             "phone": "",
    //             "web": "",
    //             "private_note": null,
    //             "avatar_url": null,
    //             "html_url": "https://app.fakturoid.cz/spqserviceconsult/subjects/14164196",
    //             "url": "https://app.fakturoid.cz/api/v2/accounts/spqserviceconsult/subjects/14164196.json",
    //             "created_at": "2022-04-01T17:38:46.432+02:00",
    //             "updated_at": "2022-04-01T17:38:46.432+02:00"
    //         }
    //     ]
    // )
}

exports.createContact = async (req, res, next) => {
    const contact = req.body.contactData;
    const jsonContact = JSON.stringify(contact);
    api.post(`/accounts/${SLUG}/subjects.json`, jsonContact)
        .then((response) => {
            res.status(200).json({response: response.data});
        })
        .catch((err) => {
           console.log(err.response);
            next(err);
        });
}

exports.updateInvoice = async (req, res, next)=> {
    const invoice = req.body.invoiceData;
    const jsonInvoice = JSON.stringify(invoice);
    api.patch(`/accounts/${SLUG}/invoices/${invoice.id}.json`, jsonInvoice)
        .then((response) => {
            console.log(response.data)
            res.status(200).json({response: response.data});
        })
        .catch((err) => {
            console.log(err.response);
            next(err);
        });
}

exports.deleteInvoice = async (req, res, next) => {
    const id = req.params.invoiceId;
    console.log(id);
    api.delete(`/accounts/${SLUG}/invoices/${id}.json`)
        .then((response) => {
            console.log(response.data)
            res.status(200).json({response: response.data});
        })
        .catch((err) => {
            console.log(err.response);
            next(err);
        });
}
