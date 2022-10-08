function changePage(action){
    var pageNo = parseInt(document.getElementById("pageNo1").innerText);
    
    if (action == "next")
    {
        pageNo = pageNo + 1;
        displayLeaderboard(pageNo);
        document.getElementsByClassName("tm-btn-prev")[0].hidden = false;
        document.getElementsByClassName("tm-btn-prev2")[0].hidden = false;
    }
    else if (pageNo > 1){
        pageNo = pageNo - 1;
        displayLeaderboard(pageNo);
        document.getElementsByClassName("tm-btn-next")[0].hidden = false;
        document.getElementsByClassName("tm-btn-next2")[0].hidden = false;
        if (pageNo == 1){
            document.getElementsByClassName("tm-btn-prev")[0].hidden = true;
            document.getElementsByClassName("tm-btn-prev2")[0].hidden = true;
        }
    }

    document.getElementById("pageNo1").innerText = pageNo;
    document.getElementById("pageNo2").innerText = pageNo;
    document.getElementsByClassName("scrollIntoView")[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function displayLeaderboard(page, roles=false){
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };
    page = page-1
    fetch(`https://andyreload.herokuapp.com/leaderboard?page=${page}`, requestOptions)
        .then(response => response.text())
        .then(result => {
            data = JSON.parse(result);
            var table_ul = document.getElementById("table-ul");
            table_ul.innerHTML = "";

            if (data["players"].length < 100){
                document.getElementsByClassName("tm-btn-next")[0].hidden = true;
                document.getElementsByClassName("tm-btn-next2")[0].hidden = true;
            }

            data["players"].forEach(updateTableRow);
            if (roles){
                data["role_rewards"].forEach(updateRoleRewards);
            }
            function updateTableRow(item, index){
                var table_ul = document.getElementById("table-ul");
                //row
                var row_div = document.createElement("div");
                row_div.setAttribute("class", "row table-row");
                
                //rank div
                var rank_div = document.createElement("div");
                rank_div.setAttribute("class", "col-md-1 pd-mobl");
                var li = document.createElement("li");
                li.innerText = 100*page + index + 1;
                rank_div.appendChild(li);
                row_div.appendChild(rank_div);

                //image div
                var image_div = document.createElement("div");
                image_div.setAttribute("class", "col-md-1 pd-mobl");
                var img = document.createElement("img");
                img_link = "";
                if (item["avatar"]){
                    img_link = `https://cdn.discordapp.com/avatars/${item["id"]}/${item["avatar"]}.png`;
                }
                else {
                    img_link = "https://cdn.discordapp.com/embed/avatars/1.png";
                }
                img.setAttribute("src", img_link);
                img.setAttribute("onerror", "this.onerror=null;this.src='https://cdn.discordapp.com/embed/avatars/1.png'");
                image_div.appendChild(img);
                row_div.appendChild(image_div);

                //username div
                var username_div = document.createElement("div");
                username_div.setAttribute("class", "col-md-4 pd-mobl");
                username_div.innerText = item["username"];
                row_div.appendChild(username_div);

                //Messages
                var messages_div = document.createElement("div");
                messages_div.setAttribute("class", "col-md-2 pd-mobl");
                var h6 = document.createElement("h6");
                h6.setAttribute("class", "head");
                h6.innerText = "MESSAGES";
                var h5 = document.createElement("h5");
                h5.innerText = item["message_count"];
                h5.setAttribute("class", "value");
                messages_div.appendChild(h6);
                messages_div.appendChild(h5);
                row_div.appendChild(messages_div);

                //Experience
                var experience_div = document.createElement("div");
                experience_div.setAttribute("class", "col-md-2 pd-mobl");
                var h6 = document.createElement("h6");
                h6.setAttribute("class", "head");
                h6.innerText = "EXPERIENCE";
                var h5 = document.createElement("h5");
                h5.setAttribute("class", "value");
                h5.innerText = item["xp"];
                experience_div.appendChild(h6);
                experience_div.appendChild(h5);
                row_div.appendChild(experience_div);

                //level
                var perc = parseInt((item["detailed_xp"][0]*100)/item["detailed_xp"][1])
                var level_div = document.createElement("div");
                level_div.setAttribute("role", "progressbar");
                level_div.setAttribute("class", "progressbar");
                level_div.setAttribute("aria-valuenow", perc);
                level_div.setAttribute("aria-valuemin", "0");
                level_div.setAttribute("aria-valuemax", "100");
                level_div.setAttribute("style", `--value:${item["level"]}; --perc:${perc}`);
                row_div.appendChild(level_div);
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
        })
        .catch(error => console.log('error', error));
}

window.onload = function(){
    document.getElementsByClassName("tm-btn-next")[0].hidden = false;
    document.getElementsByClassName("tm-btn-prev")[0].hidden = true;
    document.getElementsByClassName("tm-btn-next2")[0].hidden = false;
    document.getElementsByClassName("tm-btn-prev2")[0].hidden = true;
    displayLeaderboard(1, true);
}
