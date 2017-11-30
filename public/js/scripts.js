$(document).ready(() => {
  updateRandomColors();
  fetchProjects();
});

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

const fetchProjects = () => {
  fetch('/api/v1/projects')
    .then(response => response.json())
    .then(projects => {
      projects.forEach(project => {
        appendProject(project, project.id);
        fetchPalettes(project);
      });
    })
    .catch(error => console.log(error))
};

const appendProject = (project, projectId) => {
  $('.project-directory').prepend(`
    <aside class="saved-project">
      <h4 class=${project.project_name}>${project.project_name}</h4>
      <ul class="project-list" id="project-${projectId}">
      </ul>
    </aside>
  `);
};

const fetchPalettes = (project) => {
  //how do i only call this on the projects with palettes? or
  fetch( `/api/v1/projects/${project.id}/palettes`)
    .then(response => response.json())
    .then(palettes => appendPalettes(palettes, project.id))
    .catch(error => console.log(error));
};

const appendPalettes = (palette, projectId) => {
  $(`#project-${projectId}`).append(`
    <li>
      <p>${palette[0].palette_title}</p>
      <div
        class="palette-color" style="background-color: ${palette[0].color_1}">
      </div>
      <div
        class="palette-color" style="background-color: ${palette[0].color_2}">
      </div>
      <div
        class="palette-color" style="background-color: ${palette[0].color_3}">
      </div>
      <div
        class="palette-color" style="background-color: ${palette[0].color_4}">
      </div>
      <div
        class="palette-color" style="background-color: ${palette[0].color_5}">
      </div>
    </li>
  `);
};

const postProject = () => {
  let newProjectName = $('#new-project').val();

  fetch('/api/v1/projects', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ project_name: newProjectName })
  })
    .then(response => {
      if (response.status === 201) {
        return response.json();
      }
    })
    .then(projects => {
      fetchProjects();
      appendProject(projects[0]);
    })
    .catch(error => console.log(error));

  $('#new-project').val('');
};

const postPalette = (event) => {
  event.preventDefault();
  const paletteTitle = $('#new-palette').val();
  const color_1 = $('#list-color-1').text();
  const color_2 = $('#list-color-2').text();
  const color_3 = $('#list-color-3').text();
  const color_4 = $('#list-color-4').text();
  const color_5 = $('#list-color-5').text();
  const projectId = $('#project-menu option:selected').val();

  $('#new-palette').val('');

  fetch(`/api/v1/projects/${projectId}/palettes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: paletteTitle,
      project_id: projectId,
      color_1,
      color_2,
      color_3,
      color_4,
      color_5,
    })
  })
    .then(response => response.json())
    .then(newPalette => {
      appendPalettes(newPalette, projectId);
    })
    .catch(error => console.log(error));
};

const toggleFavorite = (event) => {
  $(event.target).toggleClass('full-heart-icon');
  $(event.target).parents('.color').toggleClass('favorited');
};

$('#new-project-btn').on('click', postProject);
$('.generate-btn').on('click', updateRandomColors);
$('#new-palette-btn').on('click', postPalette);
$('.icon').on('click', toggleFavorite);
