export function Auth() {
  var source = document.querySelector('#allFriends');
  var target = document.querySelector('#saveFriends');
  const saveButton = document.querySelector('#saveButton');
  const savedFriends = JSON.parse(localStorage.savedFriends || '{}');
  let leftList = [];
  let rightList = [];

  saveButton.addEventListener('click', (e) => {
    const statusOverlay = document.querySelector('.status-overlay');
    const status = document.querySelector('.status');
    const closeOverlay = document.querySelector('#overlay-close');
    const savedFriends = [];

    target.childNodes.forEach(e => {
      if (e.id) {
        savedFriends.push(e.id);
      }
    });
    localStorage.savedFriends = JSON.stringify(savedFriends || '{}');

    statusOverlay.style.display = 'block';
    status.innerHTML = 'Список друзей сохранен. Длинна списка: ' + savedFriends.length;

    closeOverlay.addEventListener('click', (e) => {
      statusOverlay.style.display = 'none';
    })
  })

  VK.init({
    apiId: 6494066
  });
  function auth() {
    return new Promise((resolve, reject) => {
      VK.Auth.login(data => {
        if (data.session) {
          resolve();
        }
        else {
          reject(new Error('Не удалось авторизоваться'));
        }
      }, 2);
    });
  }
  function callAPI(method, params) {
    params.v = '5.76';
    return new Promise((resolve, reject) => {
      VK.api(method, params, (data) => {
        if (data.error) {
          reject(data.error);
        }
        else {
          resolve(data.response);
        }
      });
    });
  }
  function renderFriends(to, what) {
    const template = document.querySelector('#user-template').innerHTML;
    const render = Handlebars.compile(template);
    const html = render({ items: what });

    to.innerHTML = html;
  }
  (async () => {
    try {
      await auth();
      const friends = await callAPI('friends.get', { fields: 'photo_50' });

      if (savedFriends.length) {
        friends.items.forEach(e => {
          if (savedFriends.includes('id_' + e.id)) {
            rightList.push(e);
          } else {
            leftList.push(e);
          }
        });
        renderFriends(target, rightList);
      } else {
        leftList = friends.items;
      }
      renderFriends(source, leftList);
    }
    catch (e) {
      console.error(e);
    }
  })();

  return { source, target }
}
