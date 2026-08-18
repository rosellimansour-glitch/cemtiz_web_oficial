const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const navLinks = document.querySelectorAll(".site-nav a");
const activeNavLinks = document.querySelectorAll(".site-nav a, .header-contact");
const navClose = document.querySelector("[data-nav-close]");
const navOverlay = document.querySelector("[data-nav-overlay]");
const year = document.querySelector("[data-year]");
const filterButtons = document.querySelectorAll("[data-filter]");
const projectCards = document.querySelectorAll("[data-project-card]");
const projectCarousel = document.querySelector("[data-project-carousel]");
const projectViewport = document.querySelector("[data-project-viewport]");
const projectTrack = document.querySelector("[data-project-track]");
const projectPrevButton = document.querySelector("[data-project-prev]");
const projectNextButton = document.querySelector("[data-project-next]");
const projectDetailToggles = document.querySelectorAll(".project-detail-toggle");
const projectVideos = document.querySelectorAll(".project-card__video");
const serviceToggles = document.querySelectorAll(".service-toggle");
const forms = document.querySelectorAll("[data-validate-form]");
const headerScrollThreshold = 90;
const heroVideo = document.querySelector("[data-hero-video]");
const projectVideoMediaQuery = window.matchMedia("(max-width: 767px)");
let projectCarouselIndex = 0;
let projectCarouselTimer;

if (year) {
  year.textContent = new Date().getFullYear();
}

if (header) {
  const updateHeaderState = () => {
    header.classList.toggle("is-scrolled", window.scrollY > headerScrollThreshold);
  };

  updateHeaderState();
  window.addEventListener("scroll", updateHeaderState, { passive: true });
}

if (header && navToggle && nav) {
  const openMenu = () => {
    header.classList.add("nav-open");
    nav.classList.add("is-open");
    document.body.classList.add("menu-open");
    navToggle.setAttribute("aria-expanded", "true");
    nav.setAttribute("aria-hidden", "false");

    if (navOverlay) {
      navOverlay.hidden = false;
      requestAnimationFrame(() => navOverlay.classList.add("is-visible"));
    }

    navClose?.focus({ preventScroll: true });
  };

  const closeMenu = () => {
    header.classList.remove("nav-open");
    nav.classList.remove("is-open");
    document.body.classList.remove("menu-open");
    navToggle.setAttribute("aria-expanded", "false");
    nav.setAttribute("aria-hidden", "true");

    if (navOverlay) {
      navOverlay.classList.remove("is-visible");
      window.setTimeout(() => {
        if (!header.classList.contains("nav-open")) {
          navOverlay.hidden = true;
        }
      }, 420);
    }
  };

  navToggle.addEventListener("click", () => {
    if (header.classList.contains("nav-open")) {
      closeMenu();
      return;
    }

    openMenu();
  });

  navClose?.addEventListener("click", () => {
    closeMenu();
    navToggle.focus({ preventScroll: true });
  });

  navOverlay?.addEventListener("click", closeMenu);

  navLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || !header.classList.contains("nav-open")) {
      return;
    }

    closeMenu();
    navToggle.focus({ preventScroll: true });
  });
}

document.querySelectorAll("img[data-fallback]").forEach((image) => {
  image.addEventListener(
    "error",
    () => {
      const placeholder = document.createElement("div");
      placeholder.className = "image-placeholder";
      placeholder.textContent = image.dataset.fallback || "Imagen en preparación";
      image.replaceWith(placeholder);
    },
    { once: true }
  );
});

if (heroVideo) {
  heroVideo.addEventListener(
    "error",
    () => {
      heroVideo.closest(".hero")?.classList.add("video-fallback");
    },
    true
  );
}

const sections = [...document.querySelectorAll("main section[id]")];

if ("IntersectionObserver" in window && sections.length > 0) {
  const activeSectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        activeNavLinks.forEach((link) => {
          link.classList.toggle(
            "is-active",
            link.getAttribute("href") === `#${entry.target.id}`
          );
        });
      });
    },
    { rootMargin: "-42% 0px -48% 0px", threshold: 0 }
  );

  sections.forEach((section) => activeSectionObserver.observe(section));
}

const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window && revealElements.length > 0) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.16 }
  );

  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}

const closeProjectDetail = (card) => {
  const toggle = card?.querySelector(".project-detail-toggle");
  const description = toggle
    ? document.getElementById(toggle.getAttribute("aria-controls"))
    : null;

  card?.classList.remove("is-detail-open");
  toggle?.setAttribute("aria-expanded", "false");
  description?.setAttribute("aria-hidden", "true");
};

const getVisibleProjectCards = () =>
  [...projectCards].filter((card) => !card.classList.contains("is-filtered-out"));

projectVideos.forEach((video) => {
  video.removeAttribute("loop");
  video.loop = false;
  video.muted = true;
  video.playsInline = true;
});

