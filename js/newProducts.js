const data = [{
    link: "cryspi_octava_SN_1200.html",
    img: "themes/images/products/vitrina/octava/CRYSPI_Octava_SN_1200.jpg",
    title: "Витрина холодильная CRYSPI Octava SN 1200",
    description: "Холодильная низко-среднетемпературная витрина эконом-класса Octava SN разработана специально для оснащения магазинов с малой и средней площадью. Витрина Octava соединила в себе оптимальное соотношение полезного объема при минимальных габаритных размерах."
}, {
    link: "cryspi_octava_SN_1500.html",
    img: "themes/images/products/vitrina/octava/CRYSPI_Octava_SN_1500.jpg",
    title: "Витрина холодильная CRYSPI Octava SN 1500",
    description: "Холодильная витрина Cryspi Octava SN 1500 предназначена для демонстрации, охлаждения и кратковременного хранения скоропортящихся продуктов на предприятиях торговли и общественного питания."
}, {
    link: "cryspi_octava_SN_1800.html",
    img: "themes/images/products/vitrina/octava/CRYSPI_Octava_SN_1800.jpg",
    title: "Витрина холодильная CRYSPI Octava SN 1800",
    description: "Холодильная витрина Cryspi Octava SN 1800 предназначена для демонстрации, охлаждения и кратковременного хранения скоропортящихся продуктов на предприятиях торговли и общественного питания."
}, {
    link: "kp_gamma_1200.html",
    img: "themes/images/products/vitrina/gamma/CRYSPI_Gamma2_SN_1200.jpg",
    title: "Витрина холодильная CRYSPI Gamma2 SN 1200",
    description: "Витрина универсальная CRYSPI Gamma-2 SN 1200 — отличный выбор для магазинов «у дома» и мини-маркетов. Подходит для хранения и презентации широкого ассортимента продуктов: свежего мяса, рыбы, колбас и сыров, молочной продукции, полуфабрикатов."
}, {
    link: "kp_gamma_1500.html",
    img: "themes/images/products/vitrina/gamma/CRYSPI_Gamma2_SN_1500.jpg",
    title: "Витрина холодильная CRYSPI Gamma2 SN 1500",
    description: "Витрина универсальная CRYSPI Gamma-2 SN 1500 — современное холодильное оборудование с автоматической разморозкой и встроенным холодильным агрегатом. Работает с системой гравитационного охлаждения."
}, {
    link: "kp_gamma_1800.html",
    img: "themes/images/products/vitrina/gamma/CRYSPI_Gamma2_SN_1800.jpg",
    title: "Витрина холодильная CRYSPI Gamma2 SN 1800",
    description: "Витрина универсальная CRYSPI Gamma-2 SN 1800 — современное холодильное оборудование с автоматической разморозкой и встроенным холодильным агрегатом. Работает с системой гравитационного охлаждения."
}]

const cards = document.querySelector('.secondList');

if (cards != null) {



    for (let i = 0; i < data.length; i++) {
        let card = document.createElement('div');

        let line = document.createElement('div');
        line.innerHTML = `							
            <hr class="soft" />`;


        card.classList.add("tovar_height");
        card.innerHTML = `
            <a href="${data[i].link}">
                <div class="row">
                    <div class="span2" style="padding-top:40px">
                        <img src="${data[i].img}" alt="" />
                    </div>
                    <div class="span4">
                        <h3>${data[i].title}</h3>
                        <hr class="soft" />
                        <p>
                            ${data[i].description}
                        </p>
                        <a href="${data[i].link}" class="btn btn-large btn-primary"> Перейти</a>
                        <br class="clr" />
                    </div>
                </div>
            </a>`;

        cards.appendChild(line);
        cards.appendChild(card);
    }


    // let vid = document.createElement('div');
    // vid.innerHTML = `
    //     <br class="clr" /><br class="clr" />
    //     <div class="video"><iframe width="860" height="484" src="https://www.youtube.com/embed/XJkPLK61R_g?rel=0&autoplay=0"
    // 		frameborder="0" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
    // 		allowfullscreen></iframe></div>
    //     </div>`;
    // vid.classList.add("video");
    // cards.appendChild(vid);


    // let client = document.createElement('div');
    // client.innerHTML = `
    // <h4 style="color:#3badc2; margin-top:20px">Наши клиенты:</h4>
    // <div class="softt">
    // 	<hr class="soft">
    // </div>
    // <ul id="flexiselDemo3">
    // 	<li><img src="themes/images/logo/hel.webp" /></li>
    // 	<li><img src="themes/images/logo/tech.webp" /></li>
    // 	<li><img src="themes/images/logo/kul.webp" /></li>
    // 	<li><img src="themes/images/logo/naz.webp" /></li>
    // 	<li><img src="themes/images/logo/mechta.webp" style="margin-top: 30px;" /></li>
    // 	<li><img src="themes/images/logo/беккер.webp" /></li>
    // 	<li><img src="themes/images/logo/biskvit.webp" style="margin-top: 30px;" /></li>
    // 	<li><img src="themes/images/logo/JLC.webp" /></li>
    // 	<li><img src="themes/images/logo/kingfisher.webp" /></li>
    // 	<li><img src="themes/images/logo/sinooil.webp" /></li>
    // 	<li><img src="themes/images/logo/kdlolimp.webp" style="margin-top: 18px;" /></li>
    // 	<li><img src="themes/images/logo/ryadom2.jpg" style="margin-top: 18px;" /></li>
    // 	<li><img src="themes/images/logo/meg.webp" /></li>
    // 	<li><img src="themes/images/logo/magnum.webp" /></li>
    // 	<li><img src="themes/images/logo/meloman.webp" /></li>
    // 	<li><img src="themes/images/logo/for (2).webp" /></li>
    // 	<li><img src="themes/images/logo/arbuz.webp" style="margin-top: 30px;" /></li>
    // </ul>`;
    // cards.appendChild(client);

}

// -----------------------------------ToTop arrow---------------------------------------
$(function() {
    $(window).scroll(function() {
        if ($(this).scrollTop() != 0) {
            $('#toTop').fadeIn();
        } else {
            $('#toTop').fadeOut();
        }
    });
    $('#toTop').click(function() {
        $('body,html').animate({ scrollTop: 0 }, 800);
    });
});