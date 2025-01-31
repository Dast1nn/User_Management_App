const createUserForm = document.querySelector('[data-create-user-form]');
const editUserFormDialog = document.querySelector('[data-edit-user-form-dialog]');
const usersContainer = document.querySelector("[data-users-container]");

const MOCK_API_URL = "https://67952a63aad755a134eb60e4.mockapi.io/todo";

let users=[];

createUserForm.addEventListener('submit',(e)=>{
  e.preventDefault();
  const formData = new FormData(createUserForm);
  const formUserData = Object.fromEntries(formData);
  const newUserData = {
    name: formUserData.userName,
    city:formUserData.userCity,
    email:formUserData.userEmail,
    avatar:formUserData.userImageUrl,
  }
  createNewUserAsync(newUserData);
});

usersContainer.addEventListener('click',(e)=>{
  if(e.target.hasAttribute("data-user-remove-btn")){
    const isRemovedUser = confirm("Are you sure you want to delete this user?");
    isRemovedUser && removeExistingUserAsync(e.target.dataset.userId);
    return;
  }
  if(e.target.hasAttribute("data-user-edit-btn")){
    populateDialog(e.target.dataset.userId);
    editUserFormDialog.showModal();
  };
})

// ------- Редактирование существующего пользователя -------
const editExistingUserAsync = async (newUserData) =>{
  try {
    const response = await fetch(`${MOCK_API_URL}/${newUserData.id}`,{
      method:'PUT',
      body:JSON.stringify(newUserData),
      headers:{
         "Content-type": "application/json"
      }
    });
    if(response.status === 400){
      throw new Error('client error');
    }
    const editedUser = response.json();
    users = users.map((user) => {
      if (user.id === editedUser.id) {
          return editedUser;
      }
      return user;
      });
    editUserFormDialog.close();
    renderUsers();
    alert("USER HAS BEEN SUCCESSFULLY EDITED");
  } catch (error) {
    console.error("ERROR when editing the user's user: ", error.message);
  }
}

// ------- Удаление существующего пользователя -------
const removeExistingUserAsync = async(userId)=>{
  try {
    const response = await fetch(`${MOCK_API_URL}/${userId}`,{
      method:'DELETE'
    });
    if(response.status === 404){
      throw new Error (`${userId} not found`);
    }
    const removedUser = await response.json();
    users = users.filter(user=> user.id !== removedUser.id);
    renderUsers();
    alert("THE USER HAS BEEN SUCCESSFULLY DELETED");    
  } catch (error) {
    console.error("ERROR when deleting a user:", error.message);
    
  }
}



// ------- Создание нового пользователя -------
const createNewUserAsync = async (newUserData)=>{
  try {
    const  response = await fetch(MOCK_API_URL,{
      method:'POST',
      body:JSON.stringify(newUserData),
      headers:{
        "Content-type": "application/json"
      }
    });
    const newCreatedUser = await response.json();
    users.unshift(newCreatedUser);
    renderUsers();
    createUserForm.reset();
    alert("NEW USER HAS BEEN SUCCESSFULLY CREATED");
  } catch (error) {
    console.error("ERROR creating a new user:", error.message)

  }
}


// ------- Получение всех пользователей -------
const getUsersAsync = async ()=>{
  try {
    const response = await fetch(MOCK_API_URL);
    users = await response.json();
    renderUsers();
  } catch (error) {
    console.error('Error',error.message);
  }
}
const renderUsers = ()=>{
  usersContainer.innerHTML='';

  users.forEach((user)=>{
    usersContainer.insertAdjacentHTML("beforeend",`
      <div class="user-card">
        <h3>${user.name}</h3>
        <p>City: ${user.city}</p>
        <span>Email: ${user.email}
        </span>
        <img src="${user.avatar}"/>
        <button class="user-edit-btn" data-user-id="${user.id}" data-user-edit-btn>🛠
      </button>
      <button class="user-remove-btn" data-user-id="${user.id}" data-user-remove-btn>❌</button>
 </div>`)
  })
};

