/* LocalStorage Management & Seeding Module */

const STORAGE_KEYS = {
  THEME: 'campushub-theme',
  NOTES: 'campushub-notes',
  EVENTS: 'campushub-events',
  LOST_FOUND: 'campushub-lostfound',
  MARKETPLACE: 'campushub-marketplace',
  COMPLAINTS: 'campushub-complaints',
  NOTICES: 'campushub-notices',
  BOOKMARKS: 'campushub-bookmarks',
  FAVORITES: 'campushub-favorites'
};

// Seed Mock Data
const MOCK_DATA = {
  [STORAGE_KEYS.NOTICES]: [
    {
      id: 'n1',
      title: 'End Semester Examination Schedule Out',
      category: 'academic',
      content: 'The end-semester exam schedule for all branches has been released. Exams start on August 10, 2026. Please check your student portal for detailed seat plans and instructions.',
      date: '2026-07-13',
      important: true
    },
    {
      id: 'n2',
      title: 'Google Placement & Internship Drive',
      category: 'placement',
      content: 'Google Software Engineering Placement & Internship Drive is scheduled for August 1, 2026. Eligible branches: CSE, ECE, EEE. Registrations close on July 20, 2026. Apply via the training cell portal.',
      date: '2026-07-12',
      important: true
    },
    {
      id: 'n3',
      title: 'Monsoon Break Announcement',
      category: 'holiday',
      content: 'The university will remain closed from July 25 to July 28, 2026, due to the heavy monsoon forecast. Hostel residents are requested to plan accordingly. Online classes will run on regular schedule on Monday.',
      date: '2026-07-10',
      important: false
    },
    {
      id: 'n4',
      title: 'Annual Technical Fest: TechPulse 2026',
      category: 'events',
      content: 'TechPulse 2026 registrations are now open. Events include Hackathons, Robot Wars, Paper Presentations, and Coding Duels. Total cash prize pool worth ₹1,00,000. Scan the QR code in the department lobby to register.',
      date: '2026-07-09',
      important: false
    },
    {
      id: 'n5',
      title: 'Supplementary Exam Registration',
      category: 'exams',
      content: 'Registrations for even-semester supplementary exams are open until July 18, 2026. Students must pay the fees (₹1,000 per course) at the finance department before filing the form online.',
      date: '2026-07-08',
      important: false
    }
  ],
  [STORAGE_KEYS.EVENTS]: [
    {
      id: 'e1',
      title: 'HackOverFlow 4.0 - 36Hr Hackathon',
      category: 'hackathons',
      description: 'The ultimate university hackathon. Join 500+ developers, designers, and innovators to solve critical real-world challenges. Free food, mentor sessions, and massive prizes.',
      date: '2026-08-15T09:00:00',
      location: 'Main Auditorium',
      organizer: 'Computer Science Department',
      featured: true,
      image: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=1200&q=80&auto=format&fit=crop'
    },
    {
      id: 'e2',
      title: 'AI in Medicine & Health Science Seminar',
      category: 'seminars',
      description: 'Explore the boundaries of machine learning applied to clinical diagnostics and bioinformatics with Dr. Sarah Jenkins from MIT AI Lab.',
      date: '2026-07-28T14:30:00',
      location: 'Seminar Hall 3',
      organizer: 'BioTech Club',
      featured: false,
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&q=80&auto=format&fit=crop'
    },
    {
      id: 'e3',
      title: 'Resume Crafting & Interview Prep Workshop',
      category: 'workshops',
      description: 'Learn top strategies to build resume profiles that pass ATS systems and learn techniques for behavioral interview questions with HR leaders.',
      date: '2026-07-20T10:00:00',
      location: 'Placement Cell Hall A',
      organizer: 'Training & Placement Cell',
      featured: false,
      image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&q=80&auto=format&fit=crop'
    },
    {
      id: 'e4',
      title: 'Inter-College Football Championship',
      category: 'sports',
      description: 'Cheer for Campus Knights as they face City Giants in the annual soccer league. Snacks and drinks will be served at the stands.',
      date: '2026-07-25T16:00:00',
      location: 'University Sports Ground',
      organizer: 'Sports Committee',
      featured: false,
      image: '../images/event_football.png'
    },
    {
      id: 'e5',
      title: 'Microsoft Placement Drive',
      category: 'placement',
      description: 'On-campus recruitment drive for Software Development Engineer (SDE-1) profiles. Pre-placement talk will start in the main hall.',
      date: '2026-08-05T09:30:00',
      location: 'Convocation Center',
      organizer: 'T&P Department',
      featured: false,
      image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1200&q=80&auto=format&fit=crop'
    }
  ],
  [STORAGE_KEYS.NOTES]: [
    {
      id: 'no1',
      subject: 'Design & Analysis of Algorithms',
      code: 'CS-402',
      semester: '4th Semester',
      department: 'Computer Science',
      description: 'Complete lecture notes covering asymptotic notations, divide and conquer, greedy algorithms, dynamic programming, and graph traversals. Includes solved examples.',
      author: 'Prof. Richard Knight',
      downloads: 412,
      bookmarkCount: 23,
      size: '4.2 MB'
    },
    {
      id: 'no2',
      subject: 'Database Management Systems',
      code: 'CS-403',
      semester: '4th Semester',
      department: 'Computer Science',
      description: 'Detailed study of Entity-Relationship diagrams, Normalization (1NF, 2NF, 3NF, BCNF), Relational Algebra, SQL queries, and transaction management concurrency control.',
      author: 'Dr. Emily Watson',
      downloads: 328,
      bookmarkCount: 15,
      size: '3.8 MB'
    },
    {
      id: 'no3',
      subject: 'Analog & Digital Communications',
      code: 'EC-501',
      semester: '5th Semester',
      department: 'Electronics',
      description: 'Covers AM, FM, Phase modulation, digital encoding schemes, PCM, delta modulation, noise metrics, and hardware blocks. Includes laboratory experiment logs.',
      author: 'Prof. David Miller',
      downloads: 198,
      bookmarkCount: 8,
      size: '6.1 MB'
    },
    {
      id: 'no4',
      subject: 'Mechanical Vibration & Dynamics',
      code: 'ME-602',
      semester: '6th Semester',
      department: 'Mechanical',
      description: 'Complex math formulations for free and forced vibration of single and multi-degree systems, dampening effects, and rotor dynamics equations.',
      author: 'Dr. Robert Chen',
      downloads: 112,
      bookmarkCount: 4,
      size: '5.4 MB'
    },
    {
      id: 'no5',
      subject: 'Environmental Engineering & Tech',
      code: 'CE-301',
      semester: '3rd Semester',
      department: 'Civil',
      description: 'Basics of water treatment plants, waste management systems, noise pollution thresholds, and local sustainability laws. Exam revision summary.',
      author: 'Prof. Clara Oswald',
      downloads: 245,
      bookmarkCount: 19,
      size: '2.1 MB'
    }
  ],
  [STORAGE_KEYS.LOST_FOUND]: [
    {
      id: 'lf1',
      type: 'lost',
      name: 'iPhone 13 (Midnight Blue)',
      category: 'Electronics',
      description: 'Lost iPhone 13 with a black Spigen bumper cover. Left it on the desk in Library Hall B near the window. Please contact me if found.',
      location: 'Central Library Hall B',
      contact: '9876543210',
      date: '2026-07-14',
      image: '../images/lost_iphone.png'
    },
    {
      id: 'lf2',
      type: 'found',
      name: 'House Keys with Leather Tag',
      category: 'Accessories',
      description: 'Found a bunch of keys (approx 3 keys) attached to a brown leather key holder stating "Ride Free". Handed over to the campus security desk.',
      location: 'Cafeteria Outer Seating',
      contact: '9988776655',
      date: '2026-07-13',
      image: '../images/found_keys.png'
    },
    {
      id: 'lf3',
      type: 'lost',
      name: 'Black Leather Wallet',
      category: 'Accessories',
      description: 'Lost my wallet containing student ID, driver license, and minor cash. If someone finds it, please hand it to the admin desk or contact me directly.',
      location: 'Basketball Court area',
      contact: '9898989898',
      date: '2026-07-12',
      image: '../images/lost_wallet.png'
    }
  ],
  [STORAGE_KEYS.MARKETPLACE]: [
    {
      id: 'm1',
      name: 'Dell 24-inch SE2422H Monitor',
      price: 20000,
      category: 'Electronics',
      description: 'Perfect working condition 1080p 75Hz monitor. Comes with HDMI cable and power cord. Selling because I am upgrading to a dual-setup. Price negotiable.',
      contact: '9000110022',
      date: '2026-07-14',
      image: '../images/market_monitor.png',
      seller: 'Alex Carter'
    },
    {
      id: 'm2',
      name: 'Casio fx-991EX Scientific Calculator',
      price: 800,
      category: 'Academic Kits',
      description: 'Original ClassWiz scientific calculator, ideal for calculus and engineering courses. Dual power solar/battery. Has minor scratches on back, buttons work perfectly.',
      contact: '9888998899',
      date: '2026-07-13',
      image: '../images/market_calculator.png',
      seller: 'Maria Diaz'
    },
    {
      id: 'm3',
      name: 'Drafting/Engineering Drawing Board',
      price: 500,
      category: 'Academic Kits',
      description: 'Standard wooden drawing board size A1 with clips and draft ruler accessory. Used only for one semester in first-year engineering drawing.',
      contact: '9777665544',
      date: '2026-07-11',
      image: '../images/market_drawing_board.png',
      seller: 'Johnathan Doe'
    },
    {
      id: 'm4',
      name: 'Introduction to Algorithms (CLRS Book)',
      price: 800,
      category: 'Books',
      description: 'Third edition, hardcover. Excellent shape. Minimal pencil highlights on graph algorithms chapters. Essential reading for coding interviews!',
      contact: '9666554433',
      date: '2026-07-10',
      image: '../images/market_clrs_book.png',
      seller: 'Sarah Connor'
    }
  ],
  [STORAGE_KEYS.COMPLAINTS]: [
    {
      id: 'c1',
      title: 'Hostel Block C Wi-Fi Frequent Disconnections',
      category: 'hostel',
      description: 'The Wi-Fi router on the 3rd floor of Block C repeatedly resets every 10-15 minutes, making it impossible to attend online lab sessions or download course material. Please repair or replace the router.',
      status: 'pending',
      date: '2026-07-14',
      trackingId: 'CH-COMP-1928'
    },
    {
      id: 'c2',
      title: 'Water Cooler Filters in Block D library',
      category: 'infrastructure',
      description: 'The water cooler adjacent to the reading room has a red filter replacement warning light flashing for the last two weeks. The water has a metallic smell. Kindly clean and replace filter.',
      status: 'resolved',
      date: '2026-07-10',
      trackingId: 'CH-COMP-1743'
    }
  ]
};

