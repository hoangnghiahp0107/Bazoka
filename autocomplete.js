let availableKeywords = [
    'Đà Nẵng',
    'Việt Nam',
    'Đà Lạt',
    'Thành phố Vũng tàu',
    'Nha Trang',
    'Bangkok',
    'Kuala Lumpur',
    'Pattaya'
];

const resultsBox = document.querySelector(".result-box");
const inputBox = document.getElementById("input-box");

inputBox.onclick = function() {
    display(availableKeywords);
};

inputBox.onkeyup = function(){
    let result = [];
    let input = inputBox.value.trim();
    if(input.length){
        result = availableKeywords.filter((keyword)=>{
            return keyword.toLowerCase().includes(input.toLowerCase());
        });
    } else {
        result = availableKeywords;
    }
    display(result);
    if(!result.length){
        resultsBox.innerHTML = '';
    }
}

function display(result){
    const content = result.map((list)=>{
        return "<li onclick=selectInput(this)>" + list + "</li>";
    });
    resultsBox.innerHTML = "<ul>" + content.join('') + "</ul>";
}

function selectInput(list){
    inputBox.value = list.innerHTML;
    resultsBox.innerHTML = '';
}