// ------- Заполнение модального окна разметкой формы -------
const populateDialog =(userId)=>{
  editUserFormDialog.innerHTML="";

  const editForm = document.createElement('form');
  const closeFormBtn = document.createElement('button');

  closeFormBtn.classList.add('close-edit-form-btn');
  closeFormBtn.textContent = "❌";
  closeFormBtn.addEventListener('click',()=>editUserFormDialog.close());
  editForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    const formData = new FormData(editForm);
    const formUserData = Object.fromEntries(formData);
    const newUserData = {
      id: formUserData.userId,
      name: formUserData.userName,
      city:formUserData.userCity,
      email:formUserData.userEmail,
      avatar:formUserData.userImageUrl,
    }
    editExistingUserAsync(newUserData);
  })
  editForm.classList.add('form');
  editForm.innerHTML=`
            <input type="text" name="userId" value="${userId}" hidden/>
            <div class="control-field">
            <label for="nameId" class="form-label" >Name</label>
            <input type="text" name="userName" id="nameId" class="form-control" required minlength="2" maxlength="23">
          </div>

          <div class="control-field">
            <label for="cityId" class="form-label" >City</label>
            <input type="text" name="userCity" id="cityId" class="form-control" required minlength="2" maxlength="20">
          </div>

          <div class="control-field">
            <label for="emailId" class="form-label" >Email</label>
            <input type="email" name="userEmail" id="emailId" class="form-control  form-control--email" required minlength="2" maxlength="23">
          </div>

          <div class="control-field">
            <label for="imagesUrlId" class="form-label">Images</label>
            <select name="userImageUrl" id="imagesUrlId" class="form-control form
           -control--images" required>
            <option value="">Image URL</option>
            <hr>
           <option
            value="https://avatars.dzeninfra.ru/get-zen_brief/6517638/pub_628678c3f12c12190362e803_628678c3f12c12190362e804/scale_1200">
            Cristiano Ronaldo</option>
            <option
            value="https://m.media-amazon.com/images/M/MV5BNzkwNDQ3Y2UtN2MxMy00OGZjLWE5MzItNzU4YjJlMDAwYTg3XkEyXkFqcGdeQXVyMjUyNDk2ODc@._V1_FMjpg_UX1000_.jpg">
            Sergio Ramos</option>
            <option
            value="images/IMG_7835.PNG">
            Rodrygo Silva de Goes</option>
            <option
            value="https://avatars.mds.yandex.net/i?id=b7a1bcec666d18915a43f05aabb5eb75_l-8497316-images-thumbs&n=13">         
            Valverde</option>
            <option
            value="https://talksport.com/wp-content/uploads/sites/5/2022/03/GettyImages-1239059685.jpg?strip=all&w=960">
            Luka Modric</option>
            <option
           Frontender[1.0] JavaScript - Form, CRUD, mock api. USERS Management APP. Приложение 4
            value="https://cdnn11.img.sputnik.by/img/07e6/09/1e/1067413214_0:0:2731:2048_1920x0_80_0_0_1fa6ea526d3b1790ffde362a6db43431.jpg">
            Toni Kross</option>
            <option
            value="https://avatars.mds.yandex.net/i?id=eaed52ea5bd298c60f
           f850710e5d05ddd9d26b49-8082760-images-thumbs&n=13">
            Wolf 1</option>
            <option
            value="https://avatars.mds.yandex.net/i?id=730e0bcc75f17fff29
           6adf3dcdaae2036067665ec12d546e-12645552-images-thumbs&n=13">
            Fox 1</option>
            </select>
            </div>
           
            <button type="submit" class="btn submit-btn">Edit User</button>
            `
            editUserFormDialog.append(editForm,closeFormBtn);
}
getUsersAsync();