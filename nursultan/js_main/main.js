let location_ala = document.querySelector('.location')
location_ala.innerHTML = `<div class="location">
                            <div class="location-container">
                                <div class="text-box">
                                    <i class="location-dropdown fa fa-map-marker-alt fa-contacts"></i>
                                    <div class="location-name">Нур-Султан</div>
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


let dropdown2 = document.querySelector(".location-container")

let loc2 = document.querySelector('.location-name')

let loc_options2 = dropdown2.querySelector('.options')

if (dropdown2 != null) {

    dropdown2.addEventListener('click', function() {

        dropdown2.classList.toggle("active")

        loc_options2.onclick = e => {
            loc2.innerHTML = e.target.innerText
            console.log(e.target.innerText);

        }

        document.querySelector('.location-background').classList.toggle('active')
        document.querySelector('.location-background').addEventListener('click', function() {
            document.querySelector('.location-background').classList.remove("active")
            dropdown2.classList.remove("active")
        })
    })

}

// ___________________________________Страница не меняется при смене ссылок__________________________________________________




let location_almaty2 = document.querySelector('.location-almaty')
let location_nursultan2 = document.querySelector('.location-nursultan')
let location_shymkent2 = document.querySelector('.location-shymkent')

if (location_almaty2 != null || location_nursultan2 != null || location_shymkent2 != null) {

    $(".location-almaty").click(function() {
        const link_array_ala = [window.location.href.split('/')[0].split('#')[0].split('?')[0], "/icegroup.kz", "almaty", window.location.href.split('/').pop()]
        location_almaty2.setAttribute("href", link_array_ala.join('/'))
    });
    $(".location-nursultan").click(function() {
        const link_array_nur = [window.location.href.split('/')[0].split('#')[0].split('?')[0], "/icegroup.kz", "nursultan", window.location.href.split('/').pop()]
        location_nursultan2.setAttribute("href", link_array_nur.join('/'))
    });
    $(".location-shymkent").click(function() {
        const link_array_shym = [window.location.href.split('/')[0].split('#')[0].split('?')[0], "/icegroup.kz", "shymkent", window.location.href.split('/').pop()]
        location_shymkent2.setAttribute("href", link_array_shym.join('/'))
    });

}



// ___________________________________Изменить номер телефона на шапке при смене города__________________________________________________


let header_tel_num_initial_1 = document.querySelector('.header_tel_num_initial_1')
let header_tel_num_initial_2 = document.querySelector('.header_tel_num_initial_2')

let zhir_1 = document.querySelector('.telefon-almata .zhir')
let zhir_2 = document.querySelector('.telefon-astana .zhir')

if (header_tel_num_initial_1 != null) {

    header_tel_num_initial_1.innerHTML = `8(7172)`
    header_tel_num_initial_2.innerHTML = `8(701)`

    zhir_1.innerHTML = `27 99 00`
    zhir_2.innerHTML = `511 22 00`
}


// ________________________________Изменить номер телефона и адресс на футере при смене города__________________________________________



let footer_block2 = document.querySelector('.footer-block2')
footer_block2.classList.add("footer-block2-notmain")

footer_block2.innerHTML = `
                                <div class="foot-one wrappers ">
                                    <div class="foot-one-left ">
                                        <i class="fa fa-map-marker fa-contacts " aria-hidden="true "></i>
                                    </div>
                                    <div class="foot-one-right ">
                                        <div class="row footer-address-grid-right ">
                                            <div class="footer-city-ala ">
                                                <div class="footer-city-ala-child ">
                                                    <p class="almaty_astana ">г. Нур-Султан</p>
                                                    <p><a class="almaty_info almaty_info_address" href="astana.html ">ул. Бейсекбаева 24/1, 2-этаж бизнес центр DARA.</a>
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
                                                <p style="margin-bottom: 5px; "><a href="tel:87172279900">8 (7172) 27-99-00</a></p>
                                                <p><a href="tel:87015112200">+7 (701) 511-22-00</a></p>
                                            </div>
                                            <!-- <div class="footer-city-asa ">
                                                <p style="margin-bottom: 5px; "><a href="tel:87172279900 ">8 (7172) 27-99-00</a></p>
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
                                                <p><a href="mailto:astana@idiamarket.kz">astana@idiamarket.kz</a></p>
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


let katalog_contacts_block = document.querySelector('.katalog-contacts-block')
if (katalog_contacts_block != null) {
    katalog_contacts_block.innerHTML = `<div class="contacts-block-left">
                                            <i class="fa fa-map-marker-alt fa-contacts" style="font-size: 25px; padding-top: 3px" aria-hidden="true"></i><br>
                                            
                                        </div>
                                        <div class="contacts-block-right">
                                            <div class="contacts-block-right-city">
                                                <p style="cursor: default;">
                                                    <a href="astana.html"><b>г. Нур-Султан:</b></a>
                                            </div>
                                            <div class="contacts-block-right-address">
                                                <a href="astana.html">ул. Бейсекбаева 24/1, <br> 2-этаж мебельный <br> центр DARA</a>
                                            </div>
                                            <div class="contacts-block-right-email">
                                                <a href="mailto:astana@idiamarket.kz">astana@idiamarket.kz</a>
                                            </div>
                                            <div>
                                                <a href="tel:87172279900">8 (7172) 27-99-00</a>
                                            </div>
                                            <div class="contacts-block-right-telephone">
                                                <a href="tel:87015112200">+7 (701) 511-22-00</a>
                                            </div>
                                        </div>`
}


// ________________________________________Убрать данные лишних городов из футера (выпадающие окны на мобилке)___________________________________________________

let block__item__ala = document.querySelector(".block__item__ala").classList.add("block__item__displaynone")
let block__item__shym = document.querySelector(".block__item__shym").classList.add("block__item__displaynone")



// ________________________________________Изменение номера в header___________________________________________________

let header_phones = document.querySelector(".header_phones")
header_phones.classList.add("header_phones_notmain")
if (header_phones != null) {
    header_phones.innerHTML = `<div class="grid_3">
                                    <span class="telefon telefon-almata telefon-notmain">
                                        <a href="tel:87172279900">
                                        <span class="header_tel_num_initial_1"> 8(7172) </span> <span class="zhir">27 99 00</span>
                                        </a>
                                    </span>
                                </div>
                                <div class="grid_3">
                                    <span class="telefon telefon-astana telefon-notmain">
                                        <a href="tel:87015112200">
                                            <span class="header_tel_num_initial_2"> 8(701) </span> <span class="zhir">511 22 00</span>
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