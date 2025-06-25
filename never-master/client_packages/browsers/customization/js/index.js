let selectedClothes = [
    { component: 11, drawable: 7, texture: 1 },  
    { component: 4, drawable: 5, texture: 1 },   
    { component: 6, drawable: 32, texture: 1 }   
];

function selectClothing(componentId, drawableId) {
    const item = { component: componentId, drawable: drawableId, texture: 1 };
    
    selectedClothes = selectedClothes.filter(c => c.component !== componentId);
    
    selectedClothes.push(item);

    mp.trigger('applyClothes', componentId, drawableId, item.texture);
}

let parentData = {
    male: [
        { id: 0, filename: "Benjamin.png" },
        { id: 1, filename: "Daniel.png" },
        { id: 2, filename: "Joshua.png" },
        { id: 3, filename: "Noah.png" },
        { id: 4, filename: "Andrew.png" },
        { id: 6, filename: "Alex.png" },
        { id: 7, filename: "Isaac.png" },
        { id: 8, filename: "Evan.png" },
        { id: 9, filename: "Ethan.png" },
        { id: 10, filename: "Vincent.png" },
        { id: 11, filename: "Angel.png" },
        { id: 12, filename: "Diego.png" },
        { id: 13, filename: "Adrian.png" },
        { id: 14, filename: "Gabriel.png" },
        { id: 15, filename: "Michael.png" },
        { id: 16, filename: "Santiago.png" },
        { id: 17, filename: "Kevin.png" },
        { id: 18, filename: "Louis.png" },
        { id: 19, filename: "Samuel.png" },
        { id: 20, filename: "Anthony.png" },
        { id: 42, filename: "Claude.png" },
        { id: 43, filename: "Niko.png" },
        { id: 44, filename: "John.png" },
    ],
    female: [
        { id: 0, filename: "Hannah.png" },
        { id: 22, filename: "Audrey.png" },
        { id: 23, filename: "Jasmine.png" },
        { id: 24, filename: "Giselle.png" },
        { id: 25, filename: "Amelia.png" },
        { id: 26, filename: "Isabella.png" },
        { id: 27, filename: "Zoe.png" },
        { id: 28, filename: "Ava.png" },
        { id: 30, filename: "Violet.png" },
        { id: 31, filename: "Sophia.png" },
        { id: 33, filename: "Nicole.png" },
        { id: 34, filename: "Ashley.png" },
        { id: 35, filename: "Grace.png" },
        { id: 36, filename: "Brianna.png" },
        { id: 37, filename: "Natalie.png" },
        { id: 38, filename: "Olivia.png" },
        { id: 39, filename: "Elizabeth.png" },
        { id: 40, filename: "Charlotte.png" },
        { id: 41, filename: "Emma.png" },
        { id: 45, filename: "Misty.png" },
    ]
};

let currentIndex = { male: 0, female: 0 };

function changeParent(gender, direction) {
    currentIndex[gender] += direction;

    if (currentIndex[gender] < 0) {
        currentIndex[gender] = parentData[gender].length - 1;
    } else if (currentIndex[gender] >= parentData[gender].length) {
        currentIndex[gender] = 0;
    }

    let currentData = parentData[gender][currentIndex[gender]];

    document.getElementById(`${gender}-image`).src = `img/parents/${gender}/${currentData.filename}`;
    document.getElementById(`${gender}-name`).textContent = currentData.filename.split(".")[0];
    
    updateCustomization();
}

let customizationData = {};
let selectedHairColorId = 0;

document.querySelectorAll('.color-hair .color').forEach(color => {
    color.addEventListener('click', () => {
        selectedHairColorId = parseInt(color.id.replace('hair-', ''), 10);
        updateCustomization();
    });
});

