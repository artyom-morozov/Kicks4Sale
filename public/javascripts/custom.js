// This js file for client-side javascript (front-end development). I just played with some datas
// to make it more usefull.

// This is for change variant on the product overview page. Whenever you click a variant
// I am passing the all the information I need then placing them properly according to
// arguments.
function changeVariant(imagePath, color, size, id, qty) 
{
    if (qty < 1)
    {
        document.getElementById("inventory-buy").style.display = "none";
        document.getElementById("soldout").style.display = "block";
    }
    else
    {
        document.getElementById("inventory-buy").style.display = "block";
        document.getElementById("soldout").style.display = "none";
    }
    document.getElementById("add-to-bag-link").href = "/add-to-bag/" + id;
    document.getElementById("buy-now-link").href = "/checkout/buy-now/" + id;
    document.getElementById("product-color").innerHTML = (color) ? color : "Default"
    document.getElementById("p-img").src = imagePath
    if(size == "")
    {
        document.getElementById("product-size-wrp").style.display = "none";
    }
    else
    {
        document.getElementById("product-size-wrp").style.display = "block";
        let sizeArray = size.split(",")
        let sizeList = document.getElementById("product-size")
        for (let i = sizeList.options.length -1 ; i > -1; i--) {
            sizeList.options[i] = null;
        }
        for (let i = 0; i < sizeArray.length; i++) {
            let option = document.createElement("option")
            option.value = sizeArray[i]
            option.innerHTML = sizeArray[i]
            sizeList.appendChild(option)
        }
    }
}

// This is a simple random generator for discount codes.
function discountCodeGenerator() 
{
    document.getElementById("discountCode").value = Math.random().toString(36).substring(2, 6) + Math.random().toString(36).substring(2, 6)
}

// This is for dashboard. Whenever you add a variant image then
// this function updates preview image with the variant link.
function updatePreviewBox(src, dest)
{
    let elem = document.getElementById(src).value
    if (elem != "")
    {
        if(src == "imagePath")
            document.getElementById("product-image").src = elem
        else
            document.getElementById(dest).innerHTML = elem
    } 
}

// This functions allow drag and drop events for categories and departments.
// The code derived from https://www.w3schools.com/html/html5_draganddrop.asp
function allowDrop(ev) {
    ev.preventDefault();
}
function drag(ev) {
    ev.dataTransfer.setData("Text", ev.target.id);
}
function drop(ev) {
    var data = ev.dataTransfer.getData("Text");
    if(ev.target.localName != "p")
        ev.target.appendChild(document.getElementById(data));
        
    ev.preventDefault();
}
function remove(ev) {
    ev.path[1].removeChild(ev.target);
    
    ev.preventDefault();
}
function dropDepartment(ev) {
    var data = ev.dataTransfer.getData("Text");
    if (ev.target.getElementsByTagName("*").length == 0)
    {
        var departments = JSON.parse(document.getElementById("navbar-list-items").value)
        for (let i = 0; i < departments.length; i++)
        {
            if (departments[i].departmentName == data)
            {
                
                var categories = departments[i].categories.split(",")

                var availableCategories = document.getElementById("draggable-area-Categories")

                if (departments[i].categories != "")
                {
                    document.getElementById("categories-wrapper").style.display = "block"
                    document.getElementById("categories-wrapper-empty-category").style.display = "none"
                    
                    for (let y = 0; y < categories.length; y++)
                    {
                        var p = document.createElement("p")
                        p.setAttribute('id', categories[y])
                        p.setAttribute('class', 'draggable-item')
                        p.setAttribute('draggable', 'true')
                        p.setAttribute('ondragstart', 'drag(event)')
                        p.appendChild(document.createTextNode(categories[y]))
                        availableCategories.appendChild(p)
                    }
                }
                else
                {
                    document.getElementById("categories-wrapper").style.display = "none"
                    document.getElementById("categories-wrapper-empty-category").style.display = "block"
                }
                
            
                
                //p.setAttribute('id', )
                //<p id="Woman" class="draggable-item" draggable="true" ondragstart="drag(event)">Tshirt,Jacket</p>
                ev.target.appendChild(document.getElementById(data));
            }
        }
    }
    else
    {
        alert("You can only add one department")
    }
        
    ev.preventDefault();
}
function dropRemove(ev) {
    var data = ev.dataTransfer.getData("Text");
    var departments = JSON.parse(document.getElementById("navbar-list-items").value)
    for (let i = 0; i < departments.length; i++)
    {
        if (departments[i].departmentName == data)
        {
            document.getElementById("categories-wrapper").style.display = "none"
            document.getElementById("categories-wrapper-empty-category").style.display = "none"

            var availableCategories = document.getElementById("draggable-area-Categories")
            var availableCategoriesList = availableCategories.getElementsByTagName("*")

            var selectedCategories = document.getElementById("draggable-area-selected")
            var selectedCategoriesList = selectedCategories.getElementsByTagName("*")
            
            if(availableCategoriesList.length > 0)
            {
                for (let x = availableCategoriesList.length - 1; x > -1; x--)
                {
                    availableCategories.removeChild(availableCategoriesList[x])
                }
            }

            if(selectedCategoriesList.length > 0)
            {
                for (let x = selectedCategoriesList.length - 1; x > -1; x--)
                {
                    selectedCategories.removeChild(selectedCategoriesList[x])
                }
            }
        }
    }

    if(ev.target.localName != "p")
        ev.target.appendChild(document.getElementById(data));
        
    ev.preventDefault();
}
function dropSelectedCategories(ev) {
    var data = ev.dataTransfer.getData("Text");
    if (ev.target.getElementsByTagName("*").length == 0)
    {
        ev.target.appendChild(document.getElementById(data));
    }
    else
    {
        alert("You can only add one category")
    }
        
    ev.preventDefault();
}