const StorageManager = {
  init: function () {
    // Seed initial data if they don't exist
    for (const [key, value] of Object.entries(MOCK_DATA)) {
      if (!localStorage.getItem(key)) {
        localStorage.setItem(key, JSON.stringify(value));
      } else {
        // Migration: Update existing seeded items to use the new local images
        try {
          const list = JSON.parse(localStorage.getItem(key));
          let updated = false;
          if (key === STORAGE_KEYS.LOST_FOUND) {
            list.forEach(item => {
              if (item.id === 'lf1' && (item.image.includes('unsplash.com') || item.image.startsWith('../images/'))) {
                item.image = '../images/lost_iphone.png';
                updated = true;
              } else if (item.id === 'lf2' && (item.image.includes('unsplash.com') || item.image.startsWith('../images/'))) {
                item.image = '../images/found_keys.png';
                updated = true;
              } else if (item.id === 'lf3' && (item.image.includes('unsplash.com') || item.image.startsWith('../images/'))) {
                item.image = '../images/lost_wallet.png';
                updated = true;
              }
            });
          } else if (key === STORAGE_KEYS.EVENTS) {
            list.forEach(event => {
              if (event.id === 'e4' && (event.image.includes('unsplash.com') || event.image.startsWith('../images/'))) {
                event.image = '../images/event_football.png';
                updated = true;
              }
            });
          } else if (key === STORAGE_KEYS.MARKETPLACE) {
            list.forEach(item => {
              if (item.id === 'm1') {
                item.image = '../images/market_monitor.png';
                item.price = 20000;
                updated = true;
              } else if (item.id === 'm2') {
                item.image = '../images/market_calculator.png';
                item.price = 800;
                updated = true;
              } else if (item.id === 'm3') {
                item.image = '../images/market_drawing_board.png';
                item.price = 500;
                updated = true;
              } else if (item.id === 'm4') {
                item.image = '../images/market_clrs_book.png';
                item.price = 800;
                updated = true;
              }
            });
          }
          if (updated) {
            localStorage.setItem(key, JSON.stringify(list));
          }
        } catch (e) {
          console.error(`Migration error for key ${key}`, e);
        }
      }
    }
    // Set up arrays for Bookmarks/Favorites if not existing
    if (!localStorage.getItem(STORAGE_KEYS.BOOKMARKS)) {
      localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.FAVORITES)) {
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify([]));
    }
  },

  get: function (key) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error(`Error reading key ${key} from LocalStorage`, e);
      return [];
    }
  },

  set: function (key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error(`Error saving key ${key} to LocalStorage`, e);
      return false;
    }
  },

  add: function (key, item) {
    const list = this.get(key);
    const newItem = { id: Date.now().toString(), ...item };
    list.unshift(newItem); // Add new item at beginning
    this.set(key, list);
    return newItem;
  },

  update: function (key, id, updatedFields) {
    const list = this.get(key);
    const idx = list.findIndex(item => item.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...updatedFields };
      this.set(key, list);
      return list[idx];
    }
    return null;
  },

  delete: function (key, id) {
    let list = this.get(key);
    list = list.filter(item => item.id !== id);
    this.set(key, list);
    return true;
  },

  // Bookmark / Favorite helpers
  toggleBookmark: function (noteId) {
    let list = this.get(STORAGE_KEYS.BOOKMARKS);
    const idx = list.indexOf(noteId);
    let added = false;
    if (idx === -1) {
      list.push(noteId);
      added = true;
    } else {
      list.splice(idx, 1);
    }
    this.set(STORAGE_KEYS.BOOKMARKS, list);
    return added;
  },

  isBookmarked: function (noteId) {
    const list = this.get(STORAGE_KEYS.BOOKMARKS);
    return list.includes(noteId);
  },

  toggleFavorite: function (itemId) {
    let list = this.get(STORAGE_KEYS.FAVORITES);
    const idx = list.indexOf(itemId);
    let added = false;
    if (idx === -1) {
      list.push(itemId);
      added = true;
    } else {
      list.splice(idx, 1);
    }
    this.set(STORAGE_KEYS.FAVORITES, list);
    return added;
  },

  isFavorite: function (itemId) {
    const list = this.get(STORAGE_KEYS.FAVORITES);
    return list.includes(itemId);
  }
};

// Initialize immediately upon script evaluation
StorageManager.init();
window.StorageManager = StorageManager;
window.STORAGE_KEYS = STORAGE_KEYS;
