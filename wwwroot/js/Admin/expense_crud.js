
var url = "http://localhost:19198/api/Expense";
var js = jQuery.noConflict(true);
js(document).ready(function () {
    showExpenses();

    var params = new URLSearchParams(window.location.search);
    var parameterValue = params.get('expenseid');
    if (parameterValue != null) {
        //call the function to bind the data 
        bindDataToFields(parameterValue);
    }
});
function showExpenses() {
    var expensedata = [];
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
                var editbtn = "<button class='btn btn-primary' onClick='editExpenseDetailsById(this)'><i class='icon-pencil'></i></button>";
                var delbtn = "<button class='btn btn-danger' onClick='deleteExpense(this)'><i class='icon-trash'></i></button>";
                var hdn = "<input type='hidden' value=" + value.ExpenseId + ">";
                var action = editbtn + " " + delbtn + hdn;
                slno += 1;
                expensedata.push([slno, value.ExpenseId, value.ExpenseHead, value.PaymentType, value.TowhomOrTransactionId, value.PaymentDate, value.Narration, value.ActiveStatus, action]);
            });
        },
        error: function (msg) {
            alert(msg);
        }
    });
    js("#expenseTable").dataTable({
        data: expensedata,
        retrieve: true,
        paging: true
    });
}
function editExpenseDetailsById(elements) {
    var expenseid = $(elements).closest('tr').find('input[type=hidden]').val();
    window.location.href = "/Expense/Edit?expenseid=" + expenseid;
}
function bindDataToFields(expenseid) {
    $.ajax({
        url: url + "/" + expenseid,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        type: "Get",
        async: false,
        success: function (result) {
            if (result.Data != null) {
                $('#hdnExpenseId').val(result.Data.ExpenseId);
                $('#txtExpenseHead').val(result.Data.ExpenseHead);
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
    window.location.href = "/Expense"
}
function createExpense() {
    var Msg = "";
    var FrmElements = $('.Mandatory')
    //alert(FrmElements[1].type);
    for (Control in FrmElements) {
        var Element = FrmElements[Control];
        if (Element.type == "select-one") {
                if(Element.value == "" || Element.value <= 0) {
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
        var expense = {};
        expense.ExpenseHead = $('#txtExpenseHead').val();
        expense.PaymentType = $('#drpPaymentType').val();
        expense.TowhomOrTransactionId = $('#txtWhomTransId').val();
        expense.PaymentDate = $('#txtPaymentDate').val();
        expense.Narration = $('#txtNarration').val();
        var status = $('#cbStatus').val();
        if (status == "on") {
            expense.ActiveStatus = true;
        }
        else {
            expense.ActiveStatus = false;
        }
        if (expense) {
            $.ajax({
                url: url,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify(expense),
                type: "Post",
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
function deleteExpense(elements) {
    var noticeid = $(elements).closest('tr').find('input[type=hidden]').val();
    if (noticeid) {
        $.ajax({
            url: url + "/" + noticeid,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            type: "Delete",
            success: function (result) {
                var checkstr = confirm('are you sure you want to delete this?');
                if (checkstr == true) {
                    if (result.Success == true) {
                        alert(result.Message);
                        backToList();
                        showNotices();
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
function updateExpenseDetails() {
    var expenseid = $("#hdnExpenseId").val();
    var Msg = "";
    var FrmElements = $('.Mandatory')
    for (Control in FrmElements) {
        var Element = FrmElements[Control];
        if (Element.type == "text") {
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
        var expense = {};
        expense.ExpenseHead = $('#txtExpenseHead').val();
        expense.PaymentType = $('#drpPaymentType').val();
        expense.TowhomOrTransactionId = $('#txtWhomTransId').val();
        expense.PaymentDate = $('#txtPaymentDate').val();
        expense.Narration = $('#txtNarration').val();
        var status = $('#cbStatus').val();
        if (status == "on") {
            expense.ActiveStatus = true;
        }
        else {
            expense.ActiveStatus = false;
        }
        if (expense) {
            //alert(JSON.stringify(expense));
            //console.log(JSON.stringify(expense));
            $.ajax({
                url: url + "/" + expenseid,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify(expense),
                type: "Put",
                success: function (result)
                {

                    if (result.Success == true) {
                        alert(result.Message);
                        backToList();
                        showExpenses();
                    }

                },
                error: function (msg) {

                    alert("Somthing went wrong!!");
                }

            });
        }
    }
}
