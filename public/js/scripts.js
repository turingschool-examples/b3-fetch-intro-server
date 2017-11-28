const addProject = () => {
  let newProjectName = $('#new-project').val();
  $('.project-directory').prepend(`
    <aside class="saved-project">
      <h4 class=${newProjectName}>${newProjectName}</h4>
      <ul class="project-list">
      </ul>
    </aside>
  `)
  $('#new-project').val('');
};

const generateColors = () => {
  //call a helper to determine how many colors need to be generated
  //generate that many Colors
  const characters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += characters[Math.floor(Math.random() * 16)];
  };
  return color;
};

const savePalette = () => {
  let project = $('#project-menu').find(':selected').text();
  let paletteName = $('#new-palette').val();
  //need to grab the HEX codes tha belong with this palette
  //append the name and baby-palette to the UL on left file tree
  //need to interact with BE here - send this palette to DB
  console.log(project, paletteName);
  $('#new-palette').val('');
}

$(document).ready(() => {
  updateRandomColors();
});

const updateRandomColors = () => {
  for (var i = 0; i < 6; i++) {

  if(!$(`.color${i}`).hasClass('unlocked-image')) {
    let color = generateColors();
    $(`.color${i}`).css('background-color', color);
    $(`.hex-code${i}`).text(color);
  };
 };
}

$('#new-project-btn').on('click', addProject);
$('.generate-btn').on('click', updateRandomColors);
$('#new-palette-btn').on('click', savePalette);
