


const BASE_URL = 'https://user-list.alphacamp.io';
const INDEX_URL = BASE_URL + '/api/v1/users/';

userList = []

const cardContainer = document.querySelector("#user-container")


// 函式：產生使用者
function renderUserCards(data) {
  let HTMLcontent = '';
  console.log(data);

  data.forEach(user => {
    HTMLcontent += `
    <div class="card m-2 name-modal-card" style="width: 18rem;">
  <img class="card-img-top" data-bs-toggle="modal" data-bs-target="#user-modal" src="${user.avatar}" alt="Card image cap">
  <div class="card-body">
    <p class="card-text">${user.name} ${user.surname}</p>
  </div>
</div>  `
  });

  cardContainer.innerHTML = HTMLcontent
}

// 綁定id





// 設定監聽器
cardContainer.addEventListener('click', function onPanelClicked(event) {

  if (event.target.matches('.name-modal-card')) {
    console.log(event.target)
    console.log('click') // 加這裡試試
  }

  console.log(event.target.dataset)
  //印出DOMStringMap--modalUserId:"5"
  // const id = event.target.dataset.modalUserId
  //??return給誰?
  // if (!id) {
  //   return
  // }
  // showMoreUserInfo(id)
})


// 取得所有使用者資料並產生使用者清單
axios.get(INDEX_URL).then((response) => {


  // console.log(response.data.results)

  userList.push(...response.data.results)
  console.log(userList)

  renderUserCards(userList)

})