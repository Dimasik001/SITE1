const slider = document.querySelector('.slider');
const prevButton = document.querySelector('.prev-button');
const nextButton = document.querySelector('.next-button');
const slides = Array.from(slider.querySelectorAll('img'));
const slideCount = slides.length;
let slideIndex = 0;
let autoSlideInterval;

prevButton.addEventListener('click', () => {
  slideIndex = (slideIndex - 1 + slideCount) % slideCount;
  slide();
  clearInterval(autoSlideInterval); // Останавливаем автоматическое перелистывание при нажатии кнопки
});

nextButton.addEventListener('click', () => {
  slideIndex = (slideIndex + 1) % slideCount;
  slide();
  clearInterval(autoSlideInterval); // Останавливаем автоматическое перелистывание при нажатии кнопки
});

const slide = () => {
  const imageWidth = slider.clientWidth;
  const slideOffset = -slideIndex * imageWidth;
  slider.style.transform = `translateX(${slideOffset}px)`;
};

const startAutoSlide = () => {
  autoSlideInterval = setInterval(() => {
    slideIndex = (slideIndex + 1) % slideCount;
    slide();
  }, 4000); // 5000 миллисекунд = 5 секунд
};


window.addEventListener('load', () => {
  slide();
  startAutoSlide(); // Запускаем автоматическое перелистывание после загрузки страницы
});

//ПОИСК
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');

searchButton.addEventListener('click', performSearch);

function performSearch() {
  const searchTerm = searchInput.value.trim().toLowerCase();

  // Remove previous highlights
  const highlightedElements = document.querySelectorAll('.highlight');
  highlightedElements.forEach(element => {
    element.outerHTML = element.innerHTML; 
  });

  if (searchTerm === "") {
    return; // Do nothing if the input is empty
  }

  const allTextNodes = getAllTextNodes();

  allTextNodes.forEach(node => {
    highlightOccurrences(node, searchTerm);
  });
}
function getAllTextNodes() {
    let textNodes = [];
    function recurse(element) {
        for (let i = 0; i < element.childNodes.length; i++) {
            const child = element.childNodes[i];
            if (child.nodeType === Node.TEXT_NODE && child.nodeValue.trim() !== '') {
                textNodes.push(child);
            } else if (child.nodeType === Node.ELEMENT_NODE && child.tagName !== "SCRIPT" && child.tagName !== "STYLE") {
                recurse(child);
            }
        }
    }
    recurse(document.body);
    return textNodes;
}

function highlightOccurrences(node, searchTerm) {
  let text = node.nodeValue;
  let regex = new RegExp('(' + searchTerm + ')', 'gi'); // 'g' for global, 'i' for case-insensitive
  let replacedText = text.replace(regex, `<span class="highlight">$1</span>`);

  if (replacedText !== text) {
    let newNode = document.createElement('span');
    newNode.innerHTML = replacedText;
    node.parentNode.replaceChild(newNode, node);
  }
}
   
   //+ -
      const incrementButton = document.querySelector('.increment');
    const decrementButton = document.querySelector('.decrement');
    const volumeCounter = document.getElementById('volume-counter');

    incrementButton.addEventListener('click', () => {
        volumeCounter.value = parseInt(volumeCounter.value) + 1;
    });

    decrementButton.addEventListener('click', () => {
        volumeCounter.value = Math.max(0, parseInt(volumeCounter.value) - 1); 
    });


// Камаз 
document.addEventListener('DOMContentLoaded', function() {
  const blocks = document.querySelectorAll('.block');
  const selectedVehicleText = document.getElementById('selected-vehicle-text');
  let currentlyActiveBlock = null;

  blocks.forEach(block => {
    block.addEventListener('click', () => {
      if (currentlyActiveBlock) {
        currentlyActiveBlock.classList.remove('active');
        selectedVehicleText.classList.remove('bold'); // Remove bold class from previous selection
      }
      block.classList.add('active');
      currentlyActiveBlock = block;
      const heading = block.querySelector('h3');
      selectedVehicleText.textContent = heading.textContent;
      selectedVehicleText.classList.add('bold'); // Add bold class to current selection
    });
  });
});


//Редактировать заказ
const editOrderButton = document.querySelector('.edit-order-button');
const deliveryContainer = document.querySelector('.delivery-container');
editOrderButton.addEventListener('click', () => {
  deliveryContainer.scrollIntoView({ behavior: 'smooth' });
});



