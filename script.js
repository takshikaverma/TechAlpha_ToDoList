const addUserBtn = document.getElementById('addUser');
const btnText = addUserBtn.innerText
const usernameTextField = document.getElementById('username');
const recordsDisplay = document.getElementById('records');
const record_size = document.getElementById('records_size');
let userArray = [];
let edit_id = null;

let objStr = localStorage.getItem('users');
if (objStr != null) {
    userArray = JSON.parse(objStr);
}
DisplayInfo();
// --------------------------------------------------------------------------------------------

// Button
addUserBtn.onclick = () => {
    const name = usernameTextField.value;
    // alert(name)

    if (edit_id != null) {
        //edit
        userArray.splice(edit_id, 1, { 'name': name });
        edit_id = null;
    }
    else {
        //insert
        userArray.push({ 'name': name })
        // console.log(userArray)
    }

    SaveInfo(userArray);
    usernameTextField.value = '';
    // DisplayInfo();
    addUserBtn.innerText = btnText;

}
// --------------------------------------------------------------------------------------------

// Save Data 
function SaveInfo(userArray) {
    let str = JSON.stringify(userArray);
    localStorage.setItem('users', str);
    DisplayInfo();
}
// --------------------------------------------------------------------------------------------

// Display
function DisplayInfo() {
    let statement = '';
    userArray.forEach((user, index) => {

        statement += `   <tr>
<th scope="row">${index + 1}</th>
<td>${user.name}</td>
<td>
    <i class="fa fa-edit btn btn-info text-white mx-2" onclick='EditInfo(${index})' ></i>
    <i class="fa fa-trash btn btn-danger text-white"  onclick='DeleteInfo(${index})'></i>
</td>
</tr>`

    });
    recordsDisplay.innerHTML = statement;
}

// --------------------------------------------------------------------------------------------
// Edit
function EditInfo(id) {
    // alert(id)
    edit_id = id;
    usernameTextField.value = userArray[id].name;
    addUserBtn.innerText = 'Save Changes'


}
// --------------------------------------------------------------------------------------------

// Delete
function DeleteInfo(id) {
    // alert(id)
    A = userArray.splice(id, 1)
    console.log(A)

    SaveInfo(userArray);
    // DisplayInfo();
}
// --------------------------------------------------------------------------------------------





// Search Data

const allTr = document.querySelectorAll('#records tr');
const searchInputField = document.querySelector('#search');

searchInputField.addEventListener('input', function (e) {
    // console.log(e.target.value.toLowerCase());
    const searchStr = e.target.value.toLowerCase().trim();
    console.log(searchStr)
    recordsDisplay.innerHTML = '';

    allTr.forEach(tr => {
        // console.log(tr);
        const td_in_tr = tr.querySelectorAll('td');
        // console.log(td_in_tr[0].innerText.toLowerCase())
        if (td_in_tr[0].innerText.toLowerCase().indexOf(searchStr) > -1) {
            recordsDisplay.appendChild(tr);
        }

    });
    if (recordsDisplay.innerHTML == '') {
        recordsDisplay.innerHTML = 'No Record Found'
    }
})

// --------------------------------------------------------------------------------------------

// Pagination
const total_records_tr = document.querySelectorAll('#records tr');
let records_per_page = 10;
let page_number = 1;
const total_records = total_records_tr.length;
let total_page = Math.ceil(total_records / records_per_page);  //40/4 = 4 page

generatePage()
DisplayRecords()
function DisplayRecords() {
    let start_index = (page_number - 1) * records_per_page; //(3-1)*10 = 20
    let end_index = start_index + (records_per_page - 1); // 20 + (10-1) = 29

    if (end_index >= total_records) {
        end_index = total_records - 1;
    }


    let statement = '';
    for (let i = start_index; i <= end_index; i++) {
        // console.log(total_records_tr[i]);
        statement += `<tr>${total_records_tr[i].innerHTML}</tr>`
    }
    recordsDisplay.innerHTML = statement;


    document.querySelectorAll('.dynamic-item').forEach(item => {
        item.classList.remove('active');
    })
    document.getElementById(`page${page_number}`).classList.add('active');

    if (page_number == 1) {
        document.getElementById('prevBtn').parentElement.classList.add('disabled')
    } else {
        document.getElementById('prevBtn').parentElement.classList.remove('disabled')
    }
    if (page_number == total_page) {
        document.getElementById('nextBtn').parentElement.classList.add('disabled')
    } else {
        document.getElementById('nextBtn').parentElement.classList.remove('disabled')
    }


    document.getElementById('page-details').innerHTML = `Showing ${start_index + 1} to ${end_index + 1} of ${total_records} `

}


function generatePage() {
    let prevBtn = `  <li class="page-item">
    <a class="page-link" id="prevBtn" onClick="prevBtn()" href="javascript:void(0)">Previous</a>
  </li>`;

    let nextBtn = `  <li class="page-item">
  <a class="page-link" id="nextBtn" onClick="nextBtn()" href="javascript:void(0)">Next</a>
</li>`;

    let buttons = '';
    let activeClass = '';

    for (let i = 1; i <= total_page; i++) {

        if (i == 1) {
            // buttons += `<li class="page-item active"><a class="page-link" href="#">${i}</a></li>`;
            activeClass = 'active';
        } else {
            // buttons += `<li class="page-item"><a class="page-link" href="#">${i}</a></li>`;
            activeClass = '';
        }
        buttons += `<li class="page-item dynamic-item ${activeClass}" id="page${i}"><a class="page-link" onClick="page(${i})" href="javascript:void(0)">${i}</a></li>`;
    }

    document.getElementById('pagination').innerHTML = `${prevBtn} ${buttons}${nextBtn}`
}


function nextBtn() {
    // alert('hello')
    page_number++;
    DisplayRecords();
}

function prevBtn() {
    // alert('hello')
    page_number--;
    DisplayRecords();
}


function page(index) {
    page_number = parseInt(index);
    DisplayRecords();
}


record_size.addEventListener('change', function (e) {
    records_per_page = parseInt(record_size.value);
    total_page = Math.ceil(total_records / records_per_page);
    page_number = 1;
    generatePage()
    DisplayRecords()
})