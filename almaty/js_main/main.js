let location_ala = document.querySelector('.location')
location_ala.innerHTML = `<div class="location">
                            <div class="location-container">
                                <div class="text-box">
                                    <i class="location-dropdown fa fa-map-marker-alt fa-contacts"></i>
                                    <div class="location-name">Алматы</div>
                                </div>
                                <div class="options">
                                    <a class="location-almaty">
                                        <div>
                                            Алматы
                                        </div>
                                    </a>
                                    <a class="location-nursultan">
                                        <div>
                                            Нур-Султан
                                        </div>
                                    </a>
                                    <a class="location-shymkent">
                                        <div>
                                            Шымкент
                                        </div>
                                    </a>
                                </div>
                            </div>
                        </div>`


let dropdown_ala = document.querySelector(".location-container")

let loc_ala = document.querySelector('.location-name')

let loc_options_ala = dropdown.querySelector('.options')

if (dropdown_ala != null) {

    dropdown_ala.addEventListener('click', function() {

        dropdown_ala.classList.toggle("active")

        loc_options_ala.onclick = e => {
            loc_ala.innerHTML = e.target.innerText
            console.log(e.target.innerText);

        }

        document.querySelector('.location-background').classList.toggle('active')
        document.querySelector('.location-background').addEventListener('click', function() {
            document.querySelector('.location-background').classList.remove("active")
            dropdown_ala.classList.remove("active")
        })
    })

}

// ___________________________________Страница не меняется при смене ссылок__________________________________________________



let location_almaty1 = document.querySelector('.location-almaty')
let location_nursultan1 = document.querySelector('.location-nursultan')
let location_shymkent1 = document.querySelector('.location-shymkent')

if (location_almaty1 != null || location_nursultan1 != null || location_shymkent1 != null) {

    $(".location-almaty").click(function() {
        const link_array_ala = [window.location.href.split('/')[0].split('#')[0].split('?')[0], "/icegroup.kz", "almaty", window.location.href.split('/').pop()]
        location_almaty1.setAttribute("href", link_array_ala.join('/'))
    });
    $(".location-nursultan").click(function() {
        const link_array_nur = [window.location.href.split('/')[0].split('#')[0].split('?')[0], "/icegroup.kz", "nursultan", window.location.href.split('/').pop()]
        location_nursultan1.setAttribute("href", link_array_nur.join('/'))
    });
    $(".location-shymkent").click(function() {
        const link_array_shym = [window.location.href.split('/')[0].split('#')[0].split('?')[0], "/icegroup.kz", "shymkent", window.location.href.split('/').pop()]
        location_shymkent1.setAttribute("href", link_array_shym.join('/'))
    });

}


// ________________________________Изменить номер телефона и адресс на футере при смене города__________________________________________



let footer_block2 = document.querySelector('.footer-block2');
footer_block2.classList.add("footer-block2-notmain");

footer_block2.innerHTML = `
                                <div class="foot-one wrappers ">
                                    <div class="foot-one-left ">
                                        <i class="fa fa-map-marker fa-contacts " aria-hidden="true "></i>
                                    </div>
                                    <div class="foot-one-right ">
                                        <div class="row footer-address-grid-right ">
                                            <div class="footer-city-ala ">
                                                <div class="footer-city-ala-child ">
                                                    <p class="almaty_astana ">г. Алматы</p>
                                                    <p><a class="almaty_info almaty_info_address" href="almaty.html ">ул. Мынбаева 43 (уг.ул. Манаса), 050008</a>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="foot-two wrappers">
                                    <div class="foot-one-left">
                                        <i class="fa fa-phone fa-contacts " style="margin-top:6px " aria-hidden="true "></i>
                                    </div>
                                    <div class="foot-one-right ">
                                        <div class="row footer-address-grid-right ">
                                            <div class="footer-city-ala ">
                                                <p style="margin-bottom: 5px; "><a href="tel:87273449900">8 (727) 344-99-00</a></p>
                                                <p><a href="tel:87019447700">+7 (701) 944 77 00</a></p>
                                            </div>
                                            <!-- <div class="footer-city-asa ">
                                                <p style="margin-bottom: 5px; "><a href="tel:87012667700">8 (701) 266-77-00</a></p>
                                                <p><a href="tel:87015112200 ">+7 (701) 511-22-00</a></p>
                                            </div> -->
                                        </div>
                                    </div>
                                </div>

                                <div class="foot-three wrappers">
                                    <div class="foot-one-left">
                                        <i class="fa fa-envelope fa-contacts " aria-hidden="true "></i>
                                    </div>
                                    <div class="foot-one-right ">
                                        <div class="row footer-address-grid-right ">
                                            <div class="footer-city-ala ">
                                                <p><a href="mailto:almaty@idiamarket.kz">almaty@idiamarket.kz</a></p>
                                            </div>
                                            <!-- <div class="footer-city-asa ">
                                                <p><a href="mailto:astana@idiamarket.kz ">astana@idiamarket.kz</a>
                                                </p>
                                            </div> -->
                                        </div>
                                    </div>
                                </div>
                            `



// ________________________________Изменить номер телефона и адресс на sidebar при смене города__________________________________________



let katalog_contacts_block = document.querySelectorAll('.katalog-contacts-block');

for (let i = 1; i < katalog_contacts_block.length; i++) {

    katalog_contacts_block[i].remove();
}



// ________________________________________Убрать данные лишних городов из футера (выпадающие окны на мобилке)___________________________________________________

let block__item__nur = document.querySelector(".block__item__nur").classList.add("block__item__displaynone")
let block__item__shym = document.querySelector(".block__item__shym").classList.add("block__item__displaynone")


// ________________________________________Изменение номера в header___________________________________________________

let header_phones = document.querySelector(".header_phones")
header_phones.classList.add("header_phones_notmain")
if (header_phones != null) {
    header_phones.innerHTML = `<div class="grid_3">
                                    <span class="telefon telefon-almata telefon-notmain">
                                        <a href="tel:87273449900">
                                        <span class="header_tel_num_initial_1"> 8(727) </span> <span class="zhir">344 99 00</span>
                                        </a>
                                    </span>
                                </div>
                                <div class="grid_3">
                                    <span class="telefon telefon-astana telefon-notmain">
                                        <a href="tel:87012667700">
                                            <span class="header_tel_num_initial_2"> 8(701) </span> <span class="zhir">266 77 00</span>
                                        </a>
                                    </span>
                                </div>
                                `
}


// ________________________________________Изменение отступы табличка город в header___________________________________________________\

let container123 = document.querySelector(".container123")
if (container123 != null) {
    container123.classList.add("container123_notmain")
}