document.addEventListener("DOMContentLoaded", function () {
  document.addEventListener('click', function (e) {
    if (e.target.classList.contains('js-remove')) {
      e.target.closest('.couter-form__row').remove();
    }
    if (e.target.classList.contains('counter__inc')) {
      let $input = e.target.closest('.counter').querySelector('.counter__input');
      $input.value = +$input.value.replace(/[^\d-]+/g, '') + +1;
    }
    if (e.target.classList.contains('counter__dec')) {
      let $input = e.target.closest('.counter').querySelector('.counter__input');
      $input.value = $input.value.replace(/[^\d-]+/g, '') - 1;
    }
    if (e.target.classList.contains('counter__reset')) {
      e.target.closest('.counter').querySelector('.counter__input').value = 0;
    }
  });

  document.querySelector('.js-edit').addEventListener('change', function () {
    if (this.checked) {
      document.querySelectorAll('.counter__input').forEach(function (item) {
        item.readOnly = false;
      })
    } else {
      document.querySelectorAll('.counter__input').forEach(function (item) {
        item.readOnly = true;
      })
    }
  })
  document.querySelector('.js-add').addEventListener('click', function () {
    let newRow = document.querySelector('.couter-form__row_hidden').cloneNode(true);
    newRow.classList.remove('couter-form__row_hidden');
    newRow.classList.add('couter-form__row_active');
    let list = document.querySelector('.couter-form__list')
    list.insertBefore(newRow, list.firstChild);
  })

  document.querySelector('.js-reset-all').addEventListener('click', function () {
    document.querySelectorAll('.couter-form__row_active').forEach(function (item) {
      item.querySelector('.counter__input').value = 0;
    })
  })

  document.querySelector('.js-save').addEventListener('click', function () {
    let itemList = createList();

    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([JSON.stringify(itemList, null, 2)], {
      type: "text/plain"
    }));
    let currentdate = new Date();
    let datetime = [[AddZero(currentdate.getDate()),
    AddZero(currentdate.getMonth() + 1),
    currentdate.getFullYear()].join("."),
    [AddZero(currentdate.getHours()),
    AddZero(currentdate.getMinutes()), currentdate.getSeconds()].join("-")].join("@");

    a.setAttribute("download", "counter_" + datetime + ".json");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  })
  function AddZero(num) {
    return (num >= 0 && num < 10) ? "0" + num : num + "";
  }

  document.querySelector('.js-load-input').addEventListener('change', function (e) {
    let reader = new FileReader();
    reader.onload = onReaderLoad;
    reader.readAsText(e.target.files[0]);
    this.value = '';
  });
  function onReaderLoad(e) {
    let obj = JSON.parse(e.target.result);
    insertList(obj);
  }

  document.querySelector('.js-save-storage').addEventListener('click', function () {
    let itemList = createList();
    localStorage.setItem('counterList', JSON.stringify(itemList));
  })
  document.querySelector('.js-load-storage').addEventListener('click', function () {
    let retrievedObject = localStorage.getItem('counterList');
    let obj = JSON.parse(retrievedObject);
    insertList(obj);
  })

  function loadOnInit() {
    let retrievedObject = localStorage.getItem('counterList');
    let obj = JSON.parse(retrievedObject);
    if (obj) {
      insertList(obj);
    }
  }
  loadOnInit();

  function createList() {
    let itemList = [];
    document.querySelectorAll('.couter-form__row_active').forEach(function (item) {
      let name = item.querySelector('.name-input').value || "";
      let count = item.querySelector('.counter__input').value || 0;
      itemList.push({ name: name, count: count });
    })
    return itemList;
  }
  function insertList(items) {
    let obj = items;
    document.querySelectorAll('.couter-form__row_active').forEach(function (item) {
      item.remove();
    })
    let originRow = document.querySelector('.couter-form__row_hidden');
    let list = document.querySelector('.couter-form__list')
    for (let i = obj.length - 1; i >= 0; i--) {
      let newRow = originRow.cloneNode(true);
      newRow.classList.remove('couter-form__row_hidden');
      newRow.classList.add('couter-form__row_active');
      newRow.querySelector('.name-input').value = obj[i].name;
      newRow.querySelector('.counter__input').value = obj[i].count;
      list.insertBefore(newRow, list.firstChild);
    }
  }
});