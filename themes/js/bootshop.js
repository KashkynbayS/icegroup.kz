//Bootsshop-----------------------//
// $(document).ready(function () {
/* carousel of home page animation */
// 	$('#myCarousel').carousel({
// 		interval: 4000
// 	})
// 	$('#featured').carousel({
// 		interval: 4000
// 	})
// 	$(function () {
// 		$('#gallery a').lightBox();
// 	});

// 	$('.subMenu > a').click(function (e) {
// 		e.preventDefault();
// 		var subMenu = $(this).siblings('ul');
// 		var li = $(this).parents('li');
// 		var subMenus = $('#sidebar li.subMenu ul');
// 		var subMenus_parents = $('#sidebar li.subMenu');
// 		if (li.hasClass('open')) {
// 			if (($(window).width() > 768) || ($(window).width() < 479)) {
// 				subMenu.slideUp();
// 			} else {
// 				subMenu.fadeOut(250);
// 			}
// 			li.removeClass('open');
// 		} else {
// 			if (($(window).width() > 768) || ($(window).width() < 479)) {
// 				subMenus.slideUp();
// 				subMenu.slideDown();
// 			} else {
// 				subMenus.fadeOut(250);
// 				subMenu.fadeIn(250);
// 			}
// 			subMenus_parents.removeClass('open');
// 			li.addClass('open');
// 		}
// 	});
// 	var ul = $('#sidebar > ul');
// 	$('#sidebar > a').click(function (e) {
// 		e.preventDefault();
// 		var sidebar = $('#sidebar');
// 		if (sidebar.hasClass('open')) {
// 			sidebar.removeClass('open');
// 			ul.slideUp(250);
// 		} else {
// 			sidebar.addClass('open');
// 			ul.slideDown(250);
// 		}
// 	});

// });


// var nav = document.querySelector('nav');
// var navTexts = document.querySelectorAll('.navText');


// window.addEventListener('scroll', function() {
//     if (window.pageYOffset > 100) {
//         nav.classList.add('bg-light', 'shadow');

//         for (let i = 0; i < navTexts.length; i++) {
//             navTexts[i].classList.remove('text-white');
//             navTexts[i].classList.add('text-dark');
//         }
//     } else {
//         nav.classList.remove('bg-light', 'shadow');


//         for (let i = 0; i < navTexts.length; i++) {
//             navTexts[i].classList.add('text-white');
//         }
//     }
// });

// for (let i = 0; i < 6; i++) {
// 	if (window.pageYOffset > 100) {
// 		navText.classList.remove('text-white');
// 		navText.classList.add('text-dark');
// 	} else {
// 		navText.classList.add('text-white');
// 	}
// }


// var navOffset = $('#id-navbar').height(10);
// scrollBy(0, -navOffset);

// var offset = 80;

// $('.navbar li a').click(function(event) {
//     event.preventDefault();
//     $($(this).attr('scrollspy-product'))[0].scroll;
//     scrollBy(0, -offset);
// });



// $('.navigation a').on('click', function (event) {
// 	var target = jQuery(this);
// 	var element = target.attr('href');
// 	var navHeight = $("nav").height();

// 	jQuery('.navbar a').removeClass('active')
// 	target.addClass('active');

// 	jQuery("body, html").animate({
// 		scrollTop: jQuery(element).offset().top - navHeight
// 	}, 800);
// 	return false;

// });



// const alm = document.getElementById("btnAlmaty");
// const ast = document.getElementById("btnAstana");
// const cities = document.getElementById("cities");
// const alaDiv = document.getElementById("alaDiv");
// const asaDiv = document.getElementById("asaDiv");

// function changeMapAlm() {
// 	cities.innerHTML = `<iframe src="https://yandex.ru/map-widget/v1/?um=constructor%3A3b657f5a6698b6274ffeddfd41c9f64b6f55e5ac00b161ebef4718f7f2b0cd38&amp;source=constructor" width="100%" height="484" frameborder="0"></iframe>`;
// 	console.log("CLICK")
// }

// function changeMapAst() {
// 	cities.innerHTML = `<iframe src="https://yandex.ru/map-widget/v1/?um=constructor%3Aee87b2f03415ad840b0787074b9bc9cbe11b17f308b4499dfc30590d5d696770&amp;source=constructor" width="100%" height="484" frameborder="0"></iframe>`;
// 	console.log("CLICK--1")
// }

// alm.addEventListener('click', changeMapAlm)

// ast.addEventListener('click', changeMapAst)



// document.addEventListener("DOMContentLoaded", function() {
//     window.addEventListener('scroll', function() {
//         if (window.scrollY > 50) {
//             document.getElementById('navbar_top').classList.add('fixed-top');
//             // add padding top to show content behind navbar
//             navbar_height = document.querySelector('.navbar').offsetHeight;
//             document.body.style.paddingTop = navbar_height + 'px';
//         } else {
//             document.getElementById('navbar_top').classList.remove('fixed-top');
//             // remove padding top from body
//             document.body.style.paddingTop = '0';
//         }
//     });
// });








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



