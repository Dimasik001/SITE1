let map;
let marker;
let unloadingMarker; // Маркер для адреса выгрузки
let routeLayer;
let geocodeTimer;

// Инициализация карты
function initMap() {
    map = new ol.Map({
        target: 'map',
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM()
            })
        ],
        view: new ol.View({
            center: ol.proj.fromLonLat([142.760868, 47.157471]),
            zoom: 13
        })
    });

    // Создание маркера для начальной точки
    marker = new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.fromLonLat([142.760868, 47.157471])),
        name: "Карьер Торфяной"
    });

    let vectorSource = new ol.source.Vector({
        features: [marker]
    });

    let markerStyle = new ol.style.Style({
        image: new ol.style.Circle({
            radius: 8,
            fill: new ol.style.Fill({ color: 'red' }),
            stroke: new ol.style.Stroke({ color: 'white', width: 2 })
        }),
        text: new ol.style.Text({
            text: marker.get("name"),
            offsetY: -15,
            fill: new ol.style.Fill({ color: "black" })
        })
    });

    let vectorLayer = new ol.layer.Vector({
        source: vectorSource,
        style: markerStyle
    });
    map.addLayer(vectorLayer);
}

// Функция для расчета маршрута и отображения его на карте
function calculateRouteAndDisplay(address) {
    const deliveryAddress = document.getElementById('deliveryAddress');
    deliveryAddress.textContent = address;

    if (!address) {
        if (routeLayer) {
            map.removeLayer(routeLayer);
            routeLayer = null; // Сброс переменной
        }
        if (unloadingMarker) {
            map.removeLayer(unloadingMarkerLayer); // Удаляем слой маркера выгрузки
            unloadingMarker = null; // Сброс переменной
        }
        return;
    }

    if (geocodeTimer) {
        clearTimeout(geocodeTimer);
    }

    geocodeTimer = setTimeout(() => {
        // Получение координат по адресу
        fetch(`https://nominatim.openstreetmap.org/search?q=${address}&format=json`)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    const destinationLat = parseFloat(data[0].lat);
                    const destinationLng = parseFloat(data[0].lon);

                    if (routeLayer) {
                        map.removeLayer(routeLayer);
                        routeLayer = null; // Сброс переменной
                    }

                    const start = ol.proj.fromLonLat([142.760868, 47.157471]);
                    const destination = ol.proj.fromLonLat([destinationLng, destinationLat]);

                    // Запрос маршрута от OpenRouteService API
                    fetch(`https://api.openrouteservice.org/v2/directions/driving-car?api_key=5b3ce3597851110001cf6248ae0c85671c5f4ce0808d5a88b1638cb1&start=${start[0]},${start[1]}&end=${destination[0]},${destination[1]}`)
                        .then(response => response.json())
                        .then(data => {
                            if (data && data.features && data.features.length > 0) {
                                const routeCoords = data.features[0].geometry.coordinates.map(coord => ol.proj.fromLonLat(coord));

                                const route = new ol.geom.LineString(routeCoords);
                                routeLayer = new ol.layer.Vector({
                                    source: new ol.source.Vector({
                                        features: [new ol.Feature({ geometry: route })]
                                    }),
                                    style: new ol.style.Style({
                                        stroke: new ol.style.Stroke({
                                            color: 'blue',
                                            width: 3
                                        })
                                    })
                                });
                                map.addLayer(routeLayer);

                                // Вычисление расстояния
                                const distance = data.features[0].properties.segments[0].distance; // расстояние в метрах
                                document.getElementById('distanceOutput').textContent = `Расстояние: ${(distance / 1000).toFixed(2)} км`;
                            } else {
                                console.error('No route found.');
                            }
                        })
                        .catch(error => {
                            console.error('Error fetching route data:', error);
                        });

                    // Обновление маркера для адреса выгрузки
                    if (unloadingMarker) {
                        map.removeLayer(unloadingMarkerLayer); // Удаляем слой с маркером выгрузки
                    }

                    // Используйте введённый адрес как имя маркера
                    unloadingMarker = new ol.Feature({
                        geometry: new ol.geom.Point(ol.proj.fromLonLat([destinationLng, destinationLat])),
                        name: address // Здесь используем введённый адрес
                    });

                    let unloadingVectorSource = new ol.source.Vector({
                        features: [unloadingMarker]
                    });

                    let unloadingMarkerStyle = new ol.style.Style({
                        image: new ol.style.Circle({
                            radius: 8,
                            fill: new ol.style.Fill({ color: 'green' }),
                            stroke: new ol.style.Stroke({ color: 'white', width: 2 })
                        }),
                        text: new ol.style.Text({
                            text: unloadingMarker.get("name"), // Отображаем введённый адрес
                            offsetY: -15,
                            fill: new ol.style.Fill({ color: "black" })
                        })
                    });

                    // Создание слоя для маркера выгрузки
                    unloadingMarkerLayer = new ol.layer.Vector({
                        source: unloadingVectorSource,
                        style: unloadingMarkerStyle
                    });
                    map.addLayer(unloadingMarkerLayer);

                    // Центрируем карту на маршруте
                    map.getView().animate({
                        center: ol.proj.fromLonLat([destinationLng, destinationLat]),
                        zoom: 13,
                        duration: 1000
                    });
                } else {
                    console.error('No coordinates found for the entered address.');
                }
            })
            .catch(error => console.error('Error fetching geocoding data:', error));
    }, 500);
}

