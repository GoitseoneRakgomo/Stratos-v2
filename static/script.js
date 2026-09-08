// =========================================
// PAGE LOADER & LOADING SCREEN
// =========================================
document.addEventListener('DOMContentLoaded', () => {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
        }, 500);
    }
});

// Fallback: Hide loading screen if page takes too long
window.addEventListener('load', () => {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.classList.add('hidden');
    }

    const pageLoader = document.getElementById("pageLoader");
    if (pageLoader) {
        pageLoader.classList.add("loader-hidden");
    }
});

// Force hide page loader fallback
setTimeout(() => {
    const pageLoader = document.getElementById("pageLoader");
    if (pageLoader && !pageLoader.classList.contains("loader-hidden")) {
        pageLoader.classList.add("loader-hidden");
    }
}, 4000);

// =========================================
// NAVIGATION DRAWER & DROPDOWN ACCORDION
// =========================================
document.addEventListener('DOMContentLoaded', () => {
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const primaryNav = document.getElementById('primaryNav');
    const dropdowns = document.querySelectorAll('.nav-dropdown');
    const mobileSearchBtn = document.getElementById('mobileSearchBtn');
    const mobileSearchInput = document.getElementById('mobileSearchInput');

    const setNavOpen = (isOpen) => {
        primaryNav?.classList.toggle('nav-open', isOpen);
        if (hamburgerBtn) {
            hamburgerBtn.setAttribute('aria-expanded', String(isOpen));
            hamburgerBtn.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Toggle navigation');
        }
    };

    // Toggle Mobile Navigation Drawer
    hamburgerBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const isOpen = !primaryNav?.classList.contains('nav-open');
        setNavOpen(Boolean(isOpen));
    });

    // Close drawer when clicking outside
    document.addEventListener('click', (e) => {
        if (!primaryNav || !primaryNav.classList.contains('nav-open')) return;
        if (!primaryNav.contains(e.target) && !hamburgerBtn?.contains(e.target)) {
            setNavOpen(false);
        }
    });

    // Dropdown handling for Desktop & Mobile
    dropdowns.forEach(dropdown => {
        const menu = dropdown.querySelector('.dropdown-menu');
        const triggerLink = dropdown.querySelector('a');

        // Desktop: Hover behaviors
        dropdown.addEventListener('mouseenter', () => {
            if (window.innerWidth > 1024) {
                menu?.classList.add('dropdown-active');
            }
        });

        dropdown.addEventListener('mouseleave', () => {
            if (window.innerWidth > 1024) {
                menu?.classList.remove('dropdown-active');
            }
        });

        // Mobile & Tablet: Toggle accordion on click
        triggerLink?.addEventListener('click', (e) => {
            if (window.innerWidth <= 1024) {
                e.preventDefault();
                e.stopPropagation();
                menu?.classList.toggle('dropdown-active');
            }
        });
    });

    // Mobile Search inside drawer
    mobileSearchBtn?.addEventListener('click', () => {
        const query = mobileSearchInput?.value.trim().toLowerCase();
        if (!query) return;

        const sections = document.querySelectorAll('section');
        const match = [...sections].find((section) =>
            section.textContent.toLowerCase().includes(query)
        );

        if (match) {
            setNavOpen(false);
            match.scrollIntoView({ behavior: 'smooth' });
        } else {
            window.alert('No matching content found.');
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 1024) {
            setNavOpen(false);
        }
    });
});

// =========================================
// SEARCH & CART ACTIONS
// =========================================
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section');
    const searchButton = document.querySelector('[aria-label="Search"]');
    const cartButton = document.querySelector('[aria-label="Cart"]');

    searchButton?.addEventListener('click', () => {
        const query = window.prompt('What would you like to find?');
        if (!query) return;
        const match = [...sections].find((section) =>
            section.textContent.toLowerCase().includes(query.toLowerCase())
        );
        if (match) match.scrollIntoView({ behavior: 'smooth' });
        else window.alert('No matching content found.');
    });

    cartButton?.addEventListener('click', () => {
        window.alert('Your engagement list is currently empty.');
    });
});
// =========================================
// INTERACTIVE CALENDAR & APPOINTMENT SYSTEM
// =========================================
document.addEventListener('DOMContentLoaded', () => {
    const calendarDays = document.getElementById('calendarDays');
    const currentMonthYear = document.getElementById('currentMonthYear');
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');
    const timeSlotsContainer = document.getElementById('timeSlots');
    const selectedDateInput = document.getElementById('selectedDateInput');
    const selectedTimeInput = document.getElementById('selectedTimeInput');

    if (!calendarDays) return; // Exit if not on appointments page

    let currentDate = new Date();
    let selectedDate = null;
    let selectedTime = null;

    const availableTimesWeekdays = ['09:00', '10:30', '14:00', '15:30'];
    const availableTimesFridays = ['09:00', '10:30'];

    function renderCalendar() {
        calendarDays.innerHTML = '';
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        if (currentMonthYear) {
            currentMonthYear.textContent = `${monthNames[month]} ${year}`;
        }

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Empty slots for alignment
        for (let i = 0; i < firstDay; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.classList.add('cal-day', 'empty');
            calendarDays.appendChild(emptyCell);
        }

        // Render days
        for (let day = 1; day <= daysInMonth; day++) {
            const dayCell = document.createElement('div');
            dayCell.classList.add('cal-day');
            dayCell.textContent = day;

            const cellDate = new Date(year, month, day);
            const dayOfWeek = cellDate.getDay();

            // Disable past dates, Saturdays (6), and Sundays (0)
            if (cellDate < today || dayOfWeek === 0 || dayOfWeek === 6) {
                dayCell.classList.add('disabled');
            } else {
                dayCell.addEventListener('click', () => selectDate(dayCell, cellDate));
            }

            if (selectedDate && cellDate.toDateString() === selectedDate.toDateString()) {
                dayCell.classList.add('selected');
            }

            calendarDays.appendChild(dayCell);
        }
    }

    function selectDate(element, date) {
        document.querySelectorAll('.cal-day').forEach(el => el.classList.remove('selected'));
        element.classList.add('selected');
        selectedDate = date;
        if (selectedDateInput) {
            selectedDateInput.value = date.toISOString().split('T')[0];
        }
        
        renderTimeSlots(date.getDay());
    }

    function renderTimeSlots(dayOfWeek) {
        if (!timeSlotsContainer) return;
        timeSlotsContainer.innerHTML = '';
        selectedTime = null;
        if (selectedTimeInput) {
            selectedTimeInput.value = '';
        }

        const slots = (dayOfWeek === 5) ? availableTimesFridays : availableTimesWeekdays;

        slots.forEach(time => {
            const slotBtn = document.createElement('div');
            slotBtn.classList.add('slot-btn');
            slotBtn.textContent = time + ' GST';
            slotBtn.addEventListener('click', () => {
                document.querySelectorAll('.slot-btn').forEach(b => b.classList.remove('selected'));
                slotBtn.classList.add('selected');
                selectedTime = time;
                if (selectedTimeInput) {
                    selectedTimeInput.value = time;
                }
            });
            timeSlotsContainer.appendChild(slotBtn);
        });
    }

    prevMonthBtn?.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });

    nextMonthBtn?.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });

    window.handleBooking = function(e) {
        e.preventDefault();
        if (!selectedDateInput?.value || !selectedTimeInput?.value) {
            alert('Please select both a date and an available time slot.');
            return;
        }
        alert(`Appointment requested for ${selectedDateInput.value} at ${selectedTimeInput.value} GST. An advisor will review and confirm shortly.`);
    };

    renderCalendar();
});