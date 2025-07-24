document.addEventListener('DOMContentLoaded', () => {
    // --- Получение элементов DOM ---
    const inputText = document.getElementById('inputText');
    const outputText = document.getElementById('outputText');
    const inputLabel = document.getElementById('inputLabel');
    const outputLabel = document.getElementById('outputLabel');
    const copyInputBtn = document.getElementById('copyInputBtn');
    const copyOutputBtn = document.getElementById('copyOutputBtn');
    const swapBtn = document.getElementById('swapBtn');
    const clearBtn = document.getElementById('clearBtn');
    const toast = document.getElementById('toast');

    // --- Карта шифрования/расшифрования ---
    const encryptionMap = {
        'й': '1', 'ц': '2', 'у': '3', 'к': '4', 'е': '5', 'н': '6', 'г': '7', 'ш': '8', 'щ': '9', 'з': '0', 'х': 'х', 'ё': 'ё', 'ф': '@', 'ы': '#', 'в': '₽', 'а': '—', 'п': '&', 'р': '르', 'о': '+', 'л': '(', 'д': ')', 'ж': '№', 'э': '∼', 'ъ': 'ъ', 'я': '*', 'ч': '치', 'м': ':', 'и': ';', 'т': '!', 'ь': 'Ъ', 'б': '비', 'ю': '%', '.': '!?',
        'Й': '1', 'Ц': '2', 'У': '3', 'К': '4', 'Е': '5', 'Н': '6', 'Г': '7', 'Ш': '8', 'Щ': '9', 'З': '0', 'Х': 'х', 'Ё': 'ё', 'Ф': '@', 'Ы': '#', 'В': '₽', 'А': '—', 'П': '&', 'Р': '르', 'О': '+', 'Л': '(', 'Д': ')', 'Ж': '№', 'Э': '∼', 'Ъ': 'ъ', 'Я': '*', 'Ч': '치', 'М': ':', 'И': ';', 'Т': '!', 'Ь': 'Ъ', 'Б': '비', 'Ю': '%'
    };
    
    const decryptionMap = Object.fromEntries(Object.entries(encryptionMap).map(([key, value]) => [value, key]));
    let isProgrammaticallyUpdating = false;

    // --- Функции шифрования и форматирования ---
    function encrypt(text) {
        return text.split('').map(char => encryptionMap[char] || char).join('');
    }

    function formatRussianText(text) {
        if (!text) return text;
        let result = text.toLowerCase();
        for (let i = 0; i < result.length; i++) {
            if (/[а-яё]/.test(result[i])) {
                result = result.substring(0, i) + result[i].toUpperCase() + result.substring(i + 1);
                break;
            }
        }
        return result;
    }

    function decrypt(text) {
        let result = '';
        let i = 0;
        while (i < text.length) {
            const twoCharKey = text.substring(i, i + 2);
            if (decryptionMap[twoCharKey]) {
                result += decryptionMap[twoCharKey];
                i += 2;
            } else {
                result += decryptionMap[text[i]] || text[i];
                i += 1;
            }
        }
        return formatRussianText(result);
    }

    // --- Функция определения языка ---
    function isProbablyRussian(text) {
        const cyrillicMatches = text.match(/[а-яё]/ig) || [];
        const cipherMatches = text.match(/[0-9@#₽—&\-+()№∼*:;!Ъ%치비]/g) || [];

        if (cyrillicMatches.length === 0) {
            return false;
        }
        
        if (cipherMatches.length > cyrillicMatches.length) {
            return false;
        }

        return true;
    }

    // --- Основной обработчик ввода ---
    function handleInput() {
        if (isProgrammaticallyUpdating) return;

        const activeElement = document.activeElement;
        const sourceText = activeElement.value;
        
        const isTextRussian = isProbablyRussian(sourceText);

        let resultText;
        
        if (isTextRussian) {
            resultText = encrypt(sourceText);
        } else {
            resultText = decrypt(sourceText);
        }
        
        isProgrammaticallyUpdating = true;

        if (activeElement === inputText) {
            outputText.value = resultText;
        } else if (activeElement === outputText) {
            inputText.value = resultText;
        }

        if (isTextRussian) {
            inputLabel.textContent = 'Русский';
            outputLabel.textContent = 'Шифр';
        } else {
            inputLabel.textContent = 'Шифр';
            outputLabel.textContent = 'Русский';
        }
        
        isProgrammaticallyUpdating = false;
    }
    
    // --- Обработчики событий ---
    inputText.addEventListener('input', handleInput);
    outputText.addEventListener('input', handleInput);

    clearBtn.addEventListener('click', () => {
        isProgrammaticallyUpdating = true;
        inputText.value = '';
        outputText.value = '';
        inputLabel.textContent = 'Русский';
        outputLabel.textContent = 'Шифр';
        isProgrammaticallyUpdating = false;
        inputText.focus();
    });

    swapBtn.addEventListener('click', () => {
        isProgrammaticallyUpdating = true;
        
        [inputLabel.textContent, outputLabel.textContent] = [outputLabel.textContent, inputLabel.textContent];
        [inputText.placeholder, outputText.placeholder] = [outputText.placeholder, inputText.placeholder];
        [inputText.value, outputText.value] = [outputText.value, inputText.value];
        
        isProgrammaticallyUpdating = false;
        inputText.focus();
    });
    
    function copyToClipboard(text, message) {
        if (!text) return;
        navigator.clipboard.writeText(text).then(() => showToast(message));
    }

    copyInputBtn.addEventListener('click', () => copyToClipboard(inputText.value, 'Исходный текст скопирован!'));
    copyOutputBtn.addEventListener('click', () => copyToClipboard(outputText.value, 'Результат скопирован!'));

    function showToast(message) {
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2000);
    }
});