function updateCustomization() {
    const similarity = document.getElementById("similaritySlider").value / 100;

    const faceFeatures = [
        parseFloat(document.getElementById("noseWidthSlider").value),
        parseFloat(document.getElementById("noseHeightSlider").value),
        parseFloat(document.getElementById("noseLengthSlider").value),
        parseFloat(document.getElementById("noseBridgeSlider").value),
        parseFloat(document.getElementById("noseTipSlider").value),
        parseFloat(document.getElementById("noseBridgeShiftSlider").value),
        parseFloat(document.getElementById("browHeightSlider").value),
        parseFloat(document.getElementById("browWidthSlider").value),
        parseFloat(document.getElementById("cheekboneHeightSlider").value),
        parseFloat(document.getElementById("cheekboneWidthSlider").value),
        parseFloat(document.getElementById("cheekWidthSlider").value),
        parseFloat(document.getElementById("eyeOpeningSlider").value),
        parseFloat(document.getElementById("lipThicknessSlider").value),
        parseFloat(document.getElementById("jawWidthSlider").value),
        parseFloat(document.getElementById("jawHeightSlider").value),
        parseFloat(document.getElementById("chinLengthSlider").value),
        parseFloat(document.getElementById("chinPositionSlider").value),
        parseFloat(document.getElementById("chinWidthSlider").value),
        parseFloat(document.getElementById("chinShapeSlider").value),
        parseFloat(document.getElementById("neckWidthSlider").value)
    ];
    customizationData = {
        gender: true,
        motherBlend: parentData.female[currentIndex.female].id,
        fatherBlend: parentData.male[currentIndex.male].id,
        shapeMix: 1 - similarity,
        skinMix: 1 - similarity,
        eyeColor: 2,
        hairColor: selectedHairColorId, 
        highlightColor: 0,
        faceFeatures: faceFeatures
    };

    mp.trigger('updateCustomization', JSON.stringify(customizationData));
}

function initializeParents() {
    document.getElementById("male-image").src = "img/parents/male/Benjamin.png";
    document.getElementById("male-name").textContent = "Benjamin";
    
    document.getElementById("female-image").src = "img/parents/female/Hannah.png";
    document.getElementById("female-name").textContent = "Hannah";
}

function updateSimilarity(value) {
    updateCustomization();
}
function openCategory(contentId, element) {
if (contentId === 'done-content') {
    const firstName = document.getElementById('name').value;
    const lastName = document.getElementById('surname').value;

    const clothesAndHair = [
        { component: 2, drawable: hairstyles[currentHairIndex].id, texture: 0 }, 
        ...selectedClothes 
    ];

    mp.trigger('createNewCharacter', firstName, lastName, JSON.stringify(customizationData), JSON.stringify(clothesAndHair), JSON.stringify(appearanceDetails));
    return; 
}

const contentSections = document.querySelectorAll('.content-section');
contentSections.forEach(section => section.style.display = 'none');
document.getElementById(contentId).style.display = 'block';

const contentContainer = document.getElementById('content');
if (contentId === 'family-content') {
    contentContainer.style.overflow = 'hidden';
} else if (contentId === 'face-content' || contentId === 'view-content') {
    contentContainer.style.overflow = 'auto';
}

const categories = document.querySelectorAll('.category');
categories.forEach(category => category.classList.remove('active'));
element.classList.add('active');
}
const hairstyles = [
    { id: 0, name: 'Лысый' },
    { id: 1, name: 'Короткий классический' },
    { id: 2, name: 'Ёжик' },
    { id: 3, name: 'Короткий пикси' },
    { id: 4, name: 'Мини-кроп' },
    { id: 5, name: 'Торнадо' },
    { id: 6, name: 'Панк' },
    { id: 7, name: 'Классическая' },
    { id: 8, name: 'Плетёные' },
    { id: 9, name: 'Взъерошенный' },
    { id: 10, name: 'Неформальный ёжик' },
    { id: 11, name: 'Высокий стиль' },
    { id: 12, name: 'Боб' },
    { id: 13, name: 'Неформальная' },
    { id: 14, name: 'Дреды' },
    { id: 15, name: 'Мокрый стиль' },
    { id: 16, name: 'Волнистый стиль' },
    { id: 17, name: 'Свободные кудри' },
    { id: 18, name: 'Романтичный образ' },
    { id: 19, name: 'Классический ёжик' },
    { id: 20, name: 'Авангард' },
    { id: 21, name: 'Короткий ирокез' },
    { id: 22, name: 'Маллет' },
    { id: 30, name: 'Дамба' },
    { id: 35, name: 'Неаккуратная' },
    { id: 73, name: 'Армейская' },
    { id: 74, name: 'Рог' },



];

let currentHairIndex = 0;
const hairNameElement = document.getElementById('hair-name');
const leftArrow = document.getElementById('left-arrow');
const rightArrow = document.getElementById('right-arrow');

