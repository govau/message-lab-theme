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
  }
  Drupal.behaviors.messageLabThemeResize = {
    // Resize function.
    attach: function (context, settings) {

      // Check that the correct context exists.
      if ($(context).find('.nav-toggle').length) {
        console.log($(this));
        // Set the toggle width.
        var showNavToggleAtWidth = 768;

        // Check the width of the window when Drupal loads.
        $(window).width() < showNavToggleAtWidth ? showNavToggle = true : showNavToggle = false;
        classToggle(showNavToggle);

        // Check the width of the window when it is resized.
        $(window).resize(function() {
          if($(this).width() >= showNavToggleAtWidth) {
            showNavToggle = false;
          } else {
            showNavToggle = true;
          }
          classToggle(showNavToggle);
        });
        function classToggle(toggle) {
          console.log(toggle);
          if (toggle) {
            $(context).find('.nav-toggle').addClass('active');
          } else {
            $(context).find('.nav-toggle').removeClass('active');
          }
        }
      };
    }
  }
})(jQuery, Drupal);
