let history = [];

// Load JSON data
fetch("digitaltwin.json")
  .then(res=>res.json())
  .then(data=>{ history = data.listening_history; updateUI(); });

function updateUI(){
    const list = document.getElementById("history");
    list.innerHTML="";
    let moodCount={}, artistCount={};

    history.forEach(s=>{
        const li=document.createElement("li");
        li.textContent=`${s.song} - ${s.artist} (${s.mood})`;
        list.appendChild(li);
        moodCount[s.mood]=(moodCount[s.mood]||0)+1;
        artistCount[s.artist]=(artistCount[s.artist]||0)+1;
    });

    const topMood=Object.keys(moodCount).reduce((a,b)=> moodCount[a]>moodCount[b]?a:b);
    const topArtist=Object.keys(artistCount).reduce((a,b)=> artistCount[a]>artistCount[b]?a:b);

    document.getElementById("totalSongs").textContent="Total Songs: "+history.length;
    document.getElementById("topMood").textContent="Top Mood: "+topMood;
    document.getElementById("topArtist").textContent="Top Artist: "+topArtist;
}

function askQuestion(){
    const q=document.getElementById("question").value.toLowerCase();
    let answer="I don't understand.";

    const moodCount={}, artistCount={};
    history.forEach(s=>{
        moodCount[s.mood]=(moodCount[s.mood]||0)+1;
        artistCount[s.artist]=(artistCount[s.artist]||0)+1;
    });

    if(q.includes("total")) answer=history.length+" songs";
    else if(q.includes("top mood")) answer=Object.keys(moodCount).reduce((a,b)=> moodCount[a]>moodCount[b]?a:b);
    else if(q.includes("top artist")) answer=Object.keys(artistCount).reduce((a,b)=> artistCount[a]>artistCount[b]?a:b);
    else if(q.includes("percentage") && q.includes("mood")){
        answer="";
        for(let m in moodCount) answer+=`${m}: ${(moodCount[m]/history.length*100).toFixed(1)}% | `;
    }
    else if(q.includes("list") && q.includes("artists")) answer=[...new Set(history.map(s=>s.artist))].join(", ");
    else if(q.includes("happy")) answer=history.filter(s=>s.mood==="happy").map(s=>s.song).join(", ");
    else if(q.includes("recommend")){
        const r=history[Math.floor(Math.random()*history.length)];
        answer=`${r.song} - ${r.artist}`;
    }
    else if(q.includes("songs by")){
        const artist=q.split("songs by")[1].trim();
        answer=history.filter(s=>s.artist.toLowerCase()===artist.toLowerCase()).map(s=>s.song).join(", ");
    }

    document.getElementById("answer").textContent=answer;
}