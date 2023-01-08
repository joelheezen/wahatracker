window.addEventListener("load", () => {
    SecondarySelectBaseLayout()
})

async function getData(){
    const response = await fetch(`https://raw.githubusercontent.com/game-datacards/datasources/main/40k/json/Secondaries.json`);
    return response.json();
}


async function SecondarySelectBaseLayout(){
    const data = await getData();
    console.log(data)

    let site = document.getElementsByTagName("site")[0]
    site.innerHTML = ""

    let optionsDiv = document.createElement("div")
    site.appendChild(optionsDiv)

    let missionPackSelect = document.createElement("select")
    missionPackSelect.id = "missionSelect"
    let options = []
    data.forEach(e => {
        if(options.indexOf(e.game) == -1 ){
            options.push(e.game)
        }
    });
    options.forEach(e => {
        let option = document.createElement("option")
        option.text = e
        missionPackSelect.add(option)
    })
    optionsDiv.appendChild(missionPackSelect)

    let factionSpecificToggle = document.createElement("input")
    factionSpecificToggle.setAttribute("type", "checkbox")
    factionSpecificToggle.id = "factionToggle"
    let factionSpecificToggleLabel = document.createElement("label")
    factionSpecificToggleLabel.setAttribute("for", "factionToggle")
    factionSpecificToggleLabel.innerHTML = "Enable faction specific missions"
    optionsDiv.appendChild(factionSpecificToggleLabel)
    optionsDiv.appendChild(factionSpecificToggle)
    missionPackSelect.addEventListener("change", () => createSecondaryList("left"))
    missionPackSelect.addEventListener("change", () => createSecondaryList("right"))
    factionSpecificToggle.addEventListener("change" , () => createSecondaryList("left"))
    factionSpecificToggle.addEventListener("change" , () => createSecondaryList("right"))

    addPlayerArea("left")
    addPlayerArea("right")

    let rdyBtn = document.createElement("button")
    site.appendChild(rdyBtn)
    rdyBtn.addEventListener("click", () => saveSelections())
}

function addPlayerArea(playerSide){
    let site = document.getElementsByTagName("site")[0]
    let sideDiv = document.createElement("div")
    sideDiv.id = playerSide + "Side"
    site.appendChild(sideDiv)

    let playerNameInput = document.createElement("input")
    playerNameInput.id = playerSide +"Name"
    let playerNameLabel = document.createElement("label")
    playerNameLabel.setAttribute("for", playerSide +"Name")
    playerNameLabel.innerHTML = "player name"
    site.appendChild(playerNameLabel)
    site.appendChild(playerNameInput)

    let secondaryArea = document.createElement("div")
    secondaryArea.id = playerSide + "secondaryZone"
    site.appendChild(secondaryArea)

    let secondary1 = document.createElement("select")
    secondary1.id = playerSide + "Sec1"
    let secondary2 = document.createElement("select")
    secondary2.id = playerSide + "Sec2"
    let secondary3 = document.createElement("select")
    secondary3.id = playerSide + "Sec3"

    secondaryArea.appendChild(secondary1)
    secondaryArea.appendChild(secondary2)
    secondaryArea.appendChild(secondary3)


    createSecondaryList(playerSide)
}

async function createSecondaryList(playerSide){
    const data = await getData();
    
    let factionToggle = document.getElementById("factionToggle")
    let missionPack = document.getElementById("missionSelect")
    let options = []
    let nameCheckArray = []
    //gets all options for current missionpack and if toggle is enabled also faction specifics
    if(factionToggle.checked){
        data.forEach(e => {
            if(e.game == missionPack.value){
                if(nameCheckArray.indexOf(e.name)== -1){
                    nameCheckArray.push(e.name)
                    options.push(e)
                }
            }
        });
    }
    else{
        data.forEach(e => {
            if(e.game == missionPack.value && e.faction_type == ""){
                if(nameCheckArray.indexOf(e.name)== -1){
                    nameCheckArray.push(e.name)
                    options.push(e)
                }
            }
        });
    }
    //gets all optgroups
    let optgroups = []
    options.forEach(e => {
        if(optgroups.indexOf(e.category) == -1){
            optgroups.push(e.category)
        }
    })
    console.log(optgroups)
    //initializes all secondary selectors and clears them before adding options
    let sec1 = document.getElementById(playerSide + "Sec1")
    let sec2 = document.getElementById(playerSide + "Sec2")
    let sec3 = document.getElementById(playerSide + "Sec3")
    sec1.innerHTML =""
    sec2.innerHTML =""
    sec3.innerHTML =""
    //places all options in the select options in the right optgroups
    optgroups.forEach(e =>{
        let optgroup = document.createElement("optgroup")
        optgroup.label = e
        sec1.add(optgroup)
        options.forEach(el => {
            if(el.category == e){
                let option = document.createElement("option")
                option.text = el.name
                sec1.add(option)
            }
        })
    })
    optgroups.forEach(e =>{
        let optgroup = document.createElement("optgroup")
        optgroup.label = e
        sec2.add(optgroup)
        options.forEach(el => {
            if(el.category == e){
                let option = document.createElement("option")
                option.text = el.name
                sec2.add(option)
            }
        })
    })
    optgroups.forEach(e =>{
        let optgroup = document.createElement("optgroup")
        optgroup.label = e
        sec3.add(optgroup)
        options.forEach(el => {
            if(el.category == e){
                let option = document.createElement("option")
                option.text = el.name
                sec3.add(option)
            }
        })
    })
}

