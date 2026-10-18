const getInitialRegex = () => {
  let first = /hello+ (world|to you)/i;
  if (HashSearch.keyExists('r')) {
    try {
      let m = HashSearch.keyExists('i') ? 'i' : '';
      m += HashSearch.keyExists('m') ? 'm' : '';
      first = new RegExp(HashSearch.get('r'), m);
    } catch {}
  }
  return first;
};

const examples = [
  getInitialRegex(),
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
  }
];


function enterFn(fn) {
  return (e) => {
    if (e.key === 'Enter') {
      fn();
    }
  };
}

let tryItDiv;
let examplesDiv;

function createExample(item, i) {
  const parentDiv = i === 0 ? tryItDiv : examplesDiv;
  const field = document.createElement('input');
  const mod = document.createElement('input');
  const result = document.createElement('div');
  let previousVal;
  let previousM;
  let randexp;

  function gen(pageload) {
    let change = false;
    result.classList.remove('err');

    try {
      const val = field.value;
      const m = mod.value;

      if (val !== previousVal || m !== previousM) {
        change = true;
        randexp = new RandExp(val, m);
        previousVal = val;
        previousM = m;
      }

      result.textContent = randexp.gen();
    } catch (err) {
      result.classList.add('err');
      result.textContent = err.message;
    }

    // Only change hash on try it now div.
    if (change && !pageload && parentDiv === tryItDiv) {
      HashSearch.set('r', field.value);
      HashSearch.remove('i');
      HashSearch.remove('m');
      for (const char of mod.value) {
        HashSearch.set(char, true);
      }
    }
  }

  // Populate fields.
  field.className = 'field';
  const regexp = item.regexp || item;
  field.value = (regexp.source || regexp.regexp.source).replace(/\\\//g, '/');

  mod.className = 'mod';
  let initialFlags = '';
  if (regexp.ignoreCase) initialFlags += 'i';
  if (regexp.multiline) initialFlags += 'm';
  mod.value = initialFlags;

  result.className = 'result';

  // Create main example container.
  const container = document.createElement('div');
  container.className = 'example-card';
  parentDiv.appendChild(container);

  // Add optional title.
  if (item.title) {
    const title = document.createElement('h3');
    title.textContent = item.title;
    container.appendChild(title);
  }

  // Add top div.
  const topContainer = document.createElement('div');
  topContainer.className = 'example-input-group';
  topContainer.append('new RandExp(');
  topContainer.appendChild(field);
  topContainer.append(', ');
  topContainer.appendChild(mod);
  topContainer.append(')');

  // Make a button to generate the randexp when clicked.
  const genBtn = document.createElement('button');
  genBtn.className = 'gen';
  genBtn.textContent = '.gen()';
  genBtn.addEventListener('click', () => gen());
  topContainer.appendChild(genBtn);

  // Append to main example container.
  container.appendChild(topContainer);
  container.appendChild(result);

  // Generate randexp on page load.
  gen(true);

  // Generate randexp on enter key press.
  const enterKey = enterFn(gen);
  field.addEventListener('keydown', enterKey);
  mod.addEventListener('keydown', enterKey);

  // Filter modifier input to only allow the character set 'im'.
  mod.addEventListener('keypress', (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey || e.key.length > 1) return;
    if (e.key !== 'i' && e.key !== 'm') {
      e.preventDefault();
      return;
    }
    const selectedText = mod.value.slice(mod.selectionStart, mod.selectionEnd);
    if (mod.value.includes(e.key) && !selectedText.includes(e.key)) {
      e.preventDefault();
    }
  });
  mod.addEventListener('input', () => {
    mod.value = [...new Set(mod.value.toLowerCase().replace(/[^im]/g, ''))].join('');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  tryItDiv = document.getElementById('tryit');
  examplesDiv = document.getElementById('examples');
  examplesDiv.style.display = 'none';

  examples.forEach((item, i) => {
    createExample(item, i);
  });

  examplesDiv.style.display = 'block';
});

