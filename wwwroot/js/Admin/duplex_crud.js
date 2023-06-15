
var imageUrl = "http://localhost:19198/";
var url = "http://localhost:19198/api/Duplex";
var js = jQuery.noConflict(true);
js(document).ready(function () {
    showAllDuplex();
   
    var params = new URLSearchParams(window.location.search);
    var parameterValue = params.get('duplexid');
    if (parameterValue != null) {
        //call the function to bind the data 
        bindDataToFields(parameterValue);
    }
    //for zooom image 
    $('.zoom-image').hover(function () {
        $(this).addClass('zoomed');
    }, function () {
        $(this).removeClass('zoomed');
    });
    //end of zoom

    //getting fileupload1
    var fileupload1 = $("#fileUpload1");
    //var filePath1 = $("#spnFilePath");
    var button = $("#btnUpload1");
    button.click(function () {
        fileupload1.click();
    });
    fileupload1.change(function (e) {

        var file = e.target.files[0];
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#previewImage').attr('src', e.target.result);
            $('#previewImage').css('display', 'block');
        };
        reader.readAsDataURL(file);

        var fileName = $(this).val().split('\\')[$(this).val().split('\\').length - 1];
        var extension = fileName.substr((fileName.lastIndexOf('.') + 1));
        if (extension == "jpg" || extension == "png") {
            $("#txtFileUpload1").removeAttr("disabled");
            $("#txtFileUpload1").val(fileName);

        }
        else {
            alert("Please select only image file!");
        }

    });
    //end of file 1

    //getting fileupload2
    var fileupload2 = $("#fileUpload2");
    //var filePath1 = $("#spnFilePath");
    var button2 = $("#btnUpload2");
    button2.click(function () {
        fileupload2.click();
    });
    fileupload2.change(function (e) {
        //image preview
        var file = e.target.files[0];
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#previewImage1').attr('src', e.target.result);
            $('#previewImage1').css('display', 'block');
        };
        reader.readAsDataURL(file);
        //end of image preview
        var fileName = $(this).val().split('\\')[$(this).val().split('\\').length - 1];
        var extension = fileName.substr((fileName.lastIndexOf('.') + 1));
        if (extension == "jpg" || extension == "png") {
            $("#txtFileUpload2").removeAttr("disabled");
            $("#txtFileUpload2").val(fileName);
        }
        else {
            alert("Please select only image file!");
        }

    });
    //end of file 2
});

