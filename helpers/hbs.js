const moment = require('moment');

module.exports = {
  truncate: function (str, len) {
    if (str.length > len && str.length > 0) {
      let new_str = str + " ";
      new_str = str.substr(0, len);
      new_str = str.substr(0, new_str.lastIndexOf(" "));
      new_str = (new_str.length > 0) ? new_str : str.substr(0, len);
      return new_str + '...';
    }
    return str;
  },

  // stripTags: function(input){
  //   return input.replace(/<(?:.|\n)*?>/gm, '');
  // }

  stripTags: function (html) {
    var tagBody = '(?:[^"\'>]|"[^"]*"|\'[^\']*\')*';

    var tagOrComment = new RegExp(
      '<(?:'
      // Comment body.
      + '!--(?:(?:-*[^->])*--+|-?)'
      // Special "raw text" elements whose content should be elided.
      + '|script\\b' + tagBody + '>[\\s\\S]*?</script\\s*'
      + '|style\\b' + tagBody + '>[\\s\\S]*?</style\\s*'
      // Regular name
      + '|/?[a-z]'
      + tagBody
      + ')>',
      'gi');

    var oldHtml;
    do {
      oldHtml = html;
      html = html.replace(tagOrComment, '');
    } while (html !== oldHtml);
    return html.replace(/</g, '&lt;');

  },

  formatDate: function(date, format){
    return moment(date).format(format);
  }, 

  select: function(selected, options){
    return options.fn(this).replace(new RegExp(' value=\"'+ selected +'\"'), '$& selected="selected"').replace(new RegExp('>' + selected + '</option>'), 'selected="selected"$&');
  }, 

  editIcon: function(storyUser, loggedUser, StoryId, floating = true){
    if(storyUser == loggedUser){
      if(floating){
        return `<a href="/stories/edit/${StoryId}" class="btn-floating halfway-fab waves-effect waves-light red center-align"><i class="fas fa-pencil-alt"></i></a>`;
      } else {
        return `<a href="/stories/edit/${StoryId}"><i class="fas fa-pencil-alt"></i></a>`;
      }
    } else {
      return '';
    }
  }
}


