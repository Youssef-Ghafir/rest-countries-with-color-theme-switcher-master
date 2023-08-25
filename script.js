let select = document.querySelector('.select-title');
window.addEventListener('scroll', e => {
    let HeighPage = document.documentElement.offsetHeight - window.innerHeight;
    if(Math.floor(window.scrollY) >= HeighPage - 4) {
    }
})
// ==============================================
let result_box = document.querySelector('.result .container');
let search_country = document.querySelector('#search-country');
function ShowLoad() {
    result_box.innerHTML = `
    <div class="d-flex justify-content-center">
  <div class="spinner-border" role="status">
    <span class="visually-hidden">Loading...</span>
  </div>
</div>
`
}
if(window.localStorage.getItem('dark')) {
    document.body.classList.add('dark-theme')
}
document.querySelector('.dark').addEventListener('click',_ => {
    document.body.classList.toggle('dark-theme')
    if(document.body.classList.contains('dark-theme')) {
        window.localStorage.setItem('dark',true)
    }else {
        window.localStorage.removeItem('dark')
    }
})
async function GetCountry() {
    try {
        ShowLoad();
        let data = await fetch('data.json');
        let result = data.json();
        return result;
    }catch(e) {
        console.log(e);
    }
}
function SearchCountry(value,re) {
    let results = []
    for (let i = 0; i < re.length; i++) {
        if(re[i].name.toLowerCase().startsWith(value.toLowerCase())) {
            results.push(re[i]);
        }        
    }
    return results;
}

