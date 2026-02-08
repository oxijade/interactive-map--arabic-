let lastClickedElement = null;

function showInfo(event, title, leader, geo, min_year, max_year, des, imageSrc) {
    if (lastClickedElement === event.target) {
        resetInfo();
        return;
    }

    lastClickedElement = event.target;

    const container = document.querySelector(".map-container");

    const newBox = document.createElement("div");
    newBox.className = "info-box";
    if (max_year == min_year) {
        newBox.innerHTML = "<b>" + "المقاومة: " + title + "</b>" + "<des>" + leader + "<br>" + geo + "<br>" + min_year + "<br>" + des + "</des>";
    } else {
        newBox.innerHTML = "<b>" + "المقاومة: " + title + "</b>" + "<des>" + leader + "<br>" + geo + "<br>" + min_year + " - " + max_year + "<br>" + des + "</des>";
    };
    newBox.style.top = event.target.style.top;
    newBox.style.left = event.target.style.left;
    container.appendChild(newBox);

    let newImage = null;
    if (imageSrc) {
        newImage = document.createElement("img");
        newImage.className = "point-image";
        newImage.src = imageSrc;
        newImage.style.width = "150px";
        newImage.style.height = "150px";
        newImage.style.top = event.target.style.top;

        const container = document.querySelector(".map-container");
        const containerWidth = container.offsetWidth;
        const imageWidth = 150;
        const pointLeftPercent = parseFloat(event.target.style.left);
        const pointLeftPx = (pointLeftPercent / 100) * containerWidth;

        const imageLeftPx = pointLeftPx - imageWidth - 10;
        const imageLeftPercent = (imageLeftPx / containerWidth) * 100;

        newImage.style.left = imageLeftPercent + '%';

        container.appendChild(newImage);
        requestAnimationFrame(() => newImage.classList.add("show"));
    }

    requestAnimationFrame(() => newBox.classList.add("show"));

    const oldBoxes = document.querySelectorAll(".info-box");
    const oldImages = document.querySelectorAll(".point-image");

    oldBoxes.forEach(box => {
        if (box !== newBox) {
            box.classList.remove("show");
            box.classList.add("hide");
            box.addEventListener("transitionend", () => box.remove(), { once: true });
        }
    });

    oldImages.forEach(img => {
        if (img !== newImage) {
            img.classList.remove("show");
            img.classList.add("hide");
            img.addEventListener("transitionend", () => img.remove(), { once: true });
        }
    });
}

function resetInfo() {
    const boxes = document.querySelectorAll(".info-box");
    const images = document.querySelectorAll(".point-image");

    boxes.forEach(box => {
        box.classList.remove("show");
        box.classList.add("hide");
        box.addEventListener("transitionend", () => box.remove(), { once: true });
    });

    images.forEach(img => {
        img.classList.remove("show");
        img.classList.add("hide");
        img.addEventListener("transitionend", () => img.remove(), { once: true });
    });

    lastClickedElement = null;
}

const slider = document.getElementById("timeline");
const year = document.getElementById("year");
let isTimelineActive = false;

function toggleTimeline() {
    const timelineWrapper = document.querySelector(".timeline-wrapper");
    isTimelineActive = !isTimelineActive;
    
    if (isTimelineActive) {
        timelineWrapper.classList.add("active");
        // Activer le filtrage avec l'année actuelle
        filterPointsByYear(parseInt(slider.value));
    } else {
        timelineWrapper.classList.remove("active");
        // Désactiver le filtrage - afficher tous les points
        showAllPoints();
    }
}

function showAllPoints() {
    resetInfo();
    const points = document.querySelectorAll(".point");
    points.forEach(point => {
        point.style.display = "block";
    });
}

function filterPointsByYear(selectedYear) {
    // Réinitialiser les infos affichées avant de filtrer
    resetInfo();
    
    const points = document.querySelectorAll(".point");
    
    points.forEach(point => {
        const minYear = parseInt(point.getAttribute("data-min-year"));
        const maxYear = parseInt(point.getAttribute("data-max-year"));
        
        if (selectedYear >= minYear && selectedYear <= maxYear) {
            point.style.display = "block";
        } else {
            point.style.display = "none";
        }
    });
}

slider.addEventListener("input", () => {
    const selectedYear = parseInt(slider.value);
    year.textContent = selectedYear;
    // Ne filtrer que si la timeline est active
    if (isTimelineActive) {
        filterPointsByYear(selectedYear);
    }
});

// Initialiser le filtrage au chargement de la page
window.addEventListener("DOMContentLoaded", () => {
    showAllPoints();
});

