$(function() {
    $('a[href*="#"]').on('click', function(e) {
        e.preventDefault();
        $('html, body').animate({ scrollTop: $($(this).attr('href')).offset().top - 40 }, 600, 'linear');
    });
});

// $('a[href*="#"]').on('click', function(e) {
//     if (this.hash !== '') {
//         e.preventDefault();

//         const hash = this.hash;

//         $('html, body').animate({ scrollTop: $(hash).offset().top }, 500);
//     }
// });

// const scroll = new SmoothScroll('a[href*="#"]', {
//     speed: 800
// });
// https://jsfiddle.net/phgsmn8k/