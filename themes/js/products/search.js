const searchedItems = document.getElementById("searched-items")




function displayList(array) {
    array.map((a) => {
        var formatter = function(priceSum) {
            let mn = 0;
            let price = priceSum.toString()
            for (let ij = price.length; ij > 0; ij--) {
                if (mn % 3 == 0) {
                    price = [price.slice(0, ij), " ", price.slice(ij)].join('');
                }
                mn++;
            }
            return price;
        }

        let item = document.createElement('div');
        item.classList.add("d__card");

        //         item.innerHTML = `
        //         <div class="thumbnail">
        //             <a href="${a.link}">
        //                 <img src="${a.img}" >
        //                 <div class="caption">
        //                     <h5>${a.title}</h2>
        //                 </div>
        //                 <div class="search-price-container"><span class="search-price">от ${formatter(a.price)} тг</span></div>
        //             </a>
        //         </div>
        // `;
        item.innerHTML = `
                <a class="search-container-tag" href="${a.link}" style="height: 100%; width: 100%;">
                <div class="search-img">
                    <div class="search-img-transition">
                        <div class="btn-5" id="view_details">

                        </div>
                    </div>
                    <img src="${a.img}" >
                </div>
                <div class="search-content">
                    <h2 class="search-heading">${a.title}</h2>
                </div>
                <div class="search-price-container">
                
                    <button id="fly" class="fly viewBlock_product_card add_item" data-id="${a.code}" data-title="<a href='${a.link}'>${a.title}</a>" data-price="${a.price}" data-quantity="1" data-img="${a.img}">
                                    
                        <div class="product-item__basket_button" title="Добавить в корзину">
                            <img class="item__basket_button_img" src="/themes/images/cart-icon-png-orange.png">
                            <span>
                                В корзину 
                            </span>
                        </div>
                        
                    </button>
                
                    <span class="search-price">от ${formatter(a.price)} ₸</span>
                </div>
            </a>
        `;
        searchedItems.appendChild(item);

    })



    // _____________________Card Notification__________________________
    $("#fly, .fly").click(function() {
        toastr.options = {
            "closeButton": true,
            "debug": false,
            "newestOnTop": true,
            "progressBar": true,
            "positionClass": "toast-top-right",
            "preventDuplicates": false,
            "onclick": null,
            "showDuration": "300",
            "hideDuration": "1000",
            "timeOut": "5000",
            "extendedTimeOut": "1000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        }

        const galochka = document.createElement('div');
        galochka.innerHTML = `<img src="/themes/images/galochka.png" alt="galochka">`

        let btn_fly = document.querySelector('#fly')
        let product_notif = this.getAttribute('data-id')


        // toastr["info"](`<img class='galochka' src='/themes/images/galochka.png' alt='galochka'> Товар <p class="product_notif"> ${product_notif} </p> добавлен в корзину`);
        toastr["info"](`<div class="notification_container">
                                        <div class="notification_ikon">
                                            <img class='galochka' src='/themes/images/galochka.png' alt='galochka'>
                                        </div>
                                        <div class="notification_message">
                                            <div class="notification_message_1">
                                                Товар 
                                                <p class="product_notif"> ${product_notif} </p>
                                            </div>
                                            добавлен в корзину
                                        </div>
                                    </div>`);
    });
    // _______________________________________________________________

}

let searchArray = JSON.parse(localStorage.getItem("searched-cards") || "[]");
let searchedWord = JSON.parse(localStorage.getItem("searched-word"));

const sWord = document.getElementById("searched-word")
sWord.innerHTML = `${searchedWord}`

searchArray.sort(function(a, b) {
    let x = parseInt(a.price, 10);
    let y = parseInt(b.price, 10);

    // console.log(typeof y)
    return x - y;
})




displayList(searchArray)