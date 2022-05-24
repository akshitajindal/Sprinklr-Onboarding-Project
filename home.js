//function for loading data from JSON into the DOM
const populateDOM = async function() {
    try {
        const response = await fetch("data.json");
        const json = await response.json();
        const panel = document.querySelector(".left-panel");
        let itemsList = document.createElement("ul");  //making an unordered list
        for(let i=0; i<json.length; i++){
            //each list element contains a div and each div element contains an img and it's title in a span tag inside a paragraph element
            let listItem = document.createElement("li");
            let divItem = document.createElement("div");
            let imgItem = document.createElement("img");
            let titleText = document.createElement("p");
            let titleSpan = document.createElement("span");
            imgItem.src = json[i].previewImage;
            titleText.setAttribute('data-text', json[i].title);
            titleText.append(titleSpan);
            divItem.append(imgItem);
            divItem.append(titleText);
            listItem.append(divItem);
            listItem.tabIndex = i+1; //assigning tab index to each list item
            listItem.classList.add("list-item");
            itemsList.append(listItem);
        }
        panel.append(itemsList); //appending the unordered list into the DOM
        document.querySelectorAll('.list-item div p').forEach(elem => {
            let widthAvailable = elem.getBoundingClientRect().width;
            elem.querySelector('span').innerHTML = clip(elem.getAttribute('data-text'), widthAvailable, elem); //clipping the title so as to get ellipses on text overflow in the middle of the title
        })
        return json;
    } catch (error) {
        console.error(`Could not fetch data: ${error}`);
    }
}

//function to clip text so as to get ellipses on text-overflow in the middle of the text
const clip = function(text, maxWidth, elem) {
    // let tempSpan = elem.querySelector('span')
    // tempSpan.innerHTML = text;
    // console.log(tempSpan.getBoundingClientRect().width);
    // console.log(text);
    if(text.length>20){
        return text.slice(0,10)+"..." + text.slice(-10);
    }
    return text;
}

//function to set the image and the caption in the right panel whenever a new object is focused on the left panel
const setRightPanel = function(item) {
    imgURL = item.querySelector('img').src;
    itemTitle = item.querySelector('p').getAttribute('data-text');
    const imgPanel = document.querySelector(".object-image");
    imgPanel.setAttribute('style', `background-image: url(${imgURL})`);
    let textBox = document.querySelector(".object-title input");
    textBox.value = itemTitle;
    item.classList.add("selected"); //adding "selected" class to the new element selected
}

//function to focus the 1st element in the list on page load
const focusOnLoad = function() {
    let item = document.querySelector(".left-panel ul").firstChild; //querying first child of the unordered list
    setRightPanel(item);
}

//function to change focus on various focus events
const setFocusOnListElements = function () {
    //setting an event listener on focus on every list item
    document.querySelectorAll('.list-item').forEach(item => {
        item.addEventListener('focus', event => {
            let prevItem = document.querySelector(".selected"); //getting the previously selected item
            prevItem.classList.remove("selected"); //unselecting the previosly selected element
            setRightPanel(item); //selecting the new element
        })
    })
}

//function to update the editted title in the left pannel
const updateTitle = function() {
    //setting an event listnered on input for the caption at the bottom of the right panel
    document.querySelector('.object-title input').addEventListener('input', (event) => {
        let currItem = document.querySelector(".selected");
        let textElem = currItem.querySelector('p');
        let spanElem = textElem.querySelector('span');
        textElem.setAttribute('data-text', event.target.value);
        let widthAvailable = textElem.getBoundingClientRect().width;
        spanElem.innerHTML = clip(event.target.value, widthAvailable, textElem); //clipping the title to take care of text overflow
    })
}

//function to navigate through the unordered list using up and down arrow keys
const keydownNavigation = function() {
    //setting an event listener on 'keydown' event
    window.addEventListener('keydown', function(event) {
        let currItem = document.querySelector(".selected");
        let currIndex = currItem.tabIndex;
        let list = document.querySelectorAll(".list-item");
        let length = list.length;
        //setting new element's index when down arrow key is pressed
        if(event.key === "ArrowDown"){
            currIndex++;
            //if down arrow key pressed on the last element then select the first element
            if(currIndex>length){
                currIndex = 1;
            }
            currItem.classList.remove("selected"); //unselect the previously selected element
            setRightPanel(list[currIndex-1]); //select the focused element 
        } 
        //setting new element's index when up arrow key is pressed
        else if(event.key === "ArrowUp") {
            currIndex--;
            //if up arrow key pressed on the first element then select the last element
            if(currIndex<=0){
                currIndex = length;
            }
            currItem.classList.remove("selected"); //unselect the previously selected element
            setRightPanel(list[currIndex-1]); //select the focused element
        }
    })
}

//populateDOM function returns a promise (since it's an async function)
const jsonPromise = populateDOM();
//we execute all other functions using the then keyword on the promise returned
jsonPromise
    .then(focusOnLoad)
    .then(setFocusOnListElements)
    .then(updateTitle)
    .then(keydownNavigation)
