/*global RandExp, HashSearch */
var first = /hello+ (world|to you)/i;
if (HashSearch.keyExists('r')) {
  try {
    var m = HashSearch.keyExists('i') ? 'i' : '';
    m += HashSearch.keyExists('m') ? 'm' : '';
    first = new RegExp(HashSearch.get('r'), m);
  } catch (err) {}
}

var examples = [
  /*jshint maxlen:false */
  first,
  {
    title: 'Date',
    regexp: /(January|February|March|April|May|June|July|August|September|October|November|December) ([1-9]|[12][0-9]|3[01]), (19|20)[0-9][0-9]/
  },
  {
    title: 'Float',
           regexp: /[-+]?[0-9]{0,16}(\.[0-9]{1,6})?/
  },
  {
    title: 'Email Address',
    regexp: /[a-z0-9._+-]{1,20}@[a-z0-9]{3,15}\.[a-z]{2,4}/
  },
  {
    title: 'XML Tags',
    regexp: /<([a-z]+)>(.*?)<\/\1>/
  },
  {
    title: 'sha1 Hash',
    regexp: /[a-f0-9]{40}/
  },
  {
    title: 'The Name "Unique"',
    regexp: /((I|Y|Ee{0,2})(o{2,3}|u{1,3})|Uu{0,2}|Yo{2,3})n(y|i{1,3}|e{1,3}|ie|e{1,3}i)(qu?|k{1,3})e{1,3}/
  },
  {
    title: 'US Currency',
    regexp: /\$([1-9]{1,3}(,\d{3}){0,3}|([1-9]{1,3}))(\.\d{2})?/
  },
  {
    title: 'Simple Password',
    regexp: /\w{6,30}/
  },
  {
    title: 'Date 2',
    regexp: /(19|20)\d\d([- /.])(0[1-9]|1[012])\2(0[1-9]|[12][0-9]|3[01])/
  },
  {
    title: 'Lorem Ipsum...',
    regexp: /((Exercitationem|Perferendis|Perspiciatis|Laborum|Eveniet|Sunt|Iure|Nam|Nobis|Eum|Cum|Officiis|Excepturi|Odio|Consectetur|Quasi|Aut|Quisquam|Vel|Eligendi|Itaque|Non|Odit|Tempore|Quaerat|Dignissimos|Facilis|Neque|Nihil|Expedita|Vitae|Vero|Ipsum|Nisi|Animi|Cumque|Pariatur|Velit|Modi|Natus|Iusto|Eaque|Sequi|Illo|Sed|Ex|Et|Voluptatibus|Tempora|Veritatis|Ratione|Assumenda|Incidunt|Nostrum|Placeat|Aliquid|Fuga|Provident|Praesentium|Rem|Necessitatibus|Suscipit|Adipisci|Quidem|Possimus|Voluptas|Debitis|Sint|Accusantium|Unde|Sapiente|Voluptate|Qui|Aspernatur|Laudantium|Soluta|Amet|Quo|Aliquam|Saepe|Culpa|Libero|Ipsa|Dicta|Reiciendis|Nesciunt|Doloribus|Autem|Impedit|Minima|Maiores|Repudiandae|Ipsam|Obcaecati|Ullam|Enim|Totam|Delectus|Ducimus|Quis|Voluptates|Dolores|Molestiae|Harum|Dolorem|Quia|Voluptatem|Molestias|Magni|Distinctio|Omnis|Illum|Dolorum|Voluptatum|Ea|Quas|Quam|Corporis|Quae|Blanditiis|Atque|Deserunt|Laboriosam|Earum|Consequuntur|Hic|Cupiditate|Quibusdam|Accusamus|Ut|Rerum|Error|Minus|Eius|Ab|Ad|Nemo|Fugit|Officia|At|In|Id|Quos|Reprehenderit|Numquam|Iste|Fugiat|Sit|Inventore|Beatae|Repellendus|Magnam|Recusandae|Quod|Explicabo|Doloremque|Aperiam|Consequatur|Asperiores|Commodi|Optio|Dolor|Labore|Temporibus|Repellat|Veniam|Architecto|Est|Esse|Mollitia|Nulla|A|Similique|Eos|Alias|Dolore|Tenetur|Deleniti|Porro|Facere|Maxime|Corrupti)( (exercitationem|perferendis|perspiciatis|laborum|eveniet|sunt|iure|nam|nobis|eum|cum|officiis|excepturi|odio|consectetur|quasi|aut|quisquam|vel|eligendi|itaque|non|odit|tempore|quaerat|dignissimos|facilis|neque|nihil|expedita|vitae|vero|ipsum|nisi|animi|cumque|pariatur|velit|modi|natus|iusto|eaque|sequi|illo|sed|ex|et|voluptatibus|tempora|veritatis|ratione|assumenda|incidunt|nostrum|placeat|aliquid|fuga|provident|praesentium|rem|necessitatibus|suscipit|adipisci|quidem|possimus|voluptas|debitis|sint|accusantium|unde|sapiente|voluptate|qui|aspernatur|laudantium|soluta|amet|quo|aliquam|saepe|culpa|libero|ipsa|dicta|reiciendis|nesciunt|doloribus|autem|impedit|minima|maiores|repudiandae|ipsam|obcaecati|ullam|enim|totam|delectus|ducimus|quis|voluptates|dolores|molestiae|harum|dolorem|quia|voluptatem|molestias|magni|distinctio|omnis|illum|dolorum|voluptatum|ea|quas|quam|corporis|quae|blanditiis|atque|deserunt|laboriosam|earum|consequuntur|hic|cupiditate|quibusdam|accusamus|ut|rerum|error|minus|eius|ab|ad|nemo|fugit|officia|at|in|id|quos|reprehenderit|numquam|iste|fugiat|sit|inventore|beatae|repellendus|magnam|recusandae|quod|explicabo|doloremque|aperiam|consequatur|asperiores|commodi|optio|dolor|labore|temporibus|repellat|veniam|architecto|est|esse|mollitia|nulla|a|similique|eos|alias|dolore|tenetur|deleniti|porro|facere|maxime|corrupti)){2,12}(, (exercitationem|perferendis|perspiciatis|laborum|eveniet|sunt|iure|nam|nobis|eum|cum|officiis|excepturi|odio|consectetur|quasi|aut|quisquam|vel|eligendi|itaque|non|odit|tempore|quaerat|dignissimos|facilis|neque|nihil|expedita|vitae|vero|ipsum|nisi|animi|cumque|pariatur|velit|modi|natus|iusto|eaque|sequi|illo|sed|ex|et|voluptatibus|tempora|veritatis|ratione|assumenda|incidunt|nostrum|placeat|aliquid|fuga|provident|praesentium|rem|necessitatibus|suscipit|adipisci|quidem|possimus|voluptas|debitis|sint|accusantium|unde|sapiente|voluptate|qui|aspernatur|laudantium|soluta|amet|quo|aliquam|saepe|culpa|libero|ipsa|dicta|reiciendis|nesciunt|doloribus|autem|impedit|minima|maiores|repudiandae|ipsam|obcaecati|ullam|enim|totam|delectus|ducimus|quis|voluptates|dolores|molestiae|harum|dolorem|quia|voluptatem|molestias|magni|distinctio|omnis|illum|dolorum|voluptatum|ea|quas|quam|corporis|quae|blanditiis|atque|deserunt|laboriosam|earum|consequuntur|hic|cupiditate|quibusdam|accusamus|ut|rerum|error|minus|eius|ab|ad|nemo|fugit|officia|at|in|id|quos|reprehenderit|numquam|iste|fugiat|sit|inventore|beatae|repellendus|magnam|recusandae|quod|explicabo|doloremque|aperiam|consequatur|asperiores|commodi|optio|dolor|labore|temporibus|repellat|veniam|architecto|est|esse|mollitia|nulla|a|similique|eos|alias|dolore|tenetur|deleniti|porro|facere|maxime|corrupti)( (exercitationem|perferendis|perspiciatis|laborum|eveniet|sunt|iure|nam|nobis|eum|cum|officiis|excepturi|odio|consectetur|quasi|aut|quisquam|vel|eligendi|itaque|non|odit|tempore|quaerat|dignissimos|facilis|neque|nihil|expedita|vitae|vero|ipsum|nisi|animi|cumque|pariatur|velit|modi|natus|iusto|eaque|sequi|illo|sed|ex|et|voluptatibus|tempora|veritatis|ratione|assumenda|incidunt|nostrum|placeat|aliquid|fuga|provident|praesentium|rem|necessitatibus|suscipit|adipisci|quidem|possimus|voluptas|debitis|sint|accusantium|unde|sapiente|voluptate|qui|aspernatur|laudantium|soluta|amet|quo|aliquam|saepe|culpa|libero|ipsa|dicta|reiciendis|nesciunt|doloribus|autem|impedit|minima|maiores|repudiandae|ipsam|obcaecati|ullam|enim|totam|delectus|ducimus|quis|voluptates|dolores|molestiae|harum|dolorem|quia|voluptatem|molestias|magni|distinctio|omnis|illum|dolorum|voluptatum|ea|quas|quam|corporis|quae|blanditiis|atque|deserunt|laboriosam|earum|consequuntur|hic|cupiditate|quibusdam|accusamus|ut|rerum|error|minus|eius|ab|ad|nemo|fugit|officia|at|in|id|quos|reprehenderit|numquam|iste|fugiat|sit|inventore|beatae|repellendus|magnam|recusandae|quod|explicabo|doloremque|aperiam|consequatur|asperiores|commodi|optio|dolor|labore|temporibus|repellat|veniam|architecto|est|esse|mollitia|nulla|a|similique|eos|alias|dolore|tenetur|deleniti|porro|facere|maxime|corrupti)){2,12}){0,5}[.?] ){1,4}/
  },
  {
    title: 'Time',
    regexp: /(1[0-2]|0[1-9])(:[0-5]\d){2} (A|P)M/
  },
  {
    title: 'Simple Name',
    regexp: /([aeiouy][bcdfghjklmnpqrstvwxz]([bcdfghjklmnpqrstvwxz]([aeiouy][bcdfghjklmnpqrstvwxz]?)?|[aeiouy]([bcdfghjklmnpqrstvwxz]([bcdfghjklmnpqrstvwxz]|[aeiouy])?)?)|[bcdfghjklmnpqrstvwxz][aeiouy][bcdfghjklmnpqrstvwxz]([aeiouy]([bcdfghjklmnpqrstvwxz])?|[bcdfghjklmnpqrstvwxz]([aeiouy])?)?)/
  }
];


