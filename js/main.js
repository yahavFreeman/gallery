'use strict'
console.log('Starting up');

function init(){
    const projects=renderProjects()
    var elportfolio=document.querySelector('.put-modals')
    projects.forEach(function(project){
        var strHtml='<div class="col-md-4 col-sm-6 portfolio-item">'
        +`<a class="portfolio-link ${project.id}" data-toggle="modal" onclick="onModal(this)"  style="text-align:center;">`
        +'<div class="portfolio-hover">'
        +'<div class="portfolio-hover-content">'
        +'<i class="fa fa-plus fa-3x"></i>'
        +'</div>'
        +'</div>'
        +`<img class="img-fluid port-image" src="${project.image}" alt="">`
        +'</a>'
        +'<div class="portfolio-caption">'
        +`<h4>${project.id}</h4>`
        '<p class="text-muted">Illustration</p>'
        +'</div></div>';
        elportfolio.innerHTML+=strHtml
    })
}

function onModal(which){
const projects=renderProjects()
var project=projects.filter(proj=>{
    return (proj.id===which.classList[1])
})
var elModal=document.querySelector(".portfolio-modal")
elModal.innerHTML='<div class="modal-dialog"><div class="modal-content"><div class="close-modal" data-dismiss="modal">'
+'<div class="lr"><div class="rl"></div></div></div>'
+'<div class="container"><div class="row"><div class="col-lg-8 mx-auto"><div class="modal-body">'
+'<!-- Project Details Go Here -->'
+`<h2>${project[0].id}</h2>`
+`<p class="item-intro text-muted">${project[0].title}</p>`
+`<img class="img-fluid d-block mx-auto" src="${project[0].image}" alt="">`
+`<p>${project[0].desc}</p>`
+'<ul class="list-inline">'
+`<li>Date: ${project[0].publishedAt}</li>`
+'<li>Client: coding academy</li>'
+`<li>Category: ${project[0].category}</li>`
+'</ul>'
+`<a href="${project[0].url}" target="blank" class="btn btn-primary view"><span></span> View Project</a>`
+'<button class="btn btn-primary cl" data-dismiss="modal" type="button">'
+'<i class="fa fa-times"></i>Close Project</button></div></div></div></div></div></div>'
$("#portfolioModal1").modal({ show: false})
$("#portfolioModal1").modal('show');
}

function onSendMail(){
    const elMail=document.querySelector('#email')
    var address=elMail.value
    const elSubject= document.querySelector("#subject")
    var subject=elSubject.value
    const elMessage=document.querySelector("#message")
    var message=elMessage.value
    window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=freeman.yav@gmail.com&su=${subject}&body=${message}`)
}


