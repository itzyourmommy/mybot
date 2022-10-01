const { default: makeWASocket, AnyMessageContent, delay, DisconnectReason, fetchLatestBaileysVersion, useSingleFileAuthState, downloadContentFromMessage, jidDecode } = require('@adiwajshing/baileys')
const colors = require('colors')
const pino = require('pino')
//COLOR
colors.setTheme({
warn:'yellow',
error:'red',
deb:'green'
})
let print = console.log;
const FileType = require('file-type')
const { smsg } = require('./utils/smsg')
const { state, saveState } = useSingleFileAuthState('./hazn.data.json')
const fs = require('fs')

const startHandler = async() =>{
const conn = makeWASocket({
logger: pino({ level: 'silent'}),
printQRInTerminal: true,
auth: state
})

//conn.ev.on('chats.set', item => console.log(`recv ${item.chats.length} chats (is latest: ${item.isLatest})`))
//conn.ev.on('messages.set', item => console.log(`recv ${item.messages.length} messages (is latest: ${item.isLatest})`))
//conn.ev.on('contacts.set', item => console.log(`recv ${item.contacts.length} contacts`))
	

conn.ev.on('messages.upsert', async mek =>{
try {
const msg = mek.messages[0]
m = smsg(conn, msg, mek)
require('./handler.js')(conn, m)
} catch (e) {
print(`${e}`.error)
}
})
/**
* 
* @param {*} message 
* @param {*} filename 
* @param {*} attachExtension 
* @returns 
*/
conn.downloadAndSaveMediaMessage = async (message, filename, attachExtension = true) => {
let quoted = message.msg ? message.msg : message
let mime = (message.msg || message).mimetype || ''
let messageType = mime.split('/')[0].replace('application', 'document') ? mime.split('/')[0].replace('application', 'document') : mime.split('/')[0]
const stream = await downloadContentFromMessage(quoted, messageType)
let buffer = Buffer.from([])
for await(const chunk of stream) {
buffer = Buffer.concat([buffer, chunk])
}
let type = await FileType.fromBuffer(buffer)
trueFileName = attachExtension ? (filename + '.' + type.ext) : filename
// save to file
await fs.writeFileSync(trueFileName, buffer)
print(trueFileName)
return trueFileName
}
conn.downloadMediaMessage = async (message) => {
let mime = (message.msg || message).mimetype || ''
let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
const stream = await downloadContentFromMessage(message, messageType)
let buffer = Buffer.from([])
for await(const chunk of stream) {
buffer = Buffer.concat([buffer, chunk])
}        
return buffer
} 

/** Send List Messaage
*
*@param {*} jid
*@param {*} text
*@param {*} footer
*@param {*} title
*@param {*} butText
*@param [*] sections
*@param {*} quoted
*/
conn.sendListMsg = (jid, text = '', footer = '', title = '' , butText = '', sects = [], quoted) => {
let sections = sects
var listMes = {
text: text,
footer: footer,
title: title,
buttonText: butText,
sections
}
conn.sendMessage(jid, listMes, { quoted: quoted })
}

conn.ev.on('connection.update', async(update) => {
const { connection, lastDisconnect } = update
if (connection === 'close') {
lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut ? startHandler() : print('[!] Connection lost'.warn)
}
print('[!] Get Qr'.warn, update)
})
conn.ev.on('creds.update', saveState)	
return conn
}

/**
conn.downloadAndSaveMediaMessage = async (message, filename, attachExtension = true) => {
let quoted = message.msg ? message.msg : message
let mime = (message.msg || message).mimetype || ''
let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
const stream = await downloadContentFromMessage(quoted, messageType)
let buffer = Buffer.from([])
for await(const chunk of stream) {
buffer = Buffer.concat([buffer, chunk])
}
let type = await FileType.fromBuffer(buffer)
trueFileName = attachExtension ? (filename + '.' + type.ext) : filename
// save to file
await fs.writeFileSync(trueFileName, buffer)
return trueFileName
}*/

/**
conn.sendListMsg = (jid, text = '', footer = '', title = '' , butText = '', sects = [], quoted) => {
let sections = sects
var listMes = {
text: text,
footer: footer,
title: title,
buttonText: butText,
sections
}
conn.sendMessage(jid, listMes, { quoted: quoted })
}*/

startHandler()

let file = require.resolve(__filename)
fs.watchFile(file, () => {
fs.unwatchFile(file)
print(`Update ${__filename}`.warn)
delete require.cache[file]
require(file)
})
