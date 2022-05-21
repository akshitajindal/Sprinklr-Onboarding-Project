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
            titleText.innerHTML = json[i].title;
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

const jsonPromise = populateDOM();
jsonPromise
    .then ( function() {
        let inputElem = document.querySelector("ul").firstChild;
        console.log(inputElem);
        inputElem.focus();
        imgURL = inputElem.querySelector('img').src;
        const imgPanel = document.querySelector(".object-image");
        imgPanel.setAttribute('style', `background-image: url(${imgURL})`);
    })
    .then( function () {
        document.querySelectorAll('.list-item').forEach(item => {
            item.addEventListener('focus', event => {
                imgURL = item.querySelector('img').src;
                itemTitle = item.querySelector('p').innerHTML;
                const imgPanel = document.querySelector(".object-image");
                imgPanel.setAttribute('style', `background-image: url(${imgURL})`);
                const textBox = document.querySelector(".object-title input");
                textBox.nodeValue = itemTitle;
            })
        })
    })



