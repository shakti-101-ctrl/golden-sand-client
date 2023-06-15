var duplexurl = "http://localhost:19198/api/Duplex";
function bindDuplexToDropDownList(duplexDropdown, _type) {
    debugger;
    var drpduplex = duplexDropdown;
    $.ajax({
        url: duplexurl,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        type: "Get",
        async: false,
        success: function (d) {
            debugger;
            //here to bind the data to dropdown list.
            drpduplex.empty();
            if (_type == "text") {
                $.each(d.Data, function (i, duplex) {
                    drpduplex.append($("<option></option>").val(duplex.DuplexNumber).html(duplex.DuplexNumber));
                });
            }
            else {
                drpduplex.empty();
                drpduplex.append($("<option></option>").val('0').html('--Select Duplex--'));
                $.each(d.Data, function (i, duplex) {
                    drpduplex.append($("<option></option>").val(duplex.DuplexId).html(duplex.DuplexNumber));
                });
            }
           
        },
        error: function (msg) {
            alert(msg);
        }

    });
}

function getDetailsByDuplexId(duplexid) {
    debugger;
    var ownername = "";
    $.ajax({
        url: duplexurl + "/" + duplexid,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        type: "Get",
        async: false,
        success: function (d) {
            debugger;
            
            ownername = d.Data.OwnerName;

        },
        error: function (msg) {
            alert(msg);
        }
       
    });
    return ownername;
}