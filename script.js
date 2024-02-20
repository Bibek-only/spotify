async function getsSongs(){

    let a = await fetch("http://127.0.0.1:3000/songs/");
    let b = await a.text();
    let div = document.createElement("div");
    div.innerHTML = b;
    let as = div.getElementsByTagName("a");
    let songArr = [];
    for(let i = 0; i<as.length; i++){
        const ele = as[i];
        if(ele.href.endsWith(".m4a")){
            songArr.push(ele.href.split("/songs/")[1]);
        }
    }
    return songArr;

}

async function main(){
    let songs = await getsSongs();
    let songul = document.getElementById("songList").getElementsByTagName("ul")[0]
    for (const song of songs){
            songul.innerHTML = songul.innerHTML + `<li>
            <div class="music-play">
              <img src="resources/icons/play.svg" alt="" class="icon">
              <img  src="https://i.scdn.co/image/ab67616d00004851d6676fda303d26d42d8ca391" alt="">
              <div class="music-info">
                <p class="song-name">${song.replaceAll("%20"," ")}</p>
                <p>artist- unknown</p>
              </div>
              <p>play now</p>
            </div>
          </li>`;
    }

    let audio = new Audio(songs[5]);
    // audio.play()

}

main();