const playProjectVideo = (video) => {
  if (!video) {
    return;
  }

  try {
    video.currentTime = 0;
  } catch (error) {
    // Algunos navegadores esperan a cargar metadatos antes de permitir currentTime.
  }

  const playRequest = video.play();

  if (playRequest && typeof playRequest.catch === "function") {
    playRequest.catch(() => {});
  }
};

const pauseInactiveProjectVideos = (activeVideo = null) => {
  projectVideos.forEach((video) => {
    if (video === activeVideo || video.ended) {
      return;
    }

    video.pause();
  });
};

const playActiveProjectVideo = () => {
  if (!projectVideoMediaQuery.matches) {
    return;
  }

  const activeCard = getVisibleProjectCards()[projectCarouselIndex];
  const activeVideo = activeCard?.querySelector(".project-card__video") || null;

  pauseInactiveProjectVideos(activeVideo);
  playProjectVideo(activeVideo);
};

// Carrusel de proyectos: mantiene autoplay en bucle, flechas y tarjetas filtrables en una sola línea.
const goToProjectSlide = (index) => {
  const visibleCards = getVisibleProjectCards();
  const totalProjectSlides = visibleCards.length;

  if (!projectViewport || !projectTrack || totalProjectSlides === 0) {
    return;
  }

  projectCarouselIndex = (index + totalProjectSlides) % totalProjectSlides;

  const targetCard = visibleCards[projectCarouselIndex];
  const targetLeft = targetCard.offsetLeft - projectTrack.offsetLeft;
  const shouldCenterCard = window.matchMedia("(max-width: 768px)").matches;
  const centeredLeft =
    targetLeft - (projectViewport.clientWidth - targetCard.offsetWidth) / 2;

  projectViewport.scrollTo({
    left: shouldCenterCard ? Math.max(0, centeredLeft) : targetLeft,
    behavior: "smooth",
  });

  window.setTimeout(playActiveProjectVideo, shouldCenterCard ? 260 : 0);
};

const nextProjectSlide = () => {
  const totalProjectSlides = getVisibleProjectCards().length;

  if (totalProjectSlides <= 1) {
    return;
  }

  goToProjectSlide(projectCarouselIndex + 1);
};

const prevProjectSlide = () => {
  const totalProjectSlides = getVisibleProjectCards().length;

  if (totalProjectSlides <= 1) {
    return;
  }

  goToProjectSlide(projectCarouselIndex - 1);
};

const stopProjectCarouselAutoplay = () => {
  window.clearInterval(projectCarouselTimer);
  projectCarouselTimer = undefined;
};

const startProjectCarouselAutoplay = () => {
  if (!projectViewport) {
    return;
  }

  stopProjectCarouselAutoplay();

  if (getVisibleProjectCards().length <= 1) {
    return;
  }

  projectCarouselTimer = window.setInterval(nextProjectSlide, 4000);
};

if (filterButtons.length > 0 && projectCards.length > 0) {
  filterButtons.forEach((button) => {
    button.setAttribute("aria-pressed", button.classList.contains("is-active"));

    button.addEventListener("click", () => {
      const activeFilter = button.dataset.filter || "all";

      filterButtons.forEach((item) => {
        const isActive = item === button;
        item.classList.toggle("is-active", isActive);
        item.setAttribute("aria-pressed", String(isActive));
      });

      projectCards.forEach((card) => {
        const categories = (card.dataset.category || "").split(" ");
        const shouldShow =
          activeFilter === "all" || categories.includes(activeFilter);

        card.classList.toggle("is-filtered-out", !shouldShow);

        if (!shouldShow) {
          closeProjectDetail(card);
          card.querySelector(".project-card__video")?.pause();
        }
      });

      projectCarouselIndex = 0;
      goToProjectSlide(0);
      startProjectCarouselAutoplay();
    });
  });
}

projectCards.forEach((card) => {
  const video = card.querySelector(".project-card__video");

  if (!video) {
    return;
  }

  card.addEventListener("mouseenter", () => {
    if (projectVideoMediaQuery.matches) {
      return;
    }

    pauseInactiveProjectVideos(video);
    playProjectVideo(video);
  });

  card.addEventListener("mouseleave", () => {
    if (projectVideoMediaQuery.matches || video.ended) {
      return;
    }

    video.pause();
  });
});

const handleProjectVideoModeChange = () => {
  pauseInactiveProjectVideos();

  if (projectVideoMediaQuery.matches) {
    playActiveProjectVideo();
  }
};

if (typeof projectVideoMediaQuery.addEventListener === "function") {
  projectVideoMediaQuery.addEventListener("change", handleProjectVideoModeChange);
} else if (typeof projectVideoMediaQuery.addListener === "function") {
  projectVideoMediaQuery.addListener(handleProjectVideoModeChange);
}

