// ==UserScript==
// @name         auto-fill-sequence
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Pastes values in order when pressing Ctrl+V
// @author       You
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const VALUES_CONFIG = '1 2 3 4 5';

    let values = VALUES_CONFIG.split(' ').filter(val => val.trim() !== '');
    let currentIndex = 0;

    window.setValues = function(valuesString) {
        if (typeof valuesString !== 'string') {
            console.log('Error: Pass a string with values separated by spaces');
            console.log('Example: setValues("apple banana 123 cherry 456")');
            return;
        }
        
        const newValues = valuesString.split(' ').filter(val => val.trim() !== '');
        
        if (newValues.length === 0) {
            console.log('Error: Values list is empty');
            return;
        }
        
        values = newValues;
        currentIndex = 0;
        console.log(`New values set: ${values.join(', ')}`);
        showNotification(`New values: ${values.join(', ')}`);
    };

    window.showValues = function() {
        console.log(`Current values: ${values.join(', ')}`);
        console.log(`Next index: ${currentIndex + 1}/${values.length}`);
        if (currentIndex < values.length) {
            console.log(`Next value: ${values[currentIndex]}`);
        } else {
            console.log('All values used');
        }
    };

    console.log('=== Script loaded ===');
    console.log('Commands:');
    console.log('setValues("apple banana 123 cherry") - set new values');
    console.log('showValues() - show current values and progress');
    console.log('Ctrl+V - paste next value');
    console.log('Ctrl+Alt+R - reset counter');

    function insertNextValue(event) {
        if (event.ctrlKey && event.key === 'v') {
            event.preventDefault();
            event.stopPropagation();

            if (currentIndex >= values.length) {
                alert('All values used!');
                return;
            }

            const activeElement = document.activeElement;
            const currentValue = values[currentIndex];

            if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
                activeElement.value = currentValue;
                activeElement.dispatchEvent(new Event('input', { bubbles: true }));
                activeElement.dispatchEvent(new Event('change', { bubbles: true }));
                activeElement.dispatchEvent(new Event('blur', { bubbles: true }));
                activeElement.focus();
                currentIndex++;
                showNotification(`Inserted: ${currentValue} (${currentIndex}/${values.length})`);
            } else {
                alert(`Next value: ${currentValue}`);
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
            showNotification('Counter reset');
        }
    }

    document.addEventListener('keydown', insertNextValue, true);
    document.addEventListener('keydown', resetCounter, true);

})();
