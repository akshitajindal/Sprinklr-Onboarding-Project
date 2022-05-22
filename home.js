async function populateDOM() {
    try {
        const response = await fetch("data.json");
        const json = await response.json();
        console.log(json)
        const panel = document.querySelector(".left-panel")
        let itemsList = document.createElement("ul");
        for(let i=0; i<json.length; i++){
            let listItem = document.createElement("li");
            let divItem = document.createElement("div");
            let imgItem = document.createElement("img");
            let titleText = document.createElement("p");
            imgItem.src = json[i].previewImage;
            titleText.innerHTML = clip(json[i].title);
            titleText.setAttribute('data-text', json[i].title);
            divItem.append(imgItem);
            divItem.append(titleText);
            listItem.append(divItem);
            listItem.tabIndex = i+1;
            listItem.classList.add("list-item");
            itemsList.append(listItem);
        }
        panel.append(itemsList);
        return json;
    } catch (error) {
        console.error(`Could not fetch data: ${error}`);
    }
}

function clip(text) {
    if(text.length>20){
        return text.slice(0,10)+"..." + text.slice(-10);
    }
    return text;
}

function setRightPanel(item) {
    imgURL = item.querySelector('img').src;
    itemTitle = item.querySelector('p').getAttribute('data-text');
    const imgPanel = document.querySelector(".object-image");
    imgPanel.setAttribute('style', `background-image: url(${imgURL})`);
    let textBox = document.querySelector(".object-title input");
    textBox.value = itemTitle;
    item.classList.add("selected");
}


const jsonPromise = populateDOM();
jsonPromise
    .then ( function() {
        let item = document.querySelector("ul").firstChild;
        setRightPanel(item);
    })
    .then( function () {
        document.querySelectorAll('.list-item').forEach(item => {
            item.addEventListener('focus', event => {
                let prevItem = document.querySelector(".selected");
                prevItem.classList.remove("selected");
                setRightPanel(item);
            })
        })
    })
    .then( function() {
        document.querySelector('.object-title input').addEventListener('input', (event) => {
            let currItem = document.querySelector(".selected");
            currItem.querySelector('p').setAttribute('data-text', event.target.value);
            currItem.querySelector('p').innerHTML = clip(event.target.value);
        })
    })
    .then(function() {
        document.addEventListener('keydown', function(event) {
            let currItem = document.querySelector(".selected");
            let currIndex = currItem.tabIndex;
            let list = document.querySelectorAll(".list-item");
            let length = list.length;
            if(event.which === 40){
                currIndex++;
                if(currIndex>length){
                    currIndex = 1;
                }
                currItem.classList.remove("selected");
                setRightPanel(list[currIndex-1]);
            } else if(event.which === 38) {
                currIndex--;
                if(currIndex<=0){
                    currIndex = length;
                }
                currItem.classList.remove("selected");
                setRightPanel(list[currIndex-1]);
            }
        })
    })



