// Stub file for future scripts.

(function($, Drupal) {
  Drupal.behaviors.messageLabThemeNavigation = {
    // Opens and closes the main navigation.
    attach: function (context, settings) {
      $(context).find('.nav-toggle').each(function() {
        $(this).prop('aria-expanded', true); // Set default.
        $(this).on('click', function() {
          $(this).prop('aria-expanded', !$(this).prop('aria-expanded')); // Toggle the aria-expanded property.
          $(this).next('nav').slideToggle(); // Toggle the slide.
        });
      });
    }
  };
})(jQuery, Drupal);
