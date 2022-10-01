const akaneko = require('akaneko');
const { getLastMessageInChat } = require('@adiwajshing/baileys')
//const { from } = require('../handler')
const list = ['hentai','pussy','masturbation']

async function hentais(name){
return new Promise((resolve,reject) =>{
if(name === 'pussy') return akaneko.nsfw.pussy().then((imageURL) =>{
res = []
result = []
const wah = {
url: imageURL
}
resolve({
creator: '@Hazn',
result: wah
})
})
if(name === 'hentai'){
res = []
result = []
akaneko.nsfw.hentai().then(imageURL =>{
const as = {
url: imageURL
}
resolve({
status: true,
result: as
})
})
}
if(name === '') return akaneko.nsfw.pussy().then((imageURL) =>{
result = []
message = []
const yah = {
message: 'hentai not found'
}
resolve({
status: false,
result: yah
})
})
})
}
hentais()

module.exports = { hentais }
