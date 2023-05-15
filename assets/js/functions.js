
if (window.location.href.includes("signup")||window.location.href.includes("users/edit")) {

    let student = document.getElementById("student")
    let exampleInputPassword1=document.getElementById("exampleInputPassword1")
    let flexSwitchCheckDefault=document.getElementById("flexSwitchCheckDefault")

    student.addEventListener("change", (event) => {
        if (event.target.value == "student") {
            document.querySelector(".accademic").classList.remove("hide")
            document.querySelector(".prev-subjects").classList.remove("hide")
        }
        else {
            document.querySelector(".accademic").classList.add("hide")
            document.querySelector(".prev-subjects").classList.add("hide")
        }
    })
    flexSwitchCheckDefault.onclick=()=>{
        if(flexSwitchCheckDefault.checked==true){
            let text="qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890"
            let cipherText=[];
            for (let i = 0; i < 8; i++) {
                cipherText.push(text[Math.floor(Math.random()*text.length)])
            }
            exampleInputPassword1.value=cipherText.join("")
        }
        else  exampleInputPassword1.value=""
    }
    
}



else if (window.location.href.includes("regMaterials")) {

    let studentSub = document.querySelector(".student-sub");
    let materialForm = document.querySelector(".regMaterials .form")
    let currSub = document.querySelector(".currSub")
    let arr = []

    if (studentSub) {
        studentSub.addEventListener("change", (event) => {
            let Val = event.target.value;
            if (arr.every((e) => e != Val)) {
                arr.unshift(Val)
                let subDiv = document.createElement("div");
                subDiv.className = "stu-sub";
                let subPragraph = document.createElement("p");
                subPragraph.textContent = Val;
                let subSpan = document.createElement("span");
                subSpan.textContent = `X`;
                subDiv.appendChild(subPragraph);
                subDiv.appendChild(subSpan);
                currSub.value = arr;
                document.querySelector(".accademic-time span").textContent = arr.length * 3
                materialForm.appendChild(subDiv);
                subSpan.onclick = () => {
                    subDiv.style.display = "none"
                    arr = arr.filter((e) => e != subPragraph.textContent)
                    document.querySelector(".accademic-time span").textContent = arr.length * 3
                }
            }
        })
    }

}


else if (window.location.href.includes("users")||window.location.href.includes("getDepartments")||window.location.href.includes("getMaterials")){

    let FormDelete=document.querySelectorAll(".delete-form")
    
    let btnDelete=document.querySelectorAll(".delete")
    let v=false;
    
    FormDelete.forEach((e,i)=>{
            e.onsubmit=()=>{
                let text
                if(window.location.href.includes("users"))
                text="هذا المستخدم"
                else if(window.location.href.includes("getDepartments"))
                text="هذا القسم"
                else text="هذه المادة"
                if(v==false){
                    event.preventDefault();
                    Swal.fire({
                        title: `هل تريد ان تحذف  ${text}؟`,
                        icon:'warning',
                        showCancelButton:true,
                      }).then((data)=>{
                        if(data.isConfirmed){
                            v=true
                            btnDelete[i+1].click()
                        }
                    })
                }

            }
    })
        
    }




document.addEventListener('click', (e) => {
    if (e.target.classList.contains('print-btn')) {
        window.print()
    }

    if (e.target.classList.contains('close')) {
        const alert = e.target.parentElement
        alert.setAttribute('style', 'width:0 !important; opacity:0; right:0; height:48px')
        setTimeout(() => {
            alert.remove();
        }, 1100);
    }
    // close sidebar
    if (e.target.classList.contains('close-sidebar')) {
        e.target.parentElement.setAttribute('style', 'transform: translateX(-185px)')
        const gear = document.querySelector('.gear')
        const gearSvg = document.querySelector('.fa-gear')
        gearSvg.classList.toggle('rotateGear')
        gear.parentElement.setAttribute('style', 'transform: translateX(0)')
    }

    // open sidebar
    if (e.target.classList.contains('gear')) {
        const gear = document.querySelector('.fa-gear')
        gear.classList.toggle('rotateGear');
        if (gear.classList.contains('rotateGear')) {
            e.target.parentElement.setAttribute('style', 'transform: translateX(183px)')
            e.target.parentElement.nextElementSibling.setAttribute('style', 'transform: translateX(0)')
        } else {
            e.target.parentElement.nextElementSibling.setAttribute('style', 'transform: translateX(-185px)')
            e.target.parentElement.setAttribute('style', 'transform: translateX(0)')
        }
    }

})


const passwordInputs = document.querySelectorAll('input[type=password]');
passwordInputs.forEach(input=>{
    input.addEventListener('mouseenter', (e)=>{
        e.target.type = 'text'
    })
})
passwordInputs.forEach(input=>{
    input.addEventListener('mouseleave', (e)=>{
        e.target.type = 'password'
    })
})