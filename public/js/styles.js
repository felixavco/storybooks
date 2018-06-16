$(document).ready(() => {
  $('.button-collapse').sideNav();

  $('select').material_select();

  $('#delete-st-btn').on('click', () => {
    if(!confirm('Are you sure?')){
      return false
    }
  });
  
});

CKEDITOR.replace('body', {
  plugins: 'wysiwygarea,toolbar,basicstyles,link' 
});