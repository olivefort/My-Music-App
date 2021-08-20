const URLart = 'http://musicbrainz.org/ws/2/recording/?fmt=json&query=artist:';
const URLalb = 'http://musicbrainz.org/ws/2/recording/?fmt=json&query=release:';
const URLtit = 'http://musicbrainz.org/ws/2/recording/?fmt=json&query=recording:';
const URLimg = 'http://coverartarchive.org/release/';

const off7 = '&offset=';
let roll = 0;

const sub = document.getElementById('sub');
const allPage = document.getElementById('allPage');
const newSearch = document.getElementById('newSearch');
const type = document.getElementById('type');
let resultatCont = document.getElementById('resultatCont');
const modal = document.getElementById('myModal');
//const modcont = document.getElementById('modcont');
const tpage = document.getElementById('totalpage');
const tresu = document.getElementById('totalResult')

sub.addEventListener('click', (ev) => {
    ev.preventDefault();
    resultatCont.textContent = '';
    allPage.textContent = '';
    tpage.textContent = '';
    newSeek = newSearch.value;
    countPage = 1;
    valoff = '0';
    if(type.value === "artiste"){
        getData(URLart, newSeek, valoff)
    }else if(type.value === "titre"){
        getData(URLtit, newSeek, valoff)
    }else if(type.value === "album"){
        getData(URLalb, newSeek, valoff)
    }else{
        getDataAll(URLalb, newSeek, valoff)
    }
})

//fonction de création des résultats
function createResult(datac,tour){
    roll = tour;
    console.log('roll : '+roll);
    console.log('datac.count : '+datac.count);
    const record = datac.recordings;
    const page = datac.count/25;
    console.log('datac.count/25 = '+page);
    const reste = datac.count%25;
    console.log('il ya aura '+Math.floor(page)+ ' pages de 25 résultats et 1 page de '+reste+ ' résultat(s)');
    const totalPage = Math.ceil(page);
    console.log('il y aura donc un total de ' +totalPage+ ' pages')
    indexPagination(totalPage);
    tpage.textContent = 'il y a un total de : '+ totalPage + ' page(s)';
    tresu.textContent = 'il y a '+datac.count+' résultats';
    
    // const first = document.getElementById('0');
    // const last = document.getElementById('2');
   
    for( let i=0; i<roll; i++){
        const cont = document.createElement('div');
        const number = document.createElement('p');
        const resArt = document.createElement('p');
        const resTit = document.createElement('p');
        const resAlb = document.createElement('p');
        const btn = document.createElement('button');
        cont.className = "container resultat";
        number.className = "nbr";
        resArt.className = "arr";
        resTit.className = "tir";
        resAlb.className = "alr";
        btn.className = "inr";
        btn.id = "btn";
        console.log('valoff : '+valoff);
        number.textContent = parseInt(valoff)+i+1;
        console.log(parseInt(number.textContent));
        let rep = parseInt(number.textContent);
        if( rep > datac.count){
            break
        }
        btn.textContent = "Info";
        cont.appendChild(number);
        cont.appendChild(resArt);
        cont.appendChild(resTit);
        cont.appendChild(resAlb);
        cont.appendChild(btn);
        resultatCont.appendChild(cont);
        const bloc = record[i];
        console.log('bloc : '+bloc);
        const realize = bloc.releases;
        console.log(realize);
        //partie pour extraire le nom du titre
        const recording = bloc.title;
        console.log('le titre est : '+recording);
        //partie pour extraire le nom de l'artiste
        //ici impossible de faire "const artcred = bloc.artist-credit;" donc :  
        const{"artist-credit":artistCredit} = bloc;
        let artcre = artistCredit[0].name;
        console.log("l'artiste est : "+artistCredit[0].name)
        resArt.textContent = artistCredit[0].name;
        resTit.textContent = recording;
        let genre = artistCredit[0].artist.disambiguation;
        console.log("le genre est : "+genre);
        let time = milliConv(bloc.length);
        console.log("la durée du morceau est de : "+time)
        let score = bloc.score;
        let rec = bloc.title;
        if (datac.recordings[i].releases === undefined){
            resAlb.textContent ='No Release';
        }else{
            resAlb.textContent = realize[0].title;
            console.log("l'album est : "+realize[0].title);
        }
        
        btn.addEventListener('click', (ev) => {
            
            if (datac.recordings[i].releases === undefined){
                createModal(genre, artcre, time, '', score, rec);
            }else{
                getImg(URLimg+datac.recordings[i].releases[0].id);
                album = realize[0].title;
                createModal(genre, artcre, time, album, score, rec);
            }
            modal.style.display = 'block';
            ev.preventDefault();
        });
        //fermeture de la modal quand clik en dehors de celle ci
        window.onclick = function(event) {
            if (event.target == modal) {
              modal.style.display = "none";
              document.getElementById("myModal").textContent = "";
            }
        }
    }
}

