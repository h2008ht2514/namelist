const BASE_URL = 'https://user-list.alphacamp.io';
const INDEX_URL = BASE_URL + '/api/v1/users/';

userList = JSON.parse(localStorage.getItem('favoriteList'))

const cardContainer = document.querySelector("#user-container")

const searchForm = document.querySelector('#search-form')

// let filteredUsers = []


// 函式：產生使用者
// 如果favoriteList沒東西 當然網頁就出不來
function renderUserCards(data) {
  let HTMLcontent = '';
  console.log(data);

  data.forEach(user => {
    // console.log(user.surname);
    HTMLcontent += `
    <div class="card m-2 name-modal-card" style="width: 18rem;">
  <img class="card-img-top" data-bs-toggle="modal" data-bs-target="#user-modal" src="${user.avatar}" alt="Card image cap" data-modal-user-id="${user.id}">
  <div class="card-body" data-modal-user-id="${user.id}">
    <p class="card-text" data-modal-user-id="${user.id}">${user.name} ${user.surname}</p>
  </div>

  <div class="card-footer">
      <button class="btn btn-info btn-danger" data-modal-user-id="${user.id}" >x</button>
  </div>

</div>  `
  });
  cardContainer.innerHTML = HTMLcontent
}

// 綁定id
// 我們可以試著在存取 Index API 的資料時，將電影的 id 一併放進 template 裡。當按鈕被點擊時，就能把 id 挑出來然後組合出 Show API 需要的 URL。 ==>dataset



// 現在我們可以宣告一個新的 showMovieModal 函式，並使用 axios 發送 request，然後將結果輸出至 modal。注意，showMovieModal 需要傳入電影的 id 參數，等我們修改好按鈕的點擊事件監聽器之後，就會將電影的 id 發送進來
function showMoreUserInfo(id) {
  const modalTitleBox = document.querySelector('.modal-title')
  const modalAvatarBox = document.querySelector('.modal-avatar')
  const modalUserInfoBox = document.querySelector('.modal-user-info')

  axios.get(INDEX_URL + id).then(response => {
    const userdata = response.data
    console.log(userdata)

    modalTitleBox.innerText = userdata.name + " " + userdata.surname
    modalAvatarBox.src = userdata.avatar
    modalUserInfoBox.innerHTML = `
    <p id="name-modal-email">email: ${userdata.email}</p>
    <p id="name-modal-gender">gender: ${userdata.gender}</p>
    <p id="name-modal-age">age: ${userdata.age}</p>
    <p id="name-modal-region">region: ${userdata.region}</p>
    <p id="name-modal-birthday">birthday: ${userdata.birthday}</p>    
    `

    // console.log()
  })
    .catch(error => console.log(error))
}


function removeFavorite(id) {
  console.log(id)
  if (!userList || !userList.length) return;

  const removeIndex = userList.findIndex(user => user.id === id)
  console.log(removeIndex) //ex:1
  if (removeIndex === -1) return;
  

  //刪除該筆電影
  userList.splice(removeIndex,1)

  // 存回
  localStorage.setItem('favoriteList',JSON.stringify(userList))

  // 更新頁面
  renderUserCards(userList)

}


// 設定監聽器
cardContainer.addEventListener('click', function onPanelClicked(event) {
  console.log(event.target);  // 加入這行
  // if (event.target.matches('.name-modal-card')) {
  //   console.log('click') // 加這裡試試
  // }

  if (event.target.matches('.btn-danger')) {
    removeFavorite(Number(event.target.dataset.modalUserId))
  } 
  // console.log(event.target.dataset)
  //印出DOMStringMap--modalUserId:"5"

  const id = event.target.dataset.modalUserId
  // console.log(id) //印出id
  showMoreUserInfo(id)
})


// 取得所有使用者資料並產生使用者清單
// axios.get(INDEX_URL).then((response) => {
//   // console.log(response.data.results)

//   userList.push(...response.data.results)
//   // console.log(userList)
//   renderUserCards(userList)

// })

renderUserCards(userList)