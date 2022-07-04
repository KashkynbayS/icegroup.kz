const data2 = [{
    link: "scanner_6600B.php",
    img: "themes/images/products/b5_1.jpg",
    title: "Беспроводной сканер штрих кода 6600 B"
}, {
    link: "scanner_6600B.php",
    img: "themes/images/products/b5_1.jpg",
    title: "Беспроводной сканер штрих кода 6600 B"
}, {
    link: "scanner_6600B.php",
    img: "themes/images/products/b5_1.jpg",
    title: "Беспроводной сканер штрих кода 6600 B"
}, ]

const cards2 = document.querySelector('.sm-cards');


// console.log(data2.length);

for (let i = 0; i < data2.length; i++) {
    let card = document.createElement('li');
    card.classList.add("sm-card");
    card.innerHTML = `
        <a href="${data2[i].link}">
            <div class="sm-card-inner">
                <div class="sm-card-inner-wrap">
                    <div class="sm-card-img ">
                        <img src="${data2[i].img}" alt="${data2[i].title}">
                    </div>
                    <div class="sm-card-title">

                        <p>    ${data2[i].title}</p>
                    </div>
                </div>
            </div>
        </a>`;
    cards2.appendChild(card);
}