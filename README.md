# Portfolio - Yashwanth K R

A modern portfolio website featuring responsive design, interactive elements, and professional aesthetics.

# Live Website Link :[yash2006kr.github.io/portfolio](https://yash2006kr.github.io/portfolio/)
---
## Features

### Design
- Modern glassmorphism design with backdrop blur effects
- Smooth, subtle animations
- Interactive particle background system
- Dark and light theme toggle with persistent storage
- Responsive layout optimized for all devices

### Interactive Elements
- Floating action buttons for quick access to themes and additional features
- Smooth scrolling navigation
- Scroll-based animations using the AOS library
- Active navigation highlighting
- Scroll-to-top functionality
- Preloader animation

### Sections
1. Hero Section - Introduction with animated code snippet
2. About Me - Personal background with statistics
3. Skills - Interactive skill cards with progress indicators
4. Projects - Project showcase with hover effects
5. Blog - Recent blog posts in card format
6. Contact - Contact information and social links
7. Resume Download - Direct access to resume PDF

### Technical Highlights
- Pure CSS animations without heavy libraries
- Canvas-based particle system for performance
- CSS variables for easy customization
- Modern JavaScript (ES6+) with clean code
- Accessibility features including ARIA labels and keyboard navigation
- Performance optimizations such as debounced scroll events

## Technologies Used

- HTML5 - Semantic markup
- CSS3 - Modern CSS with variables, gradients, and animations
- JavaScript (ES6+) - Interactive functionality
- AOS Library - Scroll animations
- Font Awesome - Icons
- Google Fonts - Inter and JetBrains Mono

## Getting Started

1. Open `index.html` in a modern web browser.
2. The portfolio will load with all animations and interactions.
3. Use the navigation menu to browse sections.
4. Toggle themes using the theme button.
5. Interact with the particle background by moving the mouse.

## File Structure

```
portfolio/
├── index.html      # Main HTML file
├── styles.css      # Styles and animations
├── script.js       # JavaScript functionality
└── README.md       # This file
```

## Customization

### Colors
Modify CSS variables in `styles.css`:
```css
:root {
  --accent-primary: #64ffda;
  --accent-secondary: #00d9ff;
  /* ... additional variables */
}
```

### Particle Count
Adjust in `script.js`:
```javascript
this.particleCount = 40; // Modify this value
```

### Animation Speed
Update AOS settings in `script.js`:
```javascript
AOS.init({
  duration: 1000, // Animation duration in milliseconds
  // ... additional options
});
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Notes

- Blog links reference the original `yashwanthkr` folder.
- Resume PDF is linked from the original folder.
- Favicon is sourced from the original folder.
- The portfolio is designed to integrate with the existing folder structure.

## Credits

- Design Inspiration - Modern portfolio design trends
- Particle System - Custom implementation
- Animations - AOS library and custom CSS
- Icons - Font Awesome
- Fonts - Google Fonts (Inter & JetBrains Mono)

## License

This portfolio is created for Yashwanth K R. All rights reserved.

