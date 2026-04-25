import { useState, useEffect, useRef, useCallback } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, doc, deleteDoc, onSnapshot, query, orderBy, serverTimestamp, updateDoc, getDoc, setDoc } from "firebase/firestore";

const firebaseConfig = { apiKey:"AIzaSyAyPJj1tikHgRAms7UgO4lbVYtPoq91wVs",authDomain:"bet3d5.firebaseapp.com",projectId:"bet3d5",storageBucket:"bet3d5.firebasestorage.app",messagingSenderId:"1044542020926",appId:"1:1044542020926:web:f0291704b28643c942a06f" };
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

const ADMIN_PASSWORD = "castells2025";

const COLLES = ['Arreplegats','Pataquers','Bergants','Xoriguers','Ganàpies','Marracos','Trempats','Passarells','Emboirats','Engrescats','Penjats','Descargolats','Llunatics','Grillats','Gambirots'];
const CASTELLS = [{n:'pd3',cat:'d3'},{n:'pd3ps',cat:'d3'},{n:'3d5',cat:'d5'},{n:'4d5',cat:'d5'},{n:'td5',cat:'d5'},{n:'3d5a',cat:'d5'},{n:'4d5a',cat:'d5'},{n:'5d5',cat:'d5'},{n:'5d5mg',cat:'d5'},{n:'5d5a',cat:'d5'},{n:'pd4ps',cat:'d4'},{n:'3d5ps',cat:'d5'},{n:'td5ps',cat:'d5'},{n:'7d5',cat:'d5'},{n:'9d5',cat:'d5'},{n:'4d6',cat:'d6'},{n:'3d6',cat:'d6'},{n:'3d6a',cat:'d6'},{n:'4d6a',cat:'d6'},{n:'5d6',cat:'d6'},{n:'5d6mg',cat:'d6'},{n:'7d6',cat:'d6'},{n:'td6',cat:'d6'},{n:'5d6a',cat:'d6'},{n:'10d6',cat:'d6'},{n:'9d6',cat:'d6'},{n:'3d6ps',cat:'d6'},{n:'4d6ps',cat:'d6'},{n:'td6ps',cat:'d6'},{n:'pd5',cat:'d5'},{n:'4d7',cat:'d7'},{n:'3d7',cat:'d7'},{n:'4d7a',cat:'d7'},{n:'7d7',cat:'d7'},{n:'pd5ps',cat:'d5'},{n:'td7f',cat:'d7'},{n:'3d7a',cat:'d7'},{n:'pd6f',cat:'d6'},{n:'10d7',cat:'d7'},{n:'7d7mg',cat:'d7'},{n:'5d7',cat:'d7'},{n:'5d7mg',cat:'d7'},{n:'5d7a',cat:'d7'},{n:'4d8f',cat:'d8'},{n:'3d8f',cat:'d8'},{n:'4d7ps',cat:'d7'},{n:'3d7ps',cat:'d7'},{n:'9d7',cat:'d7'},{n:'4d8',cat:'d8'},{n:'pd7fm',cat:'d7'},{n:'td8fm',cat:'d8'},{n:'td7sf',cat:'d7'},{n:'4d8fa',cat:'d8'},{n:'3d8fa',cat:'d8'},{n:'7d8',cat:'d8'},{n:'3d8sf',cat:'d8'},{n:'pd6sf',cat:'d6'},{n:'4d9f',cat:'d9'},{n:'3d9fm',cat:'d9'},{n:'pd8fmp',cat:'d8'}];

function isPilarCastle(nom) { return nom.startsWith('pd'); }

const PTS = {"pd3":{"c":5,"d":10},"pd3ps":{"c":10,"d":15},"3d5":{"c":15,"d":20},"4d5":{"c":17,"d":22},"td5":{"c":25,"d":30},"3d5a":{"c":30,"d":40},"4d5a":{"c":32,"d":42},"5d5":{"c":35,"d":45},"5d5mg":{"c":47,"d":53},"5d5a":{"c":50,"d":55},"pd4ps":{"c":65,"d":75},"3d5ps":{"c":70,"d":80},"td5ps":{"c":75,"d":85},"7d5":{"c":95,"d":110},"9d5":{"c":130,"d":165},"4d6":{"c":140,"d":185},"3d6":{"c":150,"d":195},"3d6a":{"c":200,"d":250},"4d6a":{"c":215,"d":265},"5d6":{"c":270,"d":340},"5d6mg":{"c":280,"d":350},"7d6":{"c":285,"d":355},"td6":{"c":300,"d":425},"5d6a":{"c":335,"d":360},"10d6":{"c":350,"d":450},"9d6":{"c":380,"d":470},"3d6ps":{"c":480,"d":610},"4d6ps":{"c":495,"d":630},"td6ps":{"c":500,"d":640},"pd5":{"c":450,"d":670},"4d7":{"c":540,"d":690},"3d7":{"c":615,"d":785},"4d7a":{"c":800,"d":1075},"7d7":{"c":1010,"d":1225},"pd5ps":{"c":1150,"d":1320},"td7f":{"c":1225,"d":1450},"3d7a":{"c":1250,"d":1475},"pd6f":{"c":1350,"d":1515},"10d7":{"c":1525,"d":1985},"7d7mg":{"c":1550,"d":2000},"5d7":{"c":1565,"d":2010},"5d7mg":{"c":1650,"d":2155},"5d7a":{"c":1775,"d":2235},"4d8f":{"c":1780,"d":2260},"3d8f":{"c":1785,"d":2300},"4d7ps":{"c":2050,"d":2600},"3d7ps":{"c":2250,"d":2825},"9d7":{"c":2355,"d":2930},"4d8":{"c":2380,"d":3000},"pd7fm":{"c":2500,"d":3250},"td8fm":{"c":2680,"d":3450},"td7sf":{"c":3015,"d":3865},"4d8fa":{"c":3415,"d":4055},"3d8fa":{"c":3485,"d":4120},"7d8":{"c":3270,"d":4215},"3d8sf":{"c":3615,"d":4875},"pd6sf":{"c":4105,"d":5145},"4d9f":{"c":5220,"d":6105},"3d9fm":{"c":5435,"d":6975},"pd8fmp":{"c":5510,"d":7120}};

