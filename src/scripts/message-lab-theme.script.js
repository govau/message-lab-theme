(function($, Drupal) {
  Drupal.behaviors.messageLabThemeNavigation = {
    // Controls the main navigation.
    attach: function (context, settings) {

      // Set up required variables.
      var showNavToggleAtWidth = 751;
      var currentWindowState;

      // Add the resize function to the window.
      $(window, context).resize(function () {
        if(compareAgainstWindowState()) showHideMenu();
      });

      // Add the click handler to the navigation toggle button.
      $('.nav-toggle', context).click(function() {
        slideToggle();
      });

      function checkWindowSize() {
        // This function returns 'true' if the width of the window is below or equal
        // to showNavToggleAtWidth. It returns false if it is not.
        return $(window).width() <= showNavToggleAtWidth ? true : false;
      }

      function setInitialWindowState() {
        // Initialise currentWindowState based on the initial size of the window.
        // This will set the state to 'true' if it loads on a narrow screen,
        // and 'false' if it loads on a wide screen. It then calls showHideMenu
        // to set the opening state of the menu.
        if (typeof currentWindowState === 'undefined') {
          currentWindowState = checkWindowSize();
        }
        showHideMenu();
      }

      function compareAgainstWindowState() {
        // Check whether the size has flicked below the threshold. Returns 'false'
        // if there has been no change, 'true' if there has.
        if (checkWindowSize() === currentWindowState) {
          return false;
        } else {
          currentWindowState = checkWindowSize();
          return true;
        }
      }

      function showHideMenu() {
        currentWindowState ? $('.nav-toggle', context).next('nav').hide() : $('.nav-toggle', context).next('nav').show();
      }

      function slideToggle() {
        $('.nav-toggle').next('nav').slideToggle(function() {
          toggleAria();
        });
      }

      function toggleAria() {
        // Toggles the aria-expanded attribute.
        $('.nav-toggle').attr('aria-expanded', function(_, attr) { return !(attr == 'true') }); // Toggle the aria-expanded attribute.
      }

      // Set the current window state.
      setInitialWindowState();
    }
  }
})(jQuery, Drupal);
