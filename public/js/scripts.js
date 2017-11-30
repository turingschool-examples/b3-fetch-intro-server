$(document).ready(() => {
  updateRandomColors();
});

const addProject = () => {
  let newProjectName = $('#new-project').val();
  $('.project-directory').prepend(`
    <aside class="saved-project">
      <h4 class=${newProjectName}>${newProjectName}</h4>
      <ul class="project-list">
      </ul>
    </aside>
  `);
  $('#new-project').val('');
};

const updateRandomColors = () => {
  for (var i = 0; i < 6; i++) {

    if (!$(`.color${i}`).hasClass('favorited')) {
      let color = generateColors();
      $(`.color${i}`).css('background-color', color);
      $(`.hex-code${i}`).text(color);
    }
  }
};

const generateColors = () => {
  const characters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += characters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const toggleFavorite = () => {
  //let newFavorite =
  //grab hex code of the color that was clicked on
};

const savePalette = () => {
  let project = $('#project-menu').find(':selected').text();
  let paletteName = $('#new-palette').val();
  //need to grab the HEX codes tha belong with this palette
  //append the name and baby-palette to the UL
  //need to interact with BE here - send this palette to DB
  $('#new-palette').val('');
};

$('#new-project-btn').on('click', addProject);
$('.generate-btn').on('click', updateRandomColors);
$('#new-palette-btn').on('click', savePalette);
$('.empty-heart-icon').on('click', toggleFavorite);
$('.full-heart-icon').on('click', toggleFavorite);

$('.empty-heart-icon').on('click', (event) => {
  $(event.target).toggleClass('full-heart-icon');
  $(event.target).parents('.color').toggleClass('favorited');
});
