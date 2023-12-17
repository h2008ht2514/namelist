


const BASE_URL = 'https://user-list.alphacamp.io';
const INDEX_URL = BASE_URL + '/api/v1/users/';

userList = []

const cardContainer = document.querySelector("#user-container")

const searchForm = document.querySelector('#search-form')

const paginator = document.querySelector('#paginator')

let filteredUsers = []

const NAMELIST_PER_PAGE = 12




// 函式：產生使用者
function renderUserCards(data) {
  let HTMLcontent = '';
  // console.log(data);

  data.forEach(user => {
    // console.log(user.surname);
    HTMLcontent += `
    <div class="card m-2 name-modal-card" style="width: 18rem;">
  <img class="card-img-top" data-bs-toggle="modal" data-bs-target="#user-modal" src="${user.avatar}" alt="Card image cap" data-modal-user-id="${user.id}">
  <div class="card-body" data-modal-user-id="${user.id}">
    <p class="card-text" data-modal-user-id="${user.id}">${user.name} ${user.surname}</p>
  </div>

  <div class="card-footer">
      <button class="btn btn-info btn-add-favorite" data-modal-user-id="${user.id}" >+</button>
  </div>

</div>  `
  });

  cardContainer.innerHTML = HTMLcontent
}

// 綁定id
// 我們可以試著在存取 Index API 的資料時，將電影的 id 一併放進 template 裡。當按鈕被點擊時，就能把 id 挑出來然後組合出 Show API 需要的 URL。 ==>dataset



//input value
searchForm.addEventListener('submit', function onSearchFormSubmmited(event) {
  event.preventDefault();

  const searchInput = document.querySelector('#search-input') //新增這裡

  //get input keyword
  const keyword = searchInput.value.trim().toLowerCase();

  filteredUsers = userList.filter(user => user.name.toLowerCase().includes(keyword) || user.surname.toLowerCase().includes(keyword))

  //error
  if (filteredUsers.length === 0) {
    return alert(`您輸入的關鍵字：${keyword} 沒有符合條件的電影`)
  }

  renderUserCards(filteredUsers)
})




// 現在我們可以宣告一個新的 showMovieModal 函式，並使用 axios 發送 request，然後將結果輸出至 modal。注意，showMovieModal 需要傳入電影的 id 參數，等我們修改好按鈕的點擊事件監聽器之後，就會將電影的 id 發送進來
function showMoreUserInfo(id) {
  const modalTitleBox = document.querySelector('.modal-title')
  const modalAvatarBox = document.querySelector('.modal-avatar')
  const modalUserInfoBox = document.querySelector('.modal-user-info')

  axios.get(INDEX_URL + id).then(response => {
    const userdata = response.data
    console.log(userdata) //使用者詳細資料

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


//
function addtoFavorite(id) {
  console.log(id)

  // let favoriteList = []
  const list = JSON.parse(localStorage.getItem('favoriteList')) || []
  const favoriteFriend = userList.find(user => user.id === id)

  if (list.some(user => user.id === id)) {
    return alert('cannot add twice.')
  }

  list.push(favoriteFriend)
  localStorage.setItem('favoriteList', JSON.stringify(list))
}

// 
function getNameByPage(page) {
  //0~11, 12~23
  const startIndex = (page - 1) * NAMELIST_PER_PAGE

  // 回傳切割後的新陣列 記得加return!!!
  return userList.slice(startIndex, startIndex + NAMELIST_PER_PAGE)
  // renderUserCards()
  // 現在，串接 Index API 拿到總清單 userlist 以後 ，不要一口氣全部輸出，只要顯示第 1 頁的資料就好：
}


function renderPaginator(amount) {
  let howManyPage = Math.ceil(userList.length / NAMELIST_PER_PAGE)
  console.log(howManyPage) //17
  console.log(amount) //200

  let rawHTML = '';
  for (let page = 1; page <= howManyPage; page++) {
    rawHTML += ` 
  <li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>
  `
  }
  paginator.innerHTML = rawHTML
}

// 設定監聽器
cardContainer.addEventListener('click', function onPanelClicked(event) {

  // console.log(event.target);  // 加入這行

  // if (event.target.matches('.card-img-top')) {
  //   console.log('click') // 加這裡試試
  // }
  if (event.target.matches('.btn-add-favorite')) {
    addtoFavorite(Number(event.target.dataset.modalUserId))
  }

  console.log(event.target.dataset)
  //印出DOMStringMap--modalUserId:"5"

  const id = event.target.dataset.modalUserId
  // console.log(id)

  //??return給誰?
  // if (!id) {
  //   return
  // }
  showMoreUserInfo(id)
})


//
paginator.addEventListener("click", function onPaginatorClicked(event) {

  // 如果被點擊的不是 a 標籤，結束
  if (event.target.tagName !== 'A') return

  // console.log(event.target) // 印出<a class="page-link" href="#" data-page="2">2</a>
  // console.log(event.target.dataset) // {"page": "2"}
  let page = Number(event.target.dataset.page)
  console.log(page) //數字2
  // getNameByPage(page)
  renderUserCards(getNameByPage(page))

})

// 取得所有使用者資料並產生使用者清單
axios.get(INDEX_URL).then((response) => {
  // console.log(response.data.results)
  userList.push(...response.data.results)
  // console.log(userList)

  renderUserCards(getNameByPage(1))
  renderPaginator(userList.length)

})