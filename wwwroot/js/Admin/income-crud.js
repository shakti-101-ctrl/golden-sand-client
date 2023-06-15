
var url = "http://localhost:19198/api/Income";
var js = jQuery.noConflict(true);
js(document).ready(function () {
    showIncomes();
    bindDuplex();
    var params = new URLSearchParams(window.location.search);
    var parameterValue = params.get('incomeid');
    if (parameterValue != null) {
        //call the function to bind the data 
       
        bindDataToFields(parameterValue);
    }
    $("#drpDuplexNumber").change(function () {
        var name = getDetailsByDuplexId($(this).val());
        $("#txtOwnerName").val(name);
    });

});
function bindDuplex() {
    //binng duplex to drop down list
    var duplexDropdown = $("#drpDuplexNumber");

    if (duplexDropdown != null) {
        bindDuplexToDropDownList($("#drpDuplexNumber"), "value");
    }
    //end
}
function showIncomes() {
    var incomedata = [];
    var count = 0;
    $.ajax({
        url: url,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        type: "Get",
        async: false,
        success: function (result) {
            var slno = 0;
            $.each(result.Data, function (key, value) {
                var editbtn = "<button class='btn btn-primary' onClick='editIncomeDetailsById(this)'><i class='icon-pencil'></i></button>";
                var delbtn = "<button class='btn btn-danger' onClick='deleteIncome(this)'><i class='icon-trash'></i></button>";
                var hdn = "<input type='hidden' value=" + value.IncomeId + ">";
                var action = editbtn + " " + delbtn + hdn;
                slno += 1;
                incomedata.push([slno, value.IncomeId, value.DuplexNumber, value.OwnerName, value.Purpose, value.PaymentType, value.TowhomOrTransactionId, value.PaymentDate, value.Narration, value.ActiveStatus, action]);
            });
        },
        error: function (msg) {
            alert(msg);
        }

    });
    js("#incomeTable").dataTable({
        data: incomedata,
        retrieve: true,
        paging: true,

        columnDefs: [
            {
                targets: 7,
                render: DataTable.render.datetime('Do MMM YYYY'),
            }      
        ],
    });
}
function editIncomeDetailsById(elements) {
    var incomeid = $(elements).closest('tr').find('input[type=hidden]').val();
    window.location.href = "/Income/Edit?incomeid=" + incomeid;
}
function bindDataToFields(incomeid) {
    $.ajax({
        url: url + "/" + incomeid,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        type: "Get",
        async: false,
        success: function (result) {
            if (result.Data != null) {
                debugger;
                $('#hdnIncomeId').val(result.Data.IncomeId);
                $('#drpDuplexNumber option').each(function () {
                    if ($(this).html() == result.Data.DuplexNumber) {
                        $(this).attr('selected', 'selected');
                    }
                });
                $('#txtOwnerName').val(result.Data.OwnerName);
                $('#txtPurpose').val(result.Data.Purpose);
                $('#drpPaymentType').val(result.Data.PaymentType);
                $('#txtWhomTransId').val(result.Data.TowhomOrTransactionId);
                $('#txtPaymentDate').val(result.Data.PaymentDate);
                $('#txtNarration').val(result.Data.Narration);
                if (result.Data.ActiveStatus == true) {
                    $('#cbStatus').prop('checked', true);
                }
                else {
                    $('#cbStatus').prop('checked', false);
                }
            }
        },
        error: function (msg) {
            alert(msg);
        }

    });
}
function backToList() {
    window.location.href = "/Income"
}
function createIncome() {
    var Msg = "";
    var FrmElements = $('.Mandatory')
    for (Control in FrmElements) {
        var Element = FrmElements[Control];
        if (Element.type == "select-one") {
            if (Element.value == "" || Element.value <= 0) {
                Msg += "'" + Element.dataset.label + "' cannot be blank, Please enter data.\r\n";
                $("#" + Element.id).css('border-color', 'red');
                $("#Err" + Element.id).text("Cannot be Blank, Please Enter Data!");
                $("#Err" + Element.id).show();
            }
            else {
                $("#" + Element.id).css('border-color', '');
                $("#Err" + Element.id).text("");
                $("#Err" + Element.id).hide();
            }
        }
        else if (Element.type == "text") {
            if (Element.value == "") {
                Msg += "'" + Element.dataset.label + "' cannot be blank, Please enter data.\r\n";
                $("#" + Element.id).css('border-color', 'red');
                $("#Err" + Element.id).text("Cannot be Blank, Please Enter Data!");
                $("#Err" + Element.id).show();
            }
            else {
                $("#" + Element.id).css('border-color', '');
                $("#Err" + Element.id).text("");
                $("#Err" + Element.id).hide();
            }
        }
        else if (Element.type == "date") {
            if (Element.value == "") {
                Msg += "'" + Element.dataset.label + "' cannot be blank, Please enter data.\r\n";
                $("#" + Element.id).css('border-color', 'red');
                $("#Err" + Element.id).text("Cannot be Blank, Please Enter Data!");
                $("#Err" + Element.id).show();
            }
            else {
                $("#" + Element.id).css('border-color', '');
                $("#Err" + Element.id).text("");
                $("#Err" + Element.id).hide();
            }
        }
        else if (Element.type == "textarea") {
            if (Element.value == "") {
                Msg += "'" + Element.dataset.label + "' cannot be blank, Please enter data.\r\n";
                $("#" + Element.id).css('border-color', 'red');
                $("#Err" + Element.id).text("Cannot be Blank, Please Enter Data!");
                $("#Err" + Element.id).show();
            }
            else {
                $("#" + Element.id).css('border-color', '');
                $("#Err" + Element.id).text("");
                $("#Err" + Element.id).hide();
            }
        }
    }

    if (Msg != "") {
        alert(Msg);
    }
    else {
        var income = {};
        income.DuplexNumber = $('#drpDuplexNumber').val();
        income.OwnerName = $('#txtOwnerName').val();
        income.Purpose = $('#txtPurpose').val();
        income.TowhomOrTransactionId = $('#txtWhomTransId').val();
        income.PaymentDate = $('#txtPaymentDate').val();
        income.Narration = $('#txtNarration').val();
        income.PaymentType = $('#drpPaymentType').val();
        var status = $('#cbStatus').val();
        if (status == "on") {
            income.ActiveStatus = true;
        }
        else {
            income.ActiveStatus = false;
        }
        if (income) {
            $.ajax({
                url: url,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify(income),
                type: "Post",
                success: function (result) {

                    if (result.Success == true) {
                        alert(result.Message);
                        backToList();
                        showIncomes();
                    }

                },
                error: function (msg) {

                    alert("Somthing went wrong!!");
                }

            });
        }
    }
}
function deleteIncome(elements) {
    var incomeid = $(elements).closest('tr').find('input[type=hidden]').val();
    if (incomeid) {
        $.ajax({
            url: url + "/" + incomeid,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            type: "Delete",
            success: function (result) {
                var checkstr = confirm('Are you sure you want to delete this?');
                if (checkstr == true) {
                    if (result.Success == true) {
                        alert(result.Message);
                        backToList();
                        showIncomes();
                    }
                } else {
                    return false;
                }

            },
            error: function (result) {
                alert("Somthing went wrong!!");
            }

        });
    }
}
function updateIncome() {
    var noticeid = $("#hdnIncomeId").val();
    var Msg = "";
    var FrmElements = $('.Mandatory')
    for (Control in FrmElements) {
        var Element = FrmElements[Control];
        if (Element.type == "select-one") {
            if (Element.value == "" || Element.value <= 0) {
                Msg += "'" + Element.dataset.label + "' cannot be blank, Please enter data.\r\n";
                $("#" + Element.id).css('border-color', 'red');
                $("#Err" + Element.id).text("Cannot be Blank, Please Enter Data!");
                $("#Err" + Element.id).show();
            }
            else {
                $("#" + Element.id).css('border-color', '');
                $("#Err" + Element.id).text("");
                $("#Err" + Element.id).hide();
            }
        }
        else if (Element.type == "text") {
            if (Element.value == "") {
                Msg += "'" + Element.dataset.label + "' cannot be blank, Please enter data.\r\n";
                $("#" + Element.id).css('border-color', 'red');
                $("#Err" + Element.id).text("Cannot be Blank, Please Enter Data!");
                $("#Err" + Element.id).show();
            }
            else {
                $("#" + Element.id).css('border-color', '');
                $("#Err" + Element.id).text("");
                $("#Err" + Element.id).hide();
            }
        }
        else if (Element.type == "date") {
            if (Element.value == "") {
                Msg += "'" + Element.dataset.label + "' cannot be blank, Please enter data.\r\n";
                $("#" + Element.id).css('border-color', 'red');
                $("#Err" + Element.id).text("Cannot be Blank, Please Enter Data!");
                $("#Err" + Element.id).show();
            }
            else {
                $("#" + Element.id).css('border-color', '');
                $("#Err" + Element.id).text("");
                $("#Err" + Element.id).hide();
            }
        }
        else if (Element.type == "textarea") {
            if (Element.value == "") {
                Msg += "'" + Element.dataset.label + "' cannot be blank, Please enter data.\r\n";
                $("#" + Element.id).css('border-color', 'red');
                $("#Err" + Element.id).text("Cannot be Blank, Please Enter Data!");
                $("#Err" + Element.id).show();
            }
            else {
                $("#" + Element.id).css('border-color', '');
                $("#Err" + Element.id).text("");
                $("#Err" + Element.id).hide();
            }
        }
    }
    if (Msg != "") {
        alert(Msg);
    }
    else {
        var income = {};
        income.DuplexNumber = $('#drpDuplexNumber').val();
        income.OwnerName = $('#txtOwnerName').val();
        income.Purpose = $('#txtPurpose').val();
        income.TowhomOrTransactionId = $('#txtWhomTransId').val();
        income.PaymentDate = $('#txtPaymentDate').val();
        income.Narration = $('#txtNarration').val();
        income.PaymentType = $('#drpPaymentType').val();
        var status = $('#cbStatus').val();
        if (status == "on") {
            income.ActiveStatus = true;
        }
        else {
            income.ActiveStatus = false;
        }
        if (income) {
            $.ajax({
                url: url + "/" + noticeid,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify(income),
                type: "Put",
                success: function (result) {

                    if (result.Success == true) {
                        alert(result.Message);
                        backToList();
                        showNotices();
                    }

                },
                error: function (msg) {

                    alert("Somthing went wrong!!");
                }

            });
        }
    }
}
