document.addEventListener("DOMContentLoaded", () => {
    const switchElem = document.querySelector(".switch");
  
    switchElem.addEventListener("click", function () {
      this.classList.toggle("active");
    });
  });
  