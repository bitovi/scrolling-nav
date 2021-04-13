const sections = [
    'Buckets',
    'Tenders',
    'Sandwiches',
    'Fried Chicken',
    'Pot Pies & Bowls',
    'A La Carte',
    'Sides',
    'Sauces',
    'Desserts',
    'Drinks'
];

const containerEl = document.createElement('article');
document.body.appendChild(containerEl);

sections.forEach(food => {
    const heading = document.createElement('h2');
    heading.textContent = food;
    heading.style.marginLeft = '1em';
    containerEl.appendChild(heading);

    const content = document.createElement('div');
    content.style.height = Math.max(500, Math.round(Math.random() * 777)) + 'px';
    containerEl.appendChild(content);
});

const footerEl = document.createElement('footer');
footerEl.style.height = '555px';
document.body.appendChild(footerEl);
