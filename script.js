var servers = {};

var currentlyEditing = "";


$(document).ready(function () {
    servers = JSON.parse(localStorage.getItem("servers"));
    if (!servers) {
        servers = {};
    }
    var sortedServers = Object.fromEntries(
        Object.entries(servers).sort(([, a], [, b]) => a.lastPlayTime - b.lastPlayTime)
    );
    Object.keys(sortedServers).forEach((key) => {
        addServerToList(key);
    });
});

function onClickServer(id) {
    servers[id].lastPlayTime = Date.now();
    var server = servers[id];
    window.location.assign("minecraft://connect?serverUrl=" + server.ip + "&serverPort=" + server.port);
    saveToLocalstorage();
}

function onEditServer(id) {
    currentlyEditing = id;
    var server = servers[id];
    $("#errorText").text("");
    $("#modalTitle").text("Edit server");
    $("#removeBtn").text("Remove");
    $("#input-name").val(server.name);
    $("#input-ip").val(server.ip);
    $("#input-port").val(server.port);
    $("#add-server-modal").modal('show');
}

function removeServer() {
    $("#add-server-modal").modal('hide');
    if (!servers[currentlyEditing]) {
        return;
    }
    delete servers[currentlyEditing];
    saveToLocalstorage();
    document.getElementById(currentlyEditing).remove();
}

function saveServer() {
    if ($("#input-name").val() == "" || $("#input-ip").val() == "" || $("#input-port").val() == "") {
        $("#errorText").text("Please fill out all fields.");
        return;
    }

    var isNewServer = !servers[currentlyEditing];
    $("#add-server-modal").modal('hide');
    servers[currentlyEditing] = { name: $("#input-name").val(), ip: $("#input-ip").val(), port: $("#input-port").val(), lastPlayTime: Date.now() };
    saveToLocalstorage();
    if (isNewServer) {
        addServerToList(currentlyEditing);
    } else {
        updateServer(currentlyEditing);
    }
}

function updateServer(id) {
    var server = servers[id];

    var targetServer = document.getElementById(id);
    targetServer.firstChild.firstChild.innerHTML = server.name;
    targetServer.firstChild.lastChild.innerHTML = server.ip;
}

function addServer() {
    currentlyEditing = uuidv4();
    $("#errorText").text("");
    $("#modalTitle").text("Add server");
    $("#removeBtn").text("Cancel");
    $("#input-name").val("");
    $("#input-ip").val("");
    $("#input-port").val("19132");
    $("#add-server-modal").modal('show');

}

function addServerToList(id) {
    var server = servers[id];
    document.getElementById("serversList").innerHTML = `<div class="server" id="` + id + `"><div class="server-info" onclick="onClickServer(this.parentElement.id)"><a class="name">` + server.name + `</a><br><a class="ip">` + server.ip + `</a></div><image class="edit" src="edit.png" onclick="onEditServer(this.parentElement.id)"></image></div>` + document.getElementById("serversList").innerHTML;
}

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
        .replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
}

function saveToLocalstorage() {
    localStorage.setItem("servers", JSON.stringify(servers));
}