GetCountry().then(result => {
    search_country.addEventListener('keyup',_ => {
        if(search_country.value !== '') {
            result_box.innerHTML = '';
            let arr_result = SearchCountry(search_country.value,result);
            if(arr_result.length == 0) {
                result_box.innerHTML = `
                    <p class="text-center fs-2">Not Found !</p>`
            }
            for (let i = 0; i < arr_result.length; i++) {
                result_box.innerHTML += `
                <div class="card">
                    <img src="${arr_result[i].flag}" alt="" class="card-img-top">
                    <div class="card-body">
                        <h3 class="card-title">${arr_result[i].name}</h3>
                        <p class="card-text">Population: <span>${separateNumber(arr_result[i].population)}</span></p>
                        <p class="card-text">Region: <span>${arr_result[i].region}</span></p>
                        <p class="card-text">Capital: <span>${arr_result[i].capital}</span></p>
                    </div>
                </div>`
            }
        }else {
            ShowRandomly();
        }
    })
    async function ShowByRegion(region) {
        let countries = [];
        for (let i = 0; i < result.length; i++) {
            if(result[i].region == region) {
                countries.push(result[i]);
            }            
        }
        return countries;
    }

    select.addEventListener('click', _ => {
        select.classList.toggle('show');
        select.nextElementSibling.classList.toggle('show')
    })
    select.nextElementSibling.querySelectorAll('li').forEach(element => {
        element.addEventListener('click', _ => {
            select.children[0].setAttribute('value',element.textContent);
            select.children[0].textContent = element.textContent;
            select.nextElementSibling.classList.remove('show')
            select.classList.remove('show');
            let countries = ShowByRegion(element.textContent);
            result_box.innerHTML = '';
            countries.then(async(e) => {
                for (let i = 0; i < e.length; i++) {
                 setTimeout(_ => {
                        result_box.innerHTML += `
                    <div class="card">
                        <img src="${e[i].flag}" alt="" class="card-img-top">
                        <div class="card-body">
                            <h3 class="card-title">${e[i].name}</h3>
                            <p class="card-text">Population: <span>${separateNumber(e[i].population)}</span></p>
                            <p class="card-text">Region: <span>${e[i].region}</span></p>
                            <p class="card-text">Capital: <span>${e[i].capital}</span></p>
                        </div>
                    </div>`;
                    }, 100);
                }
            })
        })
    })
    ShowRandomly();
    function ShowRandomly() {
        result_box.innerHTML = ''
        let rand_num = [];
        for (let index = 0; index < 8; index++) {
            let randIndex = Math.floor(Math.random() * result.length);
            check = true;
            while(check) {
                if(index === 0 ){
                    rand_num.push(randIndex);
                    check = false;
                }
                if(rand_num.includes(randIndex)) {
                    randIndex = Math.floor(Math.random() * result.length)
                }else {
                    rand_num.push(randIndex);
                    check = false;
                }
            }
            result_box.innerHTML += `
                <div class="card">
                    <img src="${result[randIndex].flag}" alt="" class="card-img-top">
                    <div class="card-body">
                        <h3 class="card-title">${result[randIndex].name}</h3>
                        <p class="card-text">Population: <span>${separateNumber(result[randIndex].population)}</span></p>
                        <p class="card-text">Region: <span>${result[randIndex].region}</span></p>
                        <p class="card-text">Capital: <span>${result[randIndex].capital}</span></p>
                    </div>
                </div>`
        }
    }
    let info_country = document.querySelector('.info-country');
    let result_info_country = document.querySelector('.result-info');
    function ShowResult(etat,value='') {
        if(etat) {
            result_box.parentElement.style.display = 'none';
            info_country.style.display = 'block';
            let res = SearchCountry(value,result);
            result_info_country.innerHTML = `
            <img src="${res[0].flag}" alt="">
            <div class="inf">
                <h3 class="mb-4">${res[0].name}</h3>
               <div class="box d-flex justify-content-between mb-5 flex-wrap">
                <ul>
                    <li>Native Name: <span>${res[0].nativeName}</span></li>
                    <li>Population: <span>${separateNumber(res[0].population)}</span></li>
                    <li>Region: <span>${res[0].region}</span></li>
                    <li>Sub Region: <span>${res[0].subregion}</span></li>
                    <li>Capital: <span>${res[0].capital}</span></li>
                </ul>
                <ul>
                    <li>Top Level Domain: <span>${res[0].topLevelDomain}</span></li>
                    <li class="curren">Currencies: <span>${res[0].currencies[0].name}</span></li>
                    <li class="">Languages: <span class="lang"></span></li>
                </ul>
               </div>
               <div class="border-countries d-flex align-items-center gap-2 flex-wrap">
                <p class="mb-0">Boorder Countries:</p>
               </div>
            </div>
            `
            for (let i = 0; i < res[0].languages.length; i++) {
                document.querySelector('.lang').innerHTML += `${res[0].languages[i].name} `;       
            }
            if(res[0].borders) {
                for (let i = 0; i < res[0].borders.length; i++) {
                    document.querySelector('.border-countries').innerHTML += `
                    <span class="btn border">${res[0].borders[i]}</span>
                    `                
                }
            }else {
                document.querySelector('.border-countries').innerHTML += "Not Found !"
            }
            setTimeout(() => {
                info_country.classList.add('show')
            }, 100);

        }else {
            info_country.classList.remove('show');
            result_box.parentElement.style.display = 'block';
            setTimeout(() => {
                info_country.style.display = 'none';
            }, 200);
        }

    }
    let back_btn = document.querySelector('.back_btn');
    back_btn.addEventListener('click',_ => {
        ShowResult(false)
    })
    result_box.addEventListener('click',e => {
        if(e.target.parentElement.classList[0] == 'card') {
            ShowResult(true,e.target.parentElement.children[1].children[0].textContent);
        }else if(e.target.parentElement.classList[0] == 'card-body') {
            ShowResult(true,e.target.parentElement.children[0].textContent);
        }else if(e.target.parentElement.classList[0] == 'card-text'){
            ShowResult(true,e.target.parentElement.parentElement.children[0].textContent)
        }
    })
})


function separateNumber(number) {
    const number_1 = number;
    const formattedNumber = number_1.toLocaleString("en-US");
    return formattedNumber;
}


let start = 0;
let rest = 8;
let turn = 0
function ShowDataScroll(data) {
    let division = data.length % 8;
    let arr_result = [];
    if(division == 0) {
        if(rest < data.length) {
            for (let i  = start; i < rest; i++) {
                arr_result.push(data[i]);
            }
            start = rest;
            rest += 8;
            return arr_result;
        }
    }
    if(division > 0) {
        if(turn == 0) rest = division;
        turn++;
        if(rest < data.length) {
            for (let i = start; i < rest; i++) {
                arr_result.push(data[i]);
            }
            start = rest;
            rest += 8;
            return arr_result;
        }
    }
    return false;
}