//fonction de création de la modale
function createModal(genre, artiste, duree, album, score, titre){
    console.log(album)
    const modale = document.createElement('div');
    const span = document.createElement('span');
    const artisteMod = document.createElement('p');
    const titreMod = document.createElement('p');
    const albumMod = document.createElement('p');
    const genreMod = document.createElement('p');
    const dureeMod = document.createElement('p');
    const scoreMod= document.createElement('p');
    if(artiste === undefined){
        artisteMod.textContent = "Artiste : inconnu";
    }else{
        artisteMod.textContent = artiste;
    }

    if(titre === undefined){
        titreMod.textContent = "Titre : inconnu";
    }else{
        titreMod.textContent = titre;
    }

    if(album === undefined){
        albumMod.textContent = "Album : inconnu";
    }else{
        albumMod.textContent = album;
    }

    if(genre === undefined){
        genreMod.textContent = "Style : inconnu";
    }else{
        genreMod.textContent = "Style : " +genre;
    }

    if(duree === "NaN:NaN"){
        dureeMod.textContent = "Durée : inconnu";
    }else{
        dureeMod.textContent = "Durée : " +duree;
    }

    if(score === undefined){
        scoreMod.textContent = "Score sur 100 : inconnu";
    }else{
        scoreMod.textContent = "Score sur 100 : " +score;
    }
    modale.id = "myModale";
    modale.className = "modal-content";
    artisteMod.className = "modart";
    titreMod.className = "modtit";
    albumMod.className = "modalb";
    dureeMod.className = "des";
    scoreMod.className = "des";
    genreMod.className = "des";
    span.className = "close";
    span.id = "close";
    span.textContent = "X";
    span.addEventListener('click', (ev) => {
        modal.style.display = 'none';
        document.getElementById("myModal").textContent = "";
    })
    modale.appendChild(span);
    modal.appendChild(modale);
    modale.appendChild(artisteMod);
    modale.appendChild(titreMod);
    modale.appendChild(albumMod);
    modale.appendChild(genreMod);
    modale.appendChild(dureeMod);
    modale.appendChild(scoreMod);
}

//fonction convertisseur du timer milliseconde => minute+seconde
function milliConv(duration) {
    let seconds = Math.floor((duration / 1000) % 60);
    let minutes = Math.floor((duration / (1000 * 60)) % 60);
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;
    return minutes + ":" + seconds;
    }

//fonction recupération de l'image
function getImg(cover){
    const request = new XMLHttpRequest();
        request.open("GET",cover, true);
        request.addEventListener("readystatechange", () => {
            if (request.readyState === XMLHttpRequest.DONE && request.status === 200) {
                const recupimg = JSON.parse(request.responseText);
                const linkimg = recupimg.images[0].image;
                displayImg(linkimg);
            } else  if (request.readyState === XMLHttpRequest.DONE && request.status === 404) {
                displayImg('');
            }
        });
    request.send();
}

//fonction d'insertion de l'image dans la modale
function displayImg(urlImg){
    const imgModal = document.getElementById('myModale');
    const imgmod = document.createElement('img');
    imgmod.className = "imgZik";
    imgModal.appendChild(imgmod);
    if (urlImg === ''){
        imgmod.alt = 'pas d\'image';
    }else{
        imgmod.alt = 'covert de l\'album';
        imgmod.src = urlImg;
    }
    
}


/*Fonction pour remonter en haut de page*/
function backToTop() {
    if (window.pageYOffset > 0) {
      window.scrollBy(0, -2000);
      setTimeout(backToTop, 0);
    }
}

