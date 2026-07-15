
# CampusHub
CampusHub is a responsive student resource portal built with HTML, CSS, and JavaScript, featuring Lost &amp; Found, Notes Sharing, Events, Marketplace, and Complaint Management.

# CampusHub 🎓

CampusHub is a premium, modern, and highly responsive centralized web portal designed for college students to coordinate course materials, campus circulars, local marketplaces, lost possessions, and grievance reports. 

Built using pure **HTML5**, **CSS3**, and **Vanilla JavaScript (ES6+)**, CampusHub adheres to mobile-first responsive grid design principles and delivers a beautiful, fluid glassmorphic UI.

---

## 🚀 Key Features

*   **Central Dashboard**: View real-time statistics, sliding notice boards, recent marketplace listings, and upcoming campus events.
*   **Academic Notes Library**: Browse, search, filter (by department & semester), sort, bookmark, and download lecture notes.
*   **Interactive Campus Events**: Register reminders and track countdowns for seminars, hackathons, and placement drives.
*   **Lost & Found System**: Slide-out drawer system to report lost/found items with local storage updates and owner contact alerts.
*   **Student Marketplace**: List textbooks, drafting boards, and electronics with search filters, sorting, favorites, and a simulated live chat drawer with sellers.
*   **Grievance Complaint Portal**: Track grievances on an interactive visual timeline and change progress status (Pending, Under Review, Resolved).
*   **Notice Board**: Expanding notices with search and categorized tabs.
*   **Premium Common Utilities**: Sticky headers, dynamic top scroll progress bars, custom CSS ripple-effect buttons, Intersection Observer scroll animations, global toasts, skeleton loading blocks, and full dark-theme persistence.

---

## 📁 Folder Structure

```text
CampusHub/
├── index.html               # Welcome Splash Screen
├── README.md                # Documentation Guide
├── pages/
│   ├── home.html            # Main Student Dashboard
│   ├── notes.html           # Notes Library View
│   ├── events.html          # Seminars & hackathons schedule
│   ├── lost-found.html      # Lost & Found listings
│   ├── marketplace.html     # Marketplace trades
│   ├── complaints.html      # Grievance registration & timeline
│   ├── notice-board.html    # Notice Board Accordions
│   └── 404.html             # Error Page fallback
├── css/
│   ├── variables.css        # Theme variables (colors, typography)
│   ├── style.css            # Base stylesheet & layouts
│   ├── components.css       # Cards, Buttons, Toasts, Modals
│   ├── animations.css       # Keyframes & scroll reveals
│   └── responsive.css       # Breakpoint media queries
└── js/
    ├── theme.js             # Theme persist and early-check
    ├── storage.js           # LocalStorage wrapper & seeding
    ├── ui.js                # Hamburger toggles, toasts, ripples
    ├── search.js            # Sorting & filtering array helpers
    ├── validation.js        # Phone/Email/Required input checkers
    ├── app.js               # Dashboard stats & previews driver
    ├── notes.js             # Notes actions & download mockers
    ├── events.js            # Countdown clock & reminder schedulers
    ├── lostfound.js         # Lost & found form drawer & contact alerts
    └── marketplace.js       # Marketplace favorites & chat dialogues
```

---

## 🛠️ Technologies Used

*   **Structure**: Semantic HTML5 tags.
*   **Styling**: Pure CSS3, CSS Custom Variables, CSS Flexbox, and CSS Grid. No external frameworks (Tailwind, Bootstrap).
*   **Logic**: ES6+ JavaScript modules, DOM Manipulation APIs, and Web Storage (`localStorage`).
*   **Animations**: CSS Transitions, Keyframe Animations, and the Web `IntersectionObserver` API.
*   **Aesthetics**: Glassmorphism (`backdrop-filter`), Outfit & Inter Google Fonts.

---

## 🏃 How to Run the Project

1.  Clone the directory structure or open the project folder in your IDE.
2.  Open `index.html` at the root folder in any modern browser (Chrome, Safari, Edge, Firefox) to view the welcome splash page.
3.  Alternatively, start a local development server using:
    ```bash
    # If using Python
    python -m http.server 8000
    
    # If using Node.js / npm
    npm install -g serve
    serve .
    ```
4.  Navigate to `http://localhost:8000` (or the port specified by your dev server).

---

## 🧪 Future Scope

*   **Backend Integration**: Connect API wrappers to an Express/Node.js or Spring Boot database.
*   **Real-time WebSockets**: Implement true real-time chat between buyers and sellers.
*   **Push Notifications**: Dispatch real-time system tray alarms for calendar deadlines.

