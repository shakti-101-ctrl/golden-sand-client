
var url = "http://localhost:19198/api/Notice";
var js = jQuery.noConflict(true);
js(document).ready(function () {
    showNotices();
    
    var params = new URLSearchParams(window.location.search);
    var parameterValue = params.get('noticeid');
    if (parameterValue != null) {
        //call the function to bind the data 
        bindDataToFields(parameterValue);
    }
});
function showNotices() {
    var empdata = [];
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
                var editbtn = "<button class='btn btn-primary' onClick='editNoticeDetailsById(this)'><i class='icon-pencil'></i></button>";
                var delbtn = "<button class='btn btn-danger' onClick='deleteNotice(this)'><i class='icon-trash'></i></button>";
                var hdn = "<input type='hidden' value=" + value.NoticeId +">";
                var action = editbtn + " " + delbtn + hdn;
                slno += 1;
                empdata.push([slno, value.NoticeId, value.HeadingText, value.Description,value.PostedDate, value.EndDate, value.ActiveStatus, action]);
            });
        },
        error: function (msg) {
            alert(msg);
        }

    });
    js("#noticeTable").dataTable({
        data: empdata,
        retrieve: true,
        paging: true,

        columnDefs: [
            {
                targets: 4,
                render: DataTable.render.datetime('Do MMM YYYY'),
            },
            {
                targets: 5,
                render: DataTable.render.datetime('Do MMM YYYY'),
            }
           
        ],
    });
}
function editNoticeDetailsById(elements)
{
    var noticeid = $(elements).closest('tr').find('input[type=hidden]').val();
    window.location.href = "/Notice/Edit?noticeid=" + noticeid;
}
function bindDataToFields(noticeid) {
    $.ajax({
        url: url + "/" + noticeid,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        type: "Get",
        async: false,
        success: function (result) {
            if (result.Data != null) {
                $('#hdnNoticeId').val(result.Data.NoticeId);
                $('#txtHeading').val(result.Data.HeadingText);
                $('#txtDescription').val(result.Data.Description);
                $('#txtPostedDate').val(result.Data.PostedDate);
                $('#txtEndDate').val(result.Data.EndDate);
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
    window.location.href="/Notice"
}
function createNotice() {
    var Msg = "";
    var FrmElements = $('.Mandatory')
    for (Control in FrmElements)
    {
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

    if (Msg != "")
    {
        alert(Msg);
    }
    else {
        var notice = {};
        notice.HeadingText = $('#txtHeading').val();
        notice.Description = $('#txtDescription').val();
        notice.PostedDate = $('#txtPostedDate').val();
        notice.EndDate = $('#txtEndDate').val();
        var status = $('#cbStatus').val();
        if (status == "on") {
            notice.ActiveStatus = true;
        }
        else {
            notice.ActiveStatus = false;
        }
        if (notice) {
            $.ajax({
                url: url,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify(notice),
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
function deleteNotice(elements) {
    var noticeid = $(elements).closest('tr').find('input[type=hidden]').val();
    if (noticeid)
    {
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
function updateNotice() {
    var noticeid = $("#hdnNoticeId").val();
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
        var notice = {};
        notice.HeadingText = $('#txtHeading').val();
        notice.Description = $('#txtDescription').val();
        notice.PostedDate = $('#txtPostedDate').val();
        notice.EndDate = $('#txtEndDate').val();
        var status = $('#cbStatus').val();
        if (status == "on") {
            notice.ActiveStatus = true;
        }
        else {
            notice.ActiveStatus = false;
        }
        if (notice) {
            $.ajax({
                url: url + "/" + noticeid,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify(notice),
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