const OPA = {"Arreplegats":{"pd3":0.953323,"pd3ps":0.941832,"3d5":0.931902,"4d5":0.919263,"td5":0.932171,"3d5a":0.924701,"4d5a":0.913637,"5d5":0.887022,"5d5mg":0.886021,"5d5a":0.885769,"pd4ps":0.921631,"3d5ps":0.905604,"td5ps":0.901869,"7d5":0.851098,"9d5":0.811846,"4d6":0.8787,"3d6":0.893828,"3d6a":0.861253,"4d6a":0.837938,"5d6":0.835979,"5d6mg":0.834244,"7d6":0.803862,"td6":0.84836,"5d6a":0.83249,"10d6":0.731462,"9d6":0.749551,"3d6ps":0.806383,"4d6ps":0.789011,"td6ps":0.790924,"pd5":0.806312,"4d7":0.752318,"3d7":0.73419,"4d7a":0.620871,"7d7":0.548637,"pd5ps":0.618523,"td7f":0.463231,"3d7a":0.522303,"pd6f":0.453836,"10d7":0.284029,"7d7mg":0.333313,"5d7":0.328875,"5d7mg":0.299155,"5d7a":0.284557,"4d8f":0.135044,"3d8f":0.222108,"4d7ps":0.169752,"3d7ps":0.232345,"9d7":0.157572,"4d8":0.174752,"pd7fm":0.138273,"td8fm":0.087161,"td7sf":0.165663,"4d8fa":0.048903,"3d8fa":0.091675,"7d8":0.078608,"3d8sf":0.107226,"pd6sf":0.113712,"4d9f":0.015495,"3d9fm":0.001233},"Pataquers":{"pd3":0.928857,"pd3ps":0.917052,"3d5":0.906805,"4d5":0.894039,"td5":0.906432,"3d5a":0.89831,"4d5a":0.887114,"5d5":0.860301,"5d5mg":0.858765,"5d5a":0.858379,"pd4ps":0.892871,"3d5ps":0.876495,"td5ps":0.872409,"7d5":0.819841,"9d5":0.776409,"4d6":0.841667,"3d6":0.855983,"3d6a":0.818774,"4d6a":0.794147,"5d6":0.785365,"5d6mg":0.782689,"7d6":0.751834,"td6":0.789564,"5d6a":0.779988,"10d6":0.670193,"9d6":0.686289,"3d6ps":0.729041,"4d6ps":0.709678,"td6ps":0.710602,"pd5":0.723048,"4d7":0.66712,"3d7":0.640222,"4d7a":0.507586,"7d7":0.431733,"pd5ps":0.501942,"td7f":0.350315,"3d7a":0.410494,"pd6f":0.344046,"10d7":0.213212,"7d7mg":0.263946,"5d7":0.260474,"5d7mg":0.244458,"5d7a":0.236981,"4d8f":0.089604,"3d8f":0.179984,"4d7ps":0.147929,"3d7ps":0.220308,"9d7":0.148717,"4d8":0.16761,"pd7fm":0.135171,"td8fm":0.085683,"td7sf":0.165405,"4d8fa":0.048797,"3d8fa":0.091598,"7d8":0.07856,"3d8sf":0.107225,"pd6sf":0.113712,"4d9f":0.015495,"3d9fm":0.001233},"Bergants":{"pd3":0.933812,"pd3ps":0.921946,"3d5":0.911635,"4d5":0.898844,"td5":0.91113,"3d5a":0.902865,"4d5a":0.89164,"5d5":0.864782,"5d5mg":0.863122,"5d5a":0.862704,"pd4ps":0.896855,"3d5ps":0.880388,"td5ps":0.876208,"7d5":0.823133,"9d5":0.778356,"4d6":0.843045,"3d6":0.85706,"3d6a":0.817999,"4d6a":0.79281,"5d6":0.780851,"5d6mg":0.777707,"7d6":0.746614,"td6":0.780765,"5d6a":0.774527,"10d6":0.660012,"9d6":0.674966,"3d6ps":0.70908,"4d6ps":0.688428,"td6ps":0.688705,"pd5":0.699212,"4d7":0.641995,"3d7":0.609145,"4d7a":0.463426,"7d7":0.385671,"pd5ps":0.456589,"td7f":0.308061,"3d7a":0.369073,"pd6f":0.304089,"10d7":0.194928,"7d7mg":0.246296,"5d7":0.243241,"5d7mg":0.232634,"5d7a":0.227602,"4d8f":0.08091,"3d8f":0.172308,"4d7ps":0.14528,"3d7ps":0.219275,"9d7":0.148078,"4d8":0.167152,"pd7fm":0.135045,"td8fm":0.085642,"td7sf":0.165402,"4d8fa":0.048796,"3d8fa":0.091597,"7d8":0.07856,"3d8sf":0.107225,"pd6sf":0.113712,"4d9f":0.015495,"3d9fm":0.001233},"Xoriguers":{"pd3":0.915233,"pd3ps":0.902811,"3d5":0.891934,"4d5":0.878914,"td5":0.890269,"3d5a":0.880808,"4d5a":0.869339,"5d5":0.842112,"5d5mg":0.839453,"5d5a":0.838781,"pd4ps":0.870314,"3d5ps":0.853169,"td5ps":0.848301,"7d5":0.791655,"9d5":0.738251,"4d6":0.799558,"3d6":0.811837,"3d6a":0.762752,"4d6a":0.734709,"5d6":0.70797,"5d6mg":0.702818,"7d6":0.67072,"td6":0.690889,"5d6a":0.697628,"10d6":0.56527,"9d6":0.576421,"3d6ps":0.587623,"4d6ps":0.564423,"td6ps":0.563508,"pd5":0.570788,"4d7":0.511721,"3d7":0.473609,"4d7a":0.346489,"7d7":0.291857,"pd5ps":0.378665,"td7f":0.250796,"3d7a":0.315472,"pd6f":0.256083,"10d7":0.185966,"7d7mg":0.237895,"5d7":0.235197,"5d7mg":0.228485,"5d7a":0.224797,"4d8f":0.078437,"3d8f":0.170295,"4d7ps":0.144907,"3d7ps":0.219186,"9d7":0.148035,"4d8":0.167126,"pd7fm":0.135041,"td8fm":0.085641,"td7sf":0.165402,"4d8fa":0.048796,"3d8fa":0.091597,"7d8":0.07856,"3d8sf":0.107225,"pd6sf":0.113712,"4d9f":0.015495,"3d9fm":0.001233},"Ganàpies":{"pd3":0.938468,"pd3ps":0.926568,"3d5":0.91622,"4d5":0.903414,"td5":0.915635,"3d5a":0.907283,"4d5a":0.896038,"5d5":0.869151,"5d5mg":0.86741,"5d5a":0.866971,"pd4ps":0.900889,"3d5ps":0.884357,"td5ps":0.88011,"7d5":0.826662,"9d5":0.780827,"4d6":0.845047,"3d6":0.85881,"3d6a":0.818158,"4d6a":0.792473,"5d6":0.777651,"5d6mg":0.774078,"7d6":0.742767,"td6":0.773605,"5d6a":0.77046,"10d6":0.651563,"9d6":0.665454,"3d6ps":0.691595,"4d6ps":0.66978,"td6ps":0.669478,"pd5":0.678263,"4d7":0.619919,"3d7":0.582086,"4d7a":0.428452,"7d7":0.352121,"pd5ps":0.425622,"td7f":0.28202,"3d7a":0.34409,"pd6f":0.280836,"10d7":0.188677,"7d7mg":0.240384,"5d7":0.237547,"5d7mg":0.229462,"5d7a":0.225378,"4d8f":0.078928,"3d8f":0.170669,"4d7ps":0.144947,"3d7ps":0.219192,"9d7":0.148037,"4d8":0.167127,"pd7fm":0.135041,"td8fm":0.085641,"td7sf":0.165402,"4d8fa":0.048796,"3d8fa":0.091597,"7d8":0.07856,"3d8sf":0.107225,"pd6sf":0.113712,"4d9f":0.015495,"3d9fm":0.001233},"Marracos":{"pd3":0.922021,"pd3ps":0.909879,"3d5":0.899287,"4d5":0.886382,"td5":0.898208,"3d5a":0.889355,"4d5a":0.878009,"5d5":0.85097,"5d5mg":0.848821,"5d5a":0.848279,"pd4ps":0.881157,"3d5ps":0.864362,"td5ps":0.859849,"7d5":0.805056,"9d5":0.756168,"4d6":0.819255,"3d6":0.832449,"3d6a":0.788653,"4d6a":0.762115,"5d6":0.743129,"5d6mg":0.739022,"7d6":0.707447,"td6":0.734789,"5d6a":0.734876,"10d6":0.611616,"9d6":0.624654,"3d6ps":0.646458,"4d6ps":0.62429,"td6ps":0.62384,"pd5":0.632292,"4d7":0.573821,"3d7":0.53643,"4d7a":0.393306,"7d7":0.325355,"pd5ps":0.404158,"td7f":0.267086,"3d7a":0.330274,"pd6f":0.268701,"10d7":0.187068,"7d7mg":0.238898,"5d7":0.236138,"5d7mg":0.228843,"5d7a":0.224999,"4d8f":0.078605,"3d8f":0.170419,"4d7ps":0.144918,"3d7ps":0.219187,"9d7":0.148035,"4d8":0.167126,"pd7fm":0.135041,"td8fm":0.085641,"td7sf":0.165402,"4d8fa":0.048796,"3d8fa":0.091597,"7d8":0.07856,"3d8sf":0.107225,"pd6sf":0.113712,"4d9f":0.015495,"3d9fm":0.001233},"Trempats":{"pd3":0.947553,"pd3ps":0.935313,"3d5":0.924606,"4d5":0.91165,"td5":0.92324,"3d5a":0.91402,"4d5a":0.902591,"5d5":0.875421,"5d5mg":0.872886,"5d5a":0.872239,"pd4ps":0.903867,"3d5ps":0.886702,"td5ps":0.881795,"7d5":0.824663,"9d5":0.768329,"4d6":0.82789,"3d6":0.839157,"3d6a":0.782842,"4d6a":0.752355,"5d6":0.710803,"5d6mg":0.703407,"7d6":0.670169,"td6":0.673556,"5d6a":0.695926,"10d6":0.541832,"9d6":0.548171,"3d6ps":0.531839,"4d6ps":0.506062,"td6ps":0.504015,"pd5":0.508539,"4d7":0.448176,"3d7":0.409557,"4d7a":0.313785,"7d7":0.274925,"pd5ps":0.368436,"td7f":0.246136,"3d7a":0.311513,"pd6f":0.253058,"10d7":0.185901,"7d7mg":0.237839,"5d7":0.235146,"5d7mg":0.228474,"5d7a":0.224792,"4d8f":0.078434,"3d8f":0.170293,"4d7ps":0.144907,"3d7ps":0.219186,"9d7":0.148035,"4d8":0.167126,"pd7fm":0.135041,"td8fm":0.085641,"td7sf":0.165402,"4d8fa":0.048796,"3d8fa":0.091597,"7d8":0.07856,"3d8sf":0.107225,"pd6sf":0.113712,"4d9f":0.015495,"3d9fm":0.001233},"Passarells":{"pd3":0.890187,"pd3ps":0.874349,"3d5":0.859921,"4d5":0.845441,"td5":0.850745,"3d5a":0.833244,"4d5a":0.820106,"5d5":0.790337,"5d5mg":0.780687,"5d5a":0.77822,"pd4ps":0.790849,"3d5ps":0.768733,"td5ps":0.758808,"7d5":0.675845,"9d5":0.56267,"4d6":0.603393,"3d6":0.605906,"3d6a":0.512149,"4d6a":0.475124,"5d6":0.425922,"5d6mg":0.420418,"7d6":0.388349,"td6":0.420716,"5d6a":0.415417,"10d6":0.303419,"9d6":0.322182,"3d6ps":0.396303,"4d6ps":0.38227,"td6ps":0.385894,"pd5":0.406566,"4d7":0.356208,"3d7":0.356452,"4d7a":0.308494,"7d7":0.27384,"pd5ps":0.368091,"td7f":0.246077,"3d7a":0.311472,"pd6f":0.253035,"10d7":0.185901,"7d7mg":0.237839,"5d7":0.235146,"5d7mg":0.228474,"5d7a":0.224792,"4d8f":0.078434,"3d8f":0.170293,"4d7ps":0.144907,"3d7ps":0.219186,"9d7":0.148035,"4d8":0.167126,"pd7fm":0.135041,"td8fm":0.085641,"td7sf":0.165402,"4d8fa":0.048796,"3d8fa":0.091597,"7d8":0.07856,"3d8sf":0.107225,"pd6sf":0.113712,"4d9f":0.015495,"3d9fm":0.001233},"Emboirats":{"pd3":0.914331,"pd3ps":0.90019,"3d5":0.887514,"4d5":0.873752,"td5":0.882011,"3d5a":0.86839,"4d5a":0.85605,"5d5":0.827492,"5d5mg":0.821144,"5d5a":0.819517,"pd4ps":0.840814,"3d5ps":0.820917,"td5ps":0.813224,"7d5":0.741393,"9d5":0.649638,"4d6":0.695975,"3d6":0.700699,"3d6a":0.611019,"4d6a":0.572677,"5d6":0.504352,"5d6mg":0.495214,"7d6":0.461277,"td6":0.466726,"5d6a":0.486451,"10d6":0.340672,"9d6":0.353118,"3d6ps":0.40195,"4d6ps":0.386464,"td6ps":0.389491,"pd5":0.408791,"4d7":0.357798,"3d7":0.356723,"4d7a":0.308494,"7d7":0.27384,"pd5ps":0.368091,"td7f":0.246077,"3d7a":0.311472,"pd6f":0.253035,"10d7":0.185901,"7d7mg":0.237839,"5d7":0.235146,"5d7mg":0.228474,"5d7a":0.224792,"4d8f":0.078434,"3d8f":0.170293,"4d7ps":0.144907,"3d7ps":0.219186,"9d7":0.148035,"4d8":0.167126,"pd7fm":0.135041,"td8fm":0.085641,"td7sf":0.165402,"4d8fa":0.048796,"3d8fa":0.091597,"7d8":0.07856,"3d8sf":0.107225,"pd6sf":0.113712,"4d9f":0.015495,"3d9fm":0.001233},"Engrescats":{"pd3":0.898189,"pd3ps":0.880652,"3d5":0.864353,"4d5":0.849078,"td5":0.850935,"3d5a":0.828547,"4d5a":0.814357,"5d5":0.782968,"5d5mg":0.768754,"5d5a":0.765095,"pd4ps":0.764891,"3d5ps":0.739374,"td5ps":0.726006,"7d5":0.625819,"9d5":0.483881,"4d6":0.520078,"3d6":0.521731,"3d6a":0.438048,"4d6a":0.406943,"5d6":0.391409,"5d6mg":0.389833,"7d6":0.359627,"td6":0.410541,"5d6a":0.388487,"10d6":0.296846,"9d6":0.317657,"3d6ps":0.396113,"4d6ps":0.382158,"td6ps":0.385809,"pd5":0.406529,"4d7":0.356188,"3d7":0.356452,"4d7a":0.308494,"7d7":0.27384,"pd5ps":0.368091,"td7f":0.246077,"3d7a":0.311472,"pd6f":0.253035,"10d7":0.185901,"7d7mg":0.237839,"5d7":0.235146,"5d7mg":0.228474,"5d7a":0.224792,"4d8f":0.078434,"3d8f":0.170293,"4d7ps":0.144907,"3d7ps":0.219186,"9d7":0.148035,"4d8":0.167126,"pd7fm":0.135041,"td8fm":0.085641,"td7sf":0.165402,"4d8fa":0.048796,"3d8fa":0.091597,"7d8":0.07856,"3d8sf":0.107225,"pd6sf":0.113712,"4d9f":0.015495,"3d9fm":0.001233},"Penjats":{"pd3":0.821814,"pd3ps":0.804833,"3d5":0.789326,"4d5":0.774434,"td5":0.778205,"3d5a":0.759065,"4d5a":0.745637,"5d5":0.71546,"5d5mg":0.704872,"5d5a":0.702206,"pd4ps":0.713644,"3d5ps":0.691464,"td5ps":0.68157,"7d5":0.600167,"9d5":0.497801,"4d6":0.544326,"3d6":0.549969,"3d6a":0.474322,"4d6a":0.442038,"5d6":0.411773,"5d6mg":0.408073,"7d6":0.376842,"td6":0.417015,"5d6a":0.404706,"10d6":0.30112,"9d6":0.320657,"3d6ps":0.396268,"4d6ps":0.382253,"td6ps":0.385883,"pd5":0.406563,"4d7":0.356208,"3d7":0.356453,"4d7a":0.308494,"7d7":0.27384,"pd5ps":0.368091,"td7f":0.246077,"3d7a":0.311472,"pd6f":0.253035,"10d7":0.185901,"7d7mg":0.237839,"5d7":0.235146,"5d7mg":0.228474,"5d7a":0.224792,"4d8f":0.078434,"3d8f":0.170293,"4d7ps":0.144907,"3d7ps":0.219186,"9d7":0.148035,"4d8":0.167126,"pd7fm":0.135041,"td8fm":0.085641,"td7sf":0.165402,"4d8fa":0.048796,"3d8fa":0.091597,"7d8":0.07856,"3d8sf":0.107225,"pd6sf":0.113712,"4d9f":0.015495,"3d9fm":0.001233},"Descargolats":{"pd3":0.875038,"pd3ps":0.858366,"3d5":0.843088,"4d5":0.828265,"td5":0.832175,"3d5a":0.812903,"4d5a":0.799408,"5d5":0.769103,"5d5mg":0.758025,"5d5a":0.755202,"pd4ps":0.764346,"3d5ps":0.741394,"td5ps":0.730653,"7d5":0.644019,"9d5":0.526446,"4d6":0.567153,"3d6":0.569989,"3d6a":0.481449,"4d6a":0.446615,"5d6":0.409764,"5d6mg":0.405803,"7d6":0.374479,"td6":0.414974,"5d6a":0.402273,"10d6":0.2995,"9d6":0.319368,"3d6ps":0.396154,"4d6ps":0.382179,"td6ps":0.385824,"pd5":0.406535,"4d7":0.356191,"3d7":0.356452,"4d7a":0.308494,"7d7":0.27384,"pd5ps":0.368091,"td7f":0.246077,"3d7a":0.311472,"pd6f":0.253035,"10d7":0.185901,"7d7mg":0.237839,"5d7":0.235146,"5d7mg":0.228474,"5d7a":0.224792,"4d8f":0.078434,"3d8f":0.170293,"4d7ps":0.144907,"3d7ps":0.219186,"9d7":0.148035,"4d8":0.167126,"pd7fm":0.135041,"td8fm":0.085641,"td7sf":0.165402,"4d8fa":0.048796,"3d8fa":0.091597,"7d8":0.07856,"3d8sf":0.107225,"pd6sf":0.113712,"4d9f":0.015495,"3d9fm":0.001233},"Llunatics":{"pd3":0.899485,"pd3ps":0.882153,"3d5":0.866073,"4d5":0.850889,"td5":0.85313,"3d5a":0.831261,"4d5a":0.817179,"5d5":0.785955,"5d5mg":0.772194,"5d5a":0.76865,"pd4ps":0.769618,"3d5ps":0.744391,"td5ps":0.731306,"7d5":0.632383,"9d5":0.491504,"4d6":0.527364,"3d6":0.528722,"3d6a":0.44253,"4d6a":0.410674,"5d6":0.392422,"5d6mg":0.390645,"7d6":0.36035,"td6":0.410649,"5d6a":0.38913,"10d6":0.296894,"9d6":0.317681,"3d6ps":0.396113,"4d6ps":0.382158,"td6ps":0.385809,"pd5":0.406529,"4d7":0.356188,"3d7":0.356452,"4d7a":0.308494,"7d7":0.27384,"pd5ps":0.368091,"td7f":0.246077,"3d7a":0.311472,"pd6f":0.253035,"10d7":0.185901,"7d7mg":0.237839,"5d7":0.235146,"5d7mg":0.228474,"5d7a":0.224792,"4d8f":0.078434,"3d8f":0.170293,"4d7ps":0.144907,"3d7ps":0.219186,"9d7":0.148035,"4d8":0.167126,"pd7fm":0.135041,"td8fm":0.085641,"td7sf":0.165402,"4d8fa":0.048796,"3d8fa":0.091597,"7d8":0.07856,"3d8sf":0.107225,"pd6sf":0.113712,"4d9f":0.015495,"3d9fm":0.001233},"Grillats":{"pd3":0.874942,"pd3ps":0.857647,"3d5":0.841706,"4d5":0.826607,"td5":0.829355,"3d5a":0.808509,"4d5a":0.794684,"5d5":0.763877,"5d5mg":0.751412,"5d5a":0.748234,"pd4ps":0.753686,"3d5ps":0.72979,"td5ps":0.718105,"7d5":0.626907,"9d5":0.502245,"4d6":0.541981,"3d6":0.544696,"3d6a":0.459351,"4d6a":0.426242,"5d6":0.399329,"5d6mg":0.396556,"7d6":0.365799,"td6":0.411998,"5d6a":0.394139,"10d6":0.29763,"9d6":0.318117,"3d6ps":0.396118,"4d6ps":0.38216,"td6ps":0.38581,"pd5":0.40653,"4d7":0.356188,"3d7":0.356452,"4d7a":0.308494,"7d7":0.27384,"pd5ps":0.368091,"td7f":0.246077,"3d7a":0.311472,"pd6f":0.253035,"10d7":0.185901,"7d7mg":0.237839,"5d7":0.235146,"5d7mg":0.228474,"5d7a":0.224792,"4d8f":0.078434,"3d8f":0.170293,"4d7ps":0.144907,"3d7ps":0.219186,"9d7":0.148035,"4d8":0.167126,"pd7fm":0.135041,"td8fm":0.085641,"td7sf":0.165402,"4d8fa":0.048796,"3d8fa":0.091597,"7d8":0.07856,"3d8sf":0.107225,"pd6sf":0.113712,"4d9f":0.015495,"3d9fm":0.001233},"Gambirots":{"pd3":0.833256,"pd3ps":0.683603,"3d5":0.549813,"4d5":0.503174,"td5":0.461116,"3d5a":0.449365,"4d5a":0.438404,"5d5":0.411978,"5d5mg":0.41151,"5d5a":0.411394,"pd4ps":0.44864,"3d5ps":0.432968,"td5ps":0.429592,"7d5":0.380672,"9d5":0.345833,"4d6":0.414411,"3d6":0.430426,"3d6a":0.403035,"4d6a":0.381225,"5d6":0.387405,"5d6mg":0.386834,"7d6":0.35704,"td6":0.41029,"5d6a":0.386262,"10d6":0.29675,"9d6":0.317614,"3d6ps":0.396113,"4d6ps":0.382158,"td6ps":0.385809,"pd5":0.406529,"4d7":0.356188,"3d7":0.356452,"4d7a":0.308494,"7d7":0.27384,"pd5ps":0.368091,"td7f":0.246077,"3d7a":0.311472,"pd6f":0.253035,"10d7":0.185901,"7d7mg":0.237839,"5d7":0.235146,"5d7mg":0.228474,"5d7a":0.224792,"4d8f":0.078434,"3d8f":0.170293,"4d7ps":0.144907,"3d7ps":0.219186,"9d7":0.148035,"4d8":0.167126,"pd7fm":0.135041,"td8fm":0.085641,"td7sf":0.165402,"4d8fa":0.048796,"3d8fa":0.091597,"7d8":0.07856,"3d8sf":0.107225,"pd6sf":0.113712,"4d9f":0.015495,"3d9fm":0.001233}};

