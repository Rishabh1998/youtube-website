function loadMore(){
    var pageNo = parseInt(document.getElementById("pageNo1").innerText);
    addData(pageNo);
}

async function updateLocalStorage(page){
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };
    var prevPage = parseInt(localStorage.getItem("page"));

    fetch(`https://andyreload.herokuapp.com/leaderboard?page=${page}`, requestOptions)
        .then(response => response.text())
        .then(result => {
            localStorage.setItem(page, result);
        })
        .catch(error => console.log('error', error));
    return true;
}

function addData(page){
    var data = JSON.parse(localStorage.getItem(page));
    // var page = parseInt(localStorage.getItem("page"));
    console.log(data)
    var table_ul = document.getElementById("table-ul");
    // table_ul.innerHTML = "";

    if (data["players"].length < 100){
        document.getElementsByClassName("tm-btn-next")[0].hidden = true;
        // document.getElementsByClassName("tm-btn-next2")[0].hidden = true;
    }
    else {
        updateLocalStorage(page+1);
        document.getElementById("pageNo1").innerText = page+1;
    }

    data["players"].forEach(updateTableRow);
    // if (roles){
    //     data["role_rewards"].forEach(updateRoleRewards);
    // }
    function updateTableRow(item, index){
        var table_ul = document.getElementById("table-ul");
        //row
        var row_div = document.createElement("div");
        row_div.setAttribute("class", "row table-row");
        
        //rank div
        var rank_div = document.createElement("div");
        rank_div.setAttribute("class", "col-md-1 pd-mobl board-li");
        var li = document.createElement("li");
        pageNumber = 100*page + index + 1;
        if (pageNumber < 4){
            images = ["gold", "silver", "bronze"];
            img_link = `./img/${images[pageNumber-1]}.png`
            var img = document.createElement("img");
            img.setAttribute("class", "medal round-image");
            img.setAttribute("src", img_link);
            li.appendChild(img)
        }
        else {
            li.innerText = pageNumber;
        }

        rank_div.appendChild(li);
        row_div.appendChild(rank_div);

        //image div
        var image_div = document.createElement("div");
        image_div.setAttribute("class", "col-md-1 pd-mobl board-img");
        var img = document.createElement("img");
        img_link = "";
        if (item["avatar"]){
            img_link = `https://cdn.discordapp.com/avatars/${item["id"]}/${item["avatar"]}.png`;
        }
        else {
            img_link = "https://cdn.discordapp.com/embed/avatars/1.png";
        }
        img.setAttribute("src", img_link);
        img.setAttribute("class", "round-image");
        img.setAttribute("onerror", "this.onerror=null;this.src='https://cdn.discordapp.com/embed/avatars/1.png'");
        image_div.appendChild(img);
        row_div.appendChild(image_div);

        //username div
        var username_div = document.createElement("div");
        username_div.setAttribute("class", "col-md-4 pd-mobl board-uname");
        username_div.innerText = item["username"];
        row_div.appendChild(username_div);

        //Messages
        var messages_div = document.createElement("div");
        messages_div.setAttribute("class", "col-md-2 pd-mobl ");
        var h6 = document.createElement("h6");
        h6.setAttribute("class", "head only-desktop");
        h6.innerText = "MESSAGES";
        var h5 = document.createElement("h5");
        h5.innerText = item["message_count"];
        h5.setAttribute("class", "value only-desktop");
        messages_div.appendChild(h6);
        messages_div.appendChild(h5);
        row_div.appendChild(messages_div);

        //Experience
        var experience_div = document.createElement("div");
        experience_div.setAttribute("class", "col-md-2 pd-mobl only-desktop");
        var h6 = document.createElement("h6");
        h6.setAttribute("class", "head only-desktop");
        h6.innerText = "EXPERIENCE";
        var h5 = document.createElement("h5");
        h5.setAttribute("class", "value only-desktop");
        h5.innerText = item["xp"];
        experience_div.appendChild(h6);
        experience_div.appendChild(h5);
        row_div.appendChild(experience_div);

        //level
        var perc = parseInt((item["detailed_xp"][0]*100)/item["detailed_xp"][1]);
        var progressbarDiv = document.createElement("div");
        progressbarDiv.setAttribute("class", "col-md-2 pd-mobl board-level");
        var level_div = document.createElement("div");
        level_div.setAttribute("role", "progressbar");
        level_div.setAttribute("class", "progressbar");
        level_div.setAttribute("aria-valuenow", perc);
        level_div.setAttribute("aria-valuemin", "0");
        level_div.setAttribute("aria-valuemax", "100");
        level_div.setAttribute("style", `--value:${item["level"]}; --perc:${perc}`);
        progressbarDiv.appendChild(level_div)
        row_div.appendChild(progressbarDiv);
        //everything pushed in table;
        table_ul.appendChild(row_div);
    }

    function updateRoleRewards(item, index){
        var roleElem = document.getElementById("role-rewards");

        var div = document.createElement("div");
        div.setAttribute("class", "role-row");
        var levelDiv = document.createElement("div");
        levelDiv.setAttribute("class", "level");
        var roleDiv = document.createElement("div");
        roleDiv.setAttribute("class", `role color-${item["role"]["color"]}`);
        levelDiv.innerText = `Level ${item["rank"]}`;
        roleDiv.innerText = item["role"]["name"];
        div.appendChild(levelDiv);
        div.appendChild(roleDiv);
        roleElem.appendChild(div);
    }
}

function discordData(){

    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    fetch("https://discord.com/api/v9/invites/andyreloads?with_counts=true", requestOptions)
    .then(response => response.text())
    .then(result => {
        data = JSON.parse(result);
        var online = document.getElementById("online-members");
        var members = document.getElementById("members");
        online.innerText = data["approximate_presence_count"];
        members.innerText = data["approximate_member_count"];
    })
    .catch(error => console.log('error', error));
}

window.onload = function(){
    document.getElementsByClassName("tm-btn-next")[0].hidden = false;
    // document.getElementsByClassName("tm-btn-prev")[0].hidden = true;
    // document.getElementsByClassName("tm-btn-next2")[0].hidden = false;
    // document.getElementsByClassName("tm-btn-prev2")[0].hidden = true;
    localStorage.setItem("page", 0);
    discordData();
    updateLocalStorage(0).then(result => {
        addData(0);
    });
}