async function saveSelections(){
    const data = await getData();
    let missionSelect = document.getElementById("missionSelect").value
    let leftSec1 = document.getElementById("leftSec1").value
    let leftSec2 = document.getElementById("leftSec2").value
    let leftSec3 = document.getElementById("leftSec3").value
    let rightSec1 = document.getElementById("rightSec1").value
    let rightSec2 = document.getElementById("rightSec2").value
    let rightSec3 = document.getElementById("rightSec3").value

    data.forEach(e => {
        if(e.name == leftSec1 && e.game == missionSelect){
            leftSec1 = e
        }
        if(e.name == leftSec2 && e.game == missionSelect){
            leftSec2 = e
        }
        if(e.name == leftSec3 && e.game == missionSelect){
            leftSec3 = e
        }
        if(e.name == rightSec1 && e.game == missionSelect){
            rightSec1 = e
        }
        if(e.name == rightSec2 && e.game == missionSelect){
            rightSec2 = e
        }
        if(e.name == rightSec3 && e.game == missionSelect){
            rightSec3 = e
        }
    })
    let leftSecs = [leftSec1, leftSec2, leftSec3]
    let rightSecs = [rightSec1, rightSec2, rightSec3]
    createScoreLayout(leftSecs, rightSecs)
}

function createScoreLayout(L, R){
    let site = document.getElementsByTagName("site")[0]
    site.innerHTML=""
    console.log(L,R)

    createRoundTracker()
    createPlayerTracker(L, "left")
    createPlayerTracker(R, "right")

}

function createRoundTracker(){
    let site = document.getElementsByTagName("site")[0]

    let trackerContainer = document.createElement("div")
    trackerContainer.id = "trackerContainer"
    site.appendChild(trackerContainer)

    for(let i = 1; i < 6; i++){
        let rndbox = document.createElement("div")
        rndbox.style.background= "grey"
        trackerContainer.appendChild(rndbox)
        rndbox.innerHTML = "round " + i
        rndbox.addEventListener("click", () => colourChange(rndbox))
    }
}

function createPlayerTracker(arr, side){
    let site = document.getElementsByTagName("site")[0]

    let playerContainer = document.createElement("div")
    playerContainer.id = "playerContainer" + side

    site.appendChild(playerContainer)

    let primaryContainer = document.createElement("div")
    primaryContainer.id= "primaryContainer" + side
    playerContainer.appendChild(primaryContainer)

    let prim1Container = document.createElement("div")
    let prim2Container = document.createElement("div")

    primaryContainer.appendChild(prim1Container)
    primaryContainer.appendChild(prim2Container)

    let prim1 = document.createElement("div")
    let prim2 = document.createElement("div")
    prim1Container.appendChild(prim1)
    prim1Container.id= "primary1Container" + side
    prim2Container.appendChild(prim2)
    prim2Container.id= "primary2Container" + side

    let prim1Header = document.createElement("h3")
    let prim2Header = document.createElement("h3")
    prim1Header.innerHTML = "Primary 1 objective"
    prim2Header.innerHTML = "Primary 2 objective"
    let prim1Sub = document.createElement("p")
    let prim2Sub = document.createElement("p")
    prim1Sub.innerHTML = "Check the mission for ways to score points here, usually you take objectives and get increasing amount of points depending on number of objective markers held."
    prim2Sub.innerHTML = "Check the mission for ways to score points here, usually this has something to do with objective markers but the way of getting points is different for every mission."

    prim1.appendChild(prim1Header)
    prim1.appendChild(prim1Sub)
    prim2.appendChild(prim2Header)
    prim2.appendChild(prim2Sub)

    let secondaryContainer = document.createElement("div")
    secondaryContainer.id= "secondaryContainer" + side

    playerContainer.appendChild(secondaryContainer)

    let sec1Container = document.createElement("div")
    sec1Container.id = "secondary1Container" + side
    let sec2Container = document.createElement("div")
    sec2Container.id = "secondary2Container" + side
    let sec3Container = document.createElement("div")
    sec3Container.id = "secondary3Container" + side
    secondaryContainer.appendChild(sec1Container)
    secondaryContainer.appendChild(sec2Container)
    secondaryContainer.appendChild(sec3Container)

    let sec1Header = document.createElement("h3")
    sec1Header.innerHTML = arr[0].name
    let sec2Header = document.createElement("h3")
    sec2Header.innerHTML = arr[1].name
    let sec3Header = document.createElement("h3")
    sec3Header.innerHTML = arr[2].name

    let sec1Sub = document.createElement("p")
    sec1Sub.innerHTML = arr[0].description
    let sec2Sub = document.createElement("p")
    sec2Sub.innerHTML = arr[1].description
    let sec3Sub = document.createElement("p")
    sec3Sub.innerHTML = arr[2].description

    sec1Container.appendChild(sec1Header)
    sec1Container.appendChild(sec1Sub)
    sec2Container.appendChild(sec2Header)
    sec2Container.appendChild(sec2Sub)
    sec3Container.appendChild(sec3Header)
    sec3Container.appendChild(sec3Sub)

    addScoreFields(prim1Container, side)
    addScoreFields(prim2Container, side)

    addScoreFields(sec1Container, side)
    addScoreFields(sec2Container, side)
    addScoreFields(sec3Container, side)
}

function addScoreFields(e, side){
    for(let i = 1; i < 6; i++){
        console.log("test")
        let rnd = document.createElement("div")
        e.appendChild(rnd)
        let input = document.createElement("input")
        input.classList.add(side + "number")
        rnd.appendChild(input)
    }
}

function colourChange(e){
    if(e.style.background == "grey"){
        e.style.background = "blue"
    }
    else if(e.style.background == "blue"){
        e.style.background = "green"
    }
    else{
        e.style.background = "grey"
    }
}