// Обработчик события ввода адреса
document.getElementById('unloading-address-input').addEventListener('input', function () {
    const address = this.value;
    calculateRouteAndDisplay(address);
});

// Обработчик события нажатия кнопки расчета
document.getElementById('calculateButton').addEventListener('click', function () {
    // Получение элементов
    const cargoSelect = document.getElementById('cargo-select');
    const volumeInput = document.getElementById('volume-counter');
    const productRow = document.getElementById('productRow');
    const calculationSection = document.getElementById('calculationSection');
    const totalVolumeElement = document.getElementById('total-volume');
    const totalWeightElement = document.getElementById('total-weight');
    const itemsLabel = document.getElementById('items-label');

    // Извлечение значений и обеспечение того, что объем является числом
    const cargoType = cargoSelect.value;
    const volume = parseInt(volumeInput.value, 10) || 0;

    if (!productRow) {
        console.error("Error: Table row with id = productRow not found");
        return;
    }
    if (!calculationSection) {
        console.error("Error: Section with id = calculationSection not found");
        return;
    }
    if (!totalVolumeElement) {
        console.error("Error: Total volume element with id = total-volume not found");
        return;
    }
    if (!totalWeightElement) {
        console.error("Error: Total weight element with id = total-weight not found");
        return;
    }
    if (!itemsLabel) {
        console.error("Error: Item label element with id = items-label not found");
        return;
    }

    // Определение цен за кубометр (инкапсулировано для лучшего управления)
    const prices = {
        'Щебень': 2690.40,
        'Плодородный грунт': 1857.10,
        'Навоз': 87.10,
        'Песок': 412.80,
    };
    const pricePerCubicMeter = prices[cargoType] || 0;
    const weight = volume * 1.5;
    const totalCost = volume * pricePerCubicMeter;

    // Обновление строки таблицы с форматированными числами
    productRow.cells[0].textContent = cargoType; // Тип груза
    productRow.cells[1].textContent = volume; // Объем
    productRow.cells[2].textContent = weight.toFixed(2); // Вес
    productRow.cells[3].textContent = pricePerCubicMeter.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' });
    productRow.cells[4].textContent = totalCost.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' });

    // Обновление значений итогов
    totalVolumeElement.textContent = `${volume} м³`;
    totalWeightElement.textContent = `${weight.toFixed(2)} тонн`;

    // Показать метку элементов
    itemsLabel.classList.remove('hidden-items');

    calculationSection.scrollIntoView({ behavior: 'smooth' });
});

// Инициализация карты
initMap();
