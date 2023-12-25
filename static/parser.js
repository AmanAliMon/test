function addStatement(rule){
    rulesFile+= rule
}
function parser(keyline) {
    const keys = keyline.split("%")
    let desicions = []
    let address = keys[0]
    let ruleset = keys[1]
    let rules = JSON.parse(ruleset)
    console.log(rules);
    console.log(address);
    return [rules, address]
}
function addressParse(desicions) {
    console.log("desicin");
    console.log(desicions);
    desicions.forEach(desicion => {
        addStatement(`${desicion[1]}%${JSON.stringify(desicion[0])}\r\n`)
        let elements = document.getElementById("cells").getElementsByClassName("cells__input")
        Array.from(elements).forEach(elem => {
            let addre = [elem.getAttribute('data-col'), elem.getAttribute('data-row')]
            let addrs = desicion[1].split("")
            let bool0 = (addrs[0] == addre[0]) || (addrs[0] == '*')
            let bool1 = (addrs[1] == addre[1]) || (addrs[1] == '*')
            if (bool1 && bool0) {
                applyStyles(elem, desicion[0])
            }
        });
    });
}


function mainParser(conten) {
    console.log(conten);
    const content = conten.replace(/(&#34;)/g, '"')
    console.log(content);
    var desicions = []
    let x = content.split('\n')
    for (const line of x) {
        desicions.push(parser(line))
    }
    console.log(desicions);
    addressParse(desicions)
}


function applyStyles(elem, styles) {
    for (const prop in styles) {
        if (styles.hasOwnProperty(prop)) {
            elem.style[prop] = styles[prop];
        }
    }
}


function jcssparse(elem, format = `value`) {
    console.log("change");
    let value = elem.value
    addressParse([[JSON.parse(`{"${elem.getAttribute("data-action")}":"${eval(format)}"}`), document.getElementById("addrBar").innerText]])
}

function $ID(x) {
    return document.getElementById(x)
}

function rule(x) {
    addressParse([[JSON.parse(x), document.getElementById('addrBar').innerText]])
}

function saveFile(){
    console.log(rulesFile);
}