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
        fetchPalettes(project.id);
      });
    })
    .catch(error => {
      throw error;
    });
};

const appendProject = (project, projectId) => {
  $('.project-directory').prepend(`
    <aside class="saved-project">
      <h4 class=${projectId}>${project.project_name}</h4>
      <ul class="project-list" id="project-${projectId}">
      </ul>
    </aside>
  `);
  addProjectToList(project.project_name, projectId);
};

const addProjectToList = (projectName, projectId) => {
  $('#project-menu').prepend(`
    <option
      value="${projectId}"
      id="${projectName}">
      ${projectName}
    </option>
  `);
};

const fetchPalettes = (projectId) => {
  fetch( `/api/v1/projects/${projectId}/palettes`)
    .then(response => response.json())
    .then(palettes => appendPalettes(palettes, projectId))
    .catch(error => {
      throw error;
    });
};

const appendPalettes = (palettes, projectId) => {
  return palettes.forEach((palette) => {
    $(`#project-${projectId}`).append(`
      <li id="${palette.id}">
        <p class="small-palette-name">${palette.palette_title}</p>
        <div class="small-palette">
          <div
            class="palette-color list-color-1"
            style="background-color: ${palette.color_1}">
          </div>
          <div
            class="palette-color list-color-2"
            style="background-color: ${palette.color_2}">
          </div>
          <div
            class="palette-color list-color-3"
            style="background-color: ${palette.color_3}">
          </div>
          <div
            class="palette-color list-color-4"
            style="background-color: ${palette.color_4}">
          </div>
          <div
            class="palette-color list-color-5"
            style="background-color: ${palette.color_5}">
          </div>
        </div>
        <div class="delete-icon"></div>
      </li>
      `);
  });
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
      $('.project-directory').html('');
      fetchProjects();
      appendProject(projects[0]);
    })
    .catch(error => {
      throw error;
    });

  $('#new-project').val('');
};

const postPalette = (event) => {
  event.preventDefault();
  const paletteTitle = $('#new-palette').val();
  const color_1 = $('.hex-code1').text();
  const color_2 = $('.hex-code2').text();
  const color_3 = $('.hex-code3').text();
  const color_4 = $('.hex-code4').text();
  const color_5 = $('.hex-code5').text();
  const projectId = $('#project-menu option:selected').val();

  $('#new-palette').val('');

  fetch(`/api/v1/projects/${projectId}/palettes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      palette_title: paletteTitle,
      color_1,
      color_2,
      color_3,
      color_4,
      color_5,
      project_id: projectId,
    })
  })
    .then(response => response.json())
    .then(newPalette => {
      $(`#project-${projectId}`).html('');
      fetchPalettes(projectId);
      appendPalettes(newPalette, projectId);
    })
    .catch(error => {
      throw error;
    });
};

const toggleFavorite = (event) => {
  $(event.target).toggleClass('full-heart-icon');
  $(event.target).parents('.color').toggleClass('favorited');
};

const deleteSmallPalette = (event) => {
  event.preventDefault();
  const id = $(event.target).closest('li').attr('id');
  $(event.target).closest('li').remove();

  fetch(`/api/v1/palettes/${id}`, {
    method: 'DELETE',
  })
    .catch(error => {
      throw error;
    });
};

const checkDuplicateName = () => {
  const projectName = $('#new-project').val();

  fetch(`/api/v1/projects/`)
    .then(response => response.json())
    .then(projects => {
      const match = projects.find(project => {
        return projectName === project.name;
      });
      if (!match) {
        postProject(projectName);
      } else {
        alert(`${projectName} already exists -
              please enter a unique project name!`);
      }
    });
};

$('#new-project-btn').on('click', checkDuplicateName);
$('.generate-btn').on('click', updateRandomColors);
$('#new-palette-btn').on('click', postPalette);
$('.icon').on('click', toggleFavorite);
$('.project-directory').on('click', '.delete-icon', deleteSmallPalette);
