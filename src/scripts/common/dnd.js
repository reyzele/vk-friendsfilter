export function Dnd({ source, target }, { filterMapDnd, filterMapClick }) {

  function drop(e) {
    e.preventDefault();
    if (currentDrag) {
      let target = e.target;

      if (target.classList.contains('friends__list')) {
        this.appendChild(currentDrag);
      } else {
        while (target.tagName !== 'LI') {
          target = target.parentNode;
        }
        this.insertBefore(currentDrag, target.nextElementSibling);
      }
      currentDrag.classList.remove('dragged');
      currentDrag = null;

      filterMapDnd.get(this).dispatchEvent(new Event('keyup'));
    }
  }

  function dragstart(e) {
    if (e.target instanceof Element && e.target.classList.contains('friends__item')) {
      currentDrag = e.target;

      currentDrag.classList.add('dragged');
    } else {
      e.preventDefault();
    }
  }

  function getCurrentItem(from) {
    do {
      if (from.classList.contains('friends__item')) {
        return from;
      }
    } while (from = from.parentElement);

    return null;
  }

  function preventDefault(e) {
    e.preventDefault();
  }

  function makeDnD(zones) {
    zones.forEach(zone => {
      zone.addEventListener('dragstart', dragstart);

      zone.addEventListener('dragenter', preventDefault);

      zone.addEventListener('dragover', preventDefault);

      zone.addEventListener('drop', drop);

      zone.addEventListener('click', function (e) {
        if (e.target.classList.contains('fa-times')) {
          let item = getCurrentItem(e.target);

          if (this === source) {
            target.appendChild(item);
          } else {
            source.appendChild(item);
          }
          filterMapClick.get(this).dispatchEvent(new Event('keyup'));
        }
      });
    })
  }
  var currentDrag;

  makeDnD([source, target]);
}