// ____________________________Blocks design_________________________________

const blockMain = document.getElementById('design-blocks')
const design_ul = document.getElementById('design-ul')

const block1 = document.getElementById('block-1')
const block2 = document.getElementById('block-2')
const block3 = document.getElementById('block-3')
const block4 = document.getElementById('block-4')
const block5 = document.getElementById('block-5')
const block6 = document.getElementById('block-6')

const design_li_1 = document.getElementById('design-li-1');
const design_li_2 = document.getElementById('design-li-2');
const design_li_3 = document.getElementById('design-li-3');
const design_li_4 = document.getElementById('design-li-4');
const design_li_5 = document.getElementById('design-li-5');
const design_li_6 = document.getElementById('design-li-6');

if (blockMain != null) {

    changeBlockGiper()

    function changeBlockGiper() {
        blockMain.innerHTML = block1.innerHTML;
        // blockMain.classList.add('design-category')
        // blockMain.classList.add('index-h5')
        removeActiveClass()
        design_ul.children[0].classList.add('active-design')

        // Сперва удаляем добавленные js файлы чтобы не записовал несколько раз
        document.body.children.remove;
        document.body.children.remove;

        // Добавляем js файлы
        includeJs("/js/jquery-album.js")
    }

    function changeBlockSuper() {
        blockMain.innerHTML = block2.innerHTML;
        // blockMain.classList.add('design-category')
        // blockMain.classList.add('index-h5')
        removeActiveClass()
        design_ul.children[1].classList.add('active-design')

        // Сперва удаляем добавленные js файлы чтобы не записовал несколько раз
        document.body.children.remove;
        document.body.children.remove;


        // Добавляем js файлы
        includeJs("/themes/js/design-newPhoto.js")

        includeJs("/js/jquery-album.js")

    }

    function changeBlockMini() {
        blockMain.innerHTML = block3.innerHTML;
        // blockMain.classList.add('design-category')
        // blockMain.classList.add('index-h5')
        removeActiveClass()
        design_ul.children[2].classList.add('active-design')

        // Сперва удаляем добавленные js файлы чтобы не записовал несколько раз
        document.body.children.remove;
        document.body.children.remove;

        // Добавляем js файлы
        includeJs("/js/jquery-album.js")

    }

    function changeBlockSklad() {
        blockMain.innerHTML = block4.innerHTML;
        // blockMain.classList.add('design-category')
        // blockMain.classList.add('index-h5')
        removeActiveClass()
        design_ul.children[3].classList.add('active-design')

        // Сперва удаляем добавленные js файлы чтобы не записовал несколько раз
        document.body.children.remove;
        document.body.children.remove;

        // Добавляем js файлы
        includeJs("/js/jquery-album.js")

    }

    function changeBlockRest() {
        blockMain.innerHTML = block5.innerHTML;
        // blockMain.classList.add('design-category')
        // blockMain.classList.add('index-h5')
        removeActiveClass()
        design_ul.children[4].classList.add('active-design')

        // Сперва удаляем добавленные js файлы чтобы не записовал несколько раз
        document.body.children.remove;
        document.body.children.remove;

        // Добавляем js файлы
        includeJs("/js/jquery-album.js")

    }

    function changeBlockKafe() {
        blockMain.innerHTML = block6.innerHTML;
        // blockMain.classList.add('design-category')
        // blockMain.classList.add('index-h5')
        removeActiveClass()
        design_ul.children[5].classList.add('active-design')

        // Сперва удаляем добавленные js файлы чтобы не записовал несколько раз
        document.body.children.remove;
        document.body.children.remove;

        // Добавляем js файлы
        includeJs("/js/jquery-album.js")

    }

    function removeActiveClass() {
        for (let index = 0; index < 6; index++) {
            design_ul.children[index].classList.remove("active-design")
        }
    }



    design_li_1.addEventListener('click', changeBlockGiper)
    design_li_2.addEventListener('click', changeBlockSuper)
    design_li_3.addEventListener('click', changeBlockMini)
    design_li_4.addEventListener('click', changeBlockSklad)
    design_li_5.addEventListener('click', changeBlockRest)
    design_li_6.addEventListener('click', changeBlockKafe)


}
// __________________________________________________________________________


function includeJs(jsFilePath) {
    var js = document.createElement("script");

    js.type = "text/javascript";
    js.src = jsFilePath;

    document.body.appendChild(js);
}


// ___________________________________Footer spoiler_________________________________________

$(document).ready(function() {
    $('.block__title').click(function(event) {
        if ($('.block').hasClass('one')) {
            $('.block__title').not($(this)).removeClass('active')
            $('.block__text').not($(this).next()).slideUp(300)
        }
        $(this).toggleClass('active').next().slideToggle(300)
    })
})



// ________________________header menu replace after header_________________________
var myDivElement = $("#header");

if ($('#header') != null) {
    $('#header').after($('#container__header__menu__id'));
}