// This function stores last url. Let's say you were in the home.html then you click to about.html
// then this function returns home.html
function goBack() 
{
    window.history.back();
}

// This is a native post request for js. It insert a department to database.
// I am using this because I need to get the some datas from div instead
// input objects.
function sendPostRequest(ev)
{
    //ev.preventDefault();
    var array = [];

    var tagsContainer = document.getElementById("draggable-area").getElementsByTagName("*")
    for (let i = 0; i < tagsContainer.length; i++)
    {
        array.push(tagsContainer[i].id)
    }

    var data = {
        departmentName: document.getElementById("departmentName").value,
        categoryName: array
    }


    var xhr = new window.XMLHttpRequest()
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
           // Typical action to be performed when the document is ready:
           window.location.replace("/dashboard/departments");
        }
    };
    xhr.open('POST', '/dashboard/insert-department', true)
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
    xhr.send(JSON.stringify(data))
}

// This is a native post request for js. It update the existing information
// in the database.
// I am using this because I need to get the some datas from div instead
// input objects.
function sendPostUpdateRequest(ev)
{
    //ev.preventDefault();
    var array = [];

    var tagsContainer = document.getElementById("draggable-area").getElementsByTagName("*")
    for (let i = 0; i < tagsContainer.length; i++)
    {
        array.push(tagsContainer[i].id)
    }

    var data = {
        departmentName: document.getElementById("departmentName").value,
        categoryName: array
    }

    var link = "/dashboard/update-department/" + document.getElementById("departmentID").value


    var xhr = new window.XMLHttpRequest()
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
           // Typical action to be performed when the document is ready:
           window.location.replace("/dashboard/departments");
        }
    };
    xhr.open('POST', link, true)
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
    xhr.send(JSON.stringify(data))
}

