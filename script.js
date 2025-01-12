'use strict'

async function indexJSON(requestURL) {
    const request = new Request(requestURL);
    const response = await fetch(request);
    const jsonIndex = await response.text();
    const index = JSON.parse(jsonIndex);
    allTheThings(index);
}

function allTheThings(obj) {
    const things = document.querySelector('#things');
    const thingsThis = document.createElement('p');
    thingsThis.textContent = obj.title;
    things.appendChild(thingsThis);
    
    const thingsAbout = document.createElement('small');
    const thingsBR = document.createElement('br');
    thingsAbout.textContent = obj.description;
    thingsThis.appendChild(thingsBR);
    thingsThis.appendChild(thingsAbout);

    const thingsUL = document.createElement('ul');
    thingsUL.id = obj.id;
    things.appendChild(thingsUL);

    const thingAll = obj.things;
    for (const thing of thingAll) {
        const thingLi = document.createElement('li');
        thingLi.setAttribute("data-org", thing.stars);
        thingLi.innerHTML = `
        <h3>${thing.name}</h3>
        <small>${thing.by}</small>
        `
        thingsUL.appendChild(thingLi);

        const dialogModal = document.querySelector('#modal');
        thingLi.addEventListener('click', function () {
            const img = document.querySelector('#modal img');
            img.src = thing.img;
            img.alt = thing.name;
            const family = document.querySelector('#name');
            family.innerHTML = `
            ${thing.name}<br/>
            <small>${thing.by}</small>
            `;
            const text = document.querySelector('#text');
            text.innerHTML = thing.text;
            const link = document.querySelector('#link');
            link.href = thing.link;
            link.innerHTML = obj.moreinfo;
            onModal()
        });

        thingLi.addEventListener("mouseover", () => {
            document.body.style.backgroundImage = `url(${thing.img})`;
        });

        thingLi.addEventListener("mouseout", () => {
            document.body.style.backgroundImage = `url()`;
        });


        function onModal() {
            if (typeof dialogModal.showModal === "function") {
                dialogModal.showModal();
            } else {
                alert("The <dialog> API is not supported by this browser");
            }
        }

        const closeBtn = document.querySelector('#closeBtn');
        closeBtn.addEventListener('click', () => {
            dialogModal.close();
        });
    }
}

document.addEventListener('readystatechange', event => {
    if (event.target.readyState === 'complete') {
        //****** for all select ******
        const filter = document.querySelectorAll('#org input[type="radio"]')
        for (let i of filter) {
            i.addEventListener('change', () => {
                let value = i.value
                //*** for each target ***
                let targets = document.querySelectorAll('#things li')
                for (let ii of targets) {
                    //*** delete hidden items ***
                    ii.hidden = false
                    //*** check target every select ***
                    let item_data = ii.getAttribute('data-org')
                    //*** set hidden items ***
                    if (value && value !== 'all' && value !== item_data && !ii.classList.contains('hidden')) {
                        ii.hidden = true
                    }
                }
            })
        }
    }
});
