/*
1. doboz:
Kattintásra adjunk hozzá egy "blur" nevű class attribútumot, majd újabb kattintásra vegyük
le róla azt.
*/
let isBlurred = false;
const element1 = document.getElementById('element-one');
element1.addEventListener("click", () => {
  if (!isBlurred) {
    element1.classList.add('blur');
  } else {
    element1.classList.remove('blur');
  }
  isBlurred = !isBlurred;
})


/*
2. doboz:
Ha az egérrel fölé megyünk változzon meg a háttérszíne pirosra, ha levesszük róla az egeret
változzon vissza az eredeti színére.
*/
const element2 = document.getElementById('element-two');
element2.addEventListener("mouseover", () => {
  element2.style.backgroundColor = 'red';
})
element2.addEventListener("mouseout", () => {
  element2.style.backgroundColor = '';
})


/*
3. doboz:
Dupla kattintással sorsoljon egy számot 1 és 20 között és módosítsa a kapott számmal a doboz tartalmát.
*/
const element3 = document.getElementById('element-three');
element3.addEventListener("dblclick", () => {
  const randomNumber = Math.floor(Math.random() * (20));
  element3.firstElementChild.innerHTML = randomNumber;
})

/*
4. doboz:
Kattintásra tűnjön el, majd egy 1 másodperces várakozás után ismét jelenjen meg.
*/
const element4 = document.getElementById('element-four');
element4.addEventListener("click", () => {
  element4.classList.add('hidden');
  setTimeout(function () {
    element4.classList.remove('hidden')
  }, 1000);

})
/*
5. doboz:
Kattintásra alakítsa kör alakúra az összes dobozt.
*/
const element5 = document.getElementById('element-five');
element5.addEventListener("click", () => {
  const isCurved = false;
  const allElements = document.getElementsByClassName('shape');
  for (const Element of allElements) {
    Element.style.borderRadius = '50%';
    setTimeout(function () {
      Element.style.borderRadius = '0'
    }, 1000);
  }
})

/*
6. doboz:
Form submit eseményre módosítsuk a doboz tartalmát az input mezőbe írt értékkel
*/
const element6 = document.getElementById('box-6');
element6.addEventListener("submit", (event) => {
  event.preventDefault();
  let element6Text = event.target.elements.boxNumber;
  document.getElementById('element-six').firstElementChild.innerHTML = element6Text.value;

})

/*
7. doboz:
Keypress eseményre írjuk be a dobozba az adott karaktert, amit leütöttek
*/
const element7 = document.getElementById('box7-input');
element7.addEventListener("keypress", (event) => {
  document.getElementById('element-seven').firstElementChild.innerHTML = event.key;

})

/*
8. doboz:
Egérmozdítás eseményre írjuk be az egér pozíciójának x és y koordinátáját,
a következő séma szerint: "X: {x-koordináta}, Y: {y-koordináta}"
*/
const element8 = document.getElementById('element-eight');
document.addEventListener("mousemove", (event) => {
  document.getElementById('element-eight').firstElementChild.innerHTML = 'x: ' + event.x + "<br>" +'y: ' + event.y;

})

/*
9. doboz:
Submit eseményre módosítsuk a doboz tartalmát azzal az értékkel ami úgy áll elő,
hogy végrehajtjuk a select inputban kiválasztott operációt,
a state-en és number inputba beírt értéken.

Az előállt végeredményt tároljuk el új state-ként!

Pl:
  Number input mezőbe írt érték: 5
  Select inputban kiválasztott érték: "mult"
  Aktuális state: 9

  Operáció: 9 * 5

  Dobozba és state-be beírandó érték: 45
*/
const element9 = document.getElementById('element-nine');
let actNumber = Number(element9.firstElementChild.textContent);

document.getElementById('box-9').onsubmit = function (event){
  event.preventDefault();
  const operand = Number(event.target.elements.operand.value);
  const operator = event.target.elements.operator.value;

  switch (operator) {
    case "mult":
      actNumber *= operand;
      break;
    case "div":
      actNumber /= operand;
      break;
    case "add":
      actNumber += operand;
      break;
    case "sub":
      actNumber -= operand;
      break;
  }
  document.getElementById('element-nine').firstElementChild.innerHTML = actNumber;

}
