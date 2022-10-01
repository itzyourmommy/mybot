const axios = require('axios')
const cheerio = require('cheerio')

function groupWhatsApp(query) {
  return new Promise((resolve, reject) => {
    axios({
      url: `https://groupsor.link/group/searchmore/${query}`,
      method: 'GET'
    })
    .then(({ data }) => {
      title = []
      image = []
      desc = []
      link = []
      const $ = cheerio.load(data)
      $("img.image").get().map((rest) => {
        title.push($(rest).attr("alt"))
      })
      $("div#results > div > a > span > img").get().map((rest) => {
        image.push($(rest).attr("src"))
      })
      $("p.descri").get().map((rest) => {
        desc.push($(rest).text().trim())
      })
      $("div#results > div.post-info > div.post-info-rate-share > span > a").get().map((rest) => {
        link.push($(rest).attr("href"))
      })
      result = []
      for(let i = 0; i < title.length; i++) {
        result.push({
          title: title[i],
          icon: image[i],
          description: desc[i] ? desc[i] : '-',
          link: link[i].replace('https://groupsor.link/group/join/', 'https://chat.whatsapp.com/').replace(/ /g, '')
        })
      }
      resolve({
        creator: 'Muhammad Shulhan Zidni',
        status: true,
        result: result
      })
    })
  })
}

module.exports = { groupWhatsApp }
