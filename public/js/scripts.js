$('#new-project-btn').on('click', addProject);
$('.generate-btn').on('click', generateColors);
$('#new-palette-btn').on('click', savePalette);

function addProject() {
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

function generateColors() {
  console.log('in gen colors');
  //call a helper to determine how many colors need to be generated
  //generate that many Colors
  //pass that shit to another helper that will change the color magically
  //get it into HEX if its not and prepend that to the page
};

function savePalette() {
  let project = $('#project-menu').find(':selected').text();
  let paletteName = $('#new-palette').val();
  //need to grab the HEX codes tha belong with this palette
  //append the name and baby-palette to the UL on left file tree
  //need to interact with BE here - send this palette to DB
  console.log(project, paletteName);
  $('#new-palette').val('');
}
