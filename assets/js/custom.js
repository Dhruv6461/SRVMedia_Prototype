$('#cat-1').owlCarousel({
    items:6,
    loop:true,
    margin:20,
    nav:false,
    dots:false,
    autoplay: true,
    autoplayTimeout: 2500,
    autoplaySpeed: 1200,
    autoplayHoverPause: true,
    smartSpeed: 1200,
    slideTransition: 'linear',
    rtl:false,
    touchDrag: true,
    mouseDrag: true,
    responsive:{
        0:{ items:2 },
        600:{ items:3 },
        1000:{ items:6 }
    }
});

$('#cat-2').owlCarousel({
    items:6,
    loop:true,
    margin:20,
    nav:false,
    dots:false,
    autoplay: true,
    autoplayTimeout: 2500,
    autoplaySpeed: 1200,
    autoplayHoverPause: true,
    smartSpeed: 1200,
    slideTransition: 'linear',
    rtl:true,
    touchDrag: true,
    mouseDrag: true,
    responsive:{
        0:{ items:2 },
        600:{ items:3 },
        1000:{ items:6 }
    }
});

$('#cat-1, #cat-2').on('mouseenter focusin', function () {
    $(this).trigger('stop.owl.autoplay');
}).on('mouseleave focusout', function () {
    $(this).trigger('play.owl.autoplay', [1000]);
});

$('.carousel-toggle').on('click', function () {
    var $btn = $(this);
    var $carousel = $($btn.data('target'));
    var isPaused = $btn.attr('aria-pressed') === 'true';

    if (isPaused) {
        $carousel.trigger('play.owl.autoplay', [1000]);
        $btn.attr('aria-pressed', 'false')
            .text('Pause carousel')
            .attr('aria-label', 'Pause carousel');
    } else {
        $carousel.trigger('stop.owl.autoplay');
        $btn.attr('aria-pressed', 'true')
            .text('Resume carousel')
            .attr('aria-label', 'Resume carousel');
    }
});

$('#cat-1, #cat-2, #cat-3, #cat-5').attr('tabindex', 0).on('keydown', function (e) {
    if (e.key === 'ArrowRight' || e.key === 'Right') {
        e.preventDefault();
        $(this).trigger('next.owl.carousel');
    }
    if (e.key === 'ArrowLeft' || e.key === 'Left') {
        e.preventDefault();
        $(this).trigger('prev.owl.carousel');
    }
});

$('.banner-slide img').attr('alt', '').attr('aria-hidden', 'true');
$('.schoolLogo img').attr('alt', 'Participating school logo');

$('#cat-3').owlCarousel({
    items:3,
    loop:true,
    margin:20,
    nav:true,
    dots:true,
    autoplay: true,
    autoplayTimeout: 4500,
    autoplayHoverPause: true,
    smartSpeed: 700,
    touchDrag: true,
    mouseDrag: true,
    pullDrag: true,
    navText: ['<span aria-label="Previous slide">&#x2039;</span>', '<span aria-label="Next slide">&#x203A;</span>'],
    responsive:{
        0:{ items:1 },
        600:{ items:2 },
        1000:{ items:3 }
    }
});

$('#cat-4').owlCarousel({
    items:4,
    loop:false,
    margin:20,
    nav:false,
    dots:false,
    autoplay: true,
    responsive:{
        0:{ items:1, nav:true },
        600:{ items:2, nav:true },
        1000:{ items:4 }
    }
});

$('#cat-5').owlCarousel({
    items:4,
    loop:true,
    margin:20,
    nav:false,
    dots:true,
    autoplay: false,
    touchDrag: true,
    mouseDrag: true,
    pullDrag: true,
    responsive:{
        0:{ items:1 },
        600:{ items:1 },
        768:{ items:2 },
        992:{ items:4 }
    }
});

// Equalize heights for exhibition cards inside #cat-3 so content doesn't get cut
function equalizeExhibitionHeights() {
    var $cards = $('#cat-3 .exhibitionInner');
    if (!$cards.length) return;
    $cards.css('height', 'auto');
    var max = 0;
    $cards.each(function () {
        var h = $(this).outerHeight();
        if (h > max) max = h;
    });
    if (max > 0) {
        $cards.css('height', max + 'px');
    }
}

// Debounced resize handler
var _resizeTimer;
$(window).on('load resize', function () {
    clearTimeout(_resizeTimer);
    _resizeTimer = setTimeout(equalizeExhibitionHeights, 150);
});

// Re-run after owl refresh or images load inside the carousel
$('#cat-3').on('refreshed.owl.carousel changed.owl.carousel initialized.owl.carousel', function () {
    setTimeout(equalizeExhibitionHeights, 150);
});
$('#cat-3').find('img').on('load', function () { setTimeout(equalizeExhibitionHeights, 50); });

// Initial run
$(document).ready(function () { setTimeout(equalizeExhibitionHeights, 200); });

