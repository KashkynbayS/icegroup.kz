// var w_top = $(window).scrollTop(); // Количество пикселей на которое была прокручена страница
// var e_top = $(countbox).offset().top; // Расстояние от блока со счетчиками до верха всего документа
// var w_height = $(window).height(); // Высота окна браузера
// var d_height = $(document).height(); // Высота всего документа
// var e_height = $(countbox).outerHeight(); // Полная высота блока со счетчиками
// if (w_top + $(window).innerHeight() + 2000 >= e_top) {

var anchors = [];
var pointers = [];
var currentAnchor = -1;
var isAnimating = false;

$(function() {

    function updateAnchors() {
        anchors = [];
        $('.anchor').each(function(i, element) {
            anchors.push($(element).offset().top);
            // console.log($(element))
        });
        pointers = [];
        $('.tab').each(function(i, element) {
            pointers.push($(element));
            // console.log(pointers)
        });

    }

    $('body').on('mousewheel', function(e) {
        e.preventDefault();
        e.stopPropagation();
        if (isAnimating) {
            return false;
        }
        isAnimating = true;
        // Increase or reset current anchor
        if (e.originalEvent.wheelDelta >= 0) {
            currentAnchor--;
        } else {
            currentAnchor++;
        }
        if (currentAnchor > (anchors.length - 1) ||
            currentAnchor < 0) {
            currentAnchor = 0;
        }
        isAnimating = true;
        $('html, body').animate({
            scrollTop: parseInt(anchors[currentAnchor])
        }, 800, 'swing', function() {
            isAnimating = false;
        });
        // console.log(currentAnchor)
        // $(document).ready(function() {
        // $(".tab").click(function() {
        console.log('currentAnchor: ' + currentAnchor)

        var qwerty = currentAnchor + 1
        $('.tab').removeClass("active");
        $('a[id $= ' + qwerty + ']').addClass("active");

        // $(".tab").click(function() {
        //     currentAnchor = qwerty
        //     console.log('currentAnchor: ' + currentAnchor)
        // })

        // });
        // });
    });
    updateAnchors();

});