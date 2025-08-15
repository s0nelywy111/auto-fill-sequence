// ==UserScript==
// @name         Dmarket
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Вставляет цифры по порядку при нажатии Ctrl+V
// @author       You
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';


    const NUMBERS_CONFIG = "1 2 3 4 5";

    let numbers = NUMBERS_CONFIG.split(' ').filter(num => num.trim() !== '');
    let currentIndex = 0;

    function insertNextNumber(event) {
        if (event.ctrlKey && event.key === 'v') {
            event.preventDefault();
            event.stopPropagation();

            if (currentIndex >= numbers.length) {
                alert('Все числа использованы!');
                return;
            }

            const activeElement = document.activeElement;
            const currentNumber = numbers[currentIndex];

            if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {

                activeElement.value = currentNumber;

                activeElement.dispatchEvent(new Event('input', { bubbles: true }));
                activeElement.dispatchEvent(new Event('change', { bubbles: true }));
                activeElement.dispatchEvent(new Event('blur', { bubbles: true }));

                activeElement.focus();

                currentIndex++;

                showNotification(`Вставлено: ${currentNumber} (${currentIndex}/${numbers.length})`);
            } else {
                alert(`Следующее число: ${currentNumber}`);
                currentIndex++;
            }
        }
    }

    function showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 10px 15px;
            border-radius: 5px;
            z-index: 10000;
            font-family: Arial, sans-serif;
            font-size: 14px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 2000);
    }

    function resetCounter(event) {
        if (event.ctrlKey && event.altKey && event.key === 'r') {
            currentIndex = 0;
            showNotification('Счетчик сброшен');
        }
    }

    document.addEventListener('keydown', insertNextNumber, true);
    document.addEventListener('keydown', resetCounter, true);

})();