// Nivell 1-10: 5=normal (mult 1.0), rang 0.25 (nivell 1) fins a 2.2 (nivell 10)
// Nivell 1-3
// 1 = baixa, 2 = normal, 3 = alta
function lvlKeyToNum(k) {
  const n = Number(k);
  if ([1, 2, 3].includes(n)) return n;
  return 2;
}

function lvlNumToColor(n) {
  if (n === 1) return '#f85149';
  if (n === 2) return '#f0b400';
  return '#00d04b';
}

function lvlNumToLabel(n) {
  if (n === 1) return 'Baixa';
  if (n === 2) return 'Normal';
  return 'Alta';
}


function calcOdd(castellNom, collaNom, lvlKey, houseMarg, ordenat = true) {
  const p = OPA[collaNom]?.[castellNom];

  if (!p || p <= 0) return null;

  const nivell = lvlKeyToNum(lvlKey);

  // Fórmula nova:
  // CUOTA = (1 / P) ^ (1 / Nivell_Colla)
  let quota = Math.pow(1 / p, 1 / (nivell));

  // Marge de la casa
  quota = quota * (1 - houseMarg / 100);

  quota = Math.max(1.01, Math.round(quota * 100) / 100);

  if (ordenat) return quota;

  const red = Math.sqrt(quota) + (quota - 1) / 2;
  return Math.max(1.01, Math.round(red * 100) / 100);
}

// Índex ordinal de castells per comparar "o superior"
const CASTELL_ORDER = CASTELLS.map(c => c.n);
function castellIndex(nom) { return CASTELL_ORDER.indexOf(nom); }
function isCastellSuperiorOIgual(fet, apostat) {
  return castellIndex(fet) >= castellIndex(apostat);
}

// Comprova cada línia d'una aposta.
// ordenat=true  → cada slot ha de tenir un castell >= l'apostat en aquell slot exacte.
// ordenat=false → assignació greedy 1-a-1: per cada línia apostad, cal que existeixi
//   un slot real (no usat per una altra línia) amb un castell >= el requerit.
//   Exemple: apostat [9d7, 3d8f, 4d8], fets [td8fm, 9d7, 4d8]:
//     td8fm >= 9d7 ✓, 9d7 >= 3d8f ✓, 4d8 >= 4d8 ✓ → tot encertat
function checkApostaLines(lines, resultats, ordenat) {
  // Pilars sempre per slot independent
  const pilarLines = lines.filter(l => l.isPilar);
  const castellLines = lines.filter(l => !l.isPilar);

  const results = [];

  // Pilars: slot fix
  for (const line of pilarLines) {
    const res = resultats[line.nom];
    const fet = res?.pilar;
    const ok = !!fet && isCastellSuperiorOIgual(fet, line.castle);
    results.push({ ...line, ok, fetCastle: fet || null });
  }

  if (ordenat) {
    // Slot exacte
    for (const line of castellLines) {
      const res = resultats[line.nom];
      const fet = res?.[line.slotKey];
      const ok = !!fet && isCastellSuperiorOIgual(fet, line.castle);
      results.push({ ...line, ok, fetCastle: fet || null });
    }
  } else {
    // Sense ordre: agrupem per colla i fem assignació greedy per cada colla
    const perColla = {};
    for (const line of castellLines) {
      if (!perColla[line.nom]) perColla[line.nom] = [];
      perColla[line.nom].push(line);
    }
    for (const [collaNom, collaLines] of Object.entries(perColla)) {
      const res = resultats[collaNom];
      // Slots disponibles (no buits)
      const slotsDisp = ['c0','c1','c2']
        .map(s => ({ s, fet: res?.[s] }))
        .filter(x => x.fet);
      // Guardem l'índex original per retrobar cada línia després de ordenar
      const linesIdx = collaLines.map((l,i) => ({...l, _oi:i}));
      const linesSorted = [...linesIdx].sort((a,b) => castellIndex(b.castle) - castellIndex(a.castle));
      // Ordenem els slots disponibles de millor a pitjor
      const slotsSorted = [...slotsDisp].sort((a,b) => castellIndex(b.fet) - castellIndex(a.fet));
      // Greedy: cada slot es consumeix per UNA sola línia
      const usats = new Set();
      const assOrig = new Map(); // índex original -> fetCastle
      for (const line of linesSorted) {
        for (const {s, fet} of slotsSorted) {
          if (!usats.has(s) && isCastellSuperiorOIgual(fet, line.castle)) {
            usats.add(s); // consumit: no disponible per les altres línies
            assOrig.set(line._oi, fet);
            break;
          }
        }
      }
      for (let i = 0; i < collaLines.length; i++) {
        const fetCastle = assOrig.get(i) || null;
        results.push({ ...collaLines[i], ok: !!fetCastle, fetCastle });
      }
    }
  }

  // Retornem en el mateix ordre que lines
  return lines.map(l => results.find(r => r.slotKey === l.slotKey && r.nom === l.nom && r.castle === l.castle) || { ...l, ok: false, fetCastle: null });
}

const SLOT_NAMES = {c0:'1r Castell',c1:'2n Castell',c2:'3r Castell',pilar:'Pilar'};

