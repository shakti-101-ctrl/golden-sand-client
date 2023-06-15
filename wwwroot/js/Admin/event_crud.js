
var url = "http://localhost:19198/api/Event";
var js = jQuery.noConflict(true);
js(document).ready(function () {
    showEvents();

    var params = new URLSearchParams(window.location.search);
    var parameterValue = params.get('eventid');
    if (parameterValue != null) {
        //call the function to bind the data 
        bindDataToFields(parameterValue);
    }
});
function showEvents() {
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
                var editbtn = "<button class='btn btn-primary' onClick='editEventDetailsById(this)'><i class='icon-pencil'></i></button>";
                var delbtn = "<button class='btn btn-danger' onClick='deleteEvent(this)'><i class='icon-trash'></i></button>";
                var hdn = "<input type='hidden' value=" + value.EventId + ">";
                var action = editbtn + " " + delbtn + hdn;
                
                slno += 1;
                empdata.push([slno,value.EventId, value.HeadingText, value.Description, value.EventStartDate, value.EventEndDate, value.ActiveStatus, action]);
            });
        },
        error: function (msg) {
            alert(msg);
        }

    });
    js("#eventTable").dataTable({
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
            },
        ],
    });
}
function editEventDetailsById(elements) {
    var eventid = $(elements).closest('tr').find('input[type=hidden]').val();
    window.location.href = "/Event/Edit?eventid=" + eventid;
}
function bindDataToFields(eventid) {
    $.ajax({
        url: url + "/" + eventid,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        type: "Get",
        async: false,
        success: function (result) {
            if (result.Data != null) {
                $('#hdnEventId').val(result.Data.EventId);
                $('#txtHeading').val(result.Data.HeadingText);
                $('#txtDescription').val(result.Data.Description);
                $('#txtStartDate').val(result.Data.EventStartDate);
                $('#txtEndDate').val(result.Data.EventEndDate);
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
    window.location.href = "/Event"
}
function createAdminEvent() {
   
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
        var event = {};
        event.HeadingText = $('#txtHeading').val();
        event.Description = $('#txtDescription').val();
        event.EventStartDate = $('#txtStartDate').val();
        event.EventEndDate = $('#txtEndDate').val();
        var status = $('#cbStatus').val();
        if (status == "on") {
            event.ActiveStatus = true;
        }
        else {
            event.ActiveStatus = false;
        }
        if (event) {
            $.ajax({
                url: url,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify(event),
                type: "Post",
                success: function (result) {

                    if (result.Success == true) {
                        alert(result.Message);
                        backToList();
                        showEvents();
                    }

                },
                error: function (msg) {

                    alert("Somthing went wrong!!");
                }

            });
        }
    }
}
function deleteEvent(elements) {
    var eventid = $(elements).closest('tr').find('input[type=hidden]').val();
    if (eventid) {
        $.ajax({
            url: url + "/" + eventid,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            type: "Delete",
            success: function (result) {
                var checkstr = confirm('are you sure you want to delete this?');
                if (checkstr == true) {
                    if (result.Success == true) {
                        alert(result.Message);
                        backToList();
                        showEvents();
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
function updateEvent() {
    var eventid = $("#hdnEventId").val();
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
        var event = {};
        event.HeadingText = $('#txtHeading').val();
        event.Description = $('#txtDescription').val();
        event.EventStartDate = $('#txtStartDate').val();
        event.EventEndDate = $('#txtEndDate').val();
        var status = $('#cbStatus').val();
        if (status == "on") {
            event.ActiveStatus = true;
        }
        else {
            event.ActiveStatus = false;
        }
        if (event) {
            $.ajax({
                url: url + "/" + eventid,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify(event),
                type: "Put",
                success: function (result) {

                    if (result.Success == true) {
                        alert(result.Message);
                        backToList();
                        showEvents();
                    }

                },
                error: function (msg) {

                    alert("Somthing went wrong!!");
                }

            });
        }
    }
}
