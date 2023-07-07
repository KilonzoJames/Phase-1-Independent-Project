function showPage(pageId) {
    let pages = document.getElementsByClassName('page');
    for (let i = 0; i < pages.length; i++) {
        pages[i].classList.remove('active');
    }
    document.getElementById(pageId).classList.add('active');
}

window.onload = function() {
    let anchors = document.querySelectorAll('nav a');
    for (let i = 0; i < anchors.length; i++) {
        anchors[i].addEventListener('click', function(event) {
            event.preventDefault();
            let pageId = this.getAttribute('href').substr(1);
            showPage(pageId);
        });
    }
};

let assessments= [];
let profiles=[];
let playerName;
document.addEventListener('DOMContentLoaded', async() => {
    try {
        await fetchAssessments();
      } catch (error) {
        console.error('Error occurred while fetching and appending data:', error);
      }
    await profileFetch();
    
    document.querySelector('#form1').addEventListener('submit',(e)=>{e.preventDefault();
    usernameInput=e.target.exampleInputName.value;
    playerName=usernameInput;
    usernameGreeting(usernameInput);
   

    const page1 = document.getElementById('page1');
    const page2 = document.getElementById('page2');
    page1.classList.remove('active');
    page2.classList.add('active');
    });
})
function fetchAssessments(){
    return fetch(`https://my-json-server.typicode.com/KilonzoJames/Phase-1-Independent-Project/assessments`)
    .then(res=>res.json())
    .then(data=> {
        assessments = data;
        console.log("Assessments array:", assessments);
        startQuizFunction(assessments);
    }   )
    .catch(error => { console.error('Error occurred while fetching data:', error.message);
    }); 
   }
function profileFetch(){
    return fetch(`https://my-json-server.typicode.com/KilonzoJames/Phase-1-Independent-Project/profiles`)
    .then(res=>res.json())
    .then(data=> {
        profiles = data;
        console.log('Data received from profiles:', profiles);
        appendToLeaderboard(profiles);
        const maxId = Math.max(...profiles.map(profile => parseInt(profile.rank)));
        const nextRank = isNaN(maxId) ? 1 : maxId + 1;
        return nextRank;
    })
        .catch(error => {
    console.error('Error occurred while fetching data:', error);
    }); 
}
function appendToLeaderboard(profiles){
    const profileData=document.querySelector('#profileData')
    profileData.innerHTML="";
    profiles.forEach((profile)=>{
    const row = document.createElement('tr');

    const ranking = document.createElement('td');
    ranking.textContent = profile.rank;
    row.appendChild(ranking);

    const playerName = document.createElement('td');
    playerName.textContent = profile.playerName;
    row.appendChild(playerName);

    const scoring = document.createElement('td');
    scoring.textContent = profile.score;
    row.appendChild(scoring);

    profileData.appendChild(row);
    });
}
    let questionElement=document.querySelector('#pQuestion')
    let answerBtn=document.querySelector('#answerBtn');
    let quizNumber=document.querySelector('.question span')
    let nextBtn=document.querySelector('#next');
    let previousBtn=document.querySelector('#previous');
    let currentIndex = 0;
    let score=0;
    let rank=0
    

    function startQuizFunction(assessments){
       currentIndex=0;
       score=0;
       displayQuestion()
    }
    function displayQuestion() {
        let currentAssessment = assessments[currentIndex];
        let questionNumber=currentIndex+1;
        let quizFraction=currentAssessment.id+"/"+ assessments.length;
        quizNumber.textContent=quizFraction;
        questionElement.innerHTML =questionNumber+". " + currentAssessment.question;
        answerBtn.innerHTML = "";
        currentAssessment.choices.forEach(choice=>{
            const btn=document.createElement("button");
            btn.textContent=choice.text;
            btn.classList.add("btn");
            btn.addEventListener("click", function() {
                if (choice.correct === true) {
                  btn.style.backgroundColor = "green";
                  score++;
                } else {
                  btn.style.backgroundColor = "red";
                }  
                const buttons = Array.from(answerBtn.children);
                buttons.forEach(button => {
                  if (button !== btn) {
                    button.disabled = true;
                  }
                });
              });
              answerBtn.appendChild(btn);
            });
          }
     

    nextBtn.addEventListener('click',  function () {
        currentIndex++;
        if (currentIndex < assessments.length) {
            displayQuestion();
        } else if(currentIndex===assessments.length){
            profileFetch().then(rank=>createProfileRank({rank, playerName, score }));
            
            let page2=document.querySelector("#page2");
            let leaderboard=document.querySelector("#page3");
            page2.classList.remove("active");
            leaderboard.classList.add("active");
            alert(`${playerName}, your score is ${score}! Now go out and play.`)
        }
        else {
        console.log('Quiz completed');
       }
        }); 
    previousBtn.addEventListener('click', function(){
        currentIndex--;
        if(currentIndex >= 0){
            displayQuestion();
        }else{
            console.log('Start');
        }
        })


  
function usernameGreeting(input){
   let greeting= document.querySelector('#greeting')
   greeting.textContent=`Welcome, ${input}!`;
}
function displayScore(){
    let myScore=document.querySelector("#myScore span")
    myScore.innerHTML=`${score}`
}
function createProfileRank(profile){
    const maxId = Math.max(...profiles.map(profile => parseInt(profile.id)));
    const nextId = (maxId + 1).toString();
    const addProfile={
        id:nextId,
        rank:profile.rank,
        playerName:profile.playerName,
        score:profile.score
    };
    const submitData={method: 'POST',
    headers: {
      'Content-Type': 'application/json',
        Accept: "application/json"
    },
    body: JSON.stringify(addProfile)
    }
    return fetch('http://localhost:3000/profiles', submitData)
      .then(response => response.json())
      .then(data => {console.log('Data:', data);
      displayScore(score);
      })
        .catch(error => {console.error('Error:', error);
        });
}
let toggleButton = document.getElementById('toggleButton');
let dropdownForm = document.getElementById('dropdownForm');

toggleButton.addEventListener('click', function() {
  if (dropdownForm.style.display === 'none') {
    dropdownForm.style.display = 'block';
  } else {
    dropdownForm.style.display = 'none';
  }
});

document.querySelector('#dropdownForm').addEventListener('submit',(e)=>{e.preventDefault();
   let adminInput=e.target.adminName.value;
   welcomeAdmin=document.querySelector("#page4 span");
   welcomeAdmin.textContent=`${adminInput}!`;
   alert("Welcome back!");
   const page1 = document.getElementById('page1');
   const page4 = document.getElementById('page4');
   page1.classList.remove('active');
   page4.classList.add('active');
   });