// Hero slider accessibility: keyboard, live region updates, autoplay pause/resume
(function () {
    var $slider = $('#hero-slider');
    if (!$slider.length) return;
    var $track = $slider.find('.hero-slider__track');
    var $slides = $track.find('.hero-slide');
    var total = $slides.length;
    var idx = 0;
    var interval = 5000;
    var timer = null;
    var prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function updateAttributes() {
        $slides.each(function (i) {
            var $s = $(this);
            $s.attr('role', 'group');
            $s.attr('aria-roledescription', 'slide');
            $s.attr('aria-label', 'Slide ' + (i + 1) + ' of ' + total);
        });
    }

    function show(index) {
        idx = ((index % total) + total) % total;
        var translate = -idx * 100;
        $track.css('transform', 'translateX(' + translate + '%)');
        $slides.attr('aria-hidden', 'true').attr('tabindex', -1);
        $slides.eq(idx).attr('aria-hidden', 'false').attr('tabindex', 0);
        $slider.find('.hero-slider__status').text('Slide ' + (idx + 1) + ' of ' + total);
    }

    function next() { show(idx + 1); }
    function prev() { show(idx - 1); }

    function start() { if (!prefersReduced && !timer) timer = setInterval(next, interval); }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }

    // Initialize
    updateAttributes();
    show(0);
    start();

    // Controls
    $slider.find('.hero-slider__button--next').on('click', function (e) { e.preventDefault(); next(); });
    $slider.find('.hero-slider__button--prev').on('click', function (e) { e.preventDefault(); prev(); });

    var $pauseBtn = $slider.find('.hero-slider__button--pause');
    if ($pauseBtn.length) {
        $pauseBtn.attr('aria-pressed', 'false');
        $pauseBtn.on('click', function () {
            var isPaused = $(this).attr('aria-pressed') === 'true';
            if (isPaused) {
                start();
                $(this).attr('aria-pressed', 'false').attr('aria-label', 'Pause hero autoplay').text('Pause');
            } else {
                stop();
                $(this).attr('aria-pressed', 'true').attr('aria-label', 'Resume hero autoplay').text('Resume');
            }
        });
    }

    // Keyboard navigation when slider has focus
    $slider.on('keydown', function (e) {
        var k = e.key || e.keyIdentifier;
        if (k === 'ArrowRight' || k === 'Right') { e.preventDefault(); next(); }
        if (k === 'ArrowLeft' || k === 'Left') { e.preventDefault(); prev(); }
        if (k === ' ' || k === 'Spacebar') { e.preventDefault(); $pauseBtn.trigger('click'); }
    });

    // Pause autoplay on hover/focus for accessibility
    $slider.on('mouseenter focusin', function () { stop(); });
    $slider.on('mouseleave focusout', function () { if ($pauseBtn.attr('aria-pressed') !== 'true') start(); });
})();

// Accessibility enhancements for all Owl carousels: pause on focus, live status, reduced-motion handling
(function () {
    var carousels = ['#cat-1', '#cat-2', '#cat-3', '#cat-5'];
    var prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    carousels.forEach(function (sel) {
        var $c = $(sel);
        if (!$c.length) return;

        // ensure carousel is focusable
        if (!$c.attr('tabindex')) $c.attr('tabindex', 0);

        // add a screen-reader status region
        var $status = $('<div class="visually-hidden carousel-status" aria-live="polite"></div>');
        $c.after($status);

        // pause on focus and resume on blur (if not reduced-motion)
        $c.on('focusin', function () { $c.trigger('stop.owl.autoplay'); });
        $c.on('focusout', function () { if (!prefersReduced) $c.trigger('play.owl.autoplay', [1000]); });

        // update status and aria-hidden attributes when slide changes
        $c.on('initialized.owl.carousel changed.owl.carousel refreshed.owl.carousel', function (event) {
            try {
                var info = event.item || (event.originalEvent && event.originalEvent.item) || {};
                var total = info.count || $c.find('.owl-item:not(.cloned)').length;
                // find first active non-cloned item
                var $active = $c.find('.owl-item.active').not('.cloned').first();
                var realIndex = $active.length ? $active.index() - $c.find('.owl-item.cloned').first().index() : 0;
                if (realIndex < 0) realIndex = 0;
                // fallback if we cannot compute index
                var displayIndex = ($active.length ? $c.find('.owl-item').index($active) : 0) + 1;
                if (displayIndex > total) displayIndex = ((displayIndex - 1) % total) + 1;
                $status.text('Slide ' + (displayIndex) + ' of ' + total);

                // mark visible/invisible for assistive tech
                $c.find('.owl-item').each(function () {
                    var $it = $(this);
                    $it.attr('aria-hidden', !$it.hasClass('active'));
                    // ensure focusable state
                    $it.attr('tabindex', $it.hasClass('active') ? 0 : -1);
                });
            } catch (e) {
                // guard against unexpected event shapes
            }
        });

        // stop autoplay entirely when user prefers reduced motion
        if (prefersReduced) {
            $c.trigger('stop.owl.autoplay');
        }
    });
})();

function validateFormField($field, validator, message) {
    var $error = $field.siblings('.field-error');
    if ($error.length) { $error.remove(); }
    if (!validator($field.val().trim())) {
        $field.after('<div class="field-error" style="color:#ff4d4d;font-size:0.9rem;margin-top:6px;">' + message + '</div>');
        return false;
    }
    return true;
}

$('.enquire-form').on('submit', function (event) {
    var $form = $(this);
    var validName = validateFormField($form.find('[name="parent_name"]'), function (value) {
        return /^[A-Za-z ]{2,}$/.test(value);
    }, 'Please enter a valid parent name.');
    var validPhone = validateFormField($form.find('[name="phone"]'), function (value) {
        return /^[0-9]{10}$/.test(value);
    }, 'Please enter a 10 digit phone number.');
    var validGrade = validateFormField($form.find('[name="grade"]'), function (value) {
        return value.length >= 2;
    }, 'Please tell us which grade you are looking for.');

    if (!validName || !validPhone || !validGrade) {
        event.preventDefault();
        return false;
    }
});

$('.enquire-form input, .enquire-form textarea').on('input', function () {
    $(this).siblings('.field-error').remove();
});

