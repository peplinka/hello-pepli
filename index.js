const posts = [
  {
    id: 1,
    title: "Как всё начиналось: история моего блога",
    content: "Был момент, когда я поняла: если не начну сейчас — так и останусь с мыслями, которые так и не стали словами. Этот блог — мой шаг навстречу себе, своим идеям и тем, кто, как и я, ищет вдохновение в простых историях."
  },
  {
    id: 2,
    title: "Кто я: между кодом, наукой и мечтами",
    content: "Сейчас я учусь на специальности «Информатика и вычислительная техника» — мир алгоритмов и структур данных стал моей новой вселенной. Уже пишу на C#, создаю приложения, а так же умею проектировать базы данных на MySQL. До этого работала лаборантом в Научном центре Казани — опыт, который научил меня ценить точность и любопытство."
  },
  {
    id: 3,
    title: "Что греет душу: мои увлечения вне экрана",
    content: "Монтаж для меня как медитация в кадрах. Обожаю путешествовать — новые города,  истории. И, конечно, кухня — это моя творческая лаборатория, где эксперименты заканчиваются ароматными ужинами и довольными улыбками."
  }
];

// 🖼 Генерация постов через компонентный подход
const blogContainer = document.getElementById('blog-container');

function createPostComponent(post) {
  const postEl = document.createElement('article');
  postEl.classList.add('post');
  postEl.dataset.id = post.id;

  postEl.innerHTML = `
    <h3>${post.title}</h3>
    <p>${post.content}</p>
  `;

  // Открытие модалки по клику
  postEl.addEventListener('click', () => {
    openModal(post.title, post.content);
  });

  return postEl;
}

// 🔄 Рендерим все посты
posts.forEach(post => {
  const postComponent = createPostComponent(post);
  blogContainer.appendChild(postComponent);
});

// 🌙 Смена темы
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

themeToggle.addEventListener('click', () => {
  const currentTheme = body.getAttribute('data-theme');
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  body.setAttribute('data-theme', newTheme);
  themeToggle.textContent = newTheme === 'dark' ? '☀️ Светлая тема' : '🌙 Тёмная тема';
});

// 🪟 Модальное окно
const modal = document.getElementById('modal');
const closeModalBtn = document.querySelector('.close');

function openModal(title, content) {
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-body').textContent = content;
  modal.style.display = 'block';
}

closeModalBtn.onclick = () => {
  modal.style.display = 'none';
}

window.onclick = (event) => {
  if (event.target === modal) {
    modal.style.display = 'none';
  }
};