function getCollaOptions(collaNom) {
  const opa = OPA[collaNom] || {};
  const castellos = [], pilars = [];
  CASTELLS.forEach((cas) => {
    if (opa[cas.n] > 0) {
      if (isPilarCastle(cas.n)) pilars.push(cas.n);
      else castellos.push(cas.n);
    }
  });
  return { castellos, pilars };
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@400;600;700&family=Barlow:wght@300;400;500&display=swap');
:root{--green:#00d04b;--bg:#0d1117;--bg2:#161b22;--bg3:#1f2937;--bg4:#252d3a;--border:#2a3441;--text:#e6edf3;--text-dim:#8b949e;--text-muted:#4a5568;--gold:#f0b400;--red:#f85149;--accent:#1a8cff}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Barlow',sans-serif;background:var(--bg);color:var(--text)}
select{background:var(--bg3);border:1px solid var(--border);border-radius:4px;color:var(--text);padding:6px 10px;font-family:'Barlow',sans-serif;font-size:.88rem;outline:none;cursor:pointer;width:100%}
select:focus{border-color:var(--green)} select option{background:var(--bg2)}
input{background:var(--bg);border:1px solid var(--border);border-radius:4px;color:var(--text);padding:8px 12px;font-family:'Barlow',sans-serif;font-size:.93rem;outline:none}
input:focus{border-color:var(--green)}
input[type=range]{background:transparent;border:none;padding:0;cursor:pointer;width:100%;accent-color:var(--green)}
input[type=password]{background:var(--bg);border:1px solid var(--border);border-radius:4px;color:var(--text);padding:8px 12px;font-family:'Barlow',sans-serif;font-size:.93rem;outline:none}
input[type=password]:focus{border-color:var(--green)}
button{transition:all .15s}
@keyframes fadeIn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}
@keyframes tick{from{transform:translateX(0)}to{transform:translateX(-50%)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
.fade{animation:fadeIn .2s ease}
.slot-row{border-bottom:1px solid var(--border);transition:background .15s}
.slot-row:hover{background:rgba(26,140,255,.04)}
.slot-row:last-child{border-bottom:none}
@media(max-width:768px){.ml{grid-template-columns:1fr!important}.rp{position:static!important;height:auto!important}}
`;

function Toast({msg}){return <div style={{position:'fixed',bottom:24,right:24,zIndex:2000,background:'var(--bg4)',border:'1px solid var(--green)',borderRadius:6,padding:'12px 18px',fontFamily:"'Barlow Condensed'",fontWeight:600,fontSize:'.95rem',color:'var(--text)',transition:'all .3s',pointerEvents:'none',maxWidth:340,transform:msg?'none':'translateY(80px)',opacity:msg?1:0}}>{msg}</div>;}

function Ticker({diades,houseMarg}){
  const items=[];
  diades.forEach(d=>(d.colles||[]).forEach(c=>['5d6','3d7','td6','9d5','4d7'].forEach(nom=>{const o=calcOdd(nom,c.nom,c.nivell??5,houseMarg);if(o)items.push({nom:c.nom,cas:nom,o});})));
  if(!items.length)return <div style={{background:'var(--bg3)',borderBottom:'1px solid var(--border)',height:28,display:'flex',alignItems:'center',padding:'0 16px'}}><span style={{fontFamily:"'Barlow Condensed'",fontSize:'.78rem',color:'var(--text-dim)'}}>Carregant quotes...</span></div>;
  const d=[...items,...items];
  return <div style={{background:'var(--bg3)',borderBottom:'1px solid var(--border)',overflow:'hidden',height:28,display:'flex',alignItems:'center'}}><div style={{display:'flex',gap:48,animation:'tick 35s linear infinite',whiteSpace:'nowrap',paddingLeft:'100%'}}>{d.map((it,i)=><span key={i} style={{fontFamily:"'Barlow Condensed'",fontSize:'.78rem',color:'var(--text-dim)'}}>{it.cas} <b style={{color:'var(--green)'}}>{it.nom}</b> <b style={{color:'var(--gold)'}}>×{it.o.toFixed(2)}</b></span>)}</div></div>;
}

function SlotSelector({label,isPilar,options,selected,onSelect,collaNom,lvlKey,houseMarg}){
  const odd = selected ? calcOdd(selected, collaNom, lvlKey, houseMarg) : null;
  const pts = selected ? PTS[selected] : null;
  const hasSelection = selected && odd;
  return (
    <div className="slot-row" style={{padding:'10px 14px'}}>
      <div style={{display:'flex',alignItems:'center',gap:8,marginBottom: hasSelection ? 8 : 0}}>
        <span style={{fontFamily:"'Barlow Condensed'",fontWeight:700,fontSize:'.72rem',letterSpacing:1,textTransform:'uppercase',color:isPilar?'var(--gold)':'var(--accent)',minWidth:80,flexShrink:0}}>{label}</span>
        <select value={selected || ''} onChange={e => onSelect(e.target.value || null)} style={{flex:1,background: selected ? 'rgba(26,140,255,.08)' : 'var(--bg3)',border: `1px solid ${selected ? 'var(--accent)' : 'var(--border)'}`}}>
          <option value="">— No apostar —</option>
          {options.map(n => {
            const o = calcOdd(n, collaNom, lvlKey, houseMarg);
            if (!o) return null;
            return <option key={n} value={n}>{n} o sup. — ×{o.toFixed(2)}</option>;
          })}
        </select>
        {hasSelection && <span style={{fontFamily:"'Bebas Neue'",fontSize:'1.4rem',color:'var(--gold)',lineHeight:1,flexShrink:0}}>×{odd.toFixed(2)}</span>}
      </div>
      {hasSelection && pts && (
        <div style={{display:'flex',gap:8,paddingLeft:88,fontSize:'.7rem',color:'var(--text-dim)'}}>
          <span style={{background:'rgba(0,208,75,.1)',border:'1px solid rgba(0,208,75,.3)',borderRadius:3,padding:'1px 6px',color:'var(--green)'}}>✓ {pts.c} pts</span>
          <span style={{background:'rgba(248,81,73,.1)',border:'1px solid rgba(248,81,73,.3)',borderRadius:3,padding:'1px 6px',color:'var(--red)'}}>✗ {pts.d} pts</span>
        </div>
      )}
    </div>
  );
}

function CollaMarket({colla,selections,onToggle,houseMarg}){
  const {castellos,pilars} = getCollaOptions(colla.nom);
  const sel = selections[colla.nom] || {};
  const lvl = colla.nivell ?? 2;
  const lvlN = lvlKeyToNum(lvl);
  const numSel = ['c0','c1','c2','pilar'].filter(k => sel[k]).length;
  return (
    <div className="fade" style={{background:'var(--bg2)',border:`1px solid ${numSel>0?'rgba(26,140,255,.4)':'var(--border)'}`,borderRadius:8,marginBottom:16,overflow:'hidden',transition:'border-color .2s'}}>
      <div style={{background:'var(--bg4)',padding:'10px 14px',display:'flex',alignItems:'center',justifyContent:'space-between',borderBottom:'1px solid var(--border)',flexWrap:'wrap',gap:6}}>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <span style={{fontFamily:"'Barlow Condensed'",fontWeight:700,fontSize:'1.15rem'}}>{colla.nom}</span>
          {numSel > 0 && <span style={{background:'var(--accent)',color:'#fff',borderRadius:10,fontSize:'.65rem',fontFamily:"'Barlow Condensed'",fontWeight:700,padding:'1px 7px'}}>{numSel} sel.</span>}
        </div>
        <span style={{fontSize:'.72rem',background:'var(--bg)',border:`1px solid ${lvlNumToColor(lvlN)}40`,borderRadius:3,padding:'2px 8px',color:lvlNumToColor(lvlN)}}>{lvlNumToLabel(lvlN)}</span>
      </div>
      {['c0','c1','c2'].map((slot,si) => (
        <SlotSelector key={slot} label={`${si+1}${si===0?'r':si===1?'n':'r'} Castell`} isPilar={false} options={castellos} selected={sel[slot] || null} onSelect={v => onToggle(colla.nom, slot, v)} collaNom={colla.nom} lvlKey={lvl} houseMarg={houseMarg}/>
      ))}
      <SlotSelector label="Pilar" isPilar={true} options={pilars} selected={sel.pilar || null} onSelect={v => onToggle(colla.nom, 'pilar', v)} collaNom={colla.nom} lvlKey={lvl} houseMarg={houseMarg}/>
    </div>
  );
}

function Betslip({betslip,onRemove,onPlace,stake,setStake,currentUser,ordenat,setOrdenat}){
  const combinedBase = betslip.reduce((a,b) => a * b.odd, 1);
  const combined = ordenat ? combinedBase : Math.max(1.01, Math.round((Math.sqrt(combinedBase) + (combinedBase - 1) / 2) * 100) / 100);
  const potWin = Math.round(stake * combined);
  return (
    <div>
      <div style={{fontFamily:"'Bebas Neue'",fontSize:'1.4rem',letterSpacing:1,color:'var(--green)',borderBottom:'1px solid var(--border)',paddingBottom:10,marginBottom:12,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        Butxaca
        <span style={{background:'var(--green)',color:'#000',borderRadius:12,fontSize:'.72rem',fontFamily:"'Barlow Condensed'",fontWeight:700,padding:'2px 10px'}}>{betslip.length}</span>
      </div>
      {!currentUser && (
        <div style={{background:'rgba(248,81,73,.08)',border:'1px solid rgba(248,81,73,.3)',borderRadius:6,padding:'10px 14px',marginBottom:12,fontSize:'.83rem',color:'var(--red)',textAlign:'center'}}>
          ⚠️ Inicia sessió per apostar
        </div>
      )}
      {currentUser && (
        <div style={{background:'rgba(0,208,75,.08)',border:'1px solid rgba(0,208,75,.3)',borderRadius:6,padding:'8px 14px',marginBottom:12,fontSize:'.82rem',color:'var(--green)',display:'flex',justifyContent:'space-between'}}>
          <span>👤 {currentUser.username}</span>
          <span style={{color:'var(--gold)',fontFamily:"'Barlow Condensed'",fontWeight:700}}>{currentUser.points} pts disponibles</span>
        </div>
      )}
      {!betslip.length ? (
        <div style={{textAlign:'center',padding:'36px 0',color:'var(--text-muted)',fontSize:'.85rem'}}>
          <div style={{fontSize:'2rem',marginBottom:8}}>🎪</div>
          Selecciona apostes del mercat
        </div>
      ) : (
        <>
          {betslip.map((b,i) => (
            <div key={i} className="fade" style={{background:'var(--bg3)',border:'1px solid var(--border)',borderRadius:6,padding:'10px 12px',marginBottom:7,position:'relative'}}>
              <button onClick={() => onRemove(i)} style={{cursor:'pointer',background:'none',border:'none',color:'var(--text-muted)',fontSize:'1rem',position:'absolute',top:7,right:9}}>✕</button>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',paddingRight:20}}>
                <div>
                  <div style={{fontFamily:"'Barlow Condensed'",fontWeight:700,fontSize:'.82rem',color:'var(--green)'}}>{b.nom}</div>
                  <div style={{fontSize:'.9rem',fontWeight:500,marginTop:2}}>{b.castle} o superior</div>
                  <div style={{fontSize:'.7rem',color:'var(--text-dim)',marginTop:2}}>{b.isPilar?'🔷':'🏰'} {SLOT_NAMES[b.slotKey]}</div>
                  {PTS[b.castle] && (
                    <div style={{fontSize:'.68rem',color:'var(--text-muted)',marginTop:3,display:'flex',gap:6}}>
                      <span style={{color:'rgba(0,208,75,.7)'}}>✓ {PTS[b.castle].c}pts</span>
                      <span style={{color:'rgba(248,81,73,.7)'}}>✗ {PTS[b.castle].d}pts</span>
                    </div>
                  )}
                </div>
                <div style={{fontFamily:"'Bebas Neue'",fontSize:'1.5rem',color:'var(--gold)',lineHeight:1}}>×{b.odd.toFixed(2)}</div>
              </div>
            </div>
          ))}
          <div style={{background:'var(--bg4)',border:'1px solid var(--border)',borderRadius:6,padding:12,marginTop:10}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
              <span style={{fontSize:'.72rem',color:'var(--text-dim)',fontFamily:"'Barlow Condensed'",textTransform:'uppercase'}}>Ordre dels castells</span>
              <button
                onClick={() => setOrdenat(o => !o)}
                style={{cursor:'pointer',border:`1px solid ${ordenat?'rgba(0,208,75,.5)':'rgba(248,81,73,.5)'}`,borderRadius:4,fontFamily:"'Barlow Condensed'",fontWeight:700,fontSize:'.68rem',padding:'3px 10px',background:ordenat?'rgba(0,208,75,.1)':'rgba(248,81,73,.1)',color:ordenat?'var(--green)':'var(--red)',letterSpacing:.5}}
              >
                {ordenat ? '✓ ORDENAT' : '✗ SENSE ORDRE'}
              </button>
            </div>
            {!ordenat && (
              <div style={{fontSize:'.7rem',color:'var(--red)',marginBottom:8,fontFamily:"'Barlow Condensed'"}}>
                ⚠ Quota reduïda: els castells es poden fer en qualsevol ordre
              </div>
            )}
            <div style={{display:'flex',justifyContent:'space-between',fontSize:'.83rem',color:'var(--text-dim)',marginBottom:10}}>
              <span>Quota combinada</span>
              <div style={{textAlign:'right'}}>
                {!ordenat && <div style={{fontSize:'.65rem',color:'var(--text-muted)',textDecoration:'line-through',fontFamily:"'Bebas Neue'"}}>×{combinedBase.toFixed(2)}</div>}
                <span style={{color:'var(--gold)',fontFamily:"'Bebas Neue'",fontSize:'1.1rem'}}>×{combined.toFixed(2)}</span>
              </div>
            </div>
            <div style={{fontSize:'.72rem',color:'var(--text-dim)',marginBottom:4,fontFamily:"'Barlow Condensed'",textTransform:'uppercase'}}>Punts apostats</div>
            <input type="number" value={stake} min={1} max={currentUser?.points||9999} onChange={e => setStake(Math.max(1, parseInt(e.target.value) || 1))} style={{width:'100%'}}/>
            <div style={{display:'flex',justifyContent:'space-between',fontFamily:"'Barlow Condensed'",fontWeight:700,fontSize:'1.05rem',borderTop:'1px solid var(--border)',paddingTop:8,marginTop:8}}>
              <span>Guany potencial</span>
              <span style={{color:'var(--gold)'}}>{potWin} pts</span>
            </div>
          </div>
          <button onClick={onPlace} disabled={!currentUser} style={{width:'100%',marginTop:10,padding:12,fontSize:'1rem',cursor:currentUser?'pointer':'not-allowed',border:'none',borderRadius:4,fontFamily:"'Barlow Condensed'",fontWeight:700,background:currentUser?'var(--green)':'var(--bg3)',color:currentUser?'#000':'var(--text-muted)',letterSpacing:.5,opacity:currentUser?1:0.6}}>
            APOSTAR ARA
          </button>
        </>
      )}
    </div>
  );
}

// ===== RESULTATS TAB (dins AdminModal) =====
function ResultatsTab({diades, apostes, onToast, houseMarg}) {
  const [selDiada, setSelDiada] = useState('');
  const [resultats, setResultats] = useState({});
  const [saving, setSaving] = useState(false);

  const diadaSel = diades.find(d => d.id === selDiada);

  const initResultats = (diada) => {
    const r = {};
    (diada?.colles||[]).forEach(c => { r[c.nom] = {c0:'',c1:'',c2:'',pilar:''}; });
    // Si la diada ja té resultats parcials o finals, pre-emplenar
    if (diada?.resultats) {
      Object.keys(diada.resultats).forEach(nom => { r[nom] = {...(r[nom]||{}), ...diada.resultats[nom]}; });
    }
    setResultats(r);
  };

  const updateR = (collaNom, field, val) =>
    setResultats(prev => ({...prev, [collaNom]: {...(prev[collaNom]||{}), [field]: val}}));

  // Desar en directe (sense finalitzar)
  const desarDirecte = async () => {
    if (!selDiada || !diadaSel) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, 'diades', selDiada), {resultats});
      onToast('💾 Resultats desats en directe');
    } catch(e) { onToast('❌ ' + e.message); }
    setSaving(false);
  };

  // Publicar i atorgar punts (finalitza)
  const publicarResultats = async () => {
    if (!selDiada || !diadaSel) return;
    if (!confirm('Finalitzar la diada i atorgar punts? Aquesta acció no es pot desfer.')) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, 'diades', selDiada), {resultats, resultatsFinalitzats: true});
      const apostesDiada = apostes.filter(a => a.diadaId === selDiada && !a.resolt);
      for (const ap of apostesDiada) {
        const lineResults = checkApostaLines(ap.lines||[], resultats, ap.ordenat !== false);
        const totsEncertats = lineResults.every(l => l.ok);
        const ptsConganyats = totsEncertats ? ap.potentialWin : 0;
        await updateDoc(doc(db, 'apostes', ap.id), {resolt:true, encertat:totsEncertats, ptsAtorgats:ptsConganyats, lineResults});
        if (ap.userId) {
          const uRef = doc(db, 'usuaris', ap.userId);
          const uSnap = await getDoc(uRef);
          if (uSnap.exists()) {
            const pts = uSnap.data().points || 0;
            const delta = totsEncertats ? ptsConganyats : 0;  // ptsConganyats = stake*odd, ja inclou retorn de l'apostaCosta
            await updateDoc(uRef, {points: Math.max(0, pts + delta)});
          }
        }
      }
      onToast('✅ Resultats publicats i punts atorgats!');
    } catch(e) { onToast('❌ ' + e.message); }
    setSaving(false);
  };

  // Previsualització en temps real de les apostes
  const apostesDiada = apostes.filter(a => a.diadaId === selDiada);

  return (
    <div>
      <div style={{marginBottom:14}}>
        <label style={{fontFamily:"'Barlow Condensed'",fontWeight:600,fontSize:'.78rem',textTransform:'uppercase',color:'var(--text-dim)',display:'block',marginBottom:5}}>Diada</label>
        <select value={selDiada} onChange={e => { setSelDiada(e.target.value); initResultats(diades.find(d => d.id === e.target.value)); }}>
          <option value="">— Selecciona diada —</option>
          {diades.map(d => <option key={d.id} value={d.id}>{d.name}{d.resultatsFinalitzats ? ' ✓' : ''}</option>)}
        </select>
      </div>

      {diadaSel && (<>
        <div style={{background:'var(--bg3)',borderLeft:'3px solid var(--gold)',borderRadius:4,padding:'9px 13px',fontSize:'.82rem',color:'var(--text-dim)',marginBottom:14}}>
          🏰 Actualitza els resultats en directe mentre dura la diada. Les apostes es comproven automàticament. Quan acabi, prem <b style={{color:'var(--green)'}}>FINALITZAR</b> per atorgar punts.
        </div>

        {/* Entrada de resultats per colla */}
        {(diadaSel.colles||[]).map(c => {
          const {castellos,pilars} = getCollaOptions(c.nom);
          const r = resultats[c.nom] || {};
          // Apostes d'aquesta colla per mostrar estat
          const linesAquestaColla = apostesDiada.flatMap(ap =>
            (ap.lines||[]).filter(l => l.nom === c.nom).map(l => ({
              ...l,
              bettorName: ap.bettorName,
              apId: ap.id,
              ordenat: ap.ordenat !== false,
              lineResult: checkApostaLines([l], resultats, ap.ordenat !== false)[0]
            }))
          );
          return (
            <div key={c.nom} style={{background:'var(--bg3)',border:'1px solid var(--border)',borderRadius:6,padding:'12px 14px',marginBottom:10}}>
              <div style={{fontFamily:"'Barlow Condensed'",fontWeight:700,fontSize:'1rem',marginBottom:10}}>🏴 {c.nom}</div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom: linesAquestaColla.length ? 10 : 0}}>
                {['c0','c1','c2'].map(slot => (
                  <div key={slot}>
                    <label style={{fontSize:'.65rem',color:'var(--text-dim)',display:'block',marginBottom:3,fontFamily:"'Barlow Condensed'",textTransform:'uppercase'}}>{SLOT_NAMES[slot]}</label>
                    <select value={r[slot]||''} onChange={e => updateR(c.nom, slot, e.target.value)}>
                      <option value="">— No fet —</option>
                      {castellos.map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                ))}
                <div>
                  <label style={{fontSize:'.65rem',color:'var(--gold)',display:'block',marginBottom:3,fontFamily:"'Barlow Condensed'",textTransform:'uppercase'}}>Pilar</label>
                  <select value={r.pilar||''} onChange={e => updateR(c.nom, 'pilar', e.target.value)}>
                    <option value="">— No fet —</option>
                    {pilars.map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
              </div>
              {/* Previsualització apostes per aquesta colla */}
              {linesAquestaColla.length > 0 && (
                <div style={{borderTop:'1px solid var(--border)',paddingTop:8,display:'flex',flexDirection:'column',gap:4}}>
                  <div style={{fontSize:'.65rem',fontFamily:"'Barlow Condensed'",textTransform:'uppercase',color:'var(--text-muted)',marginBottom:2}}>Apostes en curs</div>
                  {linesAquestaColla.map((l,i) => {
                    const lr = l.lineResult;
                    const hasResult = resultats[c.nom] && (l.isPilar ? resultats[c.nom].pilar : Object.values(resultats[c.nom]).some(v=>v));
                    const color = !hasResult ? 'var(--text-muted)' : lr.ok ? 'var(--green)' : 'var(--red)';
                    const icon = !hasResult ? '⏳' : lr.ok ? '✓' : '✗';
                    return (
                      <div key={i} style={{display:'flex',alignItems:'center',gap:8,fontSize:'.75rem',background:!hasResult?'transparent':lr.ok?'rgba(0,208,75,.06)':'rgba(248,81,73,.06)',borderRadius:3,padding:'3px 6px'}}>
                        <span style={{color,fontWeight:700,minWidth:14}}>{icon}</span>
                        <span style={{color:'var(--text-dim)',flex:1}}><b style={{color:'var(--text)'}}>{l.bettorName}</b> · {l.castle} o sup. {l.isPilar?'(pilar)':l.ordenat?`(${SLOT_NAMES[l.slotKey]})`: '(qualsevol ordre)'}</span>
                        {hasResult && lr.fetCastle && <span style={{color,fontFamily:"'Barlow Condensed'",fontWeight:700}}>{lr.fetCastle}</span>}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        <div style={{display:'flex',gap:8,marginTop:8}}>
          <button onClick={desarDirecte} disabled={saving} style={{flex:1,padding:'10px',cursor:'pointer',border:'1px solid var(--border)',borderRadius:4,fontFamily:"'Barlow Condensed'",fontWeight:700,fontSize:'.9rem',background:'var(--bg4)',color:'var(--text)'}}>
            {saving ? '...' : '💾 DESAR EN DIRECTE'}
          </button>
          {!diadaSel.resultatsFinalitzats && (
            <button onClick={publicarResultats} disabled={saving} style={{flex:1,padding:'10px',cursor:'pointer',border:'none',borderRadius:4,fontFamily:"'Barlow Condensed'",fontWeight:700,fontSize:'.9rem',background:'var(--green)',color:'#000'}}>
              {saving ? '...' : '✅ FINALITZAR I ATORGAR PUNTS'}
            </button>
          )}
          {diadaSel.resultatsFinalitzats && (
            <div style={{flex:1,padding:'10px',borderRadius:4,fontFamily:"'Barlow Condensed'",fontWeight:700,fontSize:'.9rem',background:'rgba(0,208,75,.1)',color:'var(--green)',textAlign:'center',border:'1px solid rgba(0,208,75,.3)'}}>
              ✓ DIADA FINALITZADA
            </div>
          )}
        </div>
      </>)}

      {diades.filter(d=>d.resultatsFinalitzats).length > 0 && (
        <div style={{marginTop:18}}>
          <div style={{fontFamily:"'Barlow Condensed'",fontWeight:600,fontSize:'.78rem',textTransform:'uppercase',color:'var(--text-muted)',marginBottom:8}}>Diades finalitzades</div>
          {diades.filter(d=>d.resultatsFinalitzats).map(d=>(
            <div key={d.id} style={{background:'rgba(0,208,75,.05)',border:'1px solid rgba(0,208,75,.2)',borderRadius:4,padding:'8px 12px',marginBottom:6,fontSize:'.82rem',display:'flex',justifyContent:'space-between'}}>
              <span>{d.name}</span>
              <span style={{color:'var(--green)',fontFamily:"'Barlow Condensed'",fontWeight:700}}>✓ Finalitzada</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ===== ADMIN MODAL =====
function AdminModal({open,onClose,diades,houseMarg,setHouseMarg,onToast,apostes,usuaris}){
  const [authed,setAuthed]=useState(false);
  const [passInput,setPassInput]=useState('');
  const [passErr,setPassErr]=useState('');
  const [tab,setTab]=useState('nova');
  const [dName,setDName]=useState('');
  const [dDate,setDDate]=useState('');
  const [checked,setChecked]=useState([]);
  const [cfg,setCfg]=useState({});
  // slider per la preview de quota
  const [previewColla,setPreviewColla]=useState(COLLES[0]);
  const [previewCastel,setPreviewCastel]=useState('5d6');


  const handlePass = () => {
    if(passInput===ADMIN_PASSWORD){setAuthed(true);setPassErr('');}
    else{setPassErr('Contrasenya incorrecta');}
  };

  const toggle=nom=>{setChecked(p=>p.includes(nom)?p.filter(c=>c!==nom):[...p,nom]);setCfg(c=>c[nom]?c:{...c,[nom]:{nivell:2}});};
  const setF=(nom,f,v)=>setCfg(c=>({...c,[nom]:{...(c[nom]||{}),[f]:v}}));

  const crear=async()=>{
    if(!dName.trim()||!dDate){alert('Falten dades');return;}
    if(!checked.length){alert('Selecciona almenys una colla');return;}
    try{
      await addDoc(collection(db,'diades'),{name:dName.trim(),date:dDate,colles:checked.map(n=>({nom:n,nivell:cfg[n]?.nivell??5})),timestamp:serverTimestamp()});
      onToast('✅ Diada creada!');setDName('');setDDate('');setChecked([]);setCfg({});onClose();
    }catch(e){onToast('❌ '+e.message);}
  };

  const del=async(id,name)=>{if(!confirm(`Eliminar "${name}"?`))return;try{await deleteDoc(doc(db,'diades',id));onToast('🗑️ Eliminada');}catch(e){onToast('❌ '+e.message);}};

  // Gestió de resultats — ara delegat a ResultatsTab

  // Exemple quota slider
  const previewLvlN = cfg['_preview']?.nivell ?? 2;
  const previewOdd = calcOdd(previewCastel, previewColla, previewLvlN, houseMarg);

  const {castellos:prevCastellos} = getCollaOptions(previewColla);

  if(!open) return null;

  return (
    <div onClick={e=>{if(e.target===e.currentTarget)onClose();}} style={{display:'flex',position:'fixed',inset:0,background:'#000c',zIndex:1000,alignItems:'flex-start',justifyContent:'center',overflowY:'auto',padding:'20px 0'}}>
      <div style={{background:'var(--bg2)',border:'1px solid var(--border)',borderRadius:10,padding:26,width:'90%',maxWidth:700,margin:'auto'}}>
        <div style={{fontFamily:"'Bebas Neue'",fontSize:'1.7rem',letterSpacing:1,color:'var(--green)',marginBottom:18,borderBottom:'1px solid var(--border)',paddingBottom:11,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          ⚙ Administració
          <button onClick={onClose} style={{cursor:'pointer',background:'none',border:'none',color:'var(--text-muted)',fontSize:'1.2rem'}}>✕</button>
        </div>

        {!authed ? (
          <div style={{padding:'30px 0',textAlign:'center'}}>
            <div style={{fontSize:'2.5rem',marginBottom:12}}>🔒</div>
            <div style={{fontFamily:"'Barlow Condensed'",fontWeight:700,fontSize:'1.1rem',marginBottom:16}}>Accés restringit</div>
            <input type="password" value={passInput} onChange={e=>setPassInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handlePass()} placeholder="Contrasenya admin" style={{width:'100%',maxWidth:300,marginBottom:10,textAlign:'center'}}/>
            {passErr && <div style={{color:'var(--red)',fontSize:'.82rem',marginBottom:10}}>{passErr}</div>}
            <button onClick={handlePass} style={{padding:'10px 28px',cursor:'pointer',border:'none',borderRadius:4,fontFamily:"'Barlow Condensed'",fontWeight:700,background:'var(--green)',color:'#000'}}>ENTRAR</button>
          </div>
        ) : (
          <>
            <div style={{display:'flex',borderBottom:'1px solid var(--border)',marginBottom:18,flexWrap:'wrap'}}>
              {[['nova','Nova Diada'],['gestio','Gestió'],['resultats','Resultats'],['params','Paràmetres']].map(([id,lbl])=>(
                <button key={id} onClick={()=>setTab(id)} style={{cursor:'pointer',background:'none',border:'none',color:tab===id?'var(--green)':'var(--text-dim)',fontFamily:"'Barlow Condensed'",fontWeight:600,fontSize:'.88rem',padding:'8px 16px',borderBottom:`2px solid ${tab===id?'var(--green)':'transparent'}`}}>{lbl}</button>
              ))}
            </div>

            {tab==='nova'&&<div>
              <label style={{fontFamily:"'Barlow Condensed'",fontWeight:600,fontSize:'.78rem',textTransform:'uppercase',color:'var(--text-dim)',display:'block',marginBottom:5}}>Nom</label>
              <input value={dName} onChange={e=>setDName(e.target.value)} placeholder="Ex: Diada de Sant Jordi 2025" style={{width:'100%',marginBottom:10}}/>
              <label style={{fontFamily:"'Barlow Condensed'",fontWeight:600,fontSize:'.78rem',textTransform:'uppercase',color:'var(--text-dim)',display:'block',marginBottom:5}}>Data</label>
              <input type="date" value={dDate} onChange={e=>setDDate(e.target.value)} style={{width:'100%',marginBottom:10}}/>
              <label style={{fontFamily:"'Barlow Condensed'",fontWeight:600,fontSize:'.78rem',textTransform:'uppercase',color:'var(--text-dim)',display:'block',marginBottom:5}}>Colles</label>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6,marginBottom:14}}>
                {COLLES.map(c=>(
                  <label key={c} style={{display:'flex',alignItems:'center',gap:8,background:'var(--bg3)',border:`1px solid ${checked.includes(c)?'var(--green)':'var(--border)'}`,borderRadius:4,padding:'7px 11px',cursor:'pointer',fontSize:'.88rem'}}>
                    <input type="checkbox" checked={checked.includes(c)} onChange={()=>toggle(c)} style={{accentColor:'var(--green)',width:15,height:15}}/>{c}
                  </label>
                ))}
              </div>
              {checked.length>0&&<div>
                <div style={{background:'var(--bg3)',borderLeft:'3px solid var(--gold)',borderRadius:4,padding:'9px 13px',fontSize:'.82rem',color:'var(--text-dim)',marginBottom:12}}>
                  💡 <b>Nivell</b>: forma esperada de la colla. Afecta les quotes. Arrossega el slider per veure l'efecte en temps real.
                </div>

                {/* Preview de quota en temps real */}
                <div style={{background:'var(--bg3)',border:'1px solid var(--border)',borderRadius:6,padding:'12px 14px',marginBottom:14}}>
                  <div style={{fontFamily:"'Barlow Condensed'",fontWeight:700,fontSize:'.88rem',marginBottom:10,color:'var(--accent)'}}>🎯 Previsualització de quota</div>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:10}}>
                    <div>
                      <label style={{fontSize:'.68rem',color:'var(--text-dim)',display:'block',marginBottom:4,fontFamily:"'Barlow Condensed'"}}>COLLA</label>
                      <select value={previewColla} onChange={e=>setPreviewColla(e.target.value)}>
                        {checked.map(c=><option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{fontSize:'.68rem',color:'var(--text-dim)',display:'block',marginBottom:4,fontFamily:"'Barlow Condensed'"}}>CASTELL</label>
                      <select value={previewCastel} onChange={e=>setPreviewCastel(e.target.value)}>
                        {prevCastellos.map(n=><option key={n} value={n}>{n}</option>)}
                      </select>
                    </div>
                  </div>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:6}}>
                    <span style={{fontSize:'.72rem',color:'var(--text-dim)',fontFamily:"'Barlow Condensed'",textTransform:'uppercase'}}>Nivell preview</span>
                    <span style={{fontFamily:"'Barlow Condensed'",fontWeight:700,color:lvlNumToColor(previewLvlN),fontSize:'.88rem'}}>{lvlNumToLabel(previewLvlN)}</span>
                  </div>
                  <input type="range" min={1} max={3} step={1}
                    value={previewLvlN}
                    onChange={e=>setF('_preview','nivell',parseInt(e.target.value))}
                    style={{width:'100%',marginBottom:8,accentColor:lvlNumToColor(previewLvlN)}}
                  />
                  <div style={{display:'flex',justifyContent:'space-between',fontSize:'.62rem',color:'var(--text-muted)',marginBottom:10}}>
                    {[1,2,3].map(n=><span key={n} style={{color:previewLvlN===n?lvlNumToColor(n):'var(--text-muted)',fontWeight:previewLvlN===n?700:400}}>{n}</span>)}
                  </div>
                  <div style={{textAlign:'center',background:'var(--bg)',borderRadius:6,padding:'12px',border:'1px solid var(--border)'}}>
                    <div style={{fontSize:'.72rem',color:'var(--text-dim)',marginBottom:4}}>{previewColla} · {previewCastel} o sup.</div>
                    <div style={{fontFamily:"'Bebas Neue'",fontSize:'2.2rem',color:'var(--gold)',lineHeight:1}}>×{previewOdd?.toFixed(2)||'—'}</div>
                  </div>
                </div>

                {checked.map(c=>(
                  <div key={c} style={{background:'var(--bg3)',border:'1px solid var(--border)',borderRadius:6,padding:'10px 12px',marginBottom:6}}>
                    <div style={{fontFamily:"'Barlow Condensed'",fontWeight:700,marginBottom:8,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                      <span>🏴 {c}</span>
                      <span style={{color:lvlNumToColor(cfg[c]?.nivell??5),fontSize:'.82rem'}}>{lvlNumToLabel(cfg[c]?.nivell??5)}</span>
                    </div>
                    <input type="range" min={1} max={3} step={1}
                      value={cfg[c]?.nivell??5}
                      onChange={e=>setF(c,'nivell',parseInt(e.target.value))}
                      style={{width:'100%',accentColor:lvlNumToColor(cfg[c]?.nivell??5)}}
                    />
                    <div style={{display:'flex',justifyContent:'space-between',fontSize:'.62rem',color:'var(--text-muted)',marginTop:3}}>
                      {[1,2,3].map(n=><span key={n} style={{color:(cfg[c]?.nivell??5)===n?lvlNumToColor(n):'var(--text-muted)',fontWeight:(cfg[c]?.nivell??5)===n?700:400}}>{n}</span>)}
                    </div>
                    <div style={{marginTop:8,fontSize:'.72rem',color:'var(--text-dim)',background:'var(--bg)',borderRadius:3,padding:'5px 8px'}}>
                      Exemple 5d6: ×{calcOdd('5d6',c,cfg[c]?.nivell??5,houseMarg)?.toFixed(2)||'—'}
                    </div>
                  </div>
                ))}
              </div>}
              <button onClick={crear} style={{marginTop:18,padding:'10px 28px',cursor:'pointer',border:'none',borderRadius:4,fontFamily:"'Barlow Condensed'",fontWeight:700,background:'var(--green)',color:'#000'}}>CREAR DIADA</button>
            </div>}

            {tab==='gestio'&&<div>
              {!diades.length?<div style={{textAlign:'center',padding:48,color:'var(--text-muted)'}}>Cap diada</div>
              :diades.map(d=>(
                <div key={d.id} style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',background:'var(--bg3)',border:'1px solid var(--border)',borderRadius:6,padding:'11px 13px',marginBottom:7}}>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontFamily:"'Barlow Condensed'",fontWeight:700,display:'flex',alignItems:'center',gap:8}}>
                      {d.name}
                      {d.resultatsFinalitzats && <span style={{background:'rgba(0,208,75,.15)',border:'1px solid rgba(0,208,75,.4)',borderRadius:3,padding:'1px 6px',fontSize:'.65rem',color:'var(--green)'}}>✓ RESULTATS</span>}
                    </div>
                    <div style={{fontSize:'.76rem',color:'var(--text-dim)',marginTop:2}}>{d.date||'—'} · {(d.colles||[]).length} colles</div>
                    <div style={{display:'flex',gap:5,flexWrap:'wrap',marginTop:6}}>
                      {(d.colles||[]).map(c=><span key={c.nom} style={{background:'var(--bg)',border:'1px solid var(--border)',borderRadius:3,padding:'2px 7px',fontSize:'.72rem',fontFamily:"'Barlow Condensed'",fontWeight:600,color:'var(--green)'}}>{c.nom}</span>)}
                    </div>
                  </div>
                  <button onClick={()=>del(d.id,d.name)} style={{cursor:'pointer',border:'none',borderRadius:4,fontFamily:"'Barlow Condensed'",fontWeight:700,fontSize:'.8rem',padding:'5px 9px',background:'var(--red)',color:'#fff',marginLeft:10,flexShrink:0}}>🗑</button>
                </div>
              ))}
            </div>}

            {tab==='resultats'&&<ResultatsTab diades={diades} apostes={apostes} onToast={onToast} houseMarg={houseMarg}/>}

            {tab==='params'&&<div>
              <div style={{background:'var(--bg3)',borderLeft:'3px solid var(--gold)',borderRadius:4,padding:'9px 13px',fontSize:'.82rem',color:'var(--text-dim)',marginBottom:14}}>
                Quotes basades en probabilitats reals (full OPA de l'Excel). El nivell ajusta la prob. base.
              </div>
              <label style={{fontFamily:"'Barlow Condensed'",fontWeight:600,fontSize:'.78rem',textTransform:'uppercase',color:'var(--text-dim)',display:'block',marginBottom:5}}>Marge de la casa (%)</label>
              <input type="number" value={houseMarg} step={1} min={0} max={25} onChange={e=>setHouseMarg(parseFloat(e.target.value)||8)} style={{width:'100%'}}/>
              <div style={{background:'var(--bg3)',borderLeft:'3px solid var(--accent)',borderRadius:4,padding:'9px 13px',fontSize:'.82rem',color:'var(--text-dim)',marginTop:10}}>
                <div style={{marginBottom:4,fontFamily:"'Barlow Condensed'",fontWeight:700,color:'var(--text)'}}>Exemple quotes Arreplegats · 5d6</div>
                Niv.1 (Baixa): ×{calcOdd('4d7','Arreplegats',1,houseMarg)?.toFixed(2)||'—'} &nbsp;·&nbsp;
                Niv.2 (Normal): ×{calcOdd('4d7','Arreplegats',2,houseMarg)?.toFixed(2)||'—'} &nbsp;·&nbsp;
                Niv.3 (Alta): ×{calcOdd('4d7','Arreplegats',3,houseMarg)?.toFixed(2)||'—'}
              </div>
              <button onClick={()=>onToast('✅ Paràmetres desats!')} style={{marginTop:14,padding:'10px 28px',cursor:'pointer',border:'none',borderRadius:4,fontFamily:"'Barlow Condensed'",fontWeight:700,background:'var(--green)',color:'#000'}}>DESAR</button>
            </div>}
          </>
        )}
      </div>
    </div>
  );
}

// ===== LOGIN MODAL =====
function LoginModal({open,onClose,onLogin,onRegister}){
  const [mode,setMode]=useState('login');
  const [user,setUser]=useState('');
  const [pass,setPass]=useState('');
  const [err,setErr]=useState('');
  const [loading,setLoading]=useState(false);

  const handle = async () => {
    if(!user.trim()||!pass.trim()){setErr('Omple tots els camps');return;}
    setLoading(true);setErr('');
    try{
      if(mode==='login') await onLogin(user.trim(),pass.trim());
      else await onRegister(user.trim(),pass.trim());
      setUser('');setPass('');onClose();
    }catch(e){setErr(e.message);}
    setLoading(false);
  };

  if(!open)return null;
  return (
    <div onClick={e=>{if(e.target===e.currentTarget)onClose();}} style={{display:'flex',position:'fixed',inset:0,background:'#000c',zIndex:1000,alignItems:'center',justifyContent:'center'}}>
      <div style={{background:'var(--bg2)',border:'1px solid var(--border)',borderRadius:10,padding:30,width:'90%',maxWidth:380}}>
        <div style={{fontFamily:"'Bebas Neue'",fontSize:'1.7rem',letterSpacing:1,color:'var(--green)',marginBottom:18,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          {mode==='login'?'Iniciar sessió':'Registre'}
          <button onClick={onClose} style={{cursor:'pointer',background:'none',border:'none',color:'var(--text-muted)',fontSize:'1.2rem'}}>✕</button>
        </div>
        <div style={{display:'flex',gap:0,marginBottom:20,background:'var(--bg3)',borderRadius:6,padding:3}}>
          {[['login','Entrar'],['register','Registrar-se']].map(([m,l])=>(
            <button key={m} onClick={()=>setMode(m)} style={{flex:1,padding:'8px',cursor:'pointer',border:'none',borderRadius:4,fontFamily:"'Barlow Condensed'",fontWeight:600,fontSize:'.88rem',background:mode===m?'var(--green)':'transparent',color:mode===m?'#000':'var(--text-dim)'}}>
              {l}
            </button>
          ))}
        </div>
        <label style={{fontFamily:"'Barlow Condensed'",fontWeight:600,fontSize:'.78rem',textTransform:'uppercase',color:'var(--text-dim)',display:'block',marginBottom:5}}>Usuari</label>
        <input value={user} onChange={e=>setUser(e.target.value)} placeholder="El teu nom d'usuari" style={{width:'100%',marginBottom:10}}/>
        <label style={{fontFamily:"'Barlow Condensed'",fontWeight:600,fontSize:'.78rem',textTransform:'uppercase',color:'var(--text-dim)',display:'block',marginBottom:5}}>Contrasenya</label>
        <input type="password" value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handle()} placeholder="Contrasenya" style={{width:'100%',marginBottom:14}}/>
        {err && <div style={{color:'var(--red)',fontSize:'.82rem',marginBottom:10}}>{err}</div>}
        {mode==='register' && <div style={{background:'rgba(0,208,75,.08)',border:'1px solid rgba(0,208,75,.2)',borderRadius:4,padding:'8px 12px',fontSize:'.78rem',color:'var(--green)',marginBottom:12}}>🎁 Nou usuari: rebràs <b>100 punts</b> per apostar!</div>}
        <button onClick={handle} disabled={loading} style={{width:'100%',padding:'11px',cursor:'pointer',border:'none',borderRadius:4,fontFamily:"'Barlow Condensed'",fontWeight:700,fontSize:'1rem',background:'var(--green)',color:'#000'}}>
          {loading?'...':(mode==='login'?'ENTRAR':'REGISTRAR-SE')}
        </button>
      </div>
    </div>
  );
}

// ===== COMUNITAT =====
function getResDirectes(diadaId, diades) {
  return diades.find(d => d.id === diadaId)?.resultats || null;
}

function ApostaCard({a, diades, showUser = true}) {
  const ts = a.timestamp?.toDate ? a.timestamp.toDate() : null;
  const ds = ts ? ts.toLocaleDateString('ca-ES',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'}) : '—';
  const resoltColor = a.resolt ? (a.encertat ? 'var(--green)' : 'var(--red)') : 'var(--text-dim)';
  // Resultats en directe si la diada té resultats parcials però no finalitzats
  const resDirectes = !a.resolt ? getResDirectes(a.diadaId, diades) : null;
  const linesCheck = resDirectes ? checkApostaLines(a.lines||[], resDirectes, a.ordenat !== false) : null;
  return (
    <div className="fade" style={{background:'var(--bg2)',border:`1px solid ${a.resolt?(a.encertat?'rgba(0,208,75,.3)':'rgba(248,81,73,.3)'):'var(--border)'}`,borderRadius:8,marginBottom:12,overflow:'hidden'}}>
      <div style={{background:'var(--bg4)',padding:'10px 14px',display:'flex',justifyContent:'space-between',alignItems:'center',borderBottom:'1px solid var(--border)',flexWrap:'wrap',gap:6}}>
        <div>
          {showUser && <span style={{fontFamily:"'Barlow Condensed'",fontWeight:700}}>👤 {a.bettorName||'Anònim'}</span>}
          <div style={{fontSize:'.72rem',color:'var(--text-dim)',marginTop:showUser?2:0}}>📅 {a.diadaName||'—'} · {ds}{a.ordenat===false&&<span style={{marginLeft:6,color:'var(--text-muted)'}}>· Sense ordre</span>}</div>
        </div>
        <div style={{textAlign:'right'}}>
          <div style={{fontFamily:"'Bebas Neue'",fontSize:'1.4rem',color:'var(--gold)'}}>×{a.combinedOdd?.toFixed(2)||'—'}</div>
          <div style={{fontSize:'.7rem',color:'var(--text-dim)'}}>{a.stake||'—'} pts → <b style={{color:'var(--green)'}}>{a.potentialWin||'—'} pts</b></div>
          {a.resolt && <div style={{fontSize:'.72rem',color:resoltColor,fontFamily:"'Barlow Condensed'",fontWeight:700,marginTop:2}}>{a.encertat?`✅ +${a.ptsAtorgats} pts`:'❌ Fallida'}</div>}
          {!a.resolt && linesCheck && <div style={{fontSize:'.68rem',color:'var(--text-muted)',fontFamily:"'Barlow Condensed'",marginTop:2}}>🔴 EN DIRECTE</div>}
        </div>
      </div>
      <div style={{padding:'6px 14px 10px'}}>
        {(a.lines||[]).map((l,li) => {
          const lr = a.resolt ? a.lineResults?.[li] : linesCheck?.[li];
          const hasResult = !!lr;
          const lineOk = hasResult && lr.ok;
          const lineFail = hasResult && !lr.ok;
          const color = !hasResult ? 'var(--gold)' : lineOk ? 'var(--green)' : 'var(--red)';
          return (
            <div key={li} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'5px 0',borderBottom:'1px solid var(--border)',paddingLeft:4,background:lineOk?'rgba(0,208,75,.04)':lineFail?'rgba(248,81,73,.04)':'transparent',borderRadius:2}}>
              <div style={{flex:1}}>
                <span style={{fontSize:'.82rem'}}><b style={{color:'var(--green)'}}>{l.nom}</b> · {l.castle} o sup.</span>
                <div style={{fontSize:'.68rem',color:'var(--text-dim)',marginTop:1}}>
                  {l.isPilar ? 'Pilar' : (a.ordenat!==false) ? SLOT_NAMES[l.slotKey] : 'Qualsevol ordre'}
                  {hasResult && lr.fetCastle && <span style={{marginLeft:6,color,fontFamily:"'Barlow Condensed'",fontWeight:700}}>→ {lr.fetCastle} {lineOk?'✓':'✗'}</span>}
                  {hasResult && !lr.fetCastle && <span style={{marginLeft:6,color:'var(--red)',fontFamily:"'Barlow Condensed'",fontWeight:700}}>→ No fet ✗</span>}
                </div>
              </div>
              <span style={{fontFamily:"'Bebas Neue'",fontSize:'1.1rem',color,flexShrink:0,marginLeft:8}}>×{l.odd?.toFixed(2)||'—'}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Comunitat({apostes,diades,currentUser}){
  const [filt,setFilt]=useState('');
  const myApostes = currentUser ? apostes.filter(a=>a.userId===currentUser.id) : [];
  const filtered = filt ? apostes.filter(a=>a.diadaId===filt) : apostes;
  return (
    <div style={{padding:20,maxWidth:960,margin:'0 auto'}}>
      <div style={{fontFamily:"'Barlow Condensed'",fontWeight:700,fontSize:'.72rem',letterSpacing:'1.5px',textTransform:'uppercase',color:'var(--text-muted)',padding:'4px 0 10px'}}>Apostes de la comunitat</div>
      <div style={{display:'flex',gap:10,marginBottom:14,flexWrap:'wrap',alignItems:'center'}}>
        <select value={filt} onChange={e=>setFilt(e.target.value)} style={{maxWidth:260}}>
          <option value="">Totes les diades</option>
          {diades.map(d=><option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
        <span style={{fontSize:'.78rem',color:'var(--text-muted)'}}>{filtered.length} aposta{filtered.length!==1?'s':''}</span>
      </div>
      {!filtered.length ? (
        <div style={{textAlign:'center',padding:48,color:'var(--text-muted)'}}>
          <div style={{fontSize:'2.5rem',marginBottom:8}}>🎪</div>
          <p>Encara no hi ha apostes.</p>
        </div>
      ) : filtered.map(a => <ApostaCard key={a.id} a={a} diades={diades} showUser={true}/>)}
    </div>
  );
}

// ===== RANKING =====
function Ranking({usuaris}){
  const sorted = [...usuaris].sort((a,b)=>b.points-a.points);
  const medals = ['🥇','🥈','🥉'];
  return (
    <div style={{padding:20,maxWidth:700,margin:'0 auto'}}>
      <div style={{fontFamily:"'Bebas Neue'",fontSize:'2rem',letterSpacing:2,color:'var(--gold)',marginBottom:4}}>🏆 RÀNQUING</div>
      <div style={{fontFamily:"'Barlow Condensed'",fontSize:'.78rem',color:'var(--text-muted)',marginBottom:18}}>Punts acumulats de totes les diades</div>
      {!sorted.length ? (
        <div style={{textAlign:'center',padding:48,color:'var(--text-muted)'}}>
          <div style={{fontSize:'2.5rem',marginBottom:8}}>🎪</div>
          <p>Encara no hi ha usuaris registrats.</p>
        </div>
      ) : sorted.map((u,i)=>(
        <div key={u.id} className="fade" style={{background:i===0?'rgba(240,180,0,.06)':i===1?'rgba(192,192,192,.04)':i===2?'rgba(205,127,50,.04)':'var(--bg2)',border:`1px solid ${i===0?'rgba(240,180,0,.3)':i===1?'rgba(192,192,192,.2)':i===2?'rgba(205,127,50,.2)':'var(--border)'}`,borderRadius:8,padding:'14px 18px',marginBottom:8,display:'flex',alignItems:'center',gap:14,transition:'all .15s'}}>
          <div style={{fontFamily:"'Bebas Neue'",fontSize:'1.6rem',color:'var(--text-muted)',minWidth:32,textAlign:'center'}}>
            {i<3?medals[i]:`#${i+1}`}
          </div>
          <div style={{flex:1}}>
            <div style={{fontFamily:"'Barlow Condensed'",fontWeight:700,fontSize:'1.05rem'}}>{u.username}</div>
            <div style={{fontSize:'.72rem',color:'var(--text-dim)',marginTop:2}}>
              {u.totalApostes||0} aposte{(u.totalApostes||0)!==1?'s':''} realitzades
            </div>
          </div>
          <div style={{textAlign:'right'}}>
            <div style={{fontFamily:"'Bebas Neue'",fontSize:'1.8rem',color:i===0?'var(--gold)':i===1?'#c0c0c0':i===2?'#cd7f32':'var(--text)',lineHeight:1}}>{u.points}</div>
            <div style={{fontSize:'.65rem',color:'var(--text-muted)',fontFamily:"'Barlow Condensed'"}}>PUNTS</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function CollesInfo(){
  return (
    <div style={{padding:20,maxWidth:900}}>
      <div style={{fontFamily:"'Barlow Condensed'",fontWeight:700,fontSize:'.72rem',letterSpacing:'1.5px',textTransform:'uppercase',color:'var(--text-muted)',padding:'4px 0 10px'}}>Informació de colles</div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:10}}>
        {COLLES.map(c=>{
          const opa=OPA[c]||{};
          const vals=Object.values(opa).filter(v=>v>0);
          const mx=vals.length?Math.max(...vals):0;
          const mxC=Object.keys(opa).find(k=>opa[k]===mx)||'—';
          const d6=CASTELLS.filter(x=>x.cat==='d6').map(x=>opa[x.n]).filter(v=>v>0);
          const avg=d6.length?(d6.reduce((a,b)=>a+b,0)/d6.length*100).toFixed(1)+'%':'—';
          return (
            <div key={c} style={{background:'var(--bg3)',border:'1px solid var(--border)',borderRadius:8,padding:14}}>
              <div style={{fontFamily:"'Barlow Condensed'",fontWeight:700,fontSize:'1.05rem',marginBottom:6}}>{c}</div>
              <div style={{fontSize:'.78rem',color:'var(--text-dim)'}}>Màx. prob: <b style={{color:'var(--green)'}}>{(mx*100).toFixed(1)}%</b> ({mxC})</div>
              <div style={{fontSize:'.78rem',color:'var(--text-dim)',marginTop:3}}>Mitja 6a: <b>{avg}</b></div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ===== APP PRINCIPAL =====
export default function App(){
  const [fb,setFb]=useState({ok:false,msg:'● Connectant...'});
  const [diades,setDiades]=useState([]);
  const [apostes,setApostes]=useState([]);
  const [usuaris,setUsuaris]=useState([]);
  const [sec,setSec]=useState('apostes');
  const [selD,setSelD]=useState(null);
  const [bs,setBs]=useState([]);
  const [sels,setSels]=useState({});
  const [stake,setStake]=useState(100);
  const [marg,setMarg]=useState(8);
  const [ordenat,setOrdenat]=useState(true);
  const [admin,setAdmin]=useState(false);
  const [loginOpen,setLoginOpen]=useState(false);
  const [currentUser,setCurrentUser]=useState(null);
  const [toast,setToast]=useState('');
  const tmr=useRef(null);
  const bref=useRef(null);
  const showToast=useCallback(m=>{setToast(m);clearTimeout(tmr.current);tmr.current=setTimeout(()=>setToast(''),3200);},[]);

  useEffect(()=>{
    const u1=onSnapshot(collection(db,'diades'),s=>{setDiades(s.docs.map(d=>({id:d.id,...d.data()})));setFb({ok:true,msg:'● Firebase OK'});},e=>{console.error(e);setFb({ok:false,msg:'● Error Firebase'});});
    const u2=onSnapshot(query(collection(db,'apostes'),orderBy('timestamp','desc')),s=>setApostes(s.docs.map(d=>({id:d.id,...d.data()}))),e=>console.error(e));
    const u3=onSnapshot(collection(db,'usuaris'),s=>setUsuaris(s.docs.map(d=>({id:d.id,...d.data()}))),e=>console.error(e));
    return()=>{u1();u2();u3();};
  },[]);

  // Sync currentUser with live usuaris data
  useEffect(()=>{
    if(currentUser){
      const updated = usuaris.find(u=>u.id===currentUser.id);
      if(updated) setCurrentUser(updated);
    }
  },[usuaris, currentUser]);

  const handleLogin = async (username, password) => {
    const uSnap = await import('firebase/firestore').then(({getDocs,where,query:q})=>
      getDocs(q(collection(db,'usuaris'),where('username','==',username)))
    );
    if(uSnap.empty) throw new Error("Usuari no trobat. Registra't primer.");
    const uDoc = uSnap.docs[0];
    const uData = uDoc.data();
    if(uData.password !== password) throw new Error("Contrasenya incorrecta.");
    setCurrentUser({id:uDoc.id,...uData});
    showToast(`✅ Benvingut, ${username}!`);
  };

  const handleRegister = async (username, password) => {
    const {getDocs,where,query:q} = await import('firebase/firestore');
    const existing = await getDocs(q(collection(db,'usuaris'),where('username','==',username)));
    if(!existing.empty) throw new Error("Aquest nom d'usuari ja existeix.");
    const newUser = {username, password, points:100, totalApostes:0, createdAt:serverTimestamp()};
    const ref = await addDoc(collection(db,'usuaris'),newUser);
    setCurrentUser({id:ref.id,...newUser,points:100});
    showToast(`🎉 Registrat! Tens 100 punts per apostar.`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setBs([]); setSels({});
    showToast('👋 Sessió tancada.');
  };

  const handleToggle = useCallback((nom, slotKey, castleOrNull) => {
    setSels(prev => ({...prev,[nom]: { ...(prev[nom] || { c0:null, c1:null, c2:null, pilar:null }), [slotKey]: castleOrNull }}));
    setBs(prev => {
      const f = prev.filter(b => !(b.nom === nom && b.slotKey === slotKey));
      if (!castleOrNull) return f;
      const colla = diades.find(d => d.id === selD)?.colles?.find(c => c.nom === nom);
      const lvlKey = colla?.nivell ?? 2;
      const odd = calcOdd(castleOrNull, nom, lvlKey, marg);
      const finalOdd = odd ?? 1.01;
      return [...f, { nom, slotKey, castle: castleOrNull, odd: finalOdd, isPilar: isPilarCastle(castleOrNull) }];
    });
  }, [diades, selD, marg]);

  const remBet = i => {
    const b = bs[i];
    setSels(prev => ({ ...prev, [b.nom]: { ...(prev[b.nom] || {}), [b.slotKey]: null } }));
    setBs(prev => prev.filter((_,j) => j !== i));
  };

  const place = async () => {
    if (!bs.length) return;
    if (!selD) { showToast('⚠️ Selecciona una diada'); return; }
    if (!currentUser) { showToast('⚠️ Has d\'iniciar sessió'); setLoginOpen(true); return; }
    const combinedBase = bs.reduce((a,b) => a * b.odd, 1);
    const combined = ordenat ? combinedBase : Math.max(1.01, Math.round((Math.sqrt(combinedBase) + (combinedBase - 1) / 2) * 100) / 100);
    const stakeVal = Math.min(stake, currentUser.points);
    if(stakeVal<=0){showToast('⚠️ No tens prou punts');return;}
    const diada = diades.find(d => d.id === selD);
    try {
      await addDoc(collection(db,'apostes'), {
        diadaId: selD,
        diadaName: diada?.name || '—',
        bettorName: currentUser.username,
        userId: currentUser.id,
        stake: stakeVal,
        combinedOdd: Math.round(combined * 100) / 100,
        potentialWin: Math.round(stakeVal * combined),
        lines: bs.map(b => ({ nom:b.nom, castle:b.castle, slotKey:b.slotKey, odd:b.odd, isPilar:b.isPilar })),
        ordenat: ordenat,
        timestamp: serverTimestamp(),
        resolt: false,
      });
      // Deducció provisional de punts (es regularà quan l'admin posi resultats)
      await updateDoc(doc(db,'usuaris',currentUser.id),{
        points: currentUser.points - stakeVal,
        totalApostes: (currentUser.totalApostes||0) + 1
      });
      showToast(`✅ Aposta! ×${combined.toFixed(2)} → ${Math.round(stakeVal*combined)} pts potencials`);
      setBs([]); setSels({});
    } catch(e) { showToast('❌ ' + e.message); }
  };

  const selDiada = id => {
    setSelD(id); setBs([]); setSels({});
    setTimeout(() => bref.current?.scrollIntoView({ behavior:'smooth', block:'start' }), 80);
  };
  const curD = diades.find(d => d.id === selD);

  const navBtn = (id) => ({
    background:'none',border:'none',cursor:'pointer',
    color: sec===id ? 'var(--green)' : 'var(--text-dim)',
    fontFamily:"'Barlow Condensed'",fontWeight:600,fontSize:'.9rem',
    padding:'10px 18px',
    borderBottom:`2px solid ${sec===id?'var(--green)':'transparent'}`,
    whiteSpace:'nowrap'
  });

  const diadaBtn = (active) => ({
    cursor:'pointer',border:`1px solid ${active?'var(--green)':'var(--border)'}`,
    borderRadius:4,fontFamily:"'Barlow Condensed'",fontWeight:700,letterSpacing:'.5px',
    padding:'8px 18px',
    background: active ? 'rgba(0,208,75,.1)' : 'transparent',
    color: active ? 'var(--green)' : 'var(--text)',
    fontSize:'.9rem',
  });

  return (
    <>
      <style>{CSS}</style>
      <Toast msg={toast}/>
      <LoginModal open={loginOpen} onClose={()=>setLoginOpen(false)} onLogin={handleLogin} onRegister={handleRegister}/>
      <header style={{background:'var(--bg2)',borderBottom:'2px solid var(--green)',display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 24px',height:58,position:'sticky',top:0,zIndex:100}}>
        <div style={{fontFamily:"'Bebas Neue'",fontSize:'2.2rem',letterSpacing:2,color:'var(--green)',textShadow:'0 0 20px #00d04b55'}}>
          BET<span style={{color:'var(--text)'}}>3</span>d5
          <em style={{color:'var(--text)',fontStyle:'normal',fontSize:'1rem',fontFamily:"'Barlow Condensed'",fontWeight:400,letterSpacing:1,marginLeft:8,verticalAlign:'middle'}}>Apostes de Castells</em>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:8,flexWrap:'wrap',justifyContent:'flex-end'}}>
          <span style={{fontSize:'.72rem',padding:'3px 10px',borderRadius:12,fontFamily:"'Barlow Condensed'",fontWeight:600,background:fb.ok?'rgba(0,208,75,.12)':'rgba(248,81,73,.12)',color:fb.ok?'var(--green)':'var(--red)',border:fb.ok?'1px solid rgba(0,208,75,.3)':'1px solid rgba(248,81,73,.3)'}}>
            {fb.msg}
          </span>
          {currentUser ? (
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              <span style={{fontFamily:"'Barlow Condensed'",fontWeight:700,fontSize:'.88rem',color:'var(--green)'}}>👤 {currentUser.username} <span style={{color:'var(--gold)'}}>{currentUser.points} pts</span></span>
              <button onClick={handleLogout} style={{cursor:'pointer',border:'1px solid var(--border)',borderRadius:4,fontFamily:"'Barlow Condensed'",fontWeight:600,fontSize:'.82rem',padding:'6px 12px',background:'transparent',color:'var(--text-muted)'}}>Sortir</button>
            </div>
          ) : (
            <button onClick={()=>setLoginOpen(true)} style={{cursor:'pointer',border:'1px solid var(--green)',borderRadius:4,fontFamily:"'Barlow Condensed'",fontWeight:700,fontSize:'.9rem',padding:'7px 16px',background:'rgba(0,208,75,.1)',color:'var(--green)'}}>
              👤 ENTRAR
            </button>
          )}
          <button onClick={() => setAdmin(true)} style={{cursor:'pointer',border:'1px solid var(--border)',borderRadius:4,fontFamily:"'Barlow Condensed'",fontWeight:700,fontSize:'.95rem',padding:'8px 18px',background:'transparent',color:'var(--text-muted)'}}>
            ⚙ ADMIN
          </button>
        </div>
      </header>
      <Ticker diades={diades} houseMarg={marg}/>
      <nav style={{background:'var(--bg2)',borderBottom:'1px solid var(--border)',display:'flex',padding:'0 24px',overflowX:'auto'}}>
        {[['apostes','🏆 Apostes'],['meues','🎫 Les meves'],['comunitat','👥 La gent'],['ranking','🥇 Rànquing']].map(([id,lbl]) => (
          <button key={id} onClick={() => setSec(id)} style={navBtn(id)}>{lbl}</button>
        ))}
      </nav>
      {sec==='apostes' && (
        <div className="ml" style={{display:'grid',gridTemplateColumns:'1fr 310px',minHeight:'calc(100vh - 120px)'}}>
          <div style={{padding:16,borderRight:'1px solid var(--border)',overflowY:'auto'}}>
            <div style={{fontFamily:"'Barlow Condensed'",fontWeight:700,fontSize:'.72rem',letterSpacing:'1.5px',textTransform:'uppercase',color:'var(--text-muted)',padding:'4px 0 10px'}}>Diades disponibles</div>
            {!diades.length ? (
              <div style={{textAlign:'center',padding:48,color:'var(--text-muted)'}}>
                <div style={{fontSize:'2.5rem',marginBottom:8}}>🏰</div>
                <p>Cap diada. Crea'n una des d'Admin.</p>
              </div>
            ) : diades.map(d => {
              const act = selD === d.id;
              return (
                <div key={d.id} className="fade" style={{background:act?'var(--bg4)':'var(--bg3)',border:`1px solid ${act?'var(--green)':'var(--border)'}`,borderRadius:8,padding:14,marginBottom:10,transition:'all .15s'}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:10}}>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontFamily:"'Barlow Condensed'",fontWeight:700,fontSize:'1.1rem',display:'flex',alignItems:'center',gap:8}}>
                        {d.name}
                        {d.resultatsFinalitzats && <span style={{background:'rgba(0,208,75,.15)',border:'1px solid rgba(0,208,75,.4)',borderRadius:3,padding:'1px 6px',fontSize:'.65rem',color:'var(--green)'}}>✓</span>}
                      </div>
                      <div style={{fontSize:'.78rem',color:'var(--text-dim)',marginTop:3}}>📅 {d.date||'—'} · 🏴 {(d.colles||[]).length} colles</div>
                      <div style={{display:'flex',gap:5,flexWrap:'wrap',marginTop:8}}>
                        {(d.colles||[]).map(c => (
                          <span key={c.nom} style={{background:'var(--bg)',border:'1px solid var(--border)',borderRadius:3,padding:'2px 7px',fontSize:'.72rem',fontFamily:"'Barlow Condensed'",fontWeight:600,color:'var(--green)'}}>{c.nom}</span>
                        ))}
                      </div>
                    </div>
                    <button onClick={() => selDiada(d.id)} style={diadaBtn(act)}>
                      {act ? '✓ OBERTA' : '🎰 APOSTAR'}
                    </button>
                  </div>
                </div>
              );
            })}
            {selD && curD && (
              <div ref={bref}>
                <div style={{height:1,background:'var(--border)',margin:'14px 0'}}/>
                <div style={{fontFamily:"'Barlow Condensed'",fontWeight:700,fontSize:'.72rem',letterSpacing:'1.5px',textTransform:'uppercase',color:'var(--text-muted)',padding:'4px 0 10px'}}>Mercat d'apostes</div>
                <div style={{background:'var(--bg3)',border:'1px solid var(--border)',borderRadius:4,padding:'7px 12px',fontSize:'.78rem',color:'var(--text-dim)',marginBottom:12}}>
                  Per cada colla tria fins a <b>3 castells</b> i <b>1 pilar</b>. Cada aposta és "X <b>o superior</b>".
                </div>
                {(curD.colles||[]).map(c => (
                  <CollaMarket key={c.nom} colla={c} selections={sels} onToggle={handleToggle} houseMarg={marg}/>
                ))}
              </div>
            )}
          </div>
          <div className="rp" style={{padding:16,background:'var(--bg2)',position:'sticky',top:120,height:'calc(100vh - 120px)',overflowY:'auto'}}>
            <Betslip betslip={bs} onRemove={remBet} onPlace={place} stake={stake} setStake={setStake} currentUser={currentUser} ordenat={ordenat} setOrdenat={setOrdenat}/>
          </div>
        </div>
      )}
      {sec==='comunitat' && <Comunitat apostes={apostes} diades={diades} currentUser={currentUser}/>}
      {sec==='ranking' && <Ranking usuaris={usuaris}/>}
      {sec==='meues' && (
        <div style={{padding:20,maxWidth:960,margin:'0 auto'}}>
          <div style={{fontFamily:"'Barlow Condensed'",fontWeight:700,fontSize:'.72rem',letterSpacing:'1.5px',textTransform:'uppercase',color:'var(--text-muted)',padding:'4px 0 10px'}}>Les meves apostes</div>
          {!currentUser ? (
            <div style={{textAlign:'center',padding:48,color:'var(--text-muted)'}}>
              <div style={{fontSize:'2.5rem',marginBottom:8}}>👤</div>
              <p>Inicia sessió per veure les teves apostes.</p>
            </div>
          ) : (() => {
            const myAp = apostes.filter(a => a.userId === currentUser.id);
            if (!myAp.length) return (
              <div style={{textAlign:'center',padding:48,color:'var(--text-muted)'}}>
                <div style={{fontSize:'2.5rem',marginBottom:8}}>🎪</div>
                <p>Encara no has fet cap aposta.</p>
              </div>
            );
            return myAp.map(a => <ApostaCard key={a.id} a={a} diades={diades} showUser={false}/>);
          })()}
        </div>
      )}
      <AdminModal open={admin} onClose={() => setAdmin(false)} diades={diades} houseMarg={marg} setHouseMarg={setMarg} onToast={showToast} apostes={apostes} usuaris={usuaris}/>
    </>
  );
}