if (projectViewport && projectCards.length > 0) {
  projectPrevButton?.addEventListener("click", () => {
    prevProjectSlide();
    startProjectCarouselAutoplay();
  });

  projectNextButton?.addEventListener("click", () => {
    nextProjectSlide();
    startProjectCarouselAutoplay();
  });

  if (window.matchMedia("(hover: hover)").matches) {
    projectCarousel?.addEventListener("mouseenter", stopProjectCarouselAutoplay);
    projectCarousel?.addEventListener("mouseleave", startProjectCarouselAutoplay);
  }

  projectCarousel?.addEventListener("focusin", stopProjectCarouselAutoplay);
  projectCarousel?.addEventListener("focusout", startProjectCarouselAutoplay);
  window.addEventListener("resize", () => goToProjectSlide(projectCarouselIndex), { passive: true });
  startProjectCarouselAutoplay();
  playActiveProjectVideo();
}

projectDetailToggles.forEach((toggle) => {
  toggle.addEventListener("click", () => {
    const card = toggle.closest(".project-card");
    const description = document.getElementById(toggle.getAttribute("aria-controls"));

    if (!card || !description) {
      return;
    }

    const isOpen = card.classList.toggle("is-detail-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
    description.setAttribute("aria-hidden", String(!isOpen));
  });
});

serviceToggles.forEach((toggle) => {
  toggle.addEventListener("click", () => {
    const card = toggle.closest(".service-card");
    const descriptionId = toggle.getAttribute("aria-controls");
    const description = descriptionId ? document.getElementById(descriptionId) : null;

    if (!card) {
      return;
    }

    const isOpen = card.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
    description?.setAttribute("aria-hidden", String(!isOpen));
  });
});

forms.forEach((form) => {
  const status = form.querySelector("[data-form-status]");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const honeypot = form.querySelector('input[name="website"], input[name="empresa_web"]');

    // Antispam auxiliar: la validación real del honeypot debe repetirse en backend.
    // Backend rate limit pendiente:
    // - Contacto: máximo 3 envíos cada 10 minutos por IP.
    // - Línea de Seguridad: máximo 5 reportes cada 30 minutos por IP.
    // - Si se supera el límite, responder con HTTP 429.
    if (honeypot?.value.trim()) {
      return;
    }

    const fields = form.querySelectorAll("input, select, textarea");
    let isValid = true;

    fields.forEach((field) => {
      const row = field.closest(".form-row");
      const fieldIsValid = field.checkValidity();
      row?.classList.toggle("has-error", !fieldIsValid);
      isValid = isValid && fieldIsValid;
    });

    if (!status) {
      return;
    }

    if (!isValid) {
      status.textContent = "Revisa los campos marcados antes de enviar.";
      status.style.color = "#E95405";
      return;
    }

    if (form.matches("[data-contact-form]")) {
      status.textContent = "Enviando solicitud...";
      status.style.color = "#575757";
      form.submit();
      return;
    }

    status.textContent = form.matches("[data-safety-form]")
      ? "Reporte anónimo capturado en esta demo local."
      : "Solicitud capturada en esta demo local.";
    status.style.color = form.matches("[data-safety-form]") ? "#FFFFFF" : "#575757";
    form.reset();
  });

  form.addEventListener("input", (event) => {
    const field = event.target;
    const row = field.closest(".form-row");

    if (field.matches("input, select, textarea")) {
      row?.classList.toggle("has-error", !field.checkValidity());
    }

    if (status) {
      status.textContent = "";
    }
  });
});

const contactForm = document.querySelector("[data-contact-form]");
const contactStatus = contactForm?.querySelector("[data-form-status]");
const contactSuccessModal = document.querySelector("[data-contact-success-modal]");
const contactSuccessClose = document.querySelector("[data-contact-success-close]");

const showContactSuccessModal = () => {
  contactSuccessModal?.classList.add("is-visible");
};

const hideContactSuccessModal = () => {
  contactSuccessModal?.classList.remove("is-visible");
};

contactSuccessClose?.addEventListener("click", hideContactSuccessModal);

contactSuccessModal?.addEventListener("click", (event) => {
  if (event.target === contactSuccessModal) {
    hideContactSuccessModal();
  }
});

if (contactForm && contactStatus) {
  const contactParams = new URLSearchParams(window.location.search);
  const contactResult = contactParams.get("contacto");

  if (contactResult === "enviado") {
    contactStatus.textContent = "Tu solicitud fue enviada correctamente. Nos pondremos en contacto contigo.";
    contactStatus.style.color = "#575757";
    showContactSuccessModal();
    window.history.replaceState({}, document.title, `${window.location.pathname}#contacto`);
  }

  if (contactResult === "error") {
    contactStatus.textContent = "No se pudo enviar la solicitud. Inténtalo nuevamente o contáctanos por WhatsApp.";
    contactStatus.style.color = "#E95405";
  }
}
