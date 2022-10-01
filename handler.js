const { downloadContentFromMessage, proto, generateWAMessageFromContent, prepareWAMessageMedia, getLastMessageInChat, AnyMessageContent } = require('@adiwajshing/baileys');
const colors = require('colors')
const axios = require('axios')
const util = require('util')
let print = console.log;
const { fetchJson, getBuffer, getRandom, sleep, getGroupAdmins, downloadMediaMessage } = require('./utils/smsg')
const { y2mateV, y2mateA } = require('./utils/ytdl')
const { groupWhatsApp } = require('./utils/gcs')
const { wiki } = require('./utils/wiki')
const { uploadImages } = require('./utils/upimg')
const fs = require('fs')
const ytdl = require('ytdl-core')
const ffmpeg = require('fluent-ffmpeg');
const readline = require('readline')
const { hentais } = require('./utils/hentai')
const { exec, spawn } = require('child_process')
const { Sticker, createSticker, StickerTypes } = require('wa-sticker-formatter')
let regis = JSON.parse(fs.readFileSync('./database/reg.json'))
let premium = JSON.parse(fs.readFileSync('./database/premium.json'))

act = {
den:'*Sorry You Not Register Yet...*\n\n*.reg* <name>\n*To Regis/Login*',
proc:'Loading Please Wait!...',
error:'Error :(',
repair:'This Feature Maintace!',
done:'Done!',
prem:'Only Premium User Allowed',
gc:'Only Group Allowed',
owner:'Only Owner Allowed'
}

//spam?
const {
msgFilter,
isFiltered,
addFilter
} = require('./utils/spam')

function kyun(seconds){
function pad(s){
return (s < 10 ? '0' : '') + s;
}
var hours = Math.floor(seconds / (60*60));
var minutes = Math.floor(seconds % (60*60) / 60);
var seconds = Math.floor(seconds % 60);

//return pad(hours) + ':' + pad(minutes) + ':' + pad(seconds)
return `${pad(hours)} Jam ${pad(minutes)} Menit ${pad(seconds)} Detik`
}

/**
function sendMail(name, email, subject, message) {
const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");
myHeaders.set('Authorization', 'Basic ' + base64.encode('<API Key>'+":" +'<Secret Key>'));

  const data = JSON.stringify({
    "Messages": [{
      "From": {"Email": "<YOUR EMAIL>", "Name": "<YOUR NAME>"},
      "To": [{"Email": email, "Name": name}],
      "Subject": subject,
      "TextPart": message
    }]
  });

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: data,
  };

  fetch("https://api.mailjet.com/v3.1/send", requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
}
*/
prefix = '.'
global.prefix
ApiKey = 'l4MFWglNFQgD2SERyDgV4UVMbhkCbB' 
global.ApiKey

