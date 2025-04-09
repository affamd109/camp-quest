

document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    if (form) {
      const inputs = form.querySelectorAll("input, textarea, select");

      (function () {
        'use strict';

        const form = document.querySelector('.validated-form');
        const inputs = form.querySelectorAll('input[required], textarea[required]');

        form.addEventListener('submit', function (event) {
            let isValid = true;

            inputs.forEach(input => {
                const errorMessage = input.nextElementSibling;

                if (!input.value.trim()) {
                    event.preventDefault();
                    event.stopPropagation();
                    input.classList.add('border-red-500', 'focus:ring-red-500');
                    errorMessage.classList.remove('hidden');
                    isValid = false;
                } else {
                    input.classList.remove('border-red-500', 'focus:ring-red-500');
                    input.classList.add('border-green-500', 'focus:ring-green-500');
                    errorMessage.classList.add('hidden');
                }
            });

            if (!isValid) {
                event.preventDefault();
            }
        });

        inputs.forEach(input => {
            input.addEventListener('input', function () {
                const errorMessage = input.nextElementSibling;
                
                if (input.value.trim()) {
                    input.classList.remove('border-red-500', 'focus:ring-red-500');
                    input.classList.add('border-green-500', 'focus:ring-green-500');
                    errorMessage.classList.add('hidden');
                } else {
                    input.classList.remove('border-green-500', 'focus:ring-green-500');
                    input.classList.add('border-red-500', 'focus:ring-red-500');
                    errorMessage.classList.remove('hidden');
                }
            });
        });

    })();
    }
  });


   
