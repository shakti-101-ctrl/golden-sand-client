
var url = "http://localhost:19198/api/Meeting";

var js = jQuery.noConflict(true);
js(document).ready(function ()
{
    showMeetings();

    var params = new URLSearchParams(window.location.search);
    var parameterValue = params.get('meetid');
    if (parameterValue != null) {
        //call the function to bind the data 
        bindDataToFields(parameterValue);
    }
    js(".mul-select").select2({
        placeholder: "Select invited persons",
        tags: true,
    });

    //binng duplex to drop down list
    var duplexDropdown = $("#drpInvitedPersons");
    
    if (duplexDropdown != null) {
        bindDuplexToDropDownList($("#drpInvitedPersons"),"text");
    }
    //end

    
});
function showMeetings() {
    var meetdata = [];
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
                var editbtn = "<button class='btn btn-primary' onClick='editMeetingDetails(this)'><i class='icon-pencil'></i></button>";
                var delbtn = "<button class='btn btn-danger' onClick='deleteMeeting(this)'><i class='icon-trash'></i></button>";
                var hdn = "<input type='hidden' value=" + value.MeetingId + ">";
                var action = editbtn + " " + delbtn + hdn;
                slno += 1;
                meetdata.push([slno, value.MeetingId, value.HeadingText, value.Description, value.MeetStartDateTime, value.MeetEndDateTime,value.InvitedPersons,value.ActiveStatus, action]);
            });
        },
        error: function (msg) {
            alert(msg);
        }

    });
    js("#meetingTable").dataTable({
        data: meetdata,
        retrieve: true,
        paging: true
    });
}
function editMeetingDetails(elements) {
    var meetid = $(elements).closest('tr').find('input[type=hidden]').val();
    window.location.href = "/Meeting/Edit?meetid=" + meetid;
}
function bindDataToFields(meetid) {
    $.ajax({
        url: url + "/" + meetid,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        type: "Get",
        async: false,
        success: function (result) {
            if (result.Data != null) {
                var selectedValues  = result.Data.InvitedPersons;
                var selectedArray = selectedValues.split(",");
                $('#drpInvitedPersons option').each(function () {
                    // Check if the option's value is in the selected array
                    if ($.inArray($(this).val(), selectedArray) !== -1) {
                        // Set the 'selected' attribute for the option
                        $(this).prop('selected', true);
                    }
                });
                $('#drpInvitedPersons').change();
                $('#hdnMeeingId').val(result.Data.MeetingId);
                $('#txtHeadingText').val(result.Data.HeadingText);
                $('#txtDescription').val(result.Data.Description);
                $('#txtStartDate').val(result.Data.MeetStartDate);
                $('#txtEndDate').val(result.Data.MeetEndDate);
                //$('#drpInvitedPersons').val(persons);
                //$('#drpInvitedPersons').multiselect("refresh");
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
    window.location.href = "/Meeting"
}
function createMeeting() {
    var Msg = "";
    var FrmElements = $('.Mandatory')
    
    for (Control in FrmElements) {
        var Element = FrmElements[Control];
        if (Element.type == "select-multiple") {
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
        var meeting = {};
        var array = $('#drpInvitedPersons').val();
        var selectedValues = array.join(", ");
        //alert(array);
        meeting.HeadingText = $('#txtHeadingText').val();
        meeting.Description = $('#txtDescription').val();
        meeting.MeetStartDateTime = $('#txtStartDate').val();
        meeting.MeetEndDateTime = $('#txtEndDate').val();
        meeting.InvitedPersons = selectedValues;
        var status = $('#cbStatus').val();
        if (status == "on") {
            meeting.ActiveStatus = true;
        }
        else {
            meeting.ActiveStatus = false;
        }
        
        if (meeting) {
            
            $.ajax({
                url: url,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify(meeting),
                type: "Post",
                success: function (result) {
                   
                    if (result.Success == true) {
                        alert(result.Message);
                        backToList();
                        showMeetings();
                    }

                },
                error: function (msg) {

                    alert("Somthing went wrong!!");
                }

            });
        }
    }
}
function deleteMeeting(elements) {
    var meetid = $(elements).closest('tr').find('input[type=hidden]').val();
    if (meetid) {
        $.ajax({
            url: url + "/" + meetid,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            type: "Delete",
            success: function (result) {
                var checkstr = confirm('Are you sure you want to delete this?');
                if (checkstr == true) {
                    if (result.Success == true) {
                        alert(result.Message);
                        backToList();
                        showMeetings();
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
function updateMeeting() {
    var meetid = $("#hdnMeeingId").val();
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
        var meeting = {};
        var array = $('#drpInvitedPersons').val();
        var selectedValues = array.join(", ");
        //alert(array);
        meeting.HeadingText = $('#txtHeadingText').val();
        meeting.Description = $('#txtDescription').val();
        meeting.MeetStartDateTime = $('#txtStartDate').val();
        meeting.MeetEndDateTime = $('#txtEndDate').val();
        meeting.InvitedPersons = selectedValues;
        var status = $('#cbStatus').val();
        if (status == "on") {
            meeting.ActiveStatus = true;
        }
        else {
            meeting.ActiveStatus = false;
        }
        if (meeting) {
            $.ajax({
                url: url + "/" + meetid,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify(meeting),
                type: "Put",
                success: function (result) {
                    if (result.Success == true) {
                        alert(result.Message);
                        backToList();
                        showMeetings();
                    }
                },
                error: function (msg) {

                    alert("Somthing went wrong!!");
                }
            });
        }
    }
}