function showAllDuplex() {
    var duplexdata = [];
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
                var editbtn = "<button class='btn btn-primary' onClick='editDuplexDetailsByDuplexId(this)'><i class='icon-pencil'></i></button>";
                var delbtn = "<button class='btn btn-danger' onClick='deleteDuplex(this)'><i class='icon-trash'></i></button>";
                var hdn = "<input type='hidden' value=" + value.DuplexId + ">";
                var action = editbtn + " " + delbtn + hdn;
                slno += 1;
                duplexdata.push([slno, value.DuplexId, value.DuplexNumber, value.OwnerName, value.Contact, value.AlternateContact, value.EmailId, value.PhotoCopy, value.AdharCardCopy, value.ActiveStatus, action]);
            });
        },
        error: function (msg) {
            alert(msg);
        }

    });
    js("#tblDuplexDetails").dataTable({
        data: duplexdata,
        retrieve: true,
        paging: true,
        columns: [
            { 'data': duplexdata.slno },
            { 'data': duplexdata.DuplexId },
            { 'data': duplexdata.DuplexNumber },
            { 'data': duplexdata.OwnerName },
            { 'data': duplexdata.Contact },
            { 'data': duplexdata.AlternateContact },
            { 'data': duplexdata.EmailId },

            {
                'data': duplexdata.PhotoCopy,
                'sortable': false,
                'searchable': false,
                'render': function (data) {
                    if (!data) {
                        return 'N/A';
                    } else {
                        var imagepath = imageUrl + data;
                        return '<img src=' + imagepath + ' height="50px" width="50px" class="zoom-image"/>';
                    }
                }
            },
            {
                'data': duplexdata.AdharCardCopy,
                'sortable': false,
                'searchable': false,
                'render': function (data) {
                    if (!data) {
                        return 'N/A';
                    } else {


                        var imagepath = imageUrl + data;
                        //return '<img src=' + imageUrl + data + 'height="50px" width="50px" />';
                        return '<a href=' + imagepath + '> Download Adhar</a>';
                    }
                }
            },
            { 'data': duplexdata.ActiveStatus },
            { 'data': duplexdata.action },

        ]
    });
   
}
function editDuplexDetailsByDuplexId(elements) {
    var duplexid = $(elements).closest('tr').find('input[type=hidden]').val();
    window.location.href = "/Duplex/Edit?duplexid=" + duplexid;
   
}
function bindDataToFields(duplexid) {
    $.ajax({
        url: url + "/" + duplexid,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        type: "Get",
        async: false,
        success: function (result) {
            if (result.Data != null) {
                $('#hdnDuplexId').val(result.Data.DuplexId);
                $('#txtDuplexNumber').val(result.Data.DuplexNumber);
                $('#txtContactNumber').val(result.Data.Contact);
                $('#txtEmailAddrress').val(result.Data.EmailId);
                $('#txtOwenrName').val(result.Data.OwnerName);
                $('#txtAlternateContact').val(result.Data.AlternateContact);
                $('#previewImage').attr("src", imageUrl + result.Data.AdharCardCopy);
                $('#previewImage1').attr("src", imageUrl + result.Data.PhotoCopy);

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
    window.location.href = "/Duplex"
}
function createDuplex() {
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
        else if (Element.type == "file") {
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
        var formData = new FormData();
        var duplexNumber = $('#txtDuplexNumber').val();
        var adharCardCopy = $('#fileUpload1')[0].files[0];
        var contact = $('#txtContactNumber').val();
        var emailId = $('#txtEmailAddrress').val();
        var ownerName = $('#txtOwenrName').val();
        var photoCopy = $('#fileUpload2')[0].files[0];
        var alternateContact = $('#txtAlternateContact').val();
        var activeStatus = false;
        var status = $('#cbStatus').val();
        if (status == "on") {
            activeStatus = true;
        }
        else {
            activeStatus = false;
        }
        formData.append('DuplexNumber', duplexNumber);
        formData.append('OwnerName', ownerName);
        formData.append('AdharCardCopy', adharCardCopy);
        formData.append('PhotoCopy', photoCopy);
        formData.append('Contact', contact);
        formData.append('AlternateContact', alternateContact);
        formData.append('EmailId', emailId);
        formData.append('ActiveStatus', activeStatus);

        if (formData) {
            $.ajax({
                url: url,
                contentType: "application/json; charset=utf-8",
                data: formData,
                type: "Post",
                processData: false,
                contentType: false,
                success: function (result) {

                    if (result.Success == true) {
                        alert(result.Message);
                        backToList();
                        showAllDuplex();
                    }

                },
                error: function (msg) {

                    alert("Somthing went wrong!!");
                }

            });
        }
    }
}
function deleteDuplex(elements) {
    var duplexid = $(elements).closest('tr').find('input[type=hidden]').val();
    if (duplexid) {
        $.ajax({
            url: url + "/" + duplexid,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            type: "Delete",
            success: function (result) {
                var checkstr = confirm('Are you sure you want to delete this?');
                if (checkstr == true)
                {
                    if (result.Success == true) {
                        alert(result.Message);
                        backToList();
                        showAllDuplex();
                    }
                }
                else {
                    return false;
                }

            },
            error: function (result) {
                alert("Somthing went wrong!!");
            }

        });
    }
}
function updateDuplex() {
    var duplexid = $("#hdnDuplexId").val();
    var Msg = "";
    var image1 = $('#imgAdhar');
    var image2 = $('#imgPhoto');
    if (image1.val() != '') {
        $('#fileUpload1').removeClass('Mandatory');
    }

    if (image2.val() != '') {
        $('#fileUpload2').removeClass('Mandatory');
    }
    var fileUpload1 = $('#fileUpload1');
    var fileUpload2 = $('#fileUpload2');
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
        else if (Element.type == "file") {
         
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
        var formData = new FormData();
        var duplexNumber = $('#txtDuplexNumber').val();
        var adharCardCopy = $('#fileUpload1')[0].files[0];
        var contact = $('#txtContactNumber').val();
        var emailId = $('#txtEmailAddrress').val();
        var ownerName = $('#txtOwenrName').val();
        var photoCopy = $('#fileUpload2')[0].files[0];
        var alternateContact = $('#txtAlternateContact').val();
        var activeStatus = false;
        var status = $('#cbStatus').val();
        if (status == "on") {
            activeStatus = true;
        }
        else {
            activeStatus = false;
        }
        formData.append('DuplexNumber', duplexNumber);
        formData.append('OwnerName', ownerName);
        if (fileUpload1.val() != '') {
            formData.append('AdharCardCopy', adharCardCopy);
        }
        if (fileUpload2.val() != '') {
            formData.append('PhotoCopy', photoCopy);
        }
        formData.append('Contact', contact);
        formData.append('AlternateContact', alternateContact);
        formData.append('EmailId', emailId);
        formData.append('ActiveStatus', activeStatus);

        if (formData) {
            $.ajax({
                url: url + "/" + duplexid,
                contentType: "application/json; charset=utf-8",
                data: formData,
                type: "Put",
                processData: false,
                contentType: false,
                success: function (result) {

                    if (result.Success == true) {
                        alert(result.Message);
                        backToList();
                        showAllDuplex();
                    }

                },
                error: function (msg) {

                    alert("Somthing went wrong!!");
                }

            });
        }
    }
}
