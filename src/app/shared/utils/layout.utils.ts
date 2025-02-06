export class LayoutUtils {
    
    static switch_theme_rules(isDarkMode: boolean) {
        const body = document.body;
        if (isDarkMode) {
          body.classList.remove('light-theme');
          body.classList.add('dark-theme');
        } else {
          body.classList.remove('dark-theme');
          body.classList.add('light-theme');
        }
      }
}