document.addEventListener("DOMContentLoaded", async function () {
  // Define sections to load dynamically
  const sections = [
    "header",
    "hero-section",
    "stats-section",
    "why-choose-us",
    "services",
    "testimonials",
    "Contact",
    "faq",
    "universities",
    "footer"
  ];

  // Function to load section content
  async function loadSections() {
    try {
      const loadPromises = sections.map(section =>
        fetch(`components/${section}.html`)
          .then(response => {
            if (!response.ok) {
              throw new Error(`Failed to load ${section}.html: ${response.status}`);
            }
            return response.text();
          })
          .then(data => {
            const element = document.getElementById(section);
            if (element) {
              element.innerHTML = data;
            } else {
              console.warn(`Element with ID "${section}" not found in DOM`);
            }
          })
          .catch(error => {
            console.error(`Error loading ${section}:`, error);
            document.getElementById(section).innerHTML = `<p>Error loading ${section} content.</p>`;
          })
      );
      await Promise.all(loadPromises);
    } catch (error) {
      console.error("Failed to load sections:", error);
    }
  }

  // Load all sections first
  await loadSections();

  // Mobile Menu Functionality
  const mobileMenuIcon = document.querySelector(".mobile-menu-icon");
  const mobileMenu = document.querySelector(".mobile-menu");

  if (mobileMenuIcon && mobileMenu) {
    mobileMenuIcon.addEventListener("click", function (e) {
      e.stopPropagation();
      mobileMenu.classList.toggle("active");
      mobileMenuIcon.setAttribute(
        "aria-expanded",
        mobileMenu.classList.contains("active") ? "true" : "false"
      );
    });

    document.addEventListener("click", function (e) {
      if (
        !mobileMenu.contains(e.target) &&
        !mobileMenuIcon.contains(e.target) &&
        mobileMenu.classList.contains("active")
      ) {
        mobileMenu.classList.remove("active");
        mobileMenuIcon.setAttribute("aria-expanded", "false");
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 768 && mobileMenu.classList.contains("active")) {
        mobileMenu.classList.remove("active");
        mobileMenuIcon.setAttribute("aria-expanded", "false");
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && mobileMenu.classList.contains("active")) {
        mobileMenu.classList.remove("active");
        mobileMenuIcon.setAttribute("aria-expanded", "false");
        mobileMenuIcon.focus();
      }
    });
  } else {
    console.warn("Mobile menu elements not found");
  }

  // Stats Counter Functionality
  const statNumbers = document.querySelectorAll(".stat-number");
  if (statNumbers.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const stat = entry.target;
            const targetNumber = parseInt(stat.getAttribute("data-number")) || 0;
            let currentNumber = 0;
            const increment = Math.ceil(targetNumber / 50) || 1;

            const counter = setInterval(() => {
              currentNumber += increment;
              if (currentNumber >= targetNumber) {
                currentNumber = targetNumber;
                clearInterval(counter);
              }
              stat.textContent = currentNumber + (stat.textContent.includes("+") ? "+" : stat.textContent.includes("K") ? "K" : "");
            }, 50);

            observer.unobserve(stat);
          }
        });
      },
      { threshold: 0.5 }
    );

    statNumbers.forEach((stat) => observer.observe(stat));
  } else {
    console.warn("No stat-number elements found");
  }

  // FAQ Accordion Functionality
  const faqQuestions = document.querySelectorAll(".faq-question");
  if (faqQuestions.length > 0) {
    faqQuestions.forEach((question) => {
      question.addEventListener("click", () => {
        const answer = question.nextElementSibling;
        const isExpanded = question.classList.contains("expanded");

        document.querySelectorAll(".faq-question").forEach((q) => {
          if (q !== question) {
            q.classList.remove("expanded");
            q.setAttribute("aria-expanded", "false");
            q.nextElementSibling.classList.remove("visible");
          }
        });

        if (isExpanded) {
          question.classList.remove("expanded");
          question.setAttribute("aria-expanded", "false");
          answer.classList.remove("visible");
        } else {
          question.classList.add("expanded");
          question.setAttribute("aria-expanded", "true");
          answer.classList.add("visible");
        }
      });
    });
  } else {
    console.warn("No faq-question elements found");
  }
});