function updateHair() {
    const currentHair = hairstyles[currentHairIndex];
    hairNameElement.innerText = currentHair.name;
    mp.trigger('updateHair', currentHair.id);
}

leftArrow.addEventListener('click', () => {
    currentHairIndex = (currentHairIndex - 1 + hairstyles.length) % hairstyles.length;
    updateHair();
});

rightArrow.addEventListener('click', () => {
    currentHairIndex = (currentHairIndex + 1) % hairstyles.length;
    updateHair();
});

updateHair();
const beards = [{ id: -1, name: 'Нет' }, ...Array.from({ length: 29 }, (_, index) => ({
    id: index,
    name: `Борода #${index}`
}))];
const brows = [{ id: -1, name: 'Нет' }, ...Array.from({ length: 34 }, (_, index) => ({
    id: index,
    name: `Брови #${index}`
}))];

const makeups = [{ id: -1, name: 'Нет' }, ...Array.from({ length: 75 }, (_, index) => ({
    id: index,
    name: `Макияж #${index}`
}))];

let currentBeardIndex = 0;
let currentBrowIndex = 0;
let currentMakeupIndex = 0;
let selectedBeardColor = 0;
let selectedBrowColor = 0;
let selectedMakeupColor = 0;
let appearanceDetails = {
    brows: { style: -1, color: 0 },
    beard: { style: -1, color: 0 },
    makeup: { style: -1, color: 0 }
};

function updateBeard() {
    document.getElementById('beard-name').innerText = beards[currentBeardIndex].name;
    appearanceDetails.beard.style = beards[currentBeardIndex].id;
    appearanceDetails.beard.color = selectedBeardColor;
    mp.trigger('setstyle', 1, appearanceDetails.beard.style, appearanceDetails.beard.color);
}

function updateBrows() {
    document.getElementById('brows-name').innerText = brows[currentBrowIndex].name;
    appearanceDetails.brows.style = brows[currentBrowIndex].id;
    appearanceDetails.brows.color = selectedBrowColor;
    mp.trigger('setstyle', 2, appearanceDetails.brows.style, appearanceDetails.brows.color);
}

function updateMakeup() {
    document.getElementById('makeup-name').innerText = makeups[currentMakeupIndex].name;
    appearanceDetails.makeup.style = makeups[currentMakeupIndex].id;
    appearanceDetails.makeup.color = selectedMakeupColor;
    mp.trigger('setstyle', 4, appearanceDetails.makeup.style, appearanceDetails.makeup.color);
}

document.getElementById('left-arrow-beard').addEventListener('click', () => {
    currentBeardIndex = (currentBeardIndex - 1 + beards.length) % beards.length;
    updateBeard();
});
document.getElementById('right-arrow-beard').addEventListener('click', () => {
    currentBeardIndex = (currentBeardIndex + 1) % beards.length;
    updateBeard();
});

document.getElementById('left-arrow-brows').addEventListener('click', () => {
    currentBrowIndex = (currentBrowIndex - 1 + brows.length) % brows.length;
    updateBrows();
});
document.getElementById('right-arrow-brows').addEventListener('click', () => {
    currentBrowIndex = (currentBrowIndex + 1) % brows.length;
    updateBrows();
});

document.getElementById('left-arrow-makeup').addEventListener('click', () => {
    currentMakeupIndex = (currentMakeupIndex - 1 + makeups.length) % makeups.length;
    updateMakeup();
});
document.getElementById('right-arrow-makeup').addEventListener('click', () => {
    currentMakeupIndex = (currentMakeupIndex + 1) % makeups.length;
    updateMakeup();
});

document.querySelectorAll('.color-beard .color').forEach(color => {
    color.addEventListener('click', () => {
        selectedBeardColor = parseInt(color.id.replace('beard-', ''), 10);
        updateBeard();
    });
});

document.querySelectorAll('.color-brows .color').forEach(color => {
    color.addEventListener('click', () => {
        selectedBrowColor = parseInt(color.id.replace('brows-', ''), 10);
        updateBrows();
    });
});

document.querySelectorAll('.color-makeup .color').forEach(color => {
    color.addEventListener('click', () => {
        selectedMakeupColor = parseInt(color.id.replace('makeup-', ''), 10);
        updateMakeup();
    });
});

updateBeard();
updateBrows();
updateMakeup();
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') { 
        mp.trigger('close-castom'); 
    } 
});