// This is a native post request for js. It update the existing information
// in the database.
// I am using this because I need to get the some datas from div instead
// input objects.
function updateProductPost()
{
    var dArray = [];
    var cArray = [];

    var departmentContainer = document.getElementById("draggable-area").getElementsByTagName("*")
    for (let i = 0; i < departmentContainer.length; i++)
    {
        dArray.push(departmentContainer[i].id)
    }
    var categoryContainer = document.getElementById("draggable-area-selected").getElementsByTagName("*")
    for (let i = 0; i < categoryContainer.length; i++)
    {
        cArray.push(categoryContainer[i].id)
    }

    var sizeChoices = [];
    var els = document.getElementsByName('size');
    for (var i=0;i<els.length;i++){
    if ( els[i].checked ) {
        sizeChoices.push(els[i].value);
    }
    }

    var data = {
        imagePath       : document.getElementById("imagePath").value,
        title           : document.getElementById("product-title").value,
        description     : document.getElementById("product-description").value,
        price           : document.getElementById("product-price").value,
        color           : document.getElementById("product-color").value,
        size            : sizeChoices,
        quantity        : document.getElementById("product-quantity").value,
        department      : dArray,
        category        : cArray
    }

    var link = "/dashboard/update-inventory/" + document.getElementById("productID").value


    var xhr = new window.XMLHttpRequest()
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
           // Typical action to be performed when the document is ready:
           window.location.replace("/dashboard/inventory");
        }
    };
    xhr.open('POST', link, true)
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
    xhr.send(JSON.stringify(data))
}
// This is a native post request for js. It insert a product to database.
// I am using this because I need to get the some datas from div instead
// input objects.
function insertProductPost()
{
    var dArray = [];
    var cArray = [];

    var departmentContainer = document.getElementById("draggable-area").getElementsByTagName("*")
    for (let i = 0; i < departmentContainer.length; i++)
    {
        dArray.push(departmentContainer[i].id)
    }
    var categoryContainer = document.getElementById("draggable-area-selected").getElementsByTagName("*")
    for (let i = 0; i < categoryContainer.length; i++)
    {
        cArray.push(categoryContainer[i].id)
    }

    var sizeChoices = [];
    var els = document.getElementsByName('size');
    for (var i=0;i<els.length;i++){
    if ( els[i].checked ) {
        sizeChoices.push(els[i].value);
    }
    }

    var data = {
        imagePath       : document.getElementById("imagePath").value,
        title           : document.getElementById("product-title").value,
        description     : document.getElementById("product-description").value,
        price           : document.getElementById("product-price").value,
        color           : document.getElementById("product-color").value,
        size            : sizeChoices,
        quantity        : document.getElementById("product-quantity").value,
        department      : dArray,
        category        : cArray
    }

    var link = "/dashboard/insert-inventory/"


    var xhr = new window.XMLHttpRequest()
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
           // Typical action to be performed when the document is ready:
           window.location.replace("/dashboard/inventory");
        }
    };
    xhr.open('POST', link, true)
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
    xhr.send(JSON.stringify(data))
}

// This function for search bar. It basically make a get request
// whenever you press a key on the search bar.
var showResults = debounce(function(arg){
    var value = arg.trim();
    if (value == "" || value.lenght <= 0){
        $("#search-results").fadeOut();
        return;
    }
    else {
        $("#search-results").fadeIn();
    }
    var jqxhr = $.get('/presearch?q=' + value, function (data) {
        $("#search-results").html("")
    })
    .done(function(data){
        if (data.length === 0) {
        $("#search-results").append('<p class="search-no-result pad20">No results</p>')
        }
        else {
        data.forEach(x => {
            $("#search-results").append('<a href="/product-overview/' + x._id + '" class="product-search-details border-bottom"><span class="product-image-search"><img src="' 
            + x.imagePath + '" alt="' + x.title + '"></span><span class="product-name-search">' + x.title + '<br>' +
            '<span class="search-product-department">' + x.department + '</span></span></a>')
        })
        $("#search-results").append('<a href="/search?query=' + value + '" class="show-all-results">Show all results for <b>' + value + '</b></a>')
        }
    })
    .fail(function(err){
        console.log(err);
    })
}, 200);

function debounce(func, wait, immediate){
var timeout;
return function() {
    var context = this, args = arguments;
    var later = function(){
    timeout = null
    if (!immediate) func.apply(context, args)
    }
    var callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) func.apply(context, args)
}
}

// This is for changing logo url. If you are in the dashboard then whenever you click to logo
// dashbord page will load otherwise root page will load.
let logo = document.getElementById("navbar-logo");
let gotolink = document.getElementById("go-to-link")
let url = window.location.href;
if (url.includes("dashboard"))
{
    logo.setAttribute('href', '/dashboard')
    gotolink.innerHTML = "Go to User View"
    gotolink.setAttribute('href', '/')

}
else
{
    logo.setAttribute('href', '/')
    if (gotolink)
    {
        gotolink.innerHTML = "Go to Dashboard"
        gotolink.setAttribute('href', '/dashboard')
    }
}