module.exports = index = async(conn, m) =>{
try {
body = (m.mtype === 'conversation') ? m.message.conversation : (m.mtype == 'imageMessage') ? m.message.imageMessage.caption : (m.mtype == 'videoMessage') ? m.message.videoMessage.caption : (m.mtype == 'extendedTextMessage') ? m.message.extendedTextMessage.text : (m.mtype == 'buttonsResponseMessage') ? m.message.buttonsResponseMessage.selectedButtonId : (m.mtype == 'listResponseMessage') ? m.message.listResponseMessage.singleSelectReply.selectedRowId : (m.mtype == 'templateButtonReplyMessage') ? m.message.templateButtonReplyMessage.selectedId : (m.mtype === 'messageContextInfo') ? m.message.buttonsResponseMessage.selectedButtonId : (m.mtype == 'listResponseMessage') ? m.message.listResponseMessage.singleSelectReply.selectedRowId : (m.mtype == 'templateButtonReplyMessage') ? m.message.templateButtonReplyMessage.selectedId : (m.mtype === 'messageContextInfo') ? (m.message.buttonsResponseMessage?.selectedButtonId || m.message.listResponseMessage?.singleSelectReply.selectedRowId) : ''
budy = (m.mtype === 'conversation') ? m.message.conversation : (m.mtype === 'extendedTextMessage') ? m.message.extendedTextMessage.text : ''
const args = body.trim().split(/ +/).slice(1)
const isCmd = body.startsWith(prefix)
const { type, quotedMsg, mentioned } = m
const command = body.replace(prefix, '').trim().split(/ +/).shift().toLowerCase()
const from = m.key.remoteJid ? m.key.remoteJid : m.key.participant
const sender = m.key.participant ? m.key.participant : m.key.remoteJid
const senderName = m.pushName ? m.pushName : ''

const isGroup = from.endsWith('@g.us')
const groupMetadata = isGroup ? await conn.groupMetadata(from) : ''
const groupName = isGroup ? groupMetadata.subject : ''
const groupId = isGroup ? groupMetadata.id : ''
const number = ["6281539336834@s.whatsapp.net"]
const isOwner = number.includes(sender)
const groupMembers = isGroup ? groupMetadata.participants : ''
const groupAdmins = isGroup ? await getGroupAdmins(groupMembers) : ''
const isReg = regis.includes(sender)
const isPremium = premium.includes(sender)
const isGroupAdmins = isGroup ? await groupAdmins.includes(sender) : false
const isBotGroupAdmins = isGroup ? await groupAdmins.includes(sender) : false

const downloadContentFromMediaMessage = async(m) => {
let mime = (m.msg || m).mimetype || ''
const stream = await downloadContentFromMessage(m.quoted ? m.quoted : m.msg, mime.split("/")[0])
let buffer = Buffer.from([])
for await(const chunk of stream) {
buffer = Buffer.concat([buffer, chunk])
}
return buffer
}
const sendContact = (jid, numbers, name, quoted, mn) => {
let number = numbers.replace(/[^0-9]/g, '')
const vcard = 'BEGIN:VCARD\n' 
+ 'VERSION:3.0\n' 
+ 'FN:' + name + '\n'
+ 'ORG:;\n'
+ 'TEL;type=CELL;type=VOICE;waid=' + number + ':+' + number + '\n'
+ 'END:VCARD'
return conn.sendMessage(from, { contacts: { displayName: name, contacts: [{ vcard }] }, mentions : mn ? mn : []},{ quoted: quoted })
}

//quoted?
const quoted = m.quoted ? m.quoted : m
const mime = (quoted.msg || quoted).mimetype || ''
const fatkuns = (m.quoted || m)
const quoted1 = (fatkuns.mtype == 'buttonsMessage') ? fatkuns[Object.keys(fatkuns)[1]] : (fatkuns.mtype == 'templateMessage') ? fatkuns.hydratedTemplate[Object.keys(fatkuns.hydratedTemplate)[1]] : (fatkuns.mtype == 'product') ? fatkuns[Object.keys(fatkuns)[0]] : m.quoted ? m.quoted : m
const qmsg = (quoted1.msg || quoted1)
const isImage = /image/.test(mime)
const isVideo = /video/.test(mime)
const isSticker = /webp/.test(mime)
const isGif = /gif/.test(mime)
const isMessage = /converstion/.test(mime)

let a = 'Free'
if(isPremium){
a = 'Premium Active'
}

if(isCmd && isGroup) print(`[CMD] ${command} from ${senderName} in ${groupName}`.green)
if(isCmd && !isGroup) print(`[CMD] ${command} from ${senderName} in private chat`.green)

switch(command){
case'menu':
case'help':
if(!isReg) return m.reply(act.den)
buttons = [
{buttonId: 'owner', buttonText: {displayText: 'Creator'}, type: 1}
]
buttonMessage = {
image: {url:'https://www.coolgenerator.com/Others/text_design_dl/text/SEFaTiBCT1Qg8J+Ysw==/font/en0003/size/30/color/d604d6'},
caption: `*Simple-Bot*\n\n*Hi* ${m.pushName}👋\n\n*Status*:\n*✅ Plans*: *${a}*\n*✅ Expired*: *Liftime*\n*${prefix}gitclone [url]*\n*Commands:*\n*${prefix}delprem [no]*\n*${prefix}pinterest [query]*\n*${prefix}fisheye [reply img]*\n*${prefix}toimg [reply img]*\n*${prefix}hentai [premium]*\n*${prefix}pussy [premium]*\n*${prefix}trigger [reply img]*\n*${prefix}nulis [text]*\n*${prefix}play [query]*\n*${prefix}ytsearch [query]*\n*${prefix}ytmp3 [url]*\n*${prefix}sticker [reply img]*\n*${prefix}stickergif [reply gif/vid]*\n*${prefix}cgc [create gc with bot] [owner only]*\n*${prefix}wiki [query]*\n*${prefix}gcsearch [query]*\n*${prefix}memegen [text1|text2]*\n*${prefix}addprem [number]*\n\n*Special*:\n*${prefix}caraorder*\n*${prefix}follower [amount|target]*\n*${prefix}view [amount|target]*\n*${prefix}like [amount|target]*\n*${prefix}pricelist*\n*${prefix}cekstatus*\n*${prefix}komisi [owner only]*\n*NB*: Username Tanpa @ Dan View Sama Like Link Post Kalian.\n\n*📢 announcement*:\n*- Added AddPremium*\n*- Added Hentai/Pussy*\n*- Added GitClone*`,
footer: '[ Hazn ]',
buttons: buttons,
headerType: 4
}
conn.sendMessage(from,buttonMessage,{quoted:m})
break
case'd':
case'delete':
if(!isReg) return m.reply(act.den)
await conn.sendMessage(from, { delete: quotedMsg })
break
case'hentai':
if(!isPremium) return m.reply(act.prem)
if(!isReg) return m.reply(act.den)
m.reply(act.proc)
hentais('hentai').then(res =>{
conn.sendMessage(from,{image:{url:`${res.result.url}`},caption:'Here OniChan~'},{quoted:m})
})
break
case'pinterest':
if(!isReg) return m.reply(act.den)
if(args.length < 1) return m.reply('query nya banh?')
asa = body.slice(10)
m.reply(act.proc)
axios.get(`https://myhuman.herokuapp.com/api/pinterest?query=${asa}`).then((res) =>{
json = JSON.parse(JSON.stringify(res.data))
console.log(json)
rans = json[Math.floor(Math.random() * json.length)]
conn.sendMessage(from,{image:{url:rans},caption:'Here!'},{quoted:m})
}).catch((e) => m.reply(`${e}`))
break
case'pussy':
if(!isPremium) return m.reply(act.prem)
if(!isReg) return m.reply(act.den)
hentais('pussy').then(res =>{
conn.sendMessage(from,{image:{url:`${res.result.url}`},caption:'Your Horny Right Now~'},{quoted:m})
})
break
case'toimg':
if(!isReg) return m.reply(act.den)
if(!isSticker) return m.reply('itu stiker?')
let media = await conn.downloadAndSaveMediaMessage(qmsg)
let ran = await getRandom('.png')
exec(`ffmpeg -i ${media} ${ran}`, (err) => {
fs.unlinkSync(media)
if (err) throw err
let buffer = fs.readFileSync(ran)
conn.sendMessage(from, { image: buffer }, { quoted: m })
fs.unlinkSync(ran)
})
break
/**
case'gitclone':
if(!isReg) return m.reply(act.den)
if(args.length < 1) return m.reply('url?')
let [, user, repo] = args[0].match(regex) || []
repo = repo.replace(/.git$/, '')
let url = `https://api.github.com/repos/${user}/${repo}/zipball`
let filename = (await fetch(url, {method: 'HEAD'})).headers.get('content-disposition').match(/attachment; filename=(.*)/)[1]
conn.sendMessage(from,url,mimetype:'document/zip',filename:filename)
break*/
case'fisheye':
if(!isReg) return m.reply(act.den)
if(!isImage) return m.reply('itu gambar?')
m.reply(act.proc)
server1 = await conn.downloadMediaMessage(qmsg)
bg = await uploadImages(server1,false)
await conn.sendMessage(from,{image:{url:`https://yog-apikey.herokuapp.com/api/fisheye?apikey=YogGanz&url=${bg}`},caption:'Done'},{quoted:m})
break
case'trigger':
if(!isReg) return m.reply(act.den)
if(!isImage) return m.reply('itu gambar?')
ara = await downloadContentFromMessage(m.message.imageMessage || m.message.extendedTextMessage?.contextInfo.quotedMessage.imageMessage, 'image')
buffer = Buffer.from([])
for await(const chunk of ara) {             
buffer = Buffer.concat([buffer, chunk])
}
getlino = await uploadImages(buffer,false)
const sticker = new Sticker(`https://yog-apikey.herokuapp.com/api/trigger?apikey=YogGanz&url=${getlino}`, {
pack: 'Hazn', // The pack name
author: 'simple-bot', // The author name
type: StickerTypes.FULL, // The sticker type
categories: ['🤩', '🎉'], // The sticker category
id: '12345', // The sticker id
quality: 50, // The quality of the output file
background: '#000000' // The sticker background c>})
})
await sticker.toFile('./temp/_sticker.webp')
conn.sendMessage(from, {sticker:fs.readFileSync('./temp/_sticker.webp')},{quoted:m})
break
case 'order': case 'caraorder': {
if(!isReg) return m.reply(act.den)
let capp = `*Hallo _${m.pushName}_ Berikut Cara Order*\n\n*Followers :*\nex1 : _${prefix}followers jumlah|target [ tanpa (@) ]_\nex2 : _${prefix}followers 500|fdhlgrphy_\n\n*View :*\nex 1 : _${prefix}view jumlah|link_\nex 2 : _${prefix}view 10000|https://vm.tiktok.com/xxxxxxx_\n\n*Like :*\nex 1 : _${prefix}like jumlah|link_\nex 2 : _${prefix}like 10000|https://www.instagram.com/p/xxxxxxx_\n\nSekian penjelasan cara order\nSemoga anda faham dengan penjelasan ini🙏\nbeli = faham`
conn.sendMessage(from, {text: capp}, {quoted:m})
}
break
case 'followers': case 'follower': {
if(!isReg) return m.reply(act.den)
if (args.length < 1) return m.reply(`Link atau Usernamenya mana?`)
q = body.slice(10)
let juma = q.split('|')[0] ? q.split('|')[0]: q
let targtt = q.split('|')[1] ? q.split('|')[1]: ''
if (targtt.length < 1) return m.reply(`Jumlah dan Target harus di isi!`)
fetaa = await fetchJson(`https://ampibismm.my.id/api/json?bot=true&api_key=${global.ApiKey}&action=pricelist&type=follower`)
list = []
textplus = `${juma}|${targtt}`
for (let L of fetaa.data) {
list.push({
title: `*${L.nama}*`,
rowId: `${prefix}confirmorderkunci ${textplus}|${L.id_layanan}`,
description: `\n${L.desc}`
})
}
let nyobb = [{
title: "Sosmed Store",
rows: list
},
]
conn.sendListMsg(m.chat, `Pilih layanan sesuai dengan yang ingin anda beli!\njika anda membeli followers maka pilih followers\ndiharapkan anda sudah faham.`, `HaznRe (owner bot)\nAffis Junianto (owner smm)`, `Hallo, Berikut layanan kami`, `Click Here`, nyobb, m)
}
break
case 'view': {
if(!isReg) return m.reply(act.den)
if (args.length < 1) return m.reply(`Link atau Usernamenya mana?`)
q = body.slice(5)
let jumlahh = q.split('|')[0] ? q.split('|')[0]: q
let targett = q.split('|')[1] ? q.split('|')[1]: ''
if (targett.length < 1) return m.reply(`Jumlah dan Target harus di isi!`)
fetaa = await fetchJson(`https://ampibismm.my.id/api/json?bot=true&api_key=${global.ApiKey}&action=pricelist&type=view`)
list = []
textplus = `${jumlahh}|${targett}`
for (let L of fetaa.data) {
list.push({
title: `*${L.nama}*`,
rowId: `confirmorderkunci ${textplus}|${L.id_layanan}`,
description: `\n${L.desc}`
})
}
let nyobb = [{
title: "Sosmed Store",
rows: list
},
]
conn.sendListMsg(m.chat, `Pilih layanan sesuai dengan yang ingin anda beli!\njika anda membeli followers maka pilih followers\ndiharapkan anda sudah faham.`, `© 2022\nFadhil Graphy (owner bot)\nAffis Junianto (owner smm)`, `Hallo, Berikut layanan kami`, `Click Here`, nyobb, m)
}
break
case'addprem':
case'addpremium':
try {
if(!isReg) return m.reply(act.den)
if(!isOwner) return m.reply(act.owner)
if(args.length < 1) return m.reply('no ny?')
premium.push(`${args.join('')}@s.whatsapp.net`)
fs.writeFileSync('./database/premium.json',JSON.stringify(premium))
m.reply('Added!')
} catch(e) {
m.reply(`${e}`)
}
break
case'delprem':
case'delpremium':
if(!isOwner) return m.reply(act.owner)
if(!isReg) return m.reply(act.den)
if(args.length < 1) return m.reply('no ny?')
premium.splice(`${args.join('')}@s.whatsapp.net`,1)
fs.writeFileSync('./database/premium.json',JSON.stringify(premium))
m.reply('Removed')
break
case 'like':{
if(!isReg) return m.reply(act.den)
if(args.length < 1) return m.reply(`Link atau Usernamenya mana?`)
q = body.slice(5)
let jumlahhh = q.split('|')[0] ? q.split('|')[0]: q
let targettt = q.split('|')[1] ? q.split('|')[1]: ''
if (targettt.length < 1) return m.reply(`Jumlah dan Target harus di isi!`)
fetaa = await fetchJson(`https://ampibismm.my.id/api/json?bot=true&api_key=${global.ApiKey}&action=pricelist&type=like`)
list = []
textplus = `${jumlahhh}|${targettt}`
for (let L of fetaa.data) {
list.push({
title: `*${L.nama}*`,
rowId: `confirmorderkunci ${textplus}|${L.id_layanan}`,
description: `\n${L.desc}`
})
}
let nyobb = [{
title: "Sosmed Store",
rows: list
},
]
conn.sendListMsg(m.chat, `Pilih layanan sesuai dengan yang ingin anda beli!\njika anda membeli followers maka pilih followers\ndiharapkan anda sudah faham.`, `© 2022\nFadhil Graphy (owner bot)\nAffis Junianto (owner smm)`, `Hallo, Berikut layanan kami`, `Click Here`, nyobb, m)
}
break
case 'confirmorderkunci': { //KUNCI = BIAR GA DIAKSES HEHE
if(!isReg) return m.reply(act.den)
if(args.length < 1) return m.reply(`*Cara order followers*\n\n*Example :* _${prefix + command} jumlah|username tanpa (@)_\n*Example :* _${prefix + command} 500|fdhlgrphy_\n\n*Min pesan :* _300_ \n*Max pesan :* _500k_\n\nThank You`)
const q = body.slice(18)
let jumlah = q.split('|')[0] ? q.split('|')[0]: q
let targ = q.split('|')[1] ? q.split('|')[1]: ''
let idny = q.split('|')[2] ? q.split('|')[2]: ''
feta = await fetchJson(`https://ampibismm.my.id/api/json?bot=true&api_key=${global.ApiKey}&action=order&quantity=${jumlah}&target=${targ}&id_layanan=${idny}`)
if (feta.status == false) {
m.reply(`*Maaf orderan gagal di buat*\n\nPermasalahan :\n${feta.data.msg} atau Cara order anda salah\n\nDiharapkan sudah faham jika ingin membeli\njika masih tidak faham silahkan ketik ${prefix}owner!\n`)
} else {
let idpes = feta.data.order_id
let cap = `Hay *${m.pushName} 👋,* Terimakasih Telah Order di Sosmed Shop!\nScan QR diatas untuk membayar!\n\n*Id Pesanan Anda :* ${feta.data.order_id}\n*Target :* ${targ}\n*Jumlah Pesanan :* ${jumlah}\n*Total Harga Pesanan :* Rp ${feta.data.amount}\n*Status Orderan :* ${feta.data.status}\n\n_Info lebih lanjut klik button dibawah._`
buto = [
{buttonId:`cekstatus ${feta.data.order_id}`, buttonText: {displayText: 'Status'}, type: 1},
]
buttonMessage = {
image:{url:feta.data.qris},
caption: cap,
footer: 'Thanks For Buying!',
buttons: buto,
headerType: 4
}
conn.sendMessage(m.chat,buttonMessage)
}
console.log(feta)
}
break
case 'listharga':
case 'prichlist':
case 'pricelist': {
if(!isReg) return m.reply(act.den)
feta = await fetchJson(`https://ampibismm.my.id/api/json?bot=true&api_key=${global.ApiKey}&action=pricelist&type=semua`)
list = '*List Harga Layanan*\n\n'
for (let L of feta.data) {
list += `name : ${L.nama}\ndesc : ${L.desc}\nmin : ${L.min}\nmax : ${L.max}\nharga : ${L.price}\nid : ${L.id_layanan}\n\n`
}
conn.sendMessage(from, {text: list}, {quoted:m})
console.log(feta)
}
break
case 'chekstatus':
case 'cekstatus': {
if(!isReg) return m.reply(act.den)
if(args.length < 1) return m.reply('query nya bang')
q = body.slice(10)
seta = await fetchJson(`https://ampibismm.my.id/api/json?bot=true&api_key=${global.ApiKey}&action=status&order_id=${q}`)
//console.log(seta)
if (seta.status == false) {
var captionnye = `\nid order tidak di temukan`
} else {
var captionnye = `\n*Status Orderan Anda*\n\nTarget : ${seta.data.target}\nStatus : ${seta.data.status}\nFollowers Default : ${seta.data.start_count}\nOn Process : ${seta.data.kurang}\nTotal Order : ${seta.data.total_order}\nTanggal Pesan : ${seta.data.tanggal_pesan}\nJumlah Pembayaran : ${seta.data.amount}\nId Pesanan : ${seta.data.order_id}\n\nTerimakasih sudah membeli followers dari kami, ditunggu next ordernya!`
}
var copynye = `${body.slice(10)}`
const menuButa = [{
index: 1,
urlButton: {
displayText: `Copy Here`,
url: 'https://www.whatsapp.com/otp/copy/'+copynye
}},
{ulButton: {
displayText: `Panel Smm`,
url: 'https://ampibismm.my.id'
}},
{
quickReplyButton: {
displayText: `Check Status Again`,
id: `cekstatus ${body.slice(10)}`
}
},
]
const templateMessage = {
text: captionnye,
footer: 'Regard Hazn',
templateButtons: menuButa
}
await conn.sendMessage(m.chat,templateMessage)
}
break
case 'komisi':
if (!isOwner) return m.reply(act.owner)
komisi = await fetchJson(`http://ampibismm.my.id/api/json?bot=true&action=profile&api_key=${global.ApiKey}`)
let reskomisi = `Hallo owner Berikut komisi anda\n\n*Name :* ${komisi.data.name}\n*Full Name :* ${komisi.data.full_name}\n*Komisi :* ${komisi.data.komisi}`
conn.sendMessage(from, {text: reskomisi }, {quoted:m})
break
case'cgc':
case'creategc':
if(!isOwner) return m.reply(act.owner)
if(args.length < 1) return m.reply('Use Parameters : <name>')
name = body.slice(4)
const group = conn.groupCreate(`${name}`,["6281539336834@s.whatsapp.net"])
m.reply('*done create gc*\n\n*Gc:*' + group.gid)
conn.sendMessage(`${group.id}@g.us`, { text: 'hello there' })
break
case'gcsearch':
if(!isReg) return m.reply(act.den)
m.reply(act.repair)
break
case'wiki':
if(!isReg) return m.reply(act.den)
if(args.length < 1) return m.reply('query?')
wiki('id',`${body.slice(5)}`).then((res) =>{
const { title,explanation,link } = res.result
let teksnyas =`title:\n${body.slice(6)}\nsource:\n${link}\nresult:\n${explanation}`
m.reply(teksnyas)
})
break
case'reg':
case'log':
if(isReg) return m.reply('*Your Already Create Account*')
if(args.length < 1) return m.reply('Name?')
tokens = Math.floor(Math.random() * 100)
tokena = []
tokena.push(tokens)
name = body.slice(4)
email = body.slice(4)
//reg = name.split('|')[0]
//regas = email.split('|')[0]
m.reply(`*Success*\n\n*Follow Intruction In Private Chat*\n\n*Name*: ${name}\n\n*Regard Hazn~*`)
await conn.sendMessage(`${sender.split("@")[0]}@s.whatsapp.net`,{text:`========(login)===========*Token*: ${tokena}\n\n*type : .login <token>*`},{quote:m})
break
case'login':
if(args.length < 1) return m.reply('Token?')
regis.push(sender)
fs.writeFileSync('./database/reg.json',JSON.stringify(regis))
m.reply(`Your Logging As ${senderName}`)
.catch((e) => m.reply('Token Invalid Or Error'))
break
case's':
case'sticker':
if(!isReg) return m.reply(act.den)
if(!isImage) return m.reply('*please reply img*')
try {
var stream = await downloadContentFromMessage(m.message.imageMessage || m.message.extendedTextMessage?.contextInfo.quotedMessage.imageMessage, 'image')
let buffer = Buffer.from([])
for await(const chunk of stream) {
buffer = Buffer.concat([buffer, chunk])
}
const sticker = new Sticker(buffer, {
pack: 'Hazn', // The pack name
author: 'simple-bot', // The author name
type: StickerTypes.FULL, // The sticker type
categories: ['🤩', '🎉'], // The sticker category
id: '12345', // The sticker id
quality: 50, // The quality of the output file
background: '#000000' // The sticker background color (only for full stickers)
})
await sticker.toFile('./temp/sticker.webp')
conn.sendMessage(from, {sticker:fs.readFileSync('./temp/sticker.webp')},{quoted:m})
} catch(e) {
m.reply(`*failed!*\n\n*${e}*`)
}
break
case'sgif':
case'stickergif':
if(!isReg) return m.reply(act.den)
if(!isVideo && !isGif) return m.reply('*reply gif/video*')
var stream2 = await downloadContentFromMessage(m.message.imageMessage || m.message.extendedTextMessage?.contextInfo.quotedMessage.videoMessage, 'video' || m.message.imageMessage || m.message.extendedTextMessage?.contextInfo.quotedMessage.gifMessage, 'gif')
let buffer2 = Buffer.from([])
for await(const chunk2 of stream2) {
buffer2 = Buffer.concat([buffer2, chunk2])
}
const sticker2 = new Sticker(buffer2, {
pack: 'Hazn', // The pack name                    
author: 'simple-bot', // The author name          
type: StickerTypes.FULL, // The sticker type      
categories: ['   ^=      ', '   ^=^n^i'], 
quality: 50, // The quality of the output file
background: '#000000' // The sticker background c>})
})
await sticker2.toFile('./temp/sticker.webp')
conn.sendMessage(from, {sticker:fs.readFileSync('./temp/sticker.webp')},{quoted:m})
.catch((e) => m.reply(e))
break
case'owner':
case'creator':
if(!isReg) return m.reply(act.den)
await sendContact(from,'6281539336834','hazn',m)
break
case'nulis':
if(!isReg) return m.reply(act.den)
if(args.length < 1) return m.reply('text nya')
m.reply(act.proc)
conn.sendMessage(from,{image:{url:`https://api.zekais.com/bukukanan?text=${body.slice(6)}&apikey=zekais`},caption:act.done},{quoted:m}).catch((e) => m.reply(e))
break
case'play':
if(!isReg) return m.reply(act.den)
if(args.length < 1) return m.reply('query nya')
m.reply(act.proc)
fetcha = await axios.get(`https://haznre-blog.cf/api/ytplay?query=${body.slice(6)}&apikey=PoAvEQdx`).then((fetcha) =>{
//bufel = await getBuffer(`${fetch.result.result}`)
textha =`*Play Audio*\n\n*Title*: ${fetcha.data.result.title}\n*Size*: ${fetcha.data.result.size}\n\n*Sending Audio...*`
conn.sendMessage(from,{image:{url:`${fetcha.data.result.thumb}`},caption:`${textha}`},{quoted:m})
conn.sendMessage(from,{audio:{url:`${fetcha.data.result.resut}`},mimetype:'audio/mp4'},{quoted:m})
})
//fs.unlinkSync('./temp/anu.mp3')
break
case'memegen':
case'mgen':
try {
if(!isReg) return m.reply(act.den)
if(!isImage) return m.reply('itu gambar?')
if(args.length < 1) return m.reply('gunakan paramaeter text1|text2')
m.reply(act.proc)
let bkl = body.slice(8)
let text1 = bkl.split("|")[0];
let text2 = bkl.split("|")[1];
let img = await downloadContentFromMessage(m.message.imageMassage || m.message.extendedTextMessage?.contextInfo.quotedMessage.imageMessage, 'image')
let buff = Buffer.from([])
for await(const chunk of img){
buff = Buffer.concat([buff, chunk])
}
const getlink = await uploadImages(buff, false)
conn.sendMessage(from,{image:{url:`https://api.memegen.link/images/custom/${text1}/${text2}.png?background=${getlink}`},caption:'done'},{quoted:m})
} catch(e) {
m.reply('error *coba reply gambarnya*')
}
break
case'ytsearch':
if(!isReg) return m.reply(act.den)
if(args.length < 1) return m.reply('query nya banh')
m.reply(act.proc)
feta = await fetchJson(`https://api.zekais.com/yts?query=${body.slice(9)}&apikey=zekais`,{method:'get'})
textha = ''
for(res of feta.result){
textha +=`*Title*: ${res.title}\n*Duration*: ${res.durasi}\n*Id*: ${res.id}\n*Url*: ${res.url}\n-_-_-_-_-_-_-_-_-_-_-_-_-_-_-\n`
}
m.reply(`${textha}`)
break
case'ytmp3':
if(!isReg) return m.reply(act.den)
if(args.length < 1) return m.reply('url?')
m.reply(act.proc)
await axios.get(`https://haznre-blog.cf/api/ytmp3?url=${body.slice(6)}&apikey=JFDEx4mL`).then(res => {
textsa =`*Ytmp3 Downloader*\n*Title*: ${res.data.result.title}\n*Size*: ${res.data.result.size}\n*uploadDate*: ${res.data.result.uploadDate}\n\n*Audio Sending...*`
conn.sendMessage(from,{image:{url:`${res.data.result.thumb}`},caption:`${textsa}`},{quoted:m})
conn.sendMessage(from,{audio:{url:`${res.data.result.result}`},mimetype:'audio/mp4'},{quoted:m})
}).catch((e) => m.reply(`${e}`))
break
default:
if (budy.startsWith("$") && isOwner) {
exec(budy.slice(2), (err, stdout) => {
if (err) return m.reply(`${err}`)
if (stdout) m.reply(`${stdout}`.trim())
})
}
if(budy.startsWith(`>`)) {
try {
conn.sendMessage(m.key.remoteJid, { text: JSON.stringify(eval(body.slice(2)), null, 2)}, { quoted: m})
} catch (e) {
print(e)
conn.sendMessage(from, { text: String(e)}, { quoted: m})}
}
if(isCmd && isReg && msgFilter.isFiltered(from)){
print('[SPAM] Detected Spam'.red)
teksnya = `@${sender.split('@')[0]} Spam Detected\nPlease Wait 5 Seconds :)`
return conn.sendMessage(from, {text:teksnya,mentions:[sender]},{quoted:m})
}
//if(isCmd && !isOwner) msgFilter.addFilter(from)
if(isCmd && isReg && isGroup) msgFilter.addFilter(from)
if(isCmd && isReg && !isGroup) msgFilter.addFilter(from)
break
}
} catch(e) {
print(`[x] Error: ${e}`.red)
}
}
