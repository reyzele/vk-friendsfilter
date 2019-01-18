export function Filter({ source, target }) {

  function friendsFilter(e) {
    let filterList;

    if (e.target === friendInput) {
      filterList = source;
    } else if (e.target === listInput) {
      filterList = target;
    }
    renderItems(e.target.value, filterList);
  }

  function renderItems(target, source) {
    const friendNames = source.querySelectorAll('.friends__name');

    friendNames.forEach(el => {
      let item = el;

      while (!item.classList.contains('friends__item')) {
        item = item.parentNode;
      }
      if (target) {
        item.classList.add('hidden');
        if (isMatching(el.textContent, target)) {
          item.classList.remove('hidden');
        }
      } else {
        item.classList.remove('hidden');
      }
    })
  }

  function isMatching(full, chunk) {
    let fullName = full.toLowerCase();
    let req = chunk.toLowerCase();

    /*if (chunk.includes(' ')) {
      let chunkSplit = chunk.split(' ');
      console.log(chunkSplit);
      
    } */
    
    return chunk ? fullName.includes(req) : false;
    

    /* let fullName = full.split(' ');
    let name = fullName[0].toLowerCase();
    let lastName = fullName[1].toLowerCase();
    let req = chunk.toLowerCase();
    
    

    return chunk ? name.indexOf(req) === 0 || lastName.indexOf(req) === 0 : false; */
  }

  function makeKeyup(inputs) {
    inputs.forEach( (input) => {
      input.addEventListener('keyup', friendsFilter);
    } )
  }

  const friendInput = document.querySelector('#friendInput');
  const listInput = document.querySelector('#listInput');
  let filterMapDnd = new Map();
  let filterMapClick = new Map();

  makeKeyup([friendInput, listInput]);

  filterMapDnd.set(source, friendInput);
  filterMapDnd.set(target, listInput);

  filterMapClick.set(target, friendInput);
  filterMapClick.set(source, listInput);

  return { filterMapDnd, filterMapClick }
}
