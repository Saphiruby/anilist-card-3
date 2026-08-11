import { request, gql } from "graphql-request";
import { createCanvas, loadImage } from "canvas";
import fs from "fs";


const USERNAME = "Saphiruby";


const query = gql`

query {

User(name:"${USERNAME}") {


statistics {

anime {

count
episodesWatched
minutesWatched
meanScore

}

manga {

count
chaptersRead
volumesRead
meanScore

}

}



favourites {


anime {

nodes {

title {
romaji
}

coverImage {
extraLarge
}

}

}



manga {

nodes {

title {
romaji
}

coverImage {
extraLarge
}

}

}



characters {

nodes {

name {
full
}

image {
large
}

}

}



}

}

}

`;



const data = await request(
"https://graphql.anilist.co",
query
);


const user = data.User;



const WIDTH = 1200;
const HEIGHT = 1250;


const canvas = createCanvas(
WIDTH,
HEIGHT
);

const ctx = canvas.getContext("2d");




// =====================
// BACKGROUND
// =====================


const bg = await loadImage(
"fondsombre2.png"
);


const scale = Math.max(
WIDTH / bg.width,
HEIGHT / bg.height
);


const bgWidth = bg.width * scale;
const bgHeight = bg.height * scale;


ctx.drawImage(
bg,
(WIDTH - bgWidth) / 2,
(HEIGHT - bgHeight) / 2,
bgWidth,
bgHeight
);



ctx.fillStyle =
"rgba(19,31,46,0.82)";


ctx.fillRect(
0,
0,
WIDTH,
HEIGHT
);





// =====================
// TEXT
// =====================


function text(
txt,
x,
y,
size,
color="#ffffff"
){

ctx.fillStyle = color;

ctx.font =
`bold ${size}px Arial`;

ctx.fillText(
txt,
x,
y
);

}




text(
"Saphiruby",
70,
80,
55,
"#b368e7"
);







// =====================
// STATS
// =====================


function statBox(
title,
value,
x,
y
){


ctx.fillStyle =
"#1c2b3d";


ctx.beginPath();

ctx.roundRect(
x,
y,
260,
90,
18
);

ctx.fill();



text(
value,
x + 20,
y + 40,
35,
"#b368e7"
);



text(
title,
x + 20,
y + 72,
18
);


}






function statLine(
title,
stats,
y
){


text(
title,
70,
y,
32,
"#b368e7"
);



const boxWidth = 260;
const gap = 25;


const startX = 70;



stats.forEach(
(stat,index)=>{


statBox(
stat.name,
stat.value,
startX + index * (boxWidth + gap),
y + 25
);


});


}







statLine(
"Anime Statistics",
[
{
name:"Count",
value:user.statistics.anime.count
},
{
name:"Episodes",
value:user.statistics.anime.episodesWatched
},
{
name:"Days",
value:Math.ceil(
user.statistics.anime.minutesWatched / 1440
)
}
],
170
);







statLine(
"Manga Statistics",
[
{
name:"Count",
value:user.statistics.manga.count
},
{
name:"Chapters",
value:user.statistics.manga.chaptersRead
},
{
name:"Volumes",
value:user.statistics.manga.volumesRead
}
],
350
);








// =====================
// IMAGE KEEP RATIO
// =====================


async function drawImageContain(
img,
x,
y,
w,
h
){


const ratio = Math.min(
w / img.width,
h / img.height
);



const newW =
img.width * ratio;


const newH =
img.height * ratio;



ctx.drawImage(
img,
x + (w-newW)/2,
y + (h-newH)/2,
newW,
newH
);


}








// =====================
// FAVORITES
// =====================


async function drawRow(
title,
items,
y,
character=false
){


text(
title,
70,
y,
32,
"#b368e7"
);



const imageWidth = 110;
const imageHeight = 150;
const gap = 20;



const totalWidth =
(items.length * imageWidth) +
((items.length - 1) * gap);



let x =
(WIDTH - totalWidth) / 2;



for(const item of items){


const source =
character
?
item.image.large
:
item.coverImage.extraLarge;



const img =
await loadImage(source);



await drawImageContain(
img,
x,
y + 25,
imageWidth,
imageHeight
);



x += imageWidth + gap;


}


}






await drawRow(
"Favorite Anime",
user.favourites.anime.nodes.slice(0,8),
500
);




await drawRow(
"Favorite Manga",
user.favourites.manga.nodes.slice(0,8),
720
);




await drawRow(
"Favorite Characters",
user.favourites.characters.nodes.slice(0,8),
940,
true
);







// =====================
// SAVE
// =====================


fs.writeFileSync(
"profile.png",
canvas.toBuffer("image/png")
);


console.log(
"Profile updated!"
);