function enterFn(fn) {
  return function(e) {
    if (e.keyCode === 13) {
      fn();
    }
  };
}


var tryItDiv, examplesDiv;
function example(regexp, i) {
  var parentDiv = i === 0 ? tryItDiv : examplesDiv;
  var field = $('<input/>');
  var mod = $('<input/>');
  var result = $('<div/>');
  var previousVal, previousM, randexp;

  function gen(pageload) {
    var val, m;
    var change = false;
    result.removeClass('err');

    try {
      val = field.val();
      m = mod.val();

      if ((val !== previousVal) || m !== previousM) {
        change = true;
        randexp = new RandExp(val, m);
        previousVal = val;
        previousM = m;
      }

      result.text(randexp.gen());
      result.html(result.html().replace(/\n/, '<br />'));

    } catch (err) {
      result.addClass('err');
      result.text(err.message);
    }

    // Only change hash on try it now div.
    if (change && !pageload && parentDiv === tryItDiv) {
      HashSearch.set('r', val);
      HashSearch.remove('i');
      HashSearch.remove('m');
      for (var i = 0, l = m.length; i < l; i++) {
        HashSearch.set(m[i], true);
      }
    }
  }

  // Populate fields.
  field.addClass('field');
  field.val(
    (regexp.source || regexp.regexp.source)
    .replace(/\\\//g, function() { return '/'; })
  );
  mod.addClass('mod');
  if (regexp.ignoreCase) {
    mod.val('i');
  }
  if (regexp.multiline) {
    mod.val(mod.val() + 'm');
  }
  result.addClass('result');


  // Crate main example container.
  var container = $('<div/>')
    .appendTo(parentDiv);

  // Add optional title.
  if (regexp.title) {
    container.append($('<h3/>').text(regexp.title));
  }

  // Add top div.
  var topContainer = $('<div/>')
    .append('new RandExp(')
    .append(field)
    .append(', ')
    .append(mod)
    .append(')')
    .appendTo(container);

  // Make a button to generate the randexp when clicked.
  $('<button/>')
    .addClass('gen').text('.gen()')
    .appendTo(topContainer)
    .click(function() { gen(); });

  // Append to main example container.
  container.append(result);

  // Generate randexp on page load.
  gen(true);

  // Generate randexp on enter key press.
  var enterKey = enterFn(gen);
  field.on('keydown', enterKey);
  mod.on('keydown', enterKey);
}

$(function() {
  tryItDiv = $('#tryit');
  examplesDiv = $('#examples');
  examplesDiv.css('display', 'none');

  for (var i = 0, l = examples.length; i < l; i++) {
    example(examples[i], i);
  }

  examplesDiv.css('display', 'block');

  // Filter modifier input to only allow the characters set 'im'.
  $('.mod').on('keypress', function(e) {
    var c = e.keyCode;
    if ((c !== 105 && c !== 109) ||
      $(this).val()
        .indexOf(String.fromCharCode(c)) !== -1) {
      e.preventDefault();
    }
  });
});
