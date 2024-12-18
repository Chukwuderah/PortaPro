document.addEventListener("DOMContentLoaded", () => {
    // Dropdown functionality
    const dropdown = document.querySelector(".dropdown");
    const dropdownOptions = document.querySelector(".dropdown_options");

    dropdown.addEventListener("click", () => {
        dropdownOptions.classList.toggle("hidden");
    });

    // Image upload and drag-drop functionality
    const imageContainers = document.querySelectorAll(".image-container, .row");

    imageContainers.forEach(container => {
        const imgPlaceholder = container.querySelector(".image-placeholder");

        // Click to upload
        container.addEventListener("click", () => {
            const fileInput = document.createElement("input");
            fileInput.type = "file";
            fileInput.accept = "image/*";

            fileInput.addEventListener("change", (event) => {
                const file = event.target.files[0];
                if (file) {
                    updateImage(file, imgPlaceholder);
                }
            });

            fileInput.click();
        });

        // Drag and drop
        container.addEventListener("dragover", (event) => {
            event.preventDefault();
            container.style.borderColor = "blue";
        });

        container.addEventListener("dragleave", () => {
            container.style.borderColor = "#ccc";
        });

        container.addEventListener("drop", (event) => {
            event.preventDefault();
            container.style.borderColor = "#ccc";
            const file = event.dataTransfer.files[0];
            if (file) {
                updateImage(file, imgPlaceholder);
            }
        });
    });

    // Function to update image
    function updateImage(file, imgElement) {
        const reader = new FileReader();
        reader.onload = (e) => {
            imgElement.src = e.target.result;
            imgElement.style.display = "block";
            imgElement.style.width = "100%";
            imgElement.style.height = "100%";
            imgElement.style.objectFit = "cover"; // Ensure image fits the container
        };
        reader.readAsDataURL(file);
    }
});
