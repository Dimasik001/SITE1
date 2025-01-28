 document.addEventListener('DOMContentLoaded', () => {
        // Получаем все блоки с автомобилями
        const blocks = document.querySelectorAll('.block');

        // Добавляем обработчик события клика для каждого блока
        blocks.forEach(block => {
            block.addEventListener('click', () => {
                // Получаем название автомобиля
                const carName = block.querySelector('h3').textContent;

                // Получаем грузоподъемность и вместимость из атрибутов данных
                const capacity = block.getAttribute('data-capacity');
                const volume = block.getAttribute('data-volume');

                // Выводим характеристики в соответствующие элементы
                document.getElementById('car-name').textContent = ` ${carName}`;
                document.getElementById('capacity').textContent = `Грузоподъемность: ${capacity}`;
                document.getElementById('volume').textContent = `Вместимость: ${volume}`;
            });
        });
    });