//fonction effet clic sur la pagination 
function Pagination(index){
    valoff = (index-1) * 25;
    resultatCont.textContent = ''; 
    allPage.textContent = '';
    newSeek = newSearch.value;
    backToTop();
    if(type.value === "artiste"){
        getData(URLart, newSeek, valoff);
    }else if(type.value === "titre"){
        getData(URLtit, newSeek, valoff);
    }else if(type.value === "album"){
        getData(URLalb, newSeek, valoff);
    }else{
        getDataAll(URLalb, newSeek, valoff);
    }
    
}

//fonction de creation de pagination 
function indexPagination(totalPage){
    const prec = document.createElement('li');
    const aref1 = document.createElement('a'); 
    prec.id = 'prec';
    prec.className = "aff";
    aref1.textContent = "<<";
    prec.appendChild(aref1);
    allPage.appendChild(prec);
    for( let i=0; i<totalPage; i++){
        const indexPage = document.createElement('li'); 
        indexPage.id = [i+1]; 
        indexPage.className = "page"; 
        const aref3 = document.createElement('a');
        aref3.textContent = [i+1];
        indexPage.addEventListener('click', (ev) => { 
            Pagination([i+1]);
            ev.preventDefault();
        })
        indexPage.appendChild(aref3);
        allPage.appendChild(indexPage);
        if(indexPage.className=="page"){
            indexPage.style.display = 'none';
        }
    }
    repere = ((valoff+25)/25);
    lastpage = document.getElementById(totalPage);
    lastpage.className = 'aff';
    let currentPage = document.getElementById((valoff+25)/25)
    currentPage.className = 'cp';
    currentPage.style.display = "block";
    const suiv = document.createElement('li');
    const aref2 = document.createElement('a');
    suiv.className = "aff"; 
    aref2.textContent = ">>";
    suiv.appendChild(aref2);
    allPage.appendChild(suiv);
    suiv.id = 'suiv';
    const first = document.getElementById('prec')
    const last = document.getElementById('suiv')
    if( repere === totalPage ){
        lastpage.style.display = 'block';
        suiv.style.display = 'none'
    }else if( repere === totalPage-1 ){
        let aff = document.getElementById(repere);
        aff.style.display = 'block';
        lastpage.style.display = 'block';
        suiv.style.display = 'none';
    }else{
        for(i=1;i<3;i++){
            let aff = document.getElementById((valoff+25)/25+i)
            aff.className = "aff";
            aff.style.display = 'block';
        }
    }
    if(valoff == 0){
        first.style.display = 'none';
    }else if(valoff == (totalPage-1)*25){
        last.style.display = 'none';
    }
    if(totalPage == 1){
        first.style.display = 'none';
        last.style.display = 'none';
    }
    first.addEventListener('click', (ev)=> {
        let newValoff = valoff/25;
        Pagination(newValoff);
        ev.preventDefault;
    })
    last.addEventListener('click', (ev)=> {
        let newValoff = (valoff+50)/25
        Pagination(newValoff);
        ev.preventDefault;
    })
     
}




//fonction de récupération de données
function getData(linq, search, valoff ){
    const request = new XMLHttpRequest();
        request.open("GET", linq+'"'+search+'"'+off7+valoff, true);
        request.addEventListener("readystatechange", () => {
            if (request.readyState === XMLHttpRequest.DONE && request.status === 200) {
                const data = JSON.parse(request.responseText);
                console.log('data.count :'+data.count);
                console.log('data :'+data);
                if(data.count>25){
                    createResult(data, 25);
                }else{
                    createResult(data, data.count);
                }
            }
        });
    request.send()
}


function getDataAll(linq, search, valoff){
    const request = new XMLHttpRequest();
        request.open("GET", linq+'"'+search+'"'+'+'+"artist:"+'"'+search+'"'+'+'+"recording:"+'"'+search+'"'+off7+valoff, true);
        request.addEventListener("readystatechange", () => {
            if (request.readyState === XMLHttpRequest.DONE && request.status === 200) {
                const data = JSON.parse(request.responseText);
                if(data.count>25){
                    createResult(data, 25);
                }else{
                    createResult(data, data.count);
                }   
            }
        });
    request.send()
}