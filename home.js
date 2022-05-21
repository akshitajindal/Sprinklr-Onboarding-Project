async function printJSON() {
    const response = await fetch("data.json");
    const json = await response.json();
    